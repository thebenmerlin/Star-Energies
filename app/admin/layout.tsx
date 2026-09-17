import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Admin Console | Star Energies",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell siteSettings={getSiteSettings()}>{children}</AdminShell>;
}
