import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { ActivateUser } from 'src/shared/decorators/activate-user.decorator';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import {
  CreateLocationBodyDTO,
  GetDetailLocationResDTO,
  GetLocationParamsDTO,
  GetLocationsDTO,
  GetLocationsResDTO,
  SearchLocationQueryDTO,
  UpdateLocationBodyDTO,
} from './location.dto';
import { LocationService } from './location.service';
@Controller('location')
@ApiBearerAuth()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @ZodSerializerDto(GetLocationsResDTO)
  @ApiResponse({ status: 200, type: GetLocationsResDTO })
  search(
    @Query() query: SearchLocationQueryDTO,
    @ActivateUser('userId') userId: number,
  ) {
    return this.locationService.search({ userId, query });
  }

  @Post('create')
  @ZodSerializerDto(GetDetailLocationResDTO)
  @ApiResponse({ status: 201, type: GetDetailLocationResDTO })
  createLocation(
    @Body() body: CreateLocationBodyDTO,
    @ActivateUser('userId') userId: number,
  ) {
    return this.locationService.createLocation({ userId, body });
  }

  @Patch('/update')
  @ApiResponse({ status: 200, type: GetDetailLocationResDTO })
  updateLocation(
    @ActivateUser('userId') userId: number,
    @Body() body: UpdateLocationBodyDTO,
  ) {
    return this.locationService.updateLocation({ userId, body });
  }

  @Get('list')
  @ZodSerializerDto(GetLocationsDTO)
  @ApiResponse({ status: 200, type: GetLocationsDTO })
  getLocations(
    @Query() pagination: PaginationQueryDTO,
    @ActivateUser('userId') userId: number,
  ) {
    return this.locationService.getLocations(userId, pagination);
  }

  @Delete('/:id')
  @ApiResponse({ status: 200, type: MessageResDTO })
  deleteLocation(
    @Param() params: GetLocationParamsDTO,
    @ActivateUser('userId') userId: number,
  ) {
    return this.locationService.deleteLocation({
      id: Number(params.id),
      userId,
    });
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
}
