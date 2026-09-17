"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/content/routes";
import type { CallToAction, NavigationItem } from "@/types/content";
import { Mark } from "./mark";

type SiteHeaderProps = {
  navigation: readonly NavigationItem[];
  brandName: string;
  quoteCTA: CallToAction;
};

export function SiteHeader({ navigation, brandName, quoteCTA }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const hasLightOpening = [routes.coal, routes.contact, routes.privacy].includes(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={`site-header ${hasLightOpening ? "site-header--on-light" : ""} ${scrolled || open ? "site-header--solid" : ""}`}>
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/" onClick={() => setOpen(false)}>
          <Mark brandName={brandName} inverse={!hasLightOpening || scrolled || open} />
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.route} href={routes[item.route]} aria-current={pathname === routes[item.route] ? "page" : undefined} className={pathname === routes[item.route] ? "is-active" : ""}>{item.label}</Link>
          ))}
        </nav>
        <Link className="header-cta" href={quoteCTA.href}> {quoteCTA.label} <span>↗</span></Link>
        <button
          className={`menu-toggle ${open ? "menu-toggle--open" : ""}`}
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <i /><i />
        </button>
      </div>
      <div className={`mobile-menu ${open ? "mobile-menu--open" : ""}`}>
        <nav aria-label="Mobile navigation">
          {navigation.map((item, index) => (
            <Link key={item.route} href={routes[item.route]} aria-current={pathname === routes[item.route] ? "page" : undefined} className={pathname === routes[item.route] ? "is-active" : ""} onClick={() => setOpen(false)} style={{ transitionDelay: `${80 + index * 45}ms` }}>
              <span>{String(index + 1).padStart(2, "0")}</span>{item.label}<b>↗</b>
            </Link>
          ))}
        </nav>
        <Link className="button button--amber" href={quoteCTA.href} onClick={() => setOpen(false)}>{quoteCTA.label} <span>↗</span></Link>
      </div>
    </header>
  );
}
