import 'dotenv/config';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

const runtimeConfig = useRuntimeConfig();

// Nuxt runtimeConfig is evaluated at build time for process.env variables.
// Therefore, we explicitly check process.env first for runtime injection via Docker.
const host = runtimeConfig.db.host;
const port = runtimeConfig.db.port;
const user = runtimeConfig.db.user;
const password = runtimeConfig.db.password;
const database = runtimeConfig.db.database;

const client = postgres({
  host,
  port,
  user,
  password,
  database,
  prepare: false,
});

export const db = drizzle(client, { schema });
