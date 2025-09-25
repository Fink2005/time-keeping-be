import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { AccessTokenGuard } from './guards/access-token.guard';
import { APIKeyGuard } from './guards/api-key.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { SharedUserRepository } from './repositories/shared-user.repo';
import { AuthApisService } from './services/apis.service';
import { EmailService } from './services/email.service';
import { HashingService } from './services/hashing.service';
import { PrismaService } from './services/prisma.service';
import { TokenService } from './services/token.service';

const sharedServices = [
  PrismaService,
  HashingService,
  TokenService,
  SharedUserRepository,
  EmailService,
  AuthApisService,
  CloudinaryService,
];

@Global() // global mode
@Module({
  providers: [
    ...sharedServices,
    AccessTokenGuard,
    APIKeyGuard,
    {
      provide: 'APP_GUARD',
      useClass: AuthenticationGuard,
    },
  ],
  exports: sharedServices, // global mode phải có exports
  imports: [JwtModule, HttpModule, CloudinaryModule], //JwtModule là 1module, nên phải imports ở đây
})
export class SharedModule {}
