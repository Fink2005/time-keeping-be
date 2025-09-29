import { UserSchema } from 'src/shared/models/shared-user.model';
import z from 'zod';

export const UserResSchema = UserSchema.omit({
  refreshToken: true,
});

export const CreateUserSchema = UserSchema.pick({
  email: true,
  keycloakId: true,
  name: true,
}).strict();

export const UpdateUserSchema = UserSchema.pick({
  name: true,
  phoneNumber: true,
  avatar: true,
  status: true,
}).strict();

export const AuthRequestSchema = z
  .object({
    token: z.string(),
    name: z.string().optional(),
  })
  .strict();

export const AuthResSchema = z.object({
  tokens: UserSchema.pick({ refreshToken: true }).extend({
    accessToken: z.string(),
  }),
  user: UserSchema.omit({
    refreshToken: true,
  }),
});

export type UserResType = z.infer<typeof UserResSchema>;
export type AuthRequestType = z.infer<typeof AuthRequestSchema>;
export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type AuthResType = z.infer<typeof AuthResSchema>;
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
