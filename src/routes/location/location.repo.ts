import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { LocationType } from './location.model';

@Injectable()
export class LocationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getLocationById({ id }: { id: number }): Promise<LocationType | null> {
    return this.prismaService.location.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
  }
}
