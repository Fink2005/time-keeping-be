import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
  CreateLocationBodySchema,
  GetDetailLocationResSchema,
  GetLocationParamsSchema,
  GetLocationsResSchema,
  GetLocationsSchema,
  SearchLocationQuerySchema,
  UpdateLocationBodySchema,
} from './location.model';

export class CreateLocationBodyDTO extends createZodDto(
  CreateLocationBodySchema,
) {}

export class GetDetailLocationResDTO extends createZodDto(
  GetDetailLocationResSchema,
) {}

export class GetLocationParamsDTO extends createZodDto(
  GetLocationParamsSchema,
) {
  @ApiProperty({ default: 5 })
  id: string;
}

export class UpdateLocationBodyDTO extends createZodDto(
  UpdateLocationBodySchema,
) {}

export class GetLocationsDTO extends createZodDto(GetLocationsSchema) {}

export class SearchLocationQueryDTO extends createZodDto(
  SearchLocationQuerySchema,
) {
  @ApiPropertyOptional({ description: 'Từ khoá tìm kiếm' })
  keyword?: string;
}

export class GetLocationsResDTO extends createZodDto(GetLocationsResSchema) {}
