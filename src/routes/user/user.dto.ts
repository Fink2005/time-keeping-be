import { createZodDto } from 'nestjs-zod';
import {
  AuthRequestSchema,
  AuthResSchema,
  CreateUserSchema,
  UpdateUserSchema,
  UserResSchema,
} from './user.model';

export class UserResDTO extends createZodDto(UserResSchema) {}
export class CreateUserDTO extends createZodDto(CreateUserSchema) {}
export class AuthRequestDto extends createZodDto(AuthRequestSchema) {}
export class AuthResDTO extends createZodDto(AuthResSchema) {}
export class UpdateUserDTO extends createZodDto(UpdateUserSchema) {}
