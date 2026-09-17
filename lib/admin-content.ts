import { mockEnquiries } from "@/content/admin-enquiries";
import {
  getAboutPage,
  getCapabilities,
  getCapabilitiesPage,
  getContactPage,
  getCoverageRegions,
  getHomePage,
  getIndustries,
  getMediaAssets,
  getOperationsPage,
  getProducts,
  getSiteSettings,
} from "@/lib/content";
import type { AdminEnquiry } from "@/types/admin";

/** Development admin repository. Replace only this boundary when persistence is introduced. */
export function getAdminDashboardData() {
  return {
    siteSettings: getSiteSettings(),
    products: getProducts(),
    industries: getIndustries(),
    capabilities: getCapabilities(),
    media: getMediaAssets(),
    enquiries: [...mockEnquiries] as AdminEnquiry[],
  };
}

export function getAdminContentData() {
  return {
    home: getHomePage().content,
    about: getAboutPage(),
    contact: getContactPage().content,
    operations: getOperationsPage().content,
    media: getMediaAssets(),
    coverage: getCoverageRegions(),
    siteSettings: getSiteSettings(),
  };
}

export function getAdminEnquiries(): AdminEnquiry[] {
  return [...mockEnquiries];
}

export function getAdminEnquiry(id: string) {
  return getAdminEnquiries().find((enquiry) => enquiry.id === id);
}
