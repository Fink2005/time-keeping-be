import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { ActivateUser } from 'src/shared/decorators/activate-user.decorator';
import { GetUserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ZodSerializerDto(GetUserDTO)
  @ApiResponse({ status: 200, type: GetUserDTO })
  getProfile(@ActivateUser('userId') userId: number) {
    return this.userService.getProfile(userId);
  }
}
