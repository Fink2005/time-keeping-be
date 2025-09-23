import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import {
  LoginBodyDTO,
  LoginResDTO,
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
  @ApiResponse({ status: 201, type: LoginResDTO })
  login(@Body() body: LoginBodyDTO) {
    return this.authService.login({
      ...body,
    });
  }

  // @Post('refresh-token')
  // @IsPublic()
  // @HttpCode(HttpStatus.OK)
  // @ZodSerializerDto(RefreshTokenResDTO)
  // refreshToken(
  //   @Body() body: RefreshTokenBodyDTO,
  //   @UserAgent() userAgent: string,
  //   @Ip() ip: string,
  // ) {
  //   return this.authService.refreshToken({
  //     refreshToken: body.refreshToken,
  //     userAgent,
  //     ip,
  //   });
  // }

  // @Post('logout')
  // @ZodSerializerDto(MessageResDTO)
  // logout(@Body() body: RefreshTokenBodyDTO) {
  //   return this.authService.logout(body.refreshToken);
  // }
}
