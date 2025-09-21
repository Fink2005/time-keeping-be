import { Injectable } from '@nestjs/common';
import { TypeOfVerificationCodeType } from 'src/shared/constants/auth.constant';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  DeviceType,
  RefreshTokenType,
  VerificationCodeType,
} from './auth.model';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: Pick<UserType, 'email'>): Promise<UserType> {
    return this.prismaService.user.create({
      data: user,
    });
  }

  async createUserGoogle(
    user: Pick<UserType, 'email' | 'name' | 'phoneNumber' | 'avatar'>,
  ): Promise<UserType> {
    return this.prismaService.user.create({
      data: user,
    });
  }

  async createVerificationCode(
    payload: Pick<
      VerificationCodeType,
      'expiresAt' | 'email' | 'code' | 'type'
    >,
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.upsert({
      where: {
        email_type: {
          email: payload.email,
          type: payload.type,
        },
      },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
      },
    });
  }

  findUniqueVerificationCode(
    // Tìm theo index
    uniqueValue:
      | { id: number }
      | {
          email_type: {
            // Key này là do bên prisma define email, type phải là unique
            email: string;
            type: TypeOfVerificationCodeType;
          };
        },
  ): Promise<VerificationCodeType | null> {
    return this.prismaService.verificationCode.findUnique({
      where: uniqueValue,
    });
  }

  createRefreshToken(data: {
    token: string;
    userId: number;
    expiresAt: Date;
    deviceId: number;
  }) {
    return this.prismaService.refreshToken.create({
      data,
    });
  }

  createDevice(
    data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> &
      Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>, //lastActive &isActive là optional ,
  ) {
    return this.prismaService.device.create({
      data,
    });
  }

  findUniqueRefreshToken(uniqueObject: {
    token: string;
  }): Promise<(RefreshTokenType & { user: UserType }) | null> {
    return this.prismaService.refreshToken.findUniqueOrThrow({
      where: uniqueObject,
      include: {
        user: true,
      },
    });
  }

  updateDevice(
    deviceId: number,
    data: Partial<DeviceType>,
  ): Promise<DeviceType> {
    return this.prismaService.device.update({
      where: {
        id: deviceId,
      },
      data,
    });
  }

  deleteRefreshToken(uniqueObject: {
    token: string;
  }): Promise<RefreshTokenType> {
    return this.prismaService.refreshToken.delete({
      where: uniqueObject,
    });
  }

  updateUser(
    where: { id: number } | { email: string },
    data: Partial<Omit<UserType, 'id'>>,
  ): Promise<UserType> {
    return this.prismaService.user.update({
      where,
      data,
    });
  }

  deleteVerificationCode(
    uniqueObject:
      | { id: number }
      | {
          email_type: {
            // Key này là do bên prisma define email, code, type phải là unique
            email: string;
            type: TypeOfVerificationCodeType;
          };
        },
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.delete({ where: uniqueObject });
  }
}
