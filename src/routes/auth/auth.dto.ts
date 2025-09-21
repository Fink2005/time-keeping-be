import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
  DisableTwoFactorBodySchema,
  ForgotPasswordBodySchema,
  GetAuthorizationUrlSchema,
  LoginBodySchema,
  LoginResSchema,
  LogoutBodySchema,
  RefreshTokenBodySchema,
  RefreshTokenResSchema,
  RegisterBodySchema,
  RegisterResSchema,
  SendOTPBodySchema,
  TwoFactorSetupResSchema,
} from './auth.model';

//NestJS mặc định chỉ biết validate bằng class-validator (ValidationPipe).
//Để NestJS hiểu được DTO sinh ra từ createZodDto, bạn phải bật ZodValidationPipe làm global pipe.
export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {
  @ApiProperty({ example: 'tdat9663+3@gmail.com' })
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
  @ApiProperty({ example: 'tdat9663+3@gmail.com' })
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

export class RefreshTokenBodyDTO extends createZodDto(RefreshTokenBodySchema) {}
export class RefreshTokenResDTO extends createZodDto(RefreshTokenResSchema) {}

export class LogoutBodyDTO extends createZodDto(LogoutBodySchema) {}

export class GetAuthorizationUrlResDTO extends createZodDto(
  GetAuthorizationUrlSchema,
) {}

export class ForgotPasswordBodyDTO extends createZodDto(
  ForgotPasswordBodySchema,
) {}

export class TwoFactorSetupResDTO extends createZodDto(
  TwoFactorSetupResSchema,
) {}

export class DisableTwoFactorBodyDTO extends createZodDto(
  DisableTwoFactorBodySchema,
) {}
