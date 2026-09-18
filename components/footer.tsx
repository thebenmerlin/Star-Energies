"use client";

import { routes } from "@/content/routes";
import type { SiteSettings } from "@/types/content";
import Link from "next/link";
import { Mark } from "./mark";

export function Footer({ siteSettings }: { siteSettings: SiteSettings }) {
  const navigation = siteSettings.navigation;
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__top shell-grid">
        <div className="footer__identity">
          <Mark inverse brandName={siteSettings.brandName} />
          <p>{siteSettings.footerDescription}</p>
        </div>
        <div className="footer__links">
          <span className="eyebrow">Navigate</span>
          {navigation.slice(1).map((item) => <Link key={item.route} href={routes[item.route]}>{item.label}</Link>)}
          <Link href={routes.privacy}>Privacy</Link>
        </div>
        <address className="footer__contact">
          <span className="eyebrow">Start a requirement</span>
          <a href={siteSettings.contact.phoneHref}>{siteSettings.contact.phoneDisplay}</a>
          <a href={siteSettings.contact.whatsappHref}>WhatsApp</a>
          <a href={siteSettings.contact.emailHref}>{siteSettings.contact.email}</a>
          <p>{siteSettings.address.display}</p>
        </address>
      </div>
      <div className="footer__base"><span>© {year} {siteSettings.businessName}</span><span>{siteSettings.footerMeta}</span></div>
    </footer>
  );
}
