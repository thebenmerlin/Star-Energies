import "server-only";

import { and, asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { homePage as developmentHomePage } from "@/content/home";
import { siteSettings as developmentSiteSettings } from "@/content/site";
import { getDatabase } from "@/db";
import { getCloudinaryDeliveryUrl } from "@/lib/cloudinary";
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
  operationsPageContent,
  privacyPageContent,
  products as productRecords,
  qualityParameters as qualityParameterRecords,
  requirementDimensions as requirementDimensionRecords,
  seoMetadata as seoMetadataRecords,
  siteSettings as siteSettingsRecords,
} from "@/db/schema";
import {
  capabilitySchema,
  coverageRegionSchema,
  industrySchema,
  mediaAssetSchema,
  productSchema,
  qualityParameterSchema,
  requirementDimensionSchema,
  seoMetadataSchema,
  siteSettingsSchema,
  type AboutPageContent,
  type CapabilitiesPageContent,
  type Capability,
  type CoalPageContent,
  type ContactPageContent,
  type CoverageRegion,
  type HomePageContent,
  type IndustriesPageContent,
  type Industry,
  type MediaAsset,
  type OperationsPageContent,
  type PrivacyPageContent,
  type Product,
  type QualityParameter,
  type RequirementDimension,
  type RouteKey,
  type SeoMetadata,
  type SiteSettings,
} from "@/types/content";

type PageKey = RouteKey;
type PageContent =
  | HomePageContent
  | AboutPageContent
  | CoalPageContent
  | IndustriesPageContent
  | CapabilitiesPageContent
  | OperationsPageContent
  | ContactPageContent
  | PrivacyPageContent;

async function authorizeAdminRead() {
  const { requireAdmin } = await import("@/lib/auth");
  return requireAdmin();
}

function unavailableContentError(resource: string) {
  return new Error(`${resource} has not been seeded in the CMS database.`);
}

function selected<T extends { id: string }>(items: readonly T[], ids: readonly string[], entityName: string): T[] {
  const itemsById = new Map(items.map((item) => [item.id, item]));
  return ids.map((id) => {
    const item = itemsById.get(id);
    if (!item) throw unavailableContentError(`Published ${entityName} "${id}"`);
    return item;
  });
}

function toMediaAsset(record: typeof mediaAssetRecords.$inferSelect): MediaAsset {
  return mediaAssetSchema.parse({
    id: record.id,
    url: getCloudinaryDeliveryUrl(record.cloudinaryPublicId ?? undefined, record.secureUrl),
    cloudinaryPublicId: record.cloudinaryPublicId ?? undefined,
    secureUrl: record.secureUrl,
    title: record.title,
    altText: record.altText,
    label: record.label,
    caption: record.caption ?? undefined,
    category: record.category,
    width: record.width ?? undefined,
    height: record.height ?? undefined,
    format: record.format ?? undefined,
    mimeType: record.mimeType ?? undefined,
    placeholder: record.placeholder,
    createdAt: record.createdAt.toISOString(),
  });
}

function toProduct(record: typeof productRecords.$inferSelect, seo?: SeoMetadata): Product {
  return productSchema.parse({
    id: record.id,
    slug: record.slug,
    name: record.name,
    shortDescription: record.shortDescription,
    longDescription: record.longDescription ?? undefined,
    sourceType: record.sourceType ?? undefined,
    grades: record.grades ?? undefined,
    gcvInfo: record.gcvInfo ?? undefined,
    sizes: record.sizes ?? undefined,
    applications: record.applications ?? undefined,
    availabilityNote: record.availabilityNote ?? undefined,
    imageId: record.imageId ?? undefined,
    featured: record.featured,
    active: record.active,
    status: record.status,
    displayOrder: record.displayOrder,
    consideredAgainst: record.consideredAgainst,
    seo,
  });
}

function toPublishedProduct(record: typeof productRecords.$inferSelect): Product | null {
  if (!record.publishedContent) return null;
  const product = productSchema.parse(record.publishedContent);
  return product.status === "published" && product.active ? product : null;
}

