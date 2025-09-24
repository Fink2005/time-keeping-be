import { Injectable } from '@nestjs/common';
import {
  InvalidLocationException,
  LocationNotFoundException,
} from '../location/location.error';
import { LocationRepository } from './../location/location.repo';
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
    //Lưu thêm locationId

    // const result = await this.attendanceRepository.createAttendance(body);
  }

  getLastedStatus(data: { userId: number }) {
    return this.attendanceRepository.getLastedStatus(data);
  }
}
