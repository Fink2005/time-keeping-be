import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/shared/constants/auth.constant';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const accessTokenBearer = request.headers.authorization?.split(' ')[1] as
      | string
      | undefined;

    const accessTokenCookie = request.cookies?.access_token as
      | string
      | undefined;

    if (!accessTokenBearer && !accessTokenCookie) {
      throw new UnauthorizedException('Access token is missing');
    }
    try {
      const decodedToken = await this.tokenService.verifyAccessToken(
        accessTokenBearer ?? accessTokenCookie ?? '',
      );
      request[REQUEST_USER_KEY] = decodedToken;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
