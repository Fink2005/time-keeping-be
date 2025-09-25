import { Injectable } from '@nestjs/common';
import { LocationType } from 'src/shared/models/shared-location.model';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  CreateLocationBodyType,
  UpdateLocationBodyType,
} from './location.model';
@Injectable()
export class LocationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createLocation({
    userId,
    body,
  }: {
    userId: number;
    body: CreateLocationBodyType;
  }): Promise<LocationType> {
    return this.prismaService.location.create({
      data: {
        ...body,
        userId,
      },
    });
  }

  getLocation(
    uniqueValue: { id: number } | { id: number; userId: number },
  ): Promise<LocationType> {
    return this.prismaService.location.findUniqueOrThrow({
      where: uniqueValue,
    });
  }

  updateLocation(payload: UpdateLocationBodyType): Promise<LocationType> {
    const { id, name, radius } = payload;
    return this.prismaService.location.update({
      where: { id },
      data: {
        name,
        radius,
      },
    });
  }
}
