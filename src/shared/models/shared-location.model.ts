import z from 'zod';
import { validAccordiate } from '../constants/attendance.constant';

export const LocationSchema = z.object({
  id: z.number().int(),
  name: z.string().max(255),
  lat: z.string().regex(validAccordiate.LAT, 'Tọa độ không hợp lệ'),
  lng: z.string().regex(validAccordiate.LNG, 'Tọa độ không hợp lệ'),
  address: z.string().max(500),
  radius: z.number().default(50),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number(),
  deletedAt: z.date().nullable().optional(),
});

// TypeScript type
export type LocationType = z.infer<typeof LocationSchema>;
