import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

let database: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to access Star Energies CMS data.");
  }

  if (!database) {
    database = drizzle(neon(connectionString), { schema });
  }

  return database;
}

export type Database = ReturnType<typeof getDatabase>;
