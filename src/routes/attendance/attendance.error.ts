import { UnprocessableEntityException } from '@nestjs/common';

export const InvalidTypeAttendanceException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidTypeAttendance',
    path: 'attendance',
  },
]);
