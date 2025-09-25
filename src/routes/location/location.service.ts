import { Injectable, UnauthorizedException } from '@nestjs/common';
import { isNotFoundPrismaError } from 'src/shared/helpers';
import { LocationNotFoundException } from './location.error';
import {
  CreateLocationBodyType,
  UpdateLocationBodyType,
} from './location.model';
import { LocationRepository } from './location.repo';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  createLocation({
    userId,
    body,
  }: {
    userId: number;
    body: CreateLocationBodyType;
  }) {
    return this.locationRepository.createLocation({ userId, body });
  }

  async getLocation({ userId, id }: { userId: number; id: number }) {
    try {
      return await this.locationRepository.getLocation({ userId, id });
    } catch (error) {
      if (isNotFoundPrismaError(error)) throw LocationNotFoundException;
      throw error;
    }
  }

  async updateLocation({
    userId,
    body,
  }: {
    userId: number;
    body: UpdateLocationBodyType;
  }) {
    try {
      // Kiểm tra có phải của user đó không
      const location = await this.locationRepository.getLocation({
        id: body.id,
      });
      if (location.userId !== userId)
        throw new UnauthorizedException('Không có quyền truy cập');
      return await this.locationRepository.updateLocation(body);
    } catch (error) {
      if (isNotFoundPrismaError(error)) throw LocationNotFoundException;
      throw error;
    }
  }
}
