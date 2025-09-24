import { createZodDto } from 'nestjs-zod';
import {
  CheckAttendancekBodySchema,
  CreatedAttendanceSchema,
  GetAttendancesSchema,
  LastedStatusResSchema,
} from './attendance.model';

export class CheckAttendanceBodyDTO extends createZodDto(
  CheckAttendancekBodySchema,
) {}

export class GetAttendancesDTO extends createZodDto(GetAttendancesSchema) {}
export class LastedStatusResDTO extends createZodDto(LastedStatusResSchema) {}
export class CreatedAttendanceDTO extends createZodDto(
  CreatedAttendanceSchema,
) {}