function toIndustry(record: typeof industryRecords.$inferSelect, seo?: SeoMetadata): Industry {
  return industrySchema.parse({
    id: record.id,
    slug: record.slug,
    name: record.name,
    shortDescription: record.shortDescription,
    longDescription: record.longDescription ?? undefined,
    imageId: record.imageId ?? undefined,
    icon: record.icon ?? undefined,
    featured: record.featured,
    active: record.active,
    status: record.status,
    displayOrder: record.displayOrder,
    seo,
  });
}

function toPublishedIndustry(record: typeof industryRecords.$inferSelect): Industry | null {
  if (!record.publishedContent) return null;
  const industry = industrySchema.parse(record.publishedContent);
  return industry.status === "published" && industry.active ? industry : null;
}

function toCapability(record: typeof capabilityRecords.$inferSelect, seo?: SeoMetadata): Capability {
  return capabilitySchema.parse({
    id: record.id,
    slug: record.slug,
    title: record.title,
    shortDescription: record.shortDescription,
    longDescription: record.longDescription ?? undefined,
    icon: record.icon ?? undefined,
    mediaId: record.mediaId ?? undefined,
    featured: record.featured,
    active: record.active,
    status: record.status,
    displayOrder: record.displayOrder,
    seo,
  });
}

function toPublishedCapability(record: typeof capabilityRecords.$inferSelect): Capability | null {
  if (!record.publishedContent) return null;
  const capability = capabilitySchema.parse(record.publishedContent);
  return capability.status === "published" && capability.active ? capability : null;
}

function toCoverageRegion(record: typeof coverageRegionRecords.$inferSelect): CoverageRegion {
  return coverageRegionSchema.parse({
    id: record.id,
    name: record.name,
    label: record.label,
    state: record.state,
    cityOrMarket: record.cityOrMarket ?? undefined,
    experienceType: "industry-experience",
    active: record.active,
    displayOrder: record.displayOrder,
    mapLabel: record.mapLabel,
  });
}

function toQualityParameter(record: typeof qualityParameterRecords.$inferSelect): QualityParameter {
  return qualityParameterSchema.parse({
    id: record.id,
    name: record.name,
    shortLabel: record.shortLabel,
    description: record.description ?? undefined,
    unit: record.unit ?? undefined,
    displayOrder: record.displayOrder,
    active: record.active,
  });
}

function toRequirementDimension(record: typeof requirementDimensionRecords.$inferSelect): RequirementDimension {
  return requirementDimensionSchema.parse({
    id: record.id,
    label: record.label,
    detail: record.detail,
    displayOrder: record.displayOrder,
  });
}

function hydrateMedia<T>(value: T, media: Map<string, MediaAsset>): T {
  if (Array.isArray(value)) return value.map((item) => hydrateMedia(item, media)) as T;
  if (!value || typeof value !== "object") return value;

  const candidate = value as Record<string, unknown>;
  if (typeof candidate.id === "string" && typeof candidate.altText === "string" && typeof candidate.category === "string" && media.has(candidate.id)) {
    return media.get(candidate.id) as T;
  }

  return Object.fromEntries(Object.entries(candidate).map(([key, item]) => [key, hydrateMedia(item, media)])) as T;
}

const getCachedMediaAssets = unstable_cache(
  async () => (await getDatabase().select().from(mediaAssetRecords).orderBy(asc(mediaAssetRecords.createdAt))).map(toMediaAsset),
  ["media-assets"],
  { tags: ["media"] },
);

const getCachedSiteSettings = unstable_cache(
  async () => {
    const [record] = await getDatabase().select().from(siteSettingsRecords).where(eq(siteSettingsRecords.id, "star-energies")).limit(1);
    if (!record) throw unavailableContentError("Site settings");
    return siteSettingsSchema.parse(record.content);
  },
  ["site-settings"],
  { tags: ["site-settings"] },
);

const getCachedProducts = unstable_cache(
  async () =>
    (await getDatabase().select().from(productRecords)).map(toPublishedProduct).filter((product): product is Product => Boolean(product)).sort((first, second) => first.displayOrder - second.displayOrder),
  ["published-products"],
  { tags: ["products"] },
);

const getCachedIndustries = unstable_cache(
  async () =>
    (await getDatabase().select().from(industryRecords)).map(toPublishedIndustry).filter((industry): industry is Industry => Boolean(industry)).sort((first, second) => first.displayOrder - second.displayOrder),
  ["published-industries"],
  { tags: ["industries"] },
);

