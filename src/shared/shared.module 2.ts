import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { APIKeyGuard } from 'src/shared/guards/api-key.guard';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';
import { HashingService } from './services/hashing.service';
const sharedServices = [PrismaService, HashingService, TokenService];

@Global()
@Module({
  providers: [...sharedServices, AccessTokenGuard, APIKeyGuard],
  exports: sharedServices,
  imports: [JwtModule],
})
export class SharedModule {}
