import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: '.env.development.local' });

export default defineConfig({
  schema: './server/utils/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.NUXT_DB_HOST!,
    port: Number(process.env.NUXT_DB_PORT!),
    user: process.env.NUXT_DB_USER!,
    password: process.env.NUXT_DB_PASSWORD!,
    database: process.env.NUXT_DB_DATABASE!
  },
});
