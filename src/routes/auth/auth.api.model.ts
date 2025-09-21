import { UserSchema } from 'src/shared/models/shared-user.model';
import { z } from 'zod';

export const RegisterPayloadSchema = UserSchema.pick({
  email: true,
})
  .extend({
    password: z.string().min(6).max(100),
  })
  .strict();

export const LoginPayloadSchema = RegisterPayloadSchema;

export type RegisterPayloadType = z.infer<typeof RegisterPayloadSchema>;
export type LoginPayloadType = z.infer<typeof LoginPayloadSchema>;
