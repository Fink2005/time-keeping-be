import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
  CreateLocationBodySchema,
  GetDetailLocationResSchema,
  GetLocationParamsSchema,
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