const getCachedCapabilities = unstable_cache(
  async () =>
    (await getDatabase().select().from(capabilityRecords)).map(toPublishedCapability).filter((capability): capability is Capability => Boolean(capability)).sort((first, second) => first.displayOrder - second.displayOrder),
  ["published-capabilities"],
  { tags: ["capabilities"] },
);

const getCachedCoverageRegions = unstable_cache(
  async () =>
    (await getDatabase().select().from(coverageRegionRecords).where(eq(coverageRegionRecords.active, true)).orderBy(asc(coverageRegionRecords.displayOrder))).map(toCoverageRegion),
  ["coverage-regions"],
  { tags: ["coverage"] },
);

const getCachedQualityParameters = unstable_cache(
  async () =>
    (await getDatabase().select().from(qualityParameterRecords).where(eq(qualityParameterRecords.active, true)).orderBy(asc(qualityParameterRecords.displayOrder))).map(toQualityParameter),
  ["quality-parameters"],
  { tags: ["quality"] },
);

const getCachedRequirementDimensions = unstable_cache(
  async () => (await getDatabase().select().from(requirementDimensionRecords).orderBy(asc(requirementDimensionRecords.displayOrder))).map(toRequirementDimension),
  ["requirement-dimensions"],
  { tags: ["requirements"] },
);

const pageTables = {
  home: homePageContent,
  about: aboutPageContent,
  coal: coalPageContent,
  industries: industriesPageContent,
  capabilities: capabilitiesPageContent,
  operations: operationsPageContent,
  contact: contactPageContent,
  privacy: privacyPageContent,
} as const;

/** New content blocks retain a safe default until their data migration has run. */
function withContentCompatibility<T extends PageContent>(page: PageKey, content: T): T {
  if (page === "home" && !("process" in content)) return { ...content, process: developmentHomePage.process } as T;
  return content;
}

async function getPublishedPageDocument<T extends PageContent>(page: PageKey): Promise<T> {
  const table = pageTables[page];
  const [record] = await getDatabase().select().from(table).where(eq(table.id, "primary")).limit(1);
  if (!record || record.status !== "published") throw unavailableContentError(`Published ${page} page`);

  const media = new Map((await getCachedMediaAssets()).map((asset) => [asset.id, asset]));
  const content = hydrateMedia(withContentCompatibility(page, record.publishedContent as T), media);
  const [seoRecord] = await getDatabase().select().from(seoMetadataRecords).where(eq(seoMetadataRecords.scope, `page:${page}`)).limit(1);
  if (seoRecord?.status === "published") {
    content.seo = seoMetadataSchema.parse(seoRecord.publishedContent);
  }
  seoMetadataSchema.parse(content.seo);
  return content;
}

function cachedPage<T extends PageContent>(page: PageKey, tags: string[]) {
  return unstable_cache(() => getPublishedPageDocument<T>(page), [`published-${page}-page`], { tags });
}

const getCachedHomePage = cachedPage<HomePageContent>("home", ["home", "media"]);
const getCachedAboutPage = cachedPage<AboutPageContent>("about", ["about", "media"]);
const getCachedCoalPage = cachedPage<CoalPageContent>("coal", ["coal", "media"]);
const getCachedIndustriesPage = cachedPage<IndustriesPageContent>("industries", ["industries", "media"]);
const getCachedCapabilitiesPage = cachedPage<CapabilitiesPageContent>("capabilities", ["capabilities", "media"]);
const getCachedOperationsPage = cachedPage<OperationsPageContent>("operations", ["operations", "media"]);
const getCachedContactPage = cachedPage<ContactPageContent>("contact", ["contact", "media"]);
const getCachedPrivacyPage = cachedPage<PrivacyPageContent>("privacy", ["privacy", "media"]);

export async function getSiteSettings(): Promise<SiteSettings> {
  // A configured application always reads this singleton from Neon. Keeping the
  // approved seed settings available during a production build lets Vercel
  // produce its framework fallback pages before the first Neon migration has
  // been applied. Runtime requests still use Neon whenever DATABASE_URL exists.
  if (!process.env.DATABASE_URL || process.env.NEXT_PHASE === "phase-production-build") return developmentSiteSettings;
  return getCachedSiteSettings();
}

