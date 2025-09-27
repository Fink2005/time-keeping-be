import { createZodDto } from 'nestjs-zod';
import {
  AuthRequestSchema,
  AuthResSchema,
  CreateUserSchema,
  GetUserSchema,
} from './user.model';

export class GetUserDTO extends createZodDto(GetUserSchema) {}
export class CreateUserDTO extends createZodDto(CreateUserSchema) {}
export class AuthRequestDto extends createZodDto(AuthRequestSchema) {}
export class AuthResDTO extends createZodDto(AuthResSchema) {}
