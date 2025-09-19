import { Prisma } from '@prisma/client';
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
): error is Prisma.PrismaClientKnownRequestError => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  );
};
