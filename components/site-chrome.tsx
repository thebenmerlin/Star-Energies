"use client";

import { usePathname } from "next/navigation";
import type { SiteSettings } from "@/types/content";
import { Footer } from "./footer";
import { SiteHeader } from "./site-header";

/** Keeps the public chrome out of the intentionally separate admin workspace. */
export function SiteChrome({ siteSettings, children }: { siteSettings: SiteSettings; children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return <>{children}</>;

  return <><SiteHeader navigation={siteSettings.navigation} brandName={siteSettings.brandName} quoteCTA={siteSettings.primaryQuoteCTA} contact={siteSettings.contact} />{children}<Footer siteSettings={siteSettings} /></>;
}
