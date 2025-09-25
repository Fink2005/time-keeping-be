// cloudinary.provider.ts

import { v2 as cloudinary } from 'cloudinary';
import envConfig from '../config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: envConfig.CLOUDINARY_NAME,
      api_key: envConfig.API_CLOUDINARY_KEY,
      api_secret: envConfig.API_CLOUDINARY_SECRET,
    });
  },
};
