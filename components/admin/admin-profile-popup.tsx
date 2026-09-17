"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import type { SiteSettings } from "@/types/content";
import { Icon } from "./admin-shell";

export interface AdminProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  siteSettings: SiteSettings;
}

export function AdminProfilePopup({ isOpen, onClose, siteSettings }: AdminProfilePopupProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  const userName = session?.user?.name || "Administrator";
  const userEmail = session?.user?.email || siteSettings.contact.email;
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SE";

  // Dismiss on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Dismiss on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSignOut = async () => {
    await authClient.signOut();
    onClose();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="admin-profile-backdrop" role="dialog" aria-modal="true" aria-label="Administrator profile information">
      <div className="admin-profile-card" ref={modalRef}>
        {/* Header with close button */}
        <div className="admin-profile-card__header">
          <span className="admin-profile-card__badge">ADMIN CONSOLE</span>
          <button
            type="button"
            className="admin-profile-card__close"
            onClick={onClose}
            aria-label="Close profile card"
          >
            <Icon name="close" size={15} />
          </button>
        </div>

        {/* User Identity Section */}
        <div className="admin-profile-card__identity">
          <div className="admin-profile-avatar-wrap">
            <span className="admin-profile-avatar">{initials}</span>
            <span className="admin-profile-status-dot" title="Authenticated" />
          </div>
          <div className="admin-profile-card__titles">
            <div className="admin-profile-card__name-row">
              <h3>{userName}</h3>
              <span className="admin-profile-role-pill">SUPER ADMIN</span>
            </div>
            <p className="admin-profile-card__email">{userEmail}</p>
          </div>
        </div>

        {/* Workspace & Security Meta */}
        <div className="admin-profile-card__meta">
          <div className="admin-profile-meta-item">
            <span>ORGANIZATION</span>
            <strong>{siteSettings.brandName}</strong>
          </div>
          <div className="admin-profile-meta-item">
            <span>OPERATIONS HUB</span>
            <strong>{siteSettings.address.city}, {siteSettings.address.state}</strong>
          </div>
          <div className="admin-profile-meta-item">
            <span>AUTH STATUS</span>
            <strong className="admin-profile-meta-active">
              <i /> Live Session
            </strong>
          </div>
          <div className="admin-profile-meta-item">
            <span>PRIVILEGE</span>
            <strong>Full System Access</strong>
          </div>
        </div>

        {/* Quick Console Actions */}
        <div className="admin-profile-card__actions">
          <p className="admin-profile-section-label">QUICK NAVIGATION</p>
          <div className="admin-profile-links">
            <Link href="/admin/settings" onClick={onClose} className="admin-profile-link">
              <Icon name="settings" size={15} />
              <span>System & Contact Settings</span>
            </Link>
            <Link href="/admin/seo" onClick={onClose} className="admin-profile-link">
              <Icon name="search" size={15} />
              <span>SEO & SERP Metadata</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className="admin-profile-link"
            >
              <Icon name="external" size={15} />
              <span>View Public Website</span>
            </a>
          </div>
        </div>

        {/* Footer with Sign Out */}
        <div className="admin-profile-card__footer">
          <button
            type="button"
            onClick={handleSignOut}
            className="admin-profile-signout-btn"
          >
            <Icon name="logOut" size={15} />
            <span>Sign Out of Administration</span>
          </button>
        </div>
      </div>
    </div>
  );
}
