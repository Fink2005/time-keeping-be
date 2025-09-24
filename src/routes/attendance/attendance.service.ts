import { Injectable } from '@nestjs/common';
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
    let location = null;
    //Kiểm tra xem locationId có hợp lệ
    if (body.locationId) {
      location = await this.locationRepository.getLocationById({
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
  }

  getLastedStatus(data: { userId: number }) {
    return this.attendanceRepository.getLastestAttendance(data);
  }
}
