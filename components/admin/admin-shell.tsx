"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { SiteSettings } from "@/types/content";
import { AdminProfilePopup } from "./admin-profile-popup";
import { AdminSignOut } from "./admin-sign-out";

type AdminNavItem = { label: string; href: string; icon: IconName };
type AdminNavGroup = { label: string; items: AdminNavItem[] };
type IconName =
  | "dashboard"
  | "content"
  | "catalogue"
  | "factory"
  | "map"
  | "image"
  | "inbox"
  | "search"
  | "settings"
  | "arrow"
  | "menu"
  | "close"
  | "external"
  | "panelLeft"
  | "panelRight"
  | "chevronDown"
  | "user"
  | "shield"
  | "logOut";

const adminNavigation: AdminNavGroup[] = [
  { label: "Overview", items: [{ label: "Dashboard", href: "/admin", icon: "dashboard" }] },
  { label: "Content", items: [{ label: "Home", href: "/admin/content/home", icon: "content" }, { label: "About", href: "/admin/content/about", icon: "content" }, { label: "Contact", href: "/admin/content/contact", icon: "content" }] },
  { label: "Catalogue", items: [{ label: "Coal & Products", href: "/admin/products", icon: "catalogue" }, { label: "Industries", href: "/admin/industries", icon: "factory" }, { label: "Capabilities", href: "/admin/capabilities", icon: "catalogue" }] },
  { label: "Operations", items: [{ label: "Operations", href: "/admin/operations", icon: "factory" }, { label: "Coverage", href: "/admin/coverage", icon: "map" }] },
  { label: "Media", items: [{ label: "Media Library", href: "/admin/media", icon: "image" }] },
  { label: "Leads", items: [{ label: "Enquiries", href: "/admin/enquiries", icon: "inbox" }] },
  { label: "System", items: [{ label: "SEO", href: "/admin/seo", icon: "search" }, { label: "Settings", href: "/admin/settings", icon: "settings" }] },
];

function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const shared = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  const paths: Record<IconName, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
    content: <><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    catalogue: <><path d="M4 6.5 12 3l8 3.5v11L12 21l-8-3.5z" /><path d="M4 6.5 12 10l8-3.5M12 10v11" /></>,
    factory: <><path d="M3 20V9l6 4V9l6 4V4h6v16z" /><path d="M7 20v-3M12 20v-3M17 20v-3" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" /><path d="M9 3v15M15 6v15" /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="1" /><circle cx="8.5" cy="9" r="1.5" /><path d="m3 17 5-5 4 4 3-3 6 6" /></>,
    inbox: <><path d="M4 4h16v14H4z" /><path d="M4 13h5l2 3h2l2-3h5" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.4 2.4-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56v.1h-3.4v-.1A1.7 1.7 0 0 0 10 19a1.7 1.7 0 0 0-1.88.34l-.06.06-2.4-2.4.06-.06A1.7 1.7 0 0 0 6.06 15a1.7 1.7 0 0 0-1.56-1.03h-.1v-3.4h.1A1.7 1.7 0 0 0 6.06 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.4-2.4.06.06A1.7 1.7 0 0 0 10 5.06a1.7 1.7 0 0 0 1.03-1.56v-.1h3.4v.1A1.7 1.7 0 0 0 15.46 5a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.4 2.4-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.56 1.03h.1v3.4h-.1A1.7 1.7 0 0 0 19.4 15Z" /></>,
    arrow: <path d="M5 12h13M13 6l6 6-6 6" />,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    external: <><path d="M14 4h6v6M20 4 11 13" /><path d="M18 14v5H5V6h5" /></>,
    panelLeft: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /><path d="m14 9-3 3 3 3" /></>,
    panelRight: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /><path d="m11 9 3 3-3 3" /></>,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M6 20v-1a6 6 0 0 1 12 0v1" /></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    logOut: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
  };
  return <svg {...shared}>{paths[name]}</svg>;
}

function AdminMark({ name }: { name: string }) {
  const [first, ...rest] = name.split(" ");
  return <span className="admin-mark"><i>✦</i><b>{first}</b><span>{rest.join(" ")}</span></span>;
}