export async function getNavigation() {
  return (await getSiteSettings()).navigation;
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  return getCachedMediaAssets();
}

export async function getProducts(): Promise<Product[]> {
  return getCachedProducts();
}

export async function getProductsByIds(ids: readonly string[]): Promise<Product[]> {
  return selected(await getProducts(), ids, "product");
}

export async function getIndustries(): Promise<Industry[]> {
  return getCachedIndustries();
}

export async function getIndustriesByIds(ids: readonly string[]): Promise<Industry[]> {
  return selected(await getIndustries(), ids, "industry");
}

export async function getCapabilities(): Promise<Capability[]> {
  return getCachedCapabilities();
}

export async function getCapabilitiesByIds(ids: readonly string[]): Promise<Capability[]> {
  return selected(await getCapabilities(), ids, "capability");
}

export async function getCoverageRegions(): Promise<CoverageRegion[]> {
  return getCachedCoverageRegions();
}

export async function getCoverageRegionsByIds(ids: readonly string[]): Promise<CoverageRegion[]> {
  return selected(await getCoverageRegions(), ids, "coverage region");
}

export async function getQualityParameters(): Promise<QualityParameter[]> {
  return getCachedQualityParameters();
}

export async function getQualityParametersByIds(ids: readonly string[]): Promise<QualityParameter[]> {
  return selected(await getQualityParameters(), ids, "quality parameter");
}

export async function getRequirementDimensions(): Promise<RequirementDimension[]> {
  return getCachedRequirementDimensions();
}

export async function getRequirementDimensionsByIds(ids: readonly string[]): Promise<RequirementDimension[]> {
  return selected(await getRequirementDimensions(), ids, "requirement dimension");
}

export async function getHomePage() {
  const [cachedContent, products, industries, coverageRegions, qualityParameters, requirementDimensions] = await Promise.all([
    getCachedHomePage(), getProducts(), getIndustries(), getCoverageRegions(), getQualityParameters(), getRequirementDimensions(),
  ]);
  // `unstable_cache` can briefly serve a document created before a content-data
  // migration; apply the same compatibility layer after the cache boundary.
  const content = withContentCompatibility("home", cachedContent);
  return {
    content,
    products: selected(products, content.sourcing.productIds, "product"),
    industries: selected(industries, content.industries.industryIds, "industry"),
    coverageRegions: selected(coverageRegions, content.coverage.regionIds, "coverage region"),
    qualityParameters: selected(qualityParameters, content.quality.parameterIds, "quality parameter"),
    requirementDimensions: selected(requirementDimensions, content.hero.requirementDimensionIds, "requirement dimension"),
  };
}

export async function getAboutPage() { return getCachedAboutPage(); }

export async function getCoalPage() {
  const [content, products, qualityParameters, requirementDimensions] = await Promise.all([getCachedCoalPage(), getProducts(), getQualityParameters(), getRequirementDimensions()]);
  return { content, products: selected(products, content.categories.productIds, "product"), qualityParameters: selected(qualityParameters, content.quality.parameterIds, "quality parameter"), requirementDimensions };
}

export async function getIndustriesPage() {
  const [content, industries] = await Promise.all([getCachedIndustriesPage(), getIndustries()]);
  return { content, industries: selected(industries, content.directory.industryIds, "industry") };
}

export async function getCapabilitiesPage() {
  const [content, capabilities] = await Promise.all([getCachedCapabilitiesPage(), getCapabilities()]);
  return { content, capabilities: selected(capabilities, content.index.capabilityIds, "capability") };
}

export async function getOperationsPage() {
  const [content, coverageRegions] = await Promise.all([getCachedOperationsPage(), getCoverageRegions()]);
  return { content, coverageRegions: selected(coverageRegions, content.coverage.regionIds, "coverage region") };
}

export async function getContactPage() {
  const [content, requirementDimensions] = await Promise.all([getCachedContactPage(), getRequirementDimensions()]);
  return { content, requirementDimensions: selected(requirementDimensions, content.formIntro.requirementDimensionIds, "requirement dimension") };
}

export async function getPrivacyPage() { return getCachedPrivacyPage(); }

