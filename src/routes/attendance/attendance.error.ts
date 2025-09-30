import { UnprocessableEntityException } from '@nestjs/common';

export const InvalidTypeAttendanceException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidTypeAttendance',
    path: 'attendance',
  },
]);

export const AttendanceNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.AttendanceNotFound',
    path: 'attendance',
  },
]);
