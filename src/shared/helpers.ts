import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const isUniqueConstraintPrismaError = (
  error: any,
): error is PrismaClientKnownRequestError => {
  return (
    error instanceof PrismaClientKnownRequestError && error.code === 'P2002'
  );
};

export const isNotFoundPrismaError = (
  error: any,
): error is PrismaClientKnownRequestError => {
  // <-- sửa ở đây
  return (
    error instanceof PrismaClientKnownRequestError && error.code === 'P2025'
  );
};