/**
 * Uncached management reads. Callers are responsible for requireAdmin() before
 * using these; admin must see drafts and inactive entries that public visitors
 * must never receive.
 */
export async function getAdminSiteSettings(): Promise<SiteSettings> {
  await authorizeAdminRead();
  const [record] = await getDatabase().select().from(siteSettingsRecords).where(eq(siteSettingsRecords.id, "star-energies")).limit(1);
  if (!record) throw unavailableContentError("Site settings");
  return siteSettingsSchema.parse(record.content);
}

export async function getAdminMediaAssets(): Promise<MediaAsset[]> {
  await authorizeAdminRead();
  return (await getDatabase().select().from(mediaAssetRecords).orderBy(asc(mediaAssetRecords.createdAt))).map(toMediaAsset);
}

export async function getAdminProducts(): Promise<Product[]> {
  await authorizeAdminRead();
  const [records, seoRecords] = await Promise.all([
    getDatabase().select().from(productRecords).orderBy(asc(productRecords.displayOrder)),
    getDatabase().select().from(seoMetadataRecords),
  ]);
  const seoByScope = new Map(seoRecords.map((record) => [record.scope, seoMetadataSchema.parse(record.draftContent)]));
  return records.map((record) => toProduct(record, seoByScope.get(`product:${record.id}`)));
}

export async function getAdminIndustries(): Promise<Industry[]> {
  await authorizeAdminRead();
  const [records, seoRecords] = await Promise.all([
    getDatabase().select().from(industryRecords).orderBy(asc(industryRecords.displayOrder)),
    getDatabase().select().from(seoMetadataRecords),
  ]);
  const seoByScope = new Map(seoRecords.map((record) => [record.scope, seoMetadataSchema.parse(record.draftContent)]));
  return records.map((record) => toIndustry(record, seoByScope.get(`industry:${record.id}`)));
}

export async function getAdminCapabilities(): Promise<Capability[]> {
  await authorizeAdminRead();
  const [records, seoRecords] = await Promise.all([
    getDatabase().select().from(capabilityRecords).orderBy(asc(capabilityRecords.displayOrder)),
    getDatabase().select().from(seoMetadataRecords),
  ]);
  const seoByScope = new Map(seoRecords.map((record) => [record.scope, seoMetadataSchema.parse(record.draftContent)]));
  return records.map((record) => toCapability(record, seoByScope.get(`capability:${record.id}`)));
}

export async function getAdminCoverageRegions(): Promise<CoverageRegion[]> {
  await authorizeAdminRead();
  return (await getDatabase().select().from(coverageRegionRecords).orderBy(asc(coverageRegionRecords.displayOrder))).map(toCoverageRegion);
}

export function getAdminPageContent(page: "home"): Promise<HomePageContent>;
export function getAdminPageContent(page: "about"): Promise<AboutPageContent>;
export function getAdminPageContent(page: "coal"): Promise<CoalPageContent>;
export function getAdminPageContent(page: "industries"): Promise<IndustriesPageContent>;
export function getAdminPageContent(page: "capabilities"): Promise<CapabilitiesPageContent>;
export function getAdminPageContent(page: "operations"): Promise<OperationsPageContent>;
export function getAdminPageContent(page: "contact"): Promise<ContactPageContent>;
export function getAdminPageContent(page: "privacy"): Promise<PrivacyPageContent>;
export function getAdminPageContent(page: PageKey): Promise<PageContent>;
export async function getAdminPageContent(page: PageKey): Promise<PageContent> {
  await authorizeAdminRead();
  const table = pageTables[page];
  const [record] = await getDatabase().select().from(table).where(eq(table.id, "primary")).limit(1);
  if (!record) throw unavailableContentError(`${page} page`);
  const media = new Map((await getAdminMediaAssets()).map((asset) => [asset.id, asset]));
  const content = hydrateMedia(withContentCompatibility(page, record.draftContent as PageContent), media);
  const [seoRecord] = await getDatabase().select().from(seoMetadataRecords).where(eq(seoMetadataRecords.scope, `page:${page}`)).limit(1);
  if (seoRecord) content.seo = seoMetadataSchema.parse(seoRecord.draftContent);
  return content;
}