function Sidebar({
  pathname,
  brandName,
  collapsed,
  onToggleCollapse,
  onOpenProfile,
  onNavigate,
}: {
  pathname: string;
  brandName: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenProfile?: () => void;
  onNavigate?: () => void;
}) {
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name || "Administrator";
  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SE";

  return (
    <aside className="admin-sidebar" data-collapsed={collapsed ? "true" : undefined}>
      <div className="admin-sidebar__brand-row">
        <Link
          href="/admin"
          className="admin-sidebar__brand"
          onClick={onNavigate}
          title={`${brandName} Admin Console`}
        >
          {collapsed ? (
            <span className="admin-mark-compact">
              <i>✦</i><b>SE</b>
            </span>
          ) : (
            <>
              <AdminMark name={brandName} />
              <small>ADMIN CONSOLE</small>
            </>
          )}
        </Link>
        {onToggleCollapse && (
          <button
            type="button"
            className="admin-sidebar__toggle"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar ( [ )" : "Collapse sidebar ( [ )"}
            title={collapsed ? "Expand sidebar ( [ )" : "Collapse sidebar ( [ )"}
          >
            <Icon name={collapsed ? "panelRight" : "panelLeft"} size={16} />
          </button>
        )}
      </div>

      <nav className="admin-sidebar__nav" aria-label="Admin navigation">
        {adminNavigation.map((group) => (
          <section key={group.label}>
            <p>{group.label}</p>
            {group.items.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  className={active ? "is-active" : ""}
                  href={item.href}
                  key={item.href}
                  onClick={onNavigate}
                  data-tooltip={item.label}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </section>
        ))}
      </nav>

      <div className="admin-sidebar__bottom">
        <button
          type="button"
          className="admin-profile-trigger"
          onClick={onOpenProfile}
          aria-label="Open administrator profile card"
          title={collapsed ? `${userName} (Administrator)` : undefined}
        >
          <div className="admin-avatar-wrap">
            <span className="admin-avatar">{initials}</span>
            <span className="admin-status-dot" />
          </div>
          {!collapsed && (
            <div className="admin-profile-trigger__info">
              <b>{userName}</b>
              <small>Administrator</small>
            </div>
          )}
        </button>
        {!collapsed && <AdminSignOut />}
      </div>
    </aside>
  );
}

function getPageTitle(pathname: string) {
  const item = adminNavigation.flatMap((group) => group.items).find((entry) => entry.href === pathname || (entry.href !== "/admin" && pathname.startsWith(`${entry.href}/`)));
  if (pathname === "/admin/content") return "Website Content";
  if (pathname.endsWith("/new")) return "New item";
  return item?.label ?? "Admin Console";
}

export function AdminShell({ siteSettings, children }: { siteSettings: SiteSettings; children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = authClient.useSession();
  const title = useMemo(() => getPageTitle(pathname), [pathname]);

  const userName = session?.user?.name || "Admin";
  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SE";

  // Read collapsed state from localStorage on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem("star_admin_sidebar_collapsed");
      if (saved === "true") setCollapsed(true);
    } catch {
      // ignore
    }
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("star_admin_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Keyboard shortcut: pressing '[' toggles the sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.getAttribute("role") === "textbox")
      ) {
        return;
      }
      if (e.key === "[" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        toggleCollapse();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  if (pathname === "/admin/login" || pathname === "/admin/setup") return <>{children}</>;

  return (
    <div className="admin-shell" data-collapsed={collapsed ? "true" : undefined}>
      <Sidebar
        pathname={pathname}
        brandName={siteSettings.brandName}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        onOpenProfile={() => setProfileOpen(true)}
      />

      {/* Mobile Drawer */}
      <div className="admin-mobile-drawer" data-open={menuOpen || undefined}>
        <div className="admin-mobile-drawer__top">
          <AdminMark name={siteSettings.brandName} />
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>
        <Sidebar
          pathname={pathname}
          brandName={siteSettings.brandName}
          onNavigate={() => setMenuOpen(false)}
          onOpenProfile={() => {
            setMenuOpen(false);
            setProfileOpen(true);
          }}
        />
      </div>

      {/* Main Workspace Area */}
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button
              className="admin-menu-button"
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Icon name="menu" />
            </button>
            <button
              className="admin-topbar__collapse-btn"
              type="button"
              onClick={toggleCollapse}
              aria-label={collapsed ? "Expand sidebar ( [ )" : "Collapse sidebar ( [ )"}
              title={collapsed ? "Expand sidebar ( [ )" : "Collapse sidebar ( [ )"}
            >
              <Icon name={collapsed ? "panelRight" : "panelLeft"} size={17} />
            </button>
            <div>
              <p>ADMIN / {title.toUpperCase()}</p>
              <h1>{title}</h1>
            </div>
          </div>

          <div className="admin-topbar__actions">
            <span className="admin-local-state">CMS</span>
            <a href="/" target="_blank" rel="noreferrer">
              View website <Icon name="external" size={14} />
            </a>
            <button
              type="button"
              className="admin-topbar__profile-btn"
              onClick={() => setProfileOpen(true)}
              aria-label="Open profile card"
              title="Administrator Profile"
            >
              <span className="admin-avatar admin-avatar--sm">{initials}</span>
              <span className="admin-topbar__profile-name">{userName}</span>
              <Icon name="chevronDown" size={12} />
            </button>
          </div>
        </header>

        <main className="admin-main">{children}</main>
      </div>

      {/* Floating Administrator Profile Popup */}
      <AdminProfilePopup
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        siteSettings={siteSettings}
      />
    </div>
  );
}

export { Icon };
