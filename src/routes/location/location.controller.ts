import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { ActivateUser } from 'src/shared/decorators/activate-user.decorator';
import {
  CreateLocationBodyDTO,
  GetDetailLocationResDTO,
  GetLocationParamsDTO,
  UpdateLocationBodyDTO,
} from './location.dto';
import { LocationService } from './location.service';
@Controller('location')
@ApiBearerAuth()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('create')
  @ZodSerializerDto(GetDetailLocationResDTO)
  @ApiResponse({ status: 201, type: GetDetailLocationResDTO })
  createLocation(
    @Body() body: CreateLocationBodyDTO,
    @ActivateUser('userId') userId: number,
  ) {
    return this.locationService.createLocation({ userId, body });
  }

  @Get('/:id')
  @ZodSerializerDto(GetDetailLocationResDTO)
  @ApiResponse({ status: 200, type: GetDetailLocationResDTO })
  getLocation(
    @Param() params: GetLocationParamsDTO,
    @ActivateUser('userId') userId: number,
  ) {
    return this.locationService.getLocation({ userId, id: Number(params.id) });
  }

  @Patch('/update')
  @ApiResponse({ status: 200, type: GetDetailLocationResDTO })
  updateLocation(
    @ActivateUser('userId') userId: number,
    @Body() body: UpdateLocationBodyDTO,
  ) {
    return this.locationService.updateLocation({ userId, body });
  }
}
