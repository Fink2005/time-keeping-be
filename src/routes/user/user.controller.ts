import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { ActivateUser } from 'src/shared/decorators/activate-user.decorator';
import {
  AuthRequestDto,
  AuthResDTO,
  UpdateUserDTO,
  UserResDTO,
} from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ZodSerializerDto(UserResDTO)
  @ApiResponse({ status: 200, type: UserResDTO })
  getProfile(@ActivateUser('userId') userId: number) {
    return this.userService.getProfile(userId);
  }

  @Post('auth')
  @ZodSerializerDto(AuthResDTO)
  @ApiResponse({ status: 200, type: AuthResDTO })
  auth(@Body() userAuth: AuthRequestDto) {
    return this.userService.auth(userAuth);
  }

  @Put('update')
  @ApiResponse({ status: 200, type: UserResDTO })
  updateUser(
    @ActivateUser('userId') userId: number,
    @Body() body: UpdateUserDTO,
  ) {
    return this.userService.updateUser({ userId, body });
  }
}
