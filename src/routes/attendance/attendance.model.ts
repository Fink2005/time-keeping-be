import { AttendanceSchema } from 'src/shared/models/shared-attendance.model';
import { LocationSchema } from 'src/shared/models/shared-location.model';
import { z } from 'zod';
export const CheckAttendancekBodySchema = AttendanceSchema.pick({
  lng: true,
  lat: true,
  address: true,
  type: true,
  imageUri: true,
  locationId: true,
}).strict();

export const GetDetailAttendanceSchema = AttendanceSchema.extend({
  Location: LocationSchema.pick({
    name: true,
  })
    .optional()
    .nullable(),
});

export const GetAttendancesSchema = z.object({
  data: z.array(GetDetailAttendanceSchema),
  totalItems: z.number(),
  page: z.number(), // Số trang hiện tại
  limit: z.number(), // Số item trên 1 trang
  totalPages: z.number(), // Tổng số trang
});

export const LastedStatusResSchema = AttendanceSchema;

export type CheckAttendanceBodyType = z.infer<
  typeof CheckAttendancekBodySchema
>;
export type LastedStatusResType = z.infer<typeof LastedStatusResSchema>;

export type GetAttendancesType = z.infer<typeof GetAttendancesSchema>;

export type GetDetailAttendanceType = z.infer<typeof GetDetailAttendanceSchema>;
