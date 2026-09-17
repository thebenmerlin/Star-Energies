"use client";

import { useEffect, useState } from "react";
import { navigation } from "@/lib/site";
import { Mark } from "./mark";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    <header className={`site-header ${scrolled || open ? "site-header--solid" : ""}`}>
      <div className="site-header__inner">
        <a className="site-header__brand" href="/" onClick={() => setOpen(false)}>
          <Mark inverse />
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a key={item.label} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <a className="header-cta" href="#enquire">Request a Quote <span>↗</span></a>
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
            <a key={item.label} href={item.href} onClick={() => setOpen(false)} style={{ transitionDelay: `${80 + index * 45}ms` }}>
              <span>{String(index + 1).padStart(2, "0")}</span>{item.label}<b>↗</b>
            </a>
          ))}
        </nav>
        <a className="button button--amber" href="#enquire" onClick={() => setOpen(false)}>Request a Quote <span>↗</span></a>
      </div>
    </header>
  );
}
