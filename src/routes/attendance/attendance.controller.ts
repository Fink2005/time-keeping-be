import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
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
  GetAttendanceParamsDTO,
  GetAttendancesDTO,
  GetDetailAttendanceDTO,
  LastedStatusResDTO,
  UpdateAttendanceDTO,
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

  @Put('/update')
  @ZodSerializerDto(GetDetailAttendanceDTO)
  @ApiResponse({ status: 200, type: GetDetailAttendanceDTO })
  updateAttendance(
    @ActivateUser('userId') userId: number,
    @Body() body: UpdateAttendanceDTO,
  ) {
    return this.attendanceService.updateAttendance({ userId, body });
  }

  @Get('/attendance-by-year/:year')
  @ZodSerializerDto(AttendanceByYearDTO)
  @ApiResponse({ status: 200, type: AttendanceByYearDTO })
  getAttendanceByYear(
    @ActivateUser('userId') userId: number,
    @Param('year') year: string,
  ) {
    return this.attendanceService.getAttendanceByYear(userId, year);
  }

  @Get('/:id')
  @ZodSerializerDto(GetDetailAttendanceDTO)
  @ApiResponse({ status: 200, type: GetDetailAttendanceDTO })
  getAttendance(
    @ActivateUser('userId') userId: number,
    @Param() param: GetAttendanceParamsDTO,
  ) {
    return this.attendanceService.getAttendanceDetail({
      userId,
      id: Number(param.id),
    });
  }

  @Get('/history/:date')
  @ZodSerializerDto(GetAttendancesDTO)
  @ApiResponse({ status: 200, type: GetAttendancesDTO })
  getAttendanceHistory(
    @ActivateUser('userId') userId: number,
    @Query() pagination: PaginationQueryDTO,
    @Param('date') date: string,
  ) {
    return this.attendanceService.getAttendanceByMonth(
      userId,
      pagination,
      date,
    );
  }
}
