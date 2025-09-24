import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationRepository } from './location.repo';
import { LocationService } from './location.service';

@Module({
  imports: [],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
  exports: [LocationRepository],
})
export class LocationModule {}
