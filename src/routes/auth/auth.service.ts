import { HttpException, Injectable } from '@nestjs/common';
import { AxiosError } from '@nestjs/terminus/dist/errors/axios.error';
import { isAxiosError } from 'axios';
import { addMilliseconds } from 'date-fns';
import ms, { StringValue } from 'ms';
import {
  ApiAcountCenterException,
  EmailAlreadyExistsException,
  EmailNotFoundException,
  FailedToSendOTPException,
  InvalidOTPException,
  OTPExpiredException,
  RefreshTokenAlreadyUsedException,
  UnauthorizedAccessException,
} from 'src/routes/auth/auth.error';
import envConfig from 'src/shared/config';
import {
  TypeOfVerificationCode,
  TypeOfVerificationCodeType,
} from 'src/shared/constants/auth.constant';
import { generateOTP, isNotFoundPrismaError } from 'src/shared/helpers';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { AuthApisService } from 'src/shared/services/apis.service';
import { EmailService } from 'src/shared/services/email.service';
import { HashingService } from 'src/shared/services/hashing.service';
import { TokenService } from 'src/shared/services/token.service';
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type';
import {
  LoginBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
  SendOTPBodyType,
} from './auth.model';
import { AuthRepository } from './auth.repo';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly authApisService: AuthApisService,
  ) {}

  async validateVerificationCode({
    email,
    code,
    type,
  }: {
    email: string;
    code: string;
    type: TypeOfVerificationCodeType;
  }) {
    const vevificationCode =
      await this.authRepository.findUniqueVerificationCode({
        email_type: {
          email: email,
          type: type,
        },
      });
    if (!vevificationCode || vevificationCode.code !== code) {
      throw InvalidOTPException;
    }
    if (vevificationCode.expiresAt < new Date()) {
      throw OTPExpiredException;
    }
    return vevificationCode;
  }

  async register(body: RegisterBodyType) {
    try {
      const resUrl = `/auth/register`;
      //Tạo user bên account center
      const result = await this.authApisService.register({ resUrl, body });

      //Decode lấy email || email trên bod
      if (result?.data?.data?.email) {
        await this.authRepository.createUser({
          email: result.data.data.email,
          name: body.name,
        });
      }
      return {
        message: 'Đăng kí thành công vui lòng kiểm tra Email để xác nhận',
        email: result?.data.data.email,
      };
    } catch (error) {
      if (isAxiosError(error))
        throw ApiAcountCenterException(error as AxiosError);
      throw error;
    }
  }

  async sendTOP(body: SendOTPBodyType) {
    //Kiểm tra user tồn tại
    const user = await this.sharedUserRepository.findUnique({
      email: body.email,
    });
    if (body.type === TypeOfVerificationCode.REGISTER && user)
      throw EmailAlreadyExistsException;
    if (body.type === TypeOfVerificationCode.FORGOT_PASSWORD && !user)
      throw EmailNotFoundException;

    const code = generateOTP();
    await this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(
        new Date(),
        ms(envConfig.OTP_EXPIRES_IN as StringValue),
      ),
    });
    // gui email
    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code,
    });
    if (error) {
      throw FailedToSendOTPException;
    }
    return { message: 'Send OTP Successfully' };
  }

  async login(body: LoginBodyType) {
    try {
      const resUrl = `/auth/login`;

      const user = await this.sharedUserRepository.findUnique({
        email: body.email,
      });

      if (!user) {
        throw EmailNotFoundException;
      }

      // Nếu lỗi sẽ throw error bên account center
      await this.authApisService.login({ resUrl, body });

      const tokens = await this.generateTokens({
        userId: user.id,
      });

      await this.authRepository.updateUser(
        { id: user.id },
        {
          refreshToken: tokens.refreshToken,
        },
      );
      return tokens;
    } catch (error) {
      if (isAxiosError(error))
        throw ApiAcountCenterException(error as AxiosError);
      throw error;
    }
  }

  async generateTokens({ userId }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({ userId }),
      this.tokenService.signRefreshToken({ userId }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshToken({ refreshToken }: RefreshTokenBodyType) {
    try {
      //Kiểm tra token hợp lệ
      const { userId } =
        await this.tokenService.verifyRefreshToken(refreshToken);

      const refreshTokenInDb = await this.authRepository.findUniqueRefreshToken(
        { refreshToken },
      );
      if (!refreshTokenInDb) throw RefreshTokenAlreadyUsedException;
      //Tạo AT và RT mới và cập nhật
      const tokens = await this.generateTokens({
        userId,
      });

      await this.authRepository.updateUser(
        { id: userId },
        {
          refreshToken: tokens.refreshToken,
        },
      );
      return tokens;
    } catch (error) {
      // mặc định throw UnauthorizedException là instaneOf HttpException
      if (error instanceof HttpException) {
        throw error;
      }
      throw UnauthorizedAccessException;
    }
  }

  async logout(refreshToken: string) {
    try {
      const { userId } =
        await this.tokenService.verifyRefreshToken(refreshToken);

      await this.authRepository.updateUser(
        { id: userId },
        {
          refreshToken: null,
        },
      );
      return { message: 'Logout successfully' };
    } catch (error) {
      if (isNotFoundPrismaError(error)) throw RefreshTokenAlreadyUsedException;

      throw UnauthorizedAccessException;
    }
  }

  // async forgotPassword(body: ForgotPasswordBodyType) {
  //   const { email, newPassword } = body;
  //   // Kiểm tra email có db

  //   const user = await this.sharedUserRepository.findUnique({
  //     email,
  //   });
  //   if (!user) throw EmailNotFoundException;

  //   // kiểm tra otp hợp lệ
  //   await this.validateVerificationCode({
  //     email,
  //     code: body.code,
  //     type: TypeOfVerificationCode.FORGOT_PASSWORD,
  //   });

  //   const hashPassword = await this.hashingService.hash(newPassword);

  //   await Promise.all([
  //     // cập nhật password mới
  //     this.authRepository.updateUser(
  //       {
  //         id: user.id,
  //       },
  //       { password: hashPassword },
  //     ),
  //     // xóa otp
  //     this.authRepository.deleteVerificationCode({
  //       email_type: {
  //         email: email,
  //         type: TypeOfVerificationCode.FORGOT_PASSWORD,
  //       },
  //     }),
  //   ]);
  //   return {
  //     message: 'Password changed successfully',
  //   };
  // }
}
