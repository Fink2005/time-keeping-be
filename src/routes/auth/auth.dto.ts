import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
  LoginBodySchema,
  LoginResSchema,
  RegisterBodySchema,
  RegisterResSchema,
  SendOTPBodySchema,
} from './auth.model';

//NestJS mặc định chỉ biết validate bằng class-validator (ValidationPipe).
//Để NestJS hiểu được DTO sinh ra từ createZodDto, bạn phải bật ZodValidationPipe làm global pipe.
export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {
  @ApiProperty({ example: 'tdat9663+5@gmail.com' })
  email: string;

  @ApiProperty({ example: 'phamt_dat123' })
  password: string;

  @ApiProperty({ example: 'phamt_dat123' })
  confirmPassword: string;
}
export class RegisterResDTO extends createZodDto(RegisterResSchema) {
  @ApiProperty({ example: 'Check email' })
  message: string;

  @ApiProperty({ example: 'tdat9663@gmail.com' })
  email: string;
}

export class SendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {
  @ApiProperty({ example: 'tdat9663+5@gmail.com' })
  email: string;

  @ApiProperty({ example: 'phamt_dat123' })
  password: string;
}
export class LoginResDTO extends createZodDto(LoginResSchema) {
  @ApiProperty({ example: '_ewds' })
  accessToken: string;

  @ApiProperty({ example: '_ewds' })
  refreshToken: string;
}
