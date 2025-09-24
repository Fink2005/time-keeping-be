import { Module } from '@nestjs/common';
import { LocationModule } from '../location/location.module';
import { AttendanceController } from './attendance.controller';
import { AttendanceRepository } from './attendance.repo';
import { AttendanceService } from './attendance.service';

@Module({
  imports: [LocationModule],
  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceRepository],
})
export class AttendanceModule {}
