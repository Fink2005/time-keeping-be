import { Injectable } from '@nestjs/common';
import { isNotFoundPrismaError } from 'src/shared/helpers';
import { LocationNotFoundException } from './location.error';
import { CreateLocationBodyType } from './location.model';
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
}
