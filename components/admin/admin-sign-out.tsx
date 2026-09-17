"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export function AdminSignOut() {
  const router = useRouter();
  return <button type="button" onClick={async () => { await authClient.signOut(); router.replace("/admin/login"); router.refresh(); }} aria-label="Sign out of administration">Sign out</button>;
}
