import { z } from 'zod';
import {
  AttendanceStatus,
  validAccordiate,
} from '../constants/attendance.constant';

export const AttendanceSchema = z.object({
  id: z.number(),
  lat: z.string().regex(validAccordiate.LAT, 'Tọa độ không hợp lệ'),
  lng: z.string().regex(validAccordiate.LNG, 'Tọa độ không hợp lệ'),
  address: z.string().max(500),
  createdAt: z.date(),
  type: z.nativeEnum(AttendanceStatus),
  imageUri: z.string().url().nullable().optional().default(null),
  userId: z.number(),
  locationId: z.number().nullable().optional().default(null),
  deletedAt: z.date().nullable().optional(),
});

export type AttendanceType = z.infer<typeof AttendanceSchema>;
