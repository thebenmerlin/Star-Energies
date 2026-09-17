import "server-only";

import { createHash, randomUUID } from "node:crypto";

import { betterAuth } from "better-auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDatabase } from "@/db";
import { administrators, rateLimits, users } from "@/db/schema";
import { getAuthBaseConfig } from "@/lib/auth-config";

const setupSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100, "Keep your name below 100 characters."),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  password: z.string().min(12, "Use a password with at least 12 characters.").max(128, "Keep your password below 128 characters."),
});

const setupRateLimit = { maxAttempts: 5, windowMs: 15 * 60 * 1000 };

export async function isAdminSetupAvailable() {
  const [administrator] = await getDatabase().select({ userId: administrators.userId }).from(administrators).limit(1);
  return !administrator;
}

async function applySetupRateLimit(clientIp: string) {
  const fingerprint = createHash("sha256")
    .update(`${process.env.BETTER_AUTH_SECRET ?? "star-energies-setup"}:${clientIp}`)
    .digest("hex");
  const key = `admin-setup:${fingerprint}`;
  const now = Date.now();
  const db = getDatabase();
  const [existing] = await db.select().from(rateLimits).where(eq(rateLimits.key, key)).limit(1);
  const isCurrentWindow = existing && now - existing.lastRequest < setupRateLimit.windowMs;

  if (isCurrentWindow && existing.count >= setupRateLimit.maxAttempts) return false;

  if (existing) {
    await db
      .update(rateLimits)
      .set({ count: isCurrentWindow ? existing.count + 1 : 1, lastRequest: now })
      .where(eq(rateLimits.key, key));
  } else {
    await db.insert(rateLimits).values({ id: randomUUID(), key, count: 1, lastRequest: now });
  }

  return true;
}

export async function createInitialAdministrator(input: unknown, clientIp: string) {
  const parsed = setupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, status: 400, message: parsed.error.issues[0]?.message ?? "Check the submitted details." };
  }

  if (!(await isAdminSetupAvailable())) {
    return { ok: false as const, status: 409, message: "Administrator setup is already complete. Please sign in." };
  }

  if (!(await applySetupRateLimit(clientIp))) {
    return { ok: false as const, status: 429, message: "Too many setup attempts. Please wait before trying again." };
  }

  try {
    const auth = betterAuth(getAuthBaseConfig({ allowEmailSignUp: true }));
    const result = await auth.api.signUpEmail({ body: parsed.data });
    const db = getDatabase();
    const [administrator] = await db
      .insert(administrators)
      .values({ userId: result.user.id, singleton: true, role: "admin" })
      .onConflictDoNothing()
      .returning({ userId: administrators.userId });

    if (!administrator) {
      // A competing setup completed first. Remove only this request's orphaned
      // non-admin account; account rows cascade from the user record.
      await db.delete(users).where(eq(users.id, result.user.id));
      return { ok: false as const, status: 409, message: "Administrator setup is already complete. Please sign in." };
    }

    return { ok: true as const };
  } catch (error) {
    console.error("Initial administrator setup failed.", error instanceof Error ? error.message : "Unknown error");
    return { ok: false as const, status: 400, message: "We could not create the administrator account. Check the details and try again." };
  }
}
