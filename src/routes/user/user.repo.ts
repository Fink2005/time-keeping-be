import { Injectable } from '@nestjs/common';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateUserType, GetUserType } from './user.model';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getProfile(userId: number): Promise<GetUserType | null> {
    return this.prismaService.user.findFirst({
      where: { id: userId },
      omit: {
        refreshToken: true,
      },
    });
  }

  updateUser(
    where: { id: number } | { email: string },
    data: Partial<Omit<UserType, 'id' | 'keycloakId' | 'email'>>,
  ): Promise<UserType> {
    return this.prismaService.user.update({
      where,
      data,
    });
  }

  async createUser(userInfor: CreateUserType): Promise<UserType> {
    const { keycloakId } = userInfor;
    // 1. Check đã tồn tại chưa
    const existedUser = await this.prismaService.user.findFirst({
      where: { keycloakId },
    });
    if (existedUser) {
      return existedUser;
    }

    const user = await this.prismaService.user.create({
      data: userInfor,
    });
    return user;
  }
}
