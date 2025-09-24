import {
  HttpException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AxiosError } from '@nestjs/terminus/dist/errors/axios.error';

// OTP related errors
export const InvalidOTPException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidOTP',
    path: 'code',
  },
]);

export const OTPExpiredException = new UnprocessableEntityException([
  {
    message: 'Error.OTPExpired',
    path: 'code',
  },
]);

export const FailedToSendOTPException = new UnprocessableEntityException([
  {
    message: 'Error.FailedToSendOTP',
    path: 'code',
  },
]);

// Email related errors
export const EmailAlreadyExistsException = new UnprocessableEntityException([
  {
    message: 'Email đã tồn tại',
    path: 'email',
  },
]);

export const EmailNotFoundException = new UnprocessableEntityException([
  {
    message: 'Không tìm thấy Email',
    path: 'email',
  },
]);

// Password related errors
export const InvalidPasswordException = new UnprocessableEntityException([
  {
    message: 'Password không đúng',
    path: 'password',
  },
]);

// Auth token related errors
export const RefreshTokenAlreadyUsedException = new UnauthorizedException(
  'Error.RefreshTokenAlreadyUsed',
);
export const UnauthorizedAccessException = new UnauthorizedException(
  'Không có quyền truy cập',
);

// Google auth related errors
export const GoogleUserInfoError = new Error('Error.FailedToGetGoogleUserInfo');

//2FA
export const TOTPAlreadyEnableException = new UnprocessableEntityException([
  {
    message: 'Error.TOTPAlreadyEnable',
    path: 'totpCode',
  },
]);

export const TOTPNotEnableException = new UnprocessableEntityException([
  {
    message: 'Error.TOTPNotEnable',
    path: 'totpCode',
  },
]);

export const InvalidTOTPAndCodeException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidTOTPAndCode',
    path: 'totpCode',
  },
  {
    message: 'Error.InvalidTOTPAndCode',
    path: 'code',
  },
]);

export const InvalidTOTPException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidOTP',
    path: 'code',
  },
]);

export const ApiAcountCenterException = (err: AxiosError) => {
  return new HttpException(
    (err.response?.data as Record<string, any>) ?? {
      message: 'Unexpected error',
    },
    (err.response?.status as number) ?? 500,
  );
};
