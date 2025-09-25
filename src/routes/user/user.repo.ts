import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { GetUserType } from './user.model';

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
}
