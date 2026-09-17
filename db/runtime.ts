import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

let database: ReturnType<typeof drizzle<typeof schema>> | undefined;

/**
 * Database access shared by the Next.js server runtime and trusted Node scripts.
 * Browser-facing modules must import through `@/db`, which is marked server-only.
 */
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
