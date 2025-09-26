import { createZodDto } from 'nestjs-zod';
import {
  AttendanceByYearSchema,
  CheckAttendancekBodySchema,
  GetAttendancesSchema,
  GetDetailAttendanceSchema,
  LastedStatusResSchema,
} from './attendance.model';

export class CheckAttendanceBodyDTO extends createZodDto(
  CheckAttendancekBodySchema,
) {}

export class GetAttendancesDTO extends createZodDto(GetAttendancesSchema) {}
export class LastedStatusResDTO extends createZodDto(LastedStatusResSchema) {}
export class GetDetailAttendanceDTO extends createZodDto(
  GetDetailAttendanceSchema,
) {}

export class AttendanceByYearDTO extends createZodDto(AttendanceByYearSchema) {}
