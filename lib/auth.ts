import "server-only";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { getDatabase } from "@/db";
import { administrators, accounts, rateLimits, sessions, users, verifications } from "@/db/schema";

const baseUrl = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;

/**
 * Deferred so `next build` does not need a live database. Route handlers and
 * server-only authorization resolve this only when an auth operation occurs.
 */
export function getAuth() {
  return betterAuth({
    database: drizzleAdapter(getDatabase(), {
      provider: "pg",
      schema: { users, sessions, accounts, verifications, rateLimits },
      usePlural: true,
      camelCase: true,
    }),
    baseURL: baseUrl,
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
      // This only opens during the one-off server-side bootstrap command.
      disableSignUp: process.env.ADMIN_BOOTSTRAP_MODE !== "true",
      autoSignIn: false,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 14,
      updateAge: 60 * 60 * 24,
    },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 20,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
      },
    },
    trustedOrigins: baseUrl ? [baseUrl] : undefined,
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
