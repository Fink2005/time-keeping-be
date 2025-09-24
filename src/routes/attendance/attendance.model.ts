import { AttendanceSchema } from 'src/shared/models/shared-attendance.model';
import { z } from 'zod';
import { LocationSchema } from '../location/location.model';

export const CheckAttendancekBodySchema = AttendanceSchema.pick({
  lng: true,
  lat: true,
  address: true,
  type: true,
  radius: true,
  imageUri: true,
  locationId: true,
}).strict();

export const AttendancesIncludeUserSchema = AttendanceSchema.extend({
  location: LocationSchema.pick({
    name: true,
  }).optional(),
});

export const GetAttendancesSchema = z.object({
  data: z.array(AttendancesIncludeUserSchema),
  totalItems: z.number(),
  page: z.number(), // Số trang hiện tại
  limit: z.number(), // Số item trên 1 trang
  totalPages: z.number(), // Tổng số trang
});

export const LastedStatusResSchema = AttendanceSchema;

export const CreatedAttendanceSchema = AttendancesIncludeUserSchema;

export type CheckAttendanceBodyType = z.infer<
  typeof CheckAttendancekBodySchema
>;
export type LastedStatusResType = z.infer<typeof LastedStatusResSchema>;

export type GetAttendancesType = z.infer<typeof GetAttendancesSchema>;

export type CreatedAttendanceType = z.infer<typeof CreatedAttendanceSchema>;
