import { UserSchema } from 'src/shared/models/shared-user.model';
import z from 'zod';

export const GetUserSchema = UserSchema.omit({
  refreshToken: true,
});

export type GetUserType = z.infer<typeof GetUserSchema>;
