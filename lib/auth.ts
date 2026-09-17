import "server-only";

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { getDatabase } from "@/db";
import { administrators } from "@/db/schema";
import { getAuthBaseConfig } from "@/lib/auth-config";

/**
 * Deferred so `next build` does not need a live database. Route handlers and
 * server-only authorization resolve this only when an auth operation occurs.
 */
export function getAuth() {
  return betterAuth({
    ...getAuthBaseConfig(),
    plugins: [nextCookies()],
  });
}

export class AdminAuthorizationError extends Error {
  constructor() {
    super("Administrator authorization is required.");
    this.name = "AdminAuthorizationError";
  }
}

export async function getAdminSession() {
  const session = await getAuth().api.getSession({ headers: await headers() });

  if (!session?.user?.id) return null;

  const [administrator] = await getDatabase()
    .select({ userId: administrators.userId, role: administrators.role })
    .from(administrators)
    .where(and(eq(administrators.userId, session.user.id), eq(administrators.role, "admin")))
    .limit(1);

  if (!administrator) return null;

  return { session, administrator };
}

/** Server-side authorization for every privileged action and data read. */
export async function requireAdmin() {
  const adminSession = await getAdminSession();
  if (!adminSession) throw new AdminAuthorizationError();
  return adminSession;
}
