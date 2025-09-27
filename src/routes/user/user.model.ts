import { UserSchema } from 'src/shared/models/shared-user.model';
import z from 'zod';

export const GetUserSchema = UserSchema.omit({
  refreshToken: true,
});

export const CreateUserSchema = UserSchema.pick({
  email: true,
  keycloakId: true,
});

export const AuthRequestSchema = z
  .object({
    token: z.string(),
  })
  .strict();

export const AuthResSchema = z.object({
  tokens: UserSchema.pick({ refreshToken: true }).extend({
    accessToken: z.string(),
  }),
  // user: UserSchema,
});

export type GetUserType = z.infer<typeof GetUserSchema>;
export type AuthRequestType = z.infer<typeof AuthRequestSchema>;
export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type AuthResType = z.infer<typeof AuthResSchema>;
