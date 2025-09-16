/* eslint-disable no-console */
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { object, string } from 'zod';

const envPath = path.resolve('.env');

// Only load .env if it exists (for local dev)
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn(
    '.env file not found — assuming environment variables are set externally (e.g. on Render)',
  );
}

// Zod schema
const ConfigSchema = object({
  DATABASE_URL: string().nonempty(),
  ACCESS_TOKEN_SECRET: string().nonempty(),
  ACCESS_TOKEN_EXPIRES_IN: string().nonempty(),
  PORT: string().nonempty(),
  SECRET_API_KEY: string().nonempty(),
  REFRESH_TOKEN_SECRET: string().nonempty(),
  REFRESH_TOKEN_EXPIRES_IN: string().nonempty(),
});

// Validate
const result = ConfigSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Invalid environment variables:\n');
  console.error(result.error.format());
  process.exit(1);
}

const envConfig = result.data;
export default envConfig;
