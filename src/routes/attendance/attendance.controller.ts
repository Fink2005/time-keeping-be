import {
  Body,
  Controller,
  Get,
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
}
