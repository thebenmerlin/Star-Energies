import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Admin Console | Star Energies",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell siteSettings={await getSiteSettings()}>{children}</AdminShell>;
}
