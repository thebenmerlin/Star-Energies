import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import "./globals.css";

const siteSettings = getSiteSettings();
export const metadata = createMetadata(siteSettings.defaultSeo);

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><SiteHeader navigation={siteSettings.navigation} brandName={siteSettings.brandName} quoteCTA={siteSettings.primaryQuoteCTA} />{children}<Footer /></body>
    </html>
  );
}
