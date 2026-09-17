import { aboutPage } from "@/content/about";
import { capabilitiesPage } from "@/content/capabilities-page";
import { capabilities } from "@/content/capabilities";
import { coalPage } from "@/content/coal";
import { contactPage } from "@/content/contact";
import { coverageRegions, qualityParameters, requirementDimensions } from "@/content/coverage";
import { homePage } from "@/content/home";
import { industriesPage } from "@/content/industries-page";
import { industries } from "@/content/industries";
import { mediaAssets } from "@/content/media";
import { operationsPage } from "@/content/operations";
import { privacyPage } from "@/content/privacy";
import { products } from "@/content/products";
import { siteSettings } from "@/content/site";
import {
  capabilitySchema,
  industrySchema,
  mediaAssetSchema,
  productSchema,
  qualityParameterSchema,
  quoteFormContentSchema,
  requirementDimensionSchema,
  seoMetadataSchema,
  siteSettingsSchema,
  coverageRegionSchema,
  type Capability,
  type CoverageRegion,
  type Industry,
  type MediaAsset,
  type Product,
  type QualityParameter,
  type RequirementDimension,
} from "@/types/content";

/**
 * Local content repository. Page components use these getters rather than seed
 * modules directly; a future Supabase implementation can replace this file
 * without requiring presentation components to change.
 */

let hasValidatedSeeds = false;

function validateLocalSeeds() {
  if (hasValidatedSeeds) return;

  siteSettingsSchema.parse(siteSettings);
  mediaAssetSchema.array().parse(mediaAssets);
  productSchema.array().parse(products);
  industrySchema.array().parse(industries);
  capabilitySchema.array().parse(capabilities);
  coverageRegionSchema.array().parse(coverageRegions);
  qualityParameterSchema.array().parse(qualityParameters);
  requirementDimensionSchema.array().parse(requirementDimensions);
  quoteFormContentSchema.parse(contactPage.formIntro.quoteForm);

  [homePage, aboutPage, coalPage, industriesPage, capabilitiesPage, operationsPage, contactPage, privacyPage].forEach((page) => {
    seoMetadataSchema.parse(page.seo);
  });

  hasValidatedSeeds = true;
}

function published<T extends { active: boolean; status: string; displayOrder: number }>(items: readonly T[]) {
  return items
    .filter((item) => item.active && item.status === "published")
    .sort((first, second) => first.displayOrder - second.displayOrder);
}

function selected<T extends { id: string }>(items: readonly T[], ids: readonly string[], entityName: string): T[] {
  const itemsById = new Map(items.map((item) => [item.id, item]));

  return ids.map((id) => {
    const item = itemsById.get(id);
    if (!item) throw new Error(`Missing ${entityName} content for id "${id}".`);
    return item;
  });
}

export function getSiteSettings() {
  validateLocalSeeds();
  return siteSettings;
}

export function getNavigation() {
  return getSiteSettings().navigation;
}

export function getMediaAssets(): MediaAsset[] {
  validateLocalSeeds();
  return [...mediaAssets];
}

export function getProducts(): Product[] {
  validateLocalSeeds();
  return published(products);
}

export function getProductsByIds(ids: readonly string[]): Product[] {
  return selected(getProducts(), ids, "product");
}

export function getIndustries(): Industry[] {
  validateLocalSeeds();
  return published(industries);
}

export function getIndustriesByIds(ids: readonly string[]): Industry[] {
  return selected(getIndustries(), ids, "industry");
}

export function getCapabilities(): Capability[] {
  validateLocalSeeds();
  return published(capabilities);
}

export function getCapabilitiesByIds(ids: readonly string[]): Capability[] {
  return selected(getCapabilities(), ids, "capability");
}

export function getCoverageRegions(): CoverageRegion[] {
  validateLocalSeeds();
  return [...coverageRegions].filter((region) => region.active).sort((first, second) => first.displayOrder - second.displayOrder);
}

export function getCoverageRegionsByIds(ids: readonly string[]): CoverageRegion[] {
  return selected(getCoverageRegions(), ids, "coverage region");
}

export function getQualityParameters(): QualityParameter[] {
  validateLocalSeeds();
  return [...qualityParameters].filter((parameter) => parameter.active).sort((first, second) => first.displayOrder - second.displayOrder);
}

export function getQualityParametersByIds(ids: readonly string[]): QualityParameter[] {
  return selected(getQualityParameters(), ids, "quality parameter");
}

export function getRequirementDimensions(): RequirementDimension[] {
  validateLocalSeeds();
  return [...requirementDimensions].sort((first, second) => first.displayOrder - second.displayOrder);
}

export function getRequirementDimensionsByIds(ids: readonly string[]): RequirementDimension[] {
  return selected(getRequirementDimensions(), ids, "requirement dimension");
}

export function getHomePage() {
  validateLocalSeeds();
  return {
    content: homePage,
    products: getProductsByIds(homePage.sourcing.productIds),
    industries: getIndustriesByIds(homePage.industries.industryIds),
    coverageRegions: getCoverageRegionsByIds(homePage.coverage.regionIds),
    qualityParameters: getQualityParametersByIds(homePage.quality.parameterIds),
    requirementDimensions: getRequirementDimensionsByIds(homePage.hero.requirementDimensionIds),
  };
}

export function getAboutPage() {
  validateLocalSeeds();
  return aboutPage;
}

export function getCoalPage() {
  validateLocalSeeds();
  return {
    content: coalPage,
    products: getProductsByIds(coalPage.categories.productIds),
    qualityParameters: getQualityParametersByIds(coalPage.quality.parameterIds),
    requirementDimensions: getRequirementDimensions(),
  };
}

export function getIndustriesPage() {
  validateLocalSeeds();
  return {
    content: industriesPage,
    industries: getIndustriesByIds(industriesPage.directory.industryIds),
  };
}

export function getCapabilitiesPage() {
  validateLocalSeeds();
  return {
    content: capabilitiesPage,
    capabilities: getCapabilitiesByIds(capabilitiesPage.index.capabilityIds),
  };
}

export function getOperationsPage() {
  validateLocalSeeds();
  return {
    content: operationsPage,
    coverageRegions: getCoverageRegionsByIds(operationsPage.coverage.regionIds),
  };
}

export function getContactPage() {
  validateLocalSeeds();
  return {
    content: contactPage,
    requirementDimensions: getRequirementDimensionsByIds(contactPage.formIntro.requirementDimensionIds),
  };
}

export function getPrivacyPage() {
  validateLocalSeeds();
  return privacyPage;
}

/** Exposed for a future admin import/preview flow and for build-time checks. */
export function validateContentSeeds() {
  validateLocalSeeds();
}
