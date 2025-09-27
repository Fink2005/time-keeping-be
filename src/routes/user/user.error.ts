import { HttpException } from '@nestjs/common';
import { AxiosError } from '@nestjs/terminus/dist/errors/axios.error';

export const ApiAcountCenterException = (err: AxiosError) => {
  return new HttpException(
    (err.response?.data as Record<string, any>) ?? {
      message: 'Unexpected error',
    },
    (err.response?.status as number) ?? 500,
  );
};
