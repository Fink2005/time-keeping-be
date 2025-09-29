import { Injectable } from '@nestjs/common';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { LocationType } from 'src/shared/models/shared-location.model';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  CreateLocationBodyType,
  GetLocationsType,
  SearchLocationQueryType,
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

  deleteLocation(id: number) {
    return this.prismaService.location.delete({
      where: { id },
    });
  }

  async getLocations(
    userId: number,
    pagination: PaginationQueryType,
  ): Promise<GetLocationsType> {
    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;

    const [totalItems, data] = await Promise.all([
      this.prismaService.location.count({
        where: {
          userId,
        },
      }),
      this.prismaService.location.findMany({
        where: {
          userId,
        },
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      data,
      totalItems,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(totalItems / pagination.limit),
    };
  }

  findLocationsByName({
    userId,
    query,
  }: {
    userId: number;
    query: SearchLocationQueryType;
  }): Promise<LocationType[]> {
    return this.prismaService.location.findMany({
      where: {
        userId,
        name: {
          contains: query.keyword,
          mode: 'insensitive',
        },
      },
    });
  }
}
