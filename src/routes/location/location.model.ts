import { LocationSchema } from 'src/shared/models/shared-location.model';
import z from 'zod';

export const CreateLocationBodySchema = LocationSchema.pick({
  name: true,
  lat: true,
  lng: true,
  address: true,
  radius: true,
}).strict();
export const GetDetailLocationResSchema = LocationSchema;
export const GetLocationParamsSchema = z
  .object({
    id: z.string().max(10),
  })
  .strict();

export type CreateLocationBodyType = z.infer<typeof CreateLocationBodySchema>;
export type GetDetailLocationResType = z.infer<
  typeof GetDetailLocationResSchema
>;
export type GetLocationParamsType = z.infer<typeof GetLocationParamsSchema>;
