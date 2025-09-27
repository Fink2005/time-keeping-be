import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { isAxiosError } from '@nestjs/terminus/dist/utils';
import { lastValueFrom } from 'rxjs';
import envConfig from 'src/shared/config';
import { NotFoundRecordException } from 'src/shared/error';
import { TokenService } from 'src/shared/services/token.service';
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type';
import { ApiAcountCenterException } from './user.error';
import { UserRepository } from './user.repo';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly httpService: HttpService,
    private readonly tokenService: TokenService,
  ) {}

  async getProfile(userId: number) {
    const user = await this.userRepository.getProfile(userId);
    if (!user) throw NotFoundRecordException;
    return user;
  }

  async auth(token: string) {
    try {
      const urlBackend = envConfig.AUTH_SERVICE_URL;
      const url = `${urlBackend}/user/profile`;

      const respon = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      const { email, keycloakId } = respon.data.data;

      const user = await this.userRepository.createUser({
        email,
        keycloakId,
      });

      const tokens = await this.generateTokens({ userId: user.id, keycloakId });
      await this.userRepository.updateUser(
        { id: user.id },
        { refreshToken: tokens.refreshToken },
      );
      return { tokens };
    } catch (error) {
      if (isAxiosError(error)) throw ApiAcountCenterException(error);
      throw error;
    }
  }

  async generateTokens({ userId, keycloakId }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({ userId, keycloakId }),
      this.tokenService.signRefreshToken({ userId }),
    ]);

    return { accessToken, refreshToken };
  }
}
