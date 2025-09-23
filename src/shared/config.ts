import { config as dotenvConfig } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

// 🚀 Chỉ load file .env khi không phải production
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve('.env');

  if (!fs.existsSync(envPath)) {
    console.error('❌ Không tìm thấy file .env');
    process.exit(1);
  }

  dotenvConfig({ path: envPath });
}
const conifgSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  SECERET_API_KEY: z.string(),

  PORT: z.string(),
  AUTH_SERVICE_URL: z.string(),
  AUTH_SERVICE_KEY: z.string(),

  OTP_EXPIRES_IN: z.string(),
  RESEND_API_KEY: z.string(),
});

const configServer = conifgSchema.safeParse(process.env);

if (!configServer.success) {
  console.log('Cac gia tri trong .env khong hop le');
  console.error(configServer.error);
  process.exit(1);
}

const envConfig = configServer.data;
export default envConfig;
