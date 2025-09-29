import { Injectable } from '@nestjs/common';
import { handleDateFormated, isNotFoundPrismaError } from 'src/shared/helpers';
import { PaginationQueryType } from 'src/shared/models/request.model';

import { AttendanceStatus } from 'src/shared/constants/attendance.constant';
import {
  InvalidLocationException,
  LocationNotFoundException,
} from '../location/location.error';
import { LocationRepository } from './../location/location.repo';
import { InvalidTypeAttendanceException } from './attendance.error';
import { CheckAttendanceBodyType } from './attendance.model';
import { AttendanceRepository } from './attendance.repo';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceRepository,
    private readonly locationRepository: LocationRepository,
  ) {}

  async checkAttendance({
    userId,
    body,
  }: {
    userId: number;
    body: CheckAttendanceBodyType;
  }) {
    try {
      let location = null;
      //Kiểm tra xem locationId có hợp lệ
      if (body.locationId) {
        location = await this.locationRepository.getLocation({
          id: body.locationId,
        });

        if (!location) throw LocationNotFoundException;
        if (location.userId !== userId) throw InvalidLocationException;
      }

      //Kiểm tra type có hợp lệ

      const lastestAttendance =
        await this.attendanceRepository.getLastestAttendance({ userId });
      if (lastestAttendance?.type === body.type)
        throw InvalidTypeAttendanceException;

      //Lưu thêm locationId
      return await this.attendanceRepository.createAttendance({
        ...body,
        userId,
      });
    } catch (error) {
      if (isNotFoundPrismaError(error)) throw LocationNotFoundException;
      throw error;
    }
  }

  async getAttendanceDetail(
    userId: number,
    pagination: PaginationQueryType,
    date: string,
  ) {
    const year = date.split('-')[0];
    const month = date.split('-')[1];
    const { data, ...rest } = await this.attendanceRepository.getAttendaceByDay(
      {
        userId,
        pagination,
        date,
      },
    );

    const dataHistoryByYear =
      await this.attendanceRepository.getAttendaceByMonthYear({
        userId,
        month,
        year,
      });

    const dataType = dataHistoryByYear.map((item) => item.type);

    const hasBoth =
      dataType.includes(AttendanceStatus.CHECK_IN) &&
      dataType.includes(AttendanceStatus.CHECK_OUT);
    const dataCalendarAttendace = Object.fromEntries(
      dataHistoryByYear.map((item) => {
        return [
          handleDateFormated(item.createdAt),
          {
            selected: true,
            marked: hasBoth,
            selectedColor: '#3b82f6',
          },
        ];
      }),
    );

    return { dataCalendarAttendace, data, ...rest };
  }

  async getAttendanceByYear(userId: number, year: string) {
    const dataHistoryByYear =
      await this.attendanceRepository.getAttendanceByYear({ userId, year });

    // Kết quả mỗi tháng
    const monthlySummary = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      checkIn: 0,
      checkOut: 0,
      pairs: 0,
    }));

    // Gom dữ liệu
    dataHistoryByYear.forEach((att) => {
      const month = new Date(att.createdAt).getMonth(); // 0-11
      if (att.type === AttendanceStatus.CHECK_IN) {
        monthlySummary[month].checkIn++;
      } else if (att.type === AttendanceStatus.CHECK_OUT) {
        monthlySummary[month].checkOut++;
      }
    });

    // Đếm số cặp (min giữa checkIn và checkOut)
    monthlySummary.forEach((m) => {
      m.pairs = Math.min(m.checkIn, m.checkOut);
    });

    return { data: monthlySummary };
  }

  getAttendances(userId: number, pagination: PaginationQueryType) {
    return this.attendanceRepository.getAttendances(userId, pagination);
  }

  getLastedStatus(data: { userId: number }) {
    return this.attendanceRepository.getLastestAttendance(data);
  }
}
