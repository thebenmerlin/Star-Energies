"use client";

import Link from "next/link";
import type { AdminEnquiry } from "@/types/admin";
import type { Capability, Industry, MediaAsset, Product, SiteSettings } from "@/types/content";
import { AdminLink, PageHeader, StatusBadge } from "./admin-primitives";

type DashboardProps = {
  siteSettings: SiteSettings;
  products: Product[];
  industries: Industry[];
  capabilities: Capability[];
  media: MediaAsset[];
  enquiryDashboard: { newCount: number; openCount: number; recent: AdminEnquiry[] };
};

const formatDate = (value: string) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));

export function AdminDashboard({ siteSettings, products, industries, capabilities, media, enquiryDashboard }: DashboardProps) {
  const placeholderMedia = media.filter((asset) => asset.placeholder);
  const contentItems = products.length + industries.length + capabilities.length;

  return <>
    <PageHeader
      eyebrow="OVERVIEW / CMS WORKSPACE"
      title="A clear view of the work in hand."
      description="A focused view of published website content and the direct commercial conversations now coming through the public quote form."
      actions={<AdminLink href="/admin/enquiries" variant="dark">Review enquiries</AdminLink>}
    />

    <section className="admin-kpis" aria-label="Current website activity">
      <div><p>NEW ENQUIRIES</p><strong>{String(enquiryDashboard.newCount).padStart(2, "0")}</strong><span>Awaiting first response</span></div>
      <div><p>OPEN CONVERSATIONS</p><strong>{String(enquiryDashboard.openCount).padStart(2, "0")}</strong><span>New, contacted or quoted</span></div>
      <div><p>PLACEHOLDER MEDIA</p><strong>{String(placeholderMedia.length).padStart(2, "0")}</strong><span>Ready to be replaced</span></div>
    </section>

    <div className="admin-dashboard-grid">
      <section className="admin-panel admin-panel--enquiries">
        <header><div><p>RECENT ENQUIRIES</p><h3>Direct conversations</h3></div><Link href="/admin/enquiries">View all</Link></header>
        <div className="admin-recent-list">
          {enquiryDashboard.recent.length === 0 ? <p className="admin-recent-empty">No website enquiries yet. New quote requests will appear here.</p> : enquiryDashboard.recent.slice(0, 5).map((enquiry) => <Link href={`/admin/enquiries/${enquiry.id}`} key={enquiry.id}>
            <div><b>{enquiry.companyName}</b><span>{enquiry.coalRequirement} · {enquiry.quantity} {enquiry.unit}</span></div>
            <time dateTime={enquiry.submittedAt}>{formatDate(enquiry.submittedAt)}</time>
            <StatusBadge status={enquiry.status} />
          </Link>)}
        </div>
      </section>

      <section className="admin-panel admin-panel--attention">
        <header><div><p>ATTENTION</p><h3>Before launch</h3></div></header>
        <div className="admin-attention-list">
          <Link href="/admin/settings"><i>01</i><span><b>Confirm direct contact details</b><small>{siteSettings.contact.isPlaceholder ? "Phone, WhatsApp and email are still marked as placeholders." : "Contact information is configured."}</small></span></Link>
          <Link href="/admin/media"><i>02</i><span><b>Replace development photography</b><small>{placeholderMedia.length} media assets are clearly marked for replacement.</small></span></Link>
          <Link href="/admin/seo"><i>03</i><span><b>Review page search metadata</b><small>Final production domain and approved descriptions still need review.</small></span></Link>
        </div>
      </section>
    </div>

    <section className="admin-panel admin-panel--catalogue-health">
      <header><div><p>WEBSITE CONTENT</p><h3>Published catalogue</h3><span>Structured entries inherited from the Phase 3 content layer.</span></div><Link href="/admin/content">Edit website content</Link></header>
      <div className="admin-catalogue-health__rows">
        <Link href="/admin/products"><b>Coal &amp; Products</b><strong>{products.length}</strong><span>published entries</span></Link>
        <Link href="/admin/industries"><b>Industries</b><strong>{industries.length}</strong><span>published entries</span></Link>
        <Link href="/admin/capabilities"><b>Capabilities</b><strong>{capabilities.length}</strong><span>published entries</span></Link>
        <Link href="/admin/media"><b>Media assets</b><strong>{media.length}</strong><span>{contentItems} structured catalogue items</span></Link>
      </div>
    </section>
  </>;
}
