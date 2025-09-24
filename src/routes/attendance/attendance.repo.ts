import { Injectable } from '@nestjs/common';
import { AttendanceType } from 'src/shared/models/shared-attendance.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class AttendanceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getLastedStatus(data: { userId: number }): Promise<AttendanceType | null> {
    return this.prismaService.attendance.findFirst({
      where: data,
      orderBy: { createdAt: 'desc' },
    });
  }

  // createAttendance(payload: Partial<Omit<AttendanceType, 'id'>>) {
  //   return this.prismaService.location.create({
  //     data: payload,
  //   });
  // }
}
