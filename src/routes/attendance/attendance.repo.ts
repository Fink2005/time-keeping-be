import { Injectable } from '@nestjs/common';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { AttendanceType } from 'src/shared/models/shared-attendance.model';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreatedAttendanceType, GetAttendancesType } from './attendance.model';

@Injectable()
export class AttendanceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getLastestAttendance(data: {
    userId: number;
  }): Promise<AttendanceType | null> {
    return this.prismaService.attendance.findFirst({
      where: data,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAttendances(
    userId: number,
    pagination: PaginationQueryType,
  ): Promise<GetAttendancesType> {
    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;

    const [totalItems, data] = await Promise.all([
      this.prismaService.attendance.count({
        where: {
          userId,
        },
      }),
      this.prismaService.attendance.findMany({
        where: {
          userId,
        },
        include: {
          Location: {
            select: {
              name: true,
            },
          },
        },
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);
    return {
      data,
      totalItems,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(totalItems / pagination.limit),
    };
  }

  createAttendance(
    payload: Omit<AttendanceType, 'id' | 'createdAt'>,
  ): Promise<CreatedAttendanceType> {
    return this.prismaService.attendance.create({
      data: {
        ...payload,
      },
      include: {
        Location: {
          select: { name: true },
        },
      },
    });
  }
}
