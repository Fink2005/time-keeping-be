import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { ActivateUser } from 'src/shared/decorators/activate-user.decorator';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import {
  CheckAttendanceBodyDTO,
  GetAttendancesDTO,
  GetDetailAttendanceDTO,
  LastedStatusResDTO,
} from './attendance.dto';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-attendance')
  @ZodSerializerDto(GetDetailAttendanceDTO)
  @ApiResponse({ status: 201, type: GetDetailAttendanceDTO })
  checkAttendance(
    @Body() body: CheckAttendanceBodyDTO,
    @ActivateUser('userId') userId: number,
  ) {
    return this.attendanceService.checkAttendance({ userId, body });
  }

  @Get('list')
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
  @ApiResponse({ status: 200, type: LastedStatusResDTO })
  getLastedStatus(@ActivateUser('userId') userId: number) {
    return this.attendanceService.getLastedStatus({ userId });
  }
}
