import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import {
  LoginBodyDTO,
  LoginResDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterBodyDTO,
  RegisterResDTO,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @IsPublic()
  @ZodSerializerDto(RegisterResDTO)
  @ApiResponse({ status: 201, type: RegisterResDTO })
  register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body);
  }

  @Post('login')
  @IsPublic()
  @ZodSerializerDto(LoginResDTO)
  @ApiResponse({ status: 200, type: LoginResDTO })
  login(@Body() body: LoginBodyDTO) {
    return this.authService.login({
      ...body,
    });
  }

  @Post('refresh-token')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(RefreshTokenResDTO)
  @ApiResponse({ status: 200, type: RefreshTokenResDTO })
  refreshToken(@Body() body: RefreshTokenBodyDTO) {
    return this.authService.refreshToken({
      refreshToken: body.refreshToken,
    });
  }
  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ZodSerializerDto(MessageResDTO)
  @ApiResponse({ status: 200, type: RefreshTokenResDTO })
  logout(@Body() body: RefreshTokenBodyDTO) {
    return this.authService.logout(body.refreshToken);
  }
}
