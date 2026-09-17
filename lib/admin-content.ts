import "server-only";

import {
  getAdminEnquiries as getPersistentEnquiries,
  getAdminEnquiry as getPersistentEnquiry,
  getAdminEnquiryDashboard,
} from "@/lib/enquiries";
import {
  getAdminCapabilities,
  getAdminCoverageRegions,
  getAdminIndustries,
  getAdminMediaAssets,
  getAdminPageContent,
  getAdminProducts,
  getAdminSiteSettings,
} from "@/lib/content";
import type { EnquiryListResult } from "@/types/enquiry";

/** CMS and private-lead data repository for authorized administration screens. */
export async function getAdminDashboardData() {
  const [siteSettings, products, industries, capabilities, media, enquiryDashboard] = await Promise.all([
    getAdminSiteSettings(),
    getAdminProducts(),
    getAdminIndustries(),
    getAdminCapabilities(),
    getAdminMediaAssets(),
    getAdminEnquiryDashboard(),
  ]);
  return {
    siteSettings,
    products,
    industries,
    capabilities,
    media,
    enquiryDashboard,
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

export async function getAdminEnquiries(options?: Parameters<typeof getPersistentEnquiries>[0]): Promise<EnquiryListResult> {
  return getPersistentEnquiries(options);
}

export async function getAdminEnquiry(id: string) {
  return getPersistentEnquiry(id);
}
