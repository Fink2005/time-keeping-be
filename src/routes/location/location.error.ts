import { UnprocessableEntityException } from '@nestjs/common';

export const LocationNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.LocationNotFound',
    path: 'location',
  },
]);

export const InvalidLocationException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidLocation',
    path: 'location',
  },
]);
