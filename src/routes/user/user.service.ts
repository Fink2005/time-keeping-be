import { Injectable } from '@nestjs/common';
import { NotFoundRecordException } from 'src/shared/error';
import { UserRepository } from './user.repo';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(userId: number) {
    const user = await this.userRepository.getProfile(userId);
    if (!user) throw NotFoundRecordException;
    return user;
  }
}
