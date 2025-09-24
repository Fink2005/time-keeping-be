import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { ActivateUser } from 'src/shared/decorators/activate-user.decorator';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import {
  CheckAttendanceBodyDTO,
  CreatedAttendanceDTO,
  GetAttendancesDTO,
  LastedStatusResDTO,
} from './attendance.dto';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-attendance')
  @ZodSerializerDto(CreatedAttendanceDTO)
  @ApiResponse({ status: 200, type: CreatedAttendanceDTO })
  checkAttendance(
    @Body() body: CheckAttendanceBodyDTO,
    @ActivateUser('userId') userId: number,
  ) {
    return this.attendanceService.checkAttendance({ userId, body });
  }

  @Get('attendances')
  @ZodSerializerDto(GetAttendancesDTO)
  @ApiResponse({ status: 200, type: GetAttendancesDTO })
  getAttendances(
    @Query() pagination: PaginationQueryDTO,
    @ActivateUser('userId') userId: number,
  ) {
    return this.attendanceService.getAttendances(userId, pagination);
  }

  @Get('lasted-status')
  @ZodSerializerDto(LastedStatusResDTO)
  getLastedStatus(@ActivateUser('userId') userId: number) {
    return this.attendanceService.getLastedStatus({ userId });
  }
}
