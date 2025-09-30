import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
  AttendanceByYearSchema,
  CheckAttendancekBodySchema,
  GetAttendanceParamsSchema,
  GetAttendancesSchema,
  GetDetailAttendanceSchema,
  LastedStatusResSchema,
  UpdateAttendanceSchema,
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

export class GetAttendanceParamsDTO extends createZodDto(
  GetAttendanceParamsSchema,
) {
  @ApiProperty({ default: 5 })
  id: string;
}

export class UpdateAttendanceDTO extends createZodDto(UpdateAttendanceSchema) {}
