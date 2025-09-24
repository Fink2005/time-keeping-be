import { z } from 'zod';

export const LocationSchema = z.object({
  id: z.number().int(),
  name: z.string().max(255),
  lat: z.string(),
  lng: z.string(),
  address: z.string().max(500).nullable(),
  radius: z.number().default(50),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number(),
});

// TypeScript type
export type LocationType = z.infer<typeof LocationSchema>;
