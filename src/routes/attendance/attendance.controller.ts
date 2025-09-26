import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { ActivateUser } from 'src/shared/decorators/activate-user.decorator';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import {
  AttendanceByYearDTO,
  CheckAttendanceBodyDTO,
  GetAttendancesDTO,
  GetDetailAttendanceDTO,
  LastedStatusResDTO,
} from './attendance.dto';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
@ApiBearerAuth()
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }

  @Get(':date')
  @ApiResponse({ status: 200, type: GetAttendancesDTO })
  getAttendanceHistory(
    @ActivateUser('userId') userId: number,
    @Query() pagination: PaginationQueryDTO,
    @Param('date') date: string,
  ) {
    return this.attendanceService.getAttendanceDetail(userId, pagination, date);
  }

  @Get('/attendance-by-year/:year')
  @ApiResponse({ status: 200, type: AttendanceByYearDTO })
  getAttendanceByYear(
    @ActivateUser('userId') userId: number,
    @Param('year') year: string,
  ) {
    return this.attendanceService.getAttendanceByYear(userId, year);
  }
}
