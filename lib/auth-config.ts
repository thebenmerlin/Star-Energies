import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { getDatabase } from "@/db/runtime";
import { accounts, rateLimits, sessions, users, verifications } from "@/db/schema";

/**
 * Shared trusted-server authentication configuration.
 * Kept free of Next-specific plugins so the one-off admin bootstrap command can
 * create the first account through Better Auth without importing Next modules.
 */
export function getAuthBaseConfig() {
  const baseUrl = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;

  return {
    database: drizzleAdapter(getDatabase(), {
      provider: "pg" as const,
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
      storage: "database" as const,
      window: 60,
      max: 20,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
      },
    },
    trustedOrigins: baseUrl ? [baseUrl] : undefined,
  };
}
