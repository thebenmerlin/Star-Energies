import { SiteChrome } from "@/components/site-chrome";
import { getSiteSettings } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import "./globals.css";

const siteSettings = getSiteSettings();
export const metadata = createMetadata(siteSettings.defaultSeo);

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><SiteChrome siteSettings={siteSettings}>{children}</SiteChrome></body>
    </html>
  );
}
