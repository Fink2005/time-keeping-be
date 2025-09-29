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

export const UpdateLocationBodySchema = LocationSchema.pick({
  id: true,
  name: true,
  radius: true,
});

export const GetLocationParamsSchema = z
  .object({
    id: z.string().max(10),
  })
  .strict();

export const GetLocationsSchema = z.object({
  data: z.array(LocationSchema),
  totalItems: z.number(),
  page: z.number(), // Số trang hiện tại
  limit: z.number(), // Số item trên 1 trang
  totalPages: z.number(), // Tổng số trang
});

export const SearchLocationQuerySchema = z.object({
  keyword: z.string().optional(),
});

export type CreateLocationBodyType = z.infer<typeof CreateLocationBodySchema>;
export type GetDetailLocationResType = z.infer<
  typeof GetDetailLocationResSchema
>;
export type GetLocationParamsType = z.infer<typeof GetLocationParamsSchema>;
export type UpdateLocationBodyType = z.infer<typeof UpdateLocationBodySchema>;
export type GetLocationsType = z.infer<typeof GetLocationsSchema>;
export type SearchLocationQueryType = z.infer<typeof SearchLocationQuerySchema>;
