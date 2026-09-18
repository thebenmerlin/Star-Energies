"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/content/routes";
import type { CallToAction, NavigationItem, SiteSettings } from "@/types/content";
import { Mark } from "./mark";

type SiteHeaderProps = {
  navigation: readonly NavigationItem[];
  brandName: string;
  quoteCTA: CallToAction;
  contact: SiteSettings["contact"];
};

export function SiteHeader({ navigation, brandName, quoteCTA, contact }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasLightOpening = [routes.coal, routes.contact, routes.privacy].includes(pathname);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const inertElements = [
      document.querySelector("main"),
      document.querySelector(".footer"),
      document.querySelector(".site-header__inner"),
    ].filter((element): element is HTMLElement => element instanceof HTMLElement);

    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("mobile-nav-open");
    inertElements.forEach((element) => { element.inert = true; });
    requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;
      const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => !element.hasAttribute("disabled"));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove("mobile-nav-open");
      inertElements.forEach((element) => { element.inert = false; });
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <header className={`site-header ${hasLightOpening ? "site-header--on-light" : ""} ${scrolled || open ? "site-header--solid" : ""}`}>
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/" onClick={closeMenu}>
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
          ref={triggerRef}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(true)}
        >
          <i /><i />
        </button>
      </div>
      <div ref={menuRef} id="mobile-navigation" className={`mobile-menu ${open ? "mobile-menu--open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="mobile-navigation-title" aria-hidden={!open}>
        <div className="mobile-menu__top">
          <Link className="mobile-menu__brand" href="/" onClick={closeMenu}>
            <Mark inverse brandName={brandName} />
          </Link>
          <button ref={closeRef} className="mobile-menu__close" type="button" onClick={closeMenu} aria-label="Close navigation">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <p id="mobile-navigation-title" className="sr-only">Site navigation</p>
        <nav aria-label="Mobile navigation">
          {navigation.map((item, index) => (
            <Link key={item.route} href={routes[item.route]} aria-current={pathname === routes[item.route] ? "page" : undefined} className={pathname === routes[item.route] ? "is-active" : ""} onClick={closeMenu} style={{ transitionDelay: `${70 + index * 38}ms` }}>
              <span>{String(index + 1).padStart(2, "0")}</span>{item.label}<b>↗</b>
            </Link>
          ))}
        </nav>
        <div className="mobile-menu__secondary">
          <Link className="button button--amber" href={quoteCTA.href} onClick={closeMenu}>{quoteCTA.label} <span>↗</span></Link>
          <div className="mobile-menu__contacts" aria-label="Direct contact">
            <a href={contact.phoneHref} onClick={closeMenu}>Call</a>
            <a href={contact.whatsappHref} onClick={closeMenu}>WhatsApp</a>
            <a href={contact.emailHref} onClick={closeMenu}>Email</a>
          </div>
        </div>
      </div>
    </header>
  );
}
