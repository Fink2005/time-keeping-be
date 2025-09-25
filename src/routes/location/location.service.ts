import { Injectable } from '@nestjs/common';
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

  getLocation({ userId, id }: { userId: number; id: number }) {
    return this.locationRepository.getLocation({ userId, id });
  }
}
