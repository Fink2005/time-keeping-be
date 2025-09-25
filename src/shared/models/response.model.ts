import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { z } from 'zod';

export const MessageResSchema = z.object({
  message: z.string(),
});
export type MessageResType = z.infer<typeof MessageResSchema>;

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
