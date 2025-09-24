import { AttendanceSchema } from 'src/shared/models/shared-attendance.model';
import { z } from 'zod';

export const CheckAttendancekBodySchema = AttendanceSchema.pick({
  lng: true,
  lat: true,
  address: true,
  type: true,
  radius: true,
  imageUri: true,
  locationId: true,
}).strict();

export const LastedStatusResSchema = AttendanceSchema;

export type CheckAttendanceBodyType = z.infer<
  typeof CheckAttendancekBodySchema
>;
export type LastedStatusResType = z.infer<typeof LastedStatusResSchema>;
