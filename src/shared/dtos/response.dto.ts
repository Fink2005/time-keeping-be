import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { MessageResSchema } from '../models/response.model';

export class MessageResDTO extends createZodDto(MessageResSchema) {
  @ApiProperty({ example: 'huhuhhihi' })
  message: string;
}
