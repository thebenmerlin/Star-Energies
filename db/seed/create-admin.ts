import { eq } from "drizzle-orm";
import { betterAuth } from "better-auth";

import { getDatabase } from "@/db/runtime";
import { administrators, users } from "@/db/schema";
import { getAuthBaseConfig } from "@/lib/auth-config";

async function createInitialAdministrator() {
  const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  const name = process.env.INITIAL_ADMIN_NAME?.trim() || "Star Energies Administrator";

  if (!email || !password) {
    throw new Error("INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD are both required. No administrator was created.");
  }
  if (password.length < 12) {
    throw new Error("INITIAL_ADMIN_PASSWORD must be at least 12 characters. No administrator was created.");
  }

  const db = getDatabase();
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);

  if (existing) {
    await db.insert(administrators).values({ userId: existing.id, role: "admin" }).onConflictDoNothing();
    console.info("The existing user is now an administrator. Their password was not changed.");
    return;
  }

  const auth = betterAuth(getAuthBaseConfig());
  const result = await auth.api.signUpEmail({ body: { email, password, name } });
  await db.insert(administrators).values({ userId: result.user.id, role: "admin" });
  console.info("Initial administrator created. Remove INITIAL_ADMIN_PASSWORD from your environment when finished.");
}

createInitialAdministrator().catch((error: unknown) => {
  console.error("Administrator bootstrap failed.", error instanceof Error ? error.message : "Unknown error");
  process.exit(1);
});
