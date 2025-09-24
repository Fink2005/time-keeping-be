import { z } from 'zod';
import { AttendanceStatus } from '../constants/attendance.constant';

export const AttendanceSchema = z.object({
  id: z.number(),
  lat: z.string(),
  lng: z.string(),
  address: z.string().max(500),
  radius: z.number().nullable().optional().default(null),
  createdAt: z.date(),
  type: z.nativeEnum(AttendanceStatus),
  imageUri: z.string().url().nullable().optional().default(null),
  userId: z.number().int(),
  locationId: z.number().nullable().optional().default(null),
});

export type AttendanceType = z.infer<typeof AttendanceSchema>;
