import { z } from 'zod';
import { UserStatus } from '../constants/auth.constant';

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  keycloakId: z.string(),
  name: z.string().min(1).max(20).nullable().optional(),
  phoneNumber: z.string().min(10).max(15).nullable().optional(),
  refreshToken: z.string().nullable(),
  avatar: z.string().nullable().optional(),
  status: z.nativeEnum(UserStatus).optional(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

//Nó nhận vào một Zod schema và suy ra type TypeScript tương ứng.
//Dùng z.infer thì type tự cập nhật theo schema. Nó giúp bạn không phải viết type tay, tránh sai lệch giữa schema
export type UserType = z.infer<typeof UserSchema>;
