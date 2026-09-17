import { eq } from "drizzle-orm";

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
import { getDatabase } from "@/db/runtime";
import {
  aboutPageContent,
  capabilities as capabilityRecords,
  capabilitiesPageContent,
  coalPageContent,
  contactPageContent,
  coverageRegions as coverageRegionRecords,
  homePageContent,
  industries as industryRecords,
  industriesPageContent,
  mediaAssets as mediaAssetRecords,
  mediaReferences,
  operationsPageContent,
  privacyPageContent,
  products as productRecords,
  qualityParameters as qualityParameterRecords,
  requirementDimensions as requirementDimensionRecords,
  seoMetadata,
  siteSettings as siteSettingsRecords,
} from "@/db/schema";
import { mediaAssetSchema, type Capability, type Industry, type MediaAsset, type Product, type QualityParameter } from "@/types/content";

const now = () => new Date();

function mediaInsert(asset: MediaAsset) {
  return {
    id: asset.id,
    cloudinaryPublicId: asset.cloudinaryPublicId ?? null,
    secureUrl: asset.secureUrl ?? asset.url,
    title: asset.title,
    altText: asset.altText,
    label: asset.label,
    caption: asset.caption ?? null,
    category: asset.category,
    width: asset.width ?? null,
    height: asset.height ?? null,
    format: asset.format ?? null,
    mimeType: asset.mimeType ?? null,
    placeholder: asset.placeholder,
    updatedAt: now(),
  };
}

function collectMediaIds(value: unknown, collected = new Set<string>()): Set<string> {
  if (Array.isArray(value)) value.forEach((item) => collectMediaIds(item, collected));
  else if (value && typeof value === "object") {
    const item = value as Record<string, unknown>;
    if (typeof item.id === "string" && typeof item.altText === "string" && typeof item.category === "string") collected.add(item.id);
    Object.values(item).forEach((child) => collectMediaIds(child, collected));
  }
  return collected;
}

/**
 * Deterministic upserts make repeat development seeds safe. It deliberately
 * does not create an administrator; use `npm run admin:create` instead.
 */
