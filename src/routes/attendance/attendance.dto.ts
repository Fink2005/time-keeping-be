import { createZodDto } from 'nestjs-zod';
import {
  CheckAttendancekBodySchema,
  LastedStatusResSchema,
} from './attendance.model';

export class CheckAttendanceBodyDTO extends createZodDto(
  CheckAttendancekBodySchema,
) {}

export class LastedStatusResDTO extends createZodDto(LastedStatusResSchema) {}
