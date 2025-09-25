import { createZodDto } from 'nestjs-zod';
import { GetUserSchema } from './user.model';

export class GetUserDTO extends createZodDto(GetUserSchema) {}
