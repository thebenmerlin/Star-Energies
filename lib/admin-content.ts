import "server-only";

import { mockEnquiries } from "@/content/admin-enquiries";
import { requireAdmin } from "@/lib/auth";
import {
  getAdminCapabilities,
  getAdminCoverageRegions,
  getAdminIndustries,
  getAdminMediaAssets,
  getAdminPageContent,
  getAdminProducts,
  getAdminSiteSettings,
} from "@/lib/content";
import type { AdminEnquiry } from "@/types/admin";

/** CMS-backed admin repository. Enquiries intentionally remain Phase 6 mock data. */
export async function getAdminDashboardData() {
  const [siteSettings, products, industries, capabilities, media, enquiries] = await Promise.all([
    getAdminSiteSettings(),
    getAdminProducts(),
    getAdminIndustries(),
    getAdminCapabilities(),
    getAdminMediaAssets(),
    getAdminEnquiries(),
  ]);
  return {
    siteSettings,
    products,
    industries,
    capabilities,
    media,
    enquiries,
  };
}

export async function getAdminContentData() {
  const [home, about, contact, operations, media, coverage, siteSettings] = await Promise.all([
    getAdminPageContent("home"),
    getAdminPageContent("about"),
    getAdminPageContent("contact"),
    getAdminPageContent("operations"),
    getAdminMediaAssets(),
    getAdminCoverageRegions(),
    getAdminSiteSettings(),
  ]);
  return {
    home,
    about,
    contact,
    operations,
    media,
    coverage,
    siteSettings,
  };
}

export async function getAdminEnquiries(): Promise<AdminEnquiry[]> {
  await requireAdmin();
  return [...mockEnquiries];
}

export async function getAdminEnquiry(id: string) {
  return (await getAdminEnquiries()).find((enquiry) => enquiry.id === id);
}
