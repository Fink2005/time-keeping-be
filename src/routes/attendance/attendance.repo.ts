import { Injectable } from '@nestjs/common';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { AttendanceType } from 'src/shared/models/shared-attendance.model';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  GetAttendancesType,
  GetDetailAttendanceType,
  UpdateAttendanceType,
} from './attendance.model';
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

  async getAttendaceByDay({
    userId,
    pagination,
    date,
  }: {
    userId: number;
    pagination: PaginationQueryType;
    date: string;
  }): Promise<GetAttendancesType> {
    const startDate = new Date(`${date}T00:00:00+07:00`);
    const endDate = new Date(`${date}T23:59:59.999+07:00`);

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
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
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

  async getAttendaceByMonthYear({
    userId,
    month,
    year,
  }: {
    userId: number;
    month: string;
    year: string;
  }): Promise<AttendanceType[]> {
    const monthStr = month ? month.padStart(2, '0') : '01';
    const endMonthStr = month ? month.padStart(2, '0') : '12';
    const endDay = '31';

    const startDate = new Date(`${year}-${monthStr}-01T00:00:00+07:00`);
    const endDate = new Date(
      `${year}-${endMonthStr}-${endDay}T23:59:59.999+07:00`,
    );

    return await this.prismaService.attendance.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAttendanceByYear({
    userId,
    year,
  }: {
    userId: number;
    year: string;
  }): Promise<AttendanceType[]> {
    const startDate = new Date(`${year}-01-01T00:00:00+07:00`);
    const endDate = new Date(`${year}-12-31T23:59:59.999+07:00`);

    return await this.prismaService.attendance.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  createAttendance(
    payload: Omit<AttendanceType, 'id' | 'createdAt'>,
  ): Promise<GetDetailAttendanceType> {
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

  getAttendanceDetail({
    userId,
    id,
  }: {
    userId: number;
    id: number;
  }): Promise<GetDetailAttendanceType> {
    return this.prismaService.attendance.findUniqueOrThrow({
      where: {
        userId,
        id,
      },
      include: {
        Location: {
          select: { name: true },
        },
      },
    });
  }

  updateAttendance({
    userId,
    body,
  }: {
    userId: number;
    body: UpdateAttendanceType;
  }): Promise<GetDetailAttendanceType> {
    const { id, note } = body;
    return this.prismaService.attendance.update({
      where: { userId, id },
      data: { note },
      include: {
        Location: {
          select: { name: true },
        },
      },
    });
  }
}
