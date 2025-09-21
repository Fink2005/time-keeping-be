import { Injectable } from '@nestjs/common';
import { AxiosError } from '@nestjs/terminus/dist/errors/axios.error';
import { addMilliseconds } from 'date-fns';
import ms, { StringValue } from 'ms';

import {
  ApiAcountCenterException,
  EmailAlreadyExistsException,
  EmailNotFoundException,
  FailedToSendOTPException,
  InvalidOTPException,
  OTPExpiredException,
} from 'src/routes/auth/auth.error';
import envConfig from 'src/shared/config';
import {
  TypeOfVerificationCode,
  TypeOfVerificationCodeType,
} from 'src/shared/constants/auth.constant';
import { generateOTP } from 'src/shared/helpers';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { TwoFactorService } from 'src/shared/services/2fa.service';
import { AuthApisService } from 'src/shared/services/apis.service';
import { EmailService } from 'src/shared/services/email.service';
import { HashingService } from 'src/shared/services/hashing.service';
import { TokenService } from 'src/shared/services/token.service';
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type';
import { LoginBodyType, RegisterBodyType, SendOTPBodyType } from './auth.model';
import { AuthRepository } from './auth.repo';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly twoFactorService: TwoFactorService,
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
      const result = await this.authApisService.register({ resUrl, body });

      if (result?.data?.data?.email) {
        await this.authRepository.createUser({
          email: result.data.data.email,
        });
      }
      return {
        message: 'Đăng kí thành công vui lòng kiểm tra Email để xác nhận',
        email: result?.data.data.email,
      };
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) throw ApiAcountCenterException(err);
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

  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    try {
      const resUrl = `/auth/login`;
      const user = await this.sharedUserRepository.findUnique({
        email: body.email,
      });

      if (!user) {
        throw EmailNotFoundException;
      }

      await this.authApisService.login({ resUrl, body });
      // Tạo device
      const device = await this.authRepository.createDevice({
        userId: user.id,
        ip: body.ip,
        userAgent: body.userAgent,
      });
      const tokens = await this.generateTokens({
        userId: user.id,
        deviceId: device.id,
      });
      return tokens;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) throw ApiAcountCenterException(err);
      throw error;
    }
  }

  async generateTokens({ userId, deviceId }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({ userId, deviceId }),
      this.tokenService.signRefreshToken({ userId }),
    ]);

    const decodeRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);
    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId,
      expiresAt: new Date(decodeRefreshToken.exp * 1000),
      deviceId,
    });
    return { accessToken, refreshToken };
  }

  // async refreshToken({
  //   refreshToken,
  //   userAgent,
  //   ip,
  // }: RefreshTokenBodyType & { userAgent: string; ip: string }) {
  //   try {
  //     //Kiểm tra token hợp lệ
  //     const { userId } =
  //       await this.tokenService.verifyRefreshToken(refreshToken);

  //     const refreshTokenInDB = await this.authRepository.findUniqueRefreshToken(
  //       { token: refreshToken },
  //     );

  //     if (!refreshTokenInDB) {
  //       throw RefreshTokenAlreadyUsedException;
  //     }
  //     const { deviceId } = refreshTokenInDB;
  //     //Cập nhật device
  //     const $updateDevice = this.authRepository.updateDevice(deviceId, {
  //       ip,
  //       userAgent,
  //     });

  //     //Xóa RT cũ
  //     const $deleteRefreshToken = this.authRepository.deleteRefreshToken({
  //       token: refreshToken,
  //     });

  //     //Tạo AT và RT mới và cập nhật
  //     const $token = this.generateTokens({ userId, deviceId });

  //     const [, , tokens] = await Promise.all([
  //       $updateDevice,
  //       $deleteRefreshToken,
  //       $token,
  //     ]);
  //     return tokens;
  //   } catch (error) {
  //     // mặc định throw UnauthorizedException là instaneOf HttpException
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }
  //     throw UnauthorizedAccessException;
  //   }
  // }

  // async logout(refreshToken: string) {
  //   try {
  //     await this.tokenService.verifyRefreshToken(refreshToken);
  //     const deletedRefreshToken = await this.authRepository.deleteRefreshToken({
  //       token: refreshToken,
  //     });
  //     await this.authRepository.updateDevice(deletedRefreshToken.deviceId, {
  //       isActive: false,
  //     });
  //     return { message: 'Logout successfully' };
  //   } catch (error) {
  //     if (isNotFoundPrismaError(error)) throw RefreshTokenAlreadyUsedException;

  //     throw UnauthorizedAccessException;
  //   }
  // }

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

  // async setupTwoFactorAuth(userId: number) {
  //   // Lấy thông tin user ( đã tồn tại & bật 2FA chưa)
  //   const user = await this.sharedUserRepository.findUnique({
  //     id: userId,
  //   });
  //   if (!user) {
  //     throw EmailNotFoundException;
  //   }

  //   if (user.totpSecret) {
  //     throw TOTPAlreadyEnableException;
  //   }

  //   // Tạo secret và uri
  //   const { secret, uri } = this.twoFactorService.generateTOTPSecrete(
  //     user.email,
  //   );

  //   // Cập nhật secret vào user
  //   await this.authRepository.updateUser(
  //     {
  //       id: userId,
  //     },
  //     { totpSecret: secret },
  //   );

  //   // Trả về
  //   return { secret, uri };
  // }

  // async disableTwoFactorAuth(
  //   data: DisableTwoFactorBodyType & { userId: number },
  // ) {
  //   const { userId, totpCode, code } = data;
  //   const user = await this.sharedUserRepository.findUnique({
  //     id: userId,
  //   });
  //   if (!user) throw EmailNotFoundException;
  //   if (!user.totpSecret) throw TOTPNotEnableException;

  //   // Kiểm tra totp hợp lệ không
  //   if (totpCode) {
  //     const isValid = this.twoFactorService.verifyTOTP({
  //       email: user.email,
  //       secret: user.totpSecret,
  //       token: totpCode,
  //     });
  //     if (!isValid) throw InvalidTOTPException;
  //   } else if (code) {
  //     await this.validateVerificationCode({
  //       email: user.email,
  //       code,
  //       type: TypeOfVerificationCode.DISABLE_2FA,
  //     });
  //   }

  //   //Cập nhật secret thành null
  //   await this.authRepository.updateUser({ id: userId }, { totpSecret: null });
  //   return {
  //     message: 'Turn off 2FA successfully',
  //   };
  // }
}
