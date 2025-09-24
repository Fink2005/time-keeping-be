import { Injectable } from '@nestjs/common';
import { AttendanceType } from 'src/shared/models/shared-attendance.model';
import { PrismaService } from 'src/shared/services/prisma.service';

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

  createAttendance(
    payload: Omit<AttendanceType, 'id' | 'createdAt'>,
  ): Promise<AttendanceType> {
    return this.prismaService.attendance.create({
      data: {
        ...payload,
      },
    });
  }
}