async function seed() {
  const db = getDatabase();

  mediaAssetSchema.array().parse(mediaAssets);

  for (const asset of mediaAssets) {
    const values = mediaInsert(asset);
    await db.insert(mediaAssetRecords).values(values).onConflictDoUpdate({ target: mediaAssetRecords.id, set: values });
  }

  await db
    .insert(siteSettingsRecords)
    .values({ id: "star-energies", content: siteSettings, updatedAt: now() })
    .onConflictDoUpdate({ target: siteSettingsRecords.id, set: { content: siteSettings, updatedAt: now() } });

  for (const product of products) {
    await db.insert(productRecords).values({ ...product, publishedContent: product, updatedAt: now() }).onConflictDoUpdate({ target: productRecords.id, set: { ...product, publishedContent: product, updatedAt: now() } });
  }
  for (const industry of industries) {
    await db.insert(industryRecords).values({ ...industry, publishedContent: industry, updatedAt: now() }).onConflictDoUpdate({ target: industryRecords.id, set: { ...industry, publishedContent: industry, updatedAt: now() } });
  }
  for (const capability of capabilities) {
    await db.insert(capabilityRecords).values({ ...capability, publishedContent: capability, updatedAt: now() }).onConflictDoUpdate({ target: capabilityRecords.id, set: { ...capability, publishedContent: capability, updatedAt: now() } });
  }
  for (const region of coverageRegions) {
    await db.insert(coverageRegionRecords).values({ ...region, cityOrMarket: region.cityOrMarket ?? null, updatedAt: now() }).onConflictDoUpdate({ target: coverageRegionRecords.id, set: { ...region, cityOrMarket: region.cityOrMarket ?? null, updatedAt: now() } });
  }
  for (const parameter of qualityParameters as readonly QualityParameter[]) {
    await db.insert(qualityParameterRecords).values({ ...parameter, description: parameter.description ?? null, unit: parameter.unit ?? null, updatedAt: now() }).onConflictDoUpdate({ target: qualityParameterRecords.id, set: { ...parameter, description: parameter.description ?? null, unit: parameter.unit ?? null, updatedAt: now() } });
  }
  for (const dimension of requirementDimensions) {
    await db.insert(requirementDimensionRecords).values({ ...dimension, updatedAt: now() }).onConflictDoUpdate({ target: requirementDimensionRecords.id, set: { ...dimension, updatedAt: now() } });
  }

  const pageValues = (content: unknown) => ({ id: "primary", draftContent: content, publishedContent: content, status: "published" as const, updatedAt: now() });
  const pageUpdate = (content: unknown) => ({ draftContent: content, publishedContent: content, status: "published" as const, updatedAt: now() });
  await db.insert(homePageContent).values(pageValues(homePage)).onConflictDoUpdate({ target: homePageContent.id, set: pageUpdate(homePage) });
  await db.insert(aboutPageContent).values(pageValues(aboutPage)).onConflictDoUpdate({ target: aboutPageContent.id, set: pageUpdate(aboutPage) });
  await db.insert(coalPageContent).values(pageValues(coalPage)).onConflictDoUpdate({ target: coalPageContent.id, set: pageUpdate(coalPage) });
  await db.insert(industriesPageContent).values(pageValues(industriesPage)).onConflictDoUpdate({ target: industriesPageContent.id, set: pageUpdate(industriesPage) });
  await db.insert(capabilitiesPageContent).values(pageValues(capabilitiesPage)).onConflictDoUpdate({ target: capabilitiesPageContent.id, set: pageUpdate(capabilitiesPage) });
  await db.insert(operationsPageContent).values(pageValues(operationsPage)).onConflictDoUpdate({ target: operationsPageContent.id, set: pageUpdate(operationsPage) });
  await db.insert(contactPageContent).values(pageValues(contactPage)).onConflictDoUpdate({ target: contactPageContent.id, set: pageUpdate(contactPage) });
  await db.insert(privacyPageContent).values(pageValues(privacyPage)).onConflictDoUpdate({ target: privacyPageContent.id, set: pageUpdate(privacyPage) });

  const seoDocuments = [
    ["site-settings", "site-settings", siteSettings.defaultSeo],
    ["home", "page:home", homePage.seo],
    ["about", "page:about", aboutPage.seo],
    ["coal", "page:coal", coalPage.seo],
    ["industries", "page:industries", industriesPage.seo],
    ["capabilities", "page:capabilities", capabilitiesPage.seo],
    ["operations", "page:operations", operationsPage.seo],
    ["contact", "page:contact", contactPage.seo],
    ["privacy", "page:privacy", privacyPage.seo],
  ] as const;
  for (const [id, scope, content] of seoDocuments) {
    await db.insert(seoMetadata).values({ id: `seo-${id}`, scope, draftContent: content, publishedContent: content, status: "published", updatedAt: now() }).onConflictDoUpdate({ target: seoMetadata.scope, set: { draftContent: content, publishedContent: content, status: "published", updatedAt: now() } });
  }

  await db.delete(mediaReferences);
  const pageDocuments = { home: homePage, about: aboutPage, coal: coalPage, industries: industriesPage, capabilities: capabilitiesPage, operations: operationsPage, contact: contactPage, privacy: privacyPage };
  const references = Object.entries(pageDocuments).flatMap(([page, content]) =>
    [...collectMediaIds(content)].flatMap((mediaId) => [
      { mediaId, scope: "page", recordId: page, field: "draft-content" },
      { mediaId, scope: "page", recordId: page, field: "published-content" },
    ]),
  );
  references.push({ mediaId: siteSettings.logo.assetId, scope: "settings", recordId: "star-energies", field: "logo" });
  (products as readonly Product[]).filter((product) => product.imageId).forEach((product) => {
    references.push({ mediaId: product.imageId!, scope: "product", recordId: product.id, field: "draft-image" });
    references.push({ mediaId: product.imageId!, scope: "product", recordId: product.id, field: "published-image" });
  });
  (industries as readonly Industry[]).filter((industry) => industry.imageId).forEach((industry) => {
    references.push({ mediaId: industry.imageId!, scope: "industry", recordId: industry.id, field: "draft-image" });
    references.push({ mediaId: industry.imageId!, scope: "industry", recordId: industry.id, field: "published-image" });
  });
  (capabilities as readonly Capability[]).filter((capability) => capability.mediaId).forEach((capability) => {
    references.push({ mediaId: capability.mediaId!, scope: "capability", recordId: capability.id, field: "draft-media" });
    references.push({ mediaId: capability.mediaId!, scope: "capability", recordId: capability.id, field: "published-media" });
  });
  if (references.length) await db.insert(mediaReferences).values(references);

  // Ensure a re-run preserves real admin accounts while refreshing CMS content.
  await db.update(siteSettingsRecords).set({ updatedAt: now() }).where(eq(siteSettingsRecords.id, "star-energies"));
  console.info("Seeded Star Energies CMS content.");
}

seed().catch((error: unknown) => {
  console.error("CMS seed failed.", error instanceof Error ? error.message : "Unknown error");
  process.exit(1);
});
