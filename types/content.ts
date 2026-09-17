import { z } from "zod";

export const contentStatusSchema = z.enum(["draft", "published"]);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

export const slugSchema = z
  .string()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens.");

export const seoMetadataSchema = z.object({
  title: z.string().min(10).max(70),
  description: z.string().min(40).max(180),
  ogTitle: z.string().min(10).max(95).optional(),
  ogDescription: z.string().min(40).max(220).optional(),
  ogImageId: z.string().min(2).max(100).optional(),
  canonicalPath: z.string().startsWith("/").max(180).optional(),
  noIndex: z.boolean().optional(),
});
export type SeoMetadata = z.infer<typeof seoMetadataSchema>;

export const callToActionSchema = z.object({
  label: z.string().min(2).max(60),
  href: z.string().min(1).max(300),
  external: z.boolean().optional(),
  intent: z.enum(["quote", "contact", "whatsapp", "phone", "email", "learn-more"]),
});
export type CallToAction = z.infer<typeof callToActionSchema>;

export const mediaAssetSchema = z.object({
  id: z.string().min(2).max(100),
  // A logo can be intentionally unassigned while its final SVG is being prepared.
  url: z.string().max(500),
  storagePath: z.string().min(1).max(300).optional(),
  title: z.string().min(2).max(120),
  altText: z.string().min(8).max(180),
  label: z.string().min(2).max(100),
  caption: z.string().min(2).max(160).optional(),
  category: z.enum(["logo", "coal", "facility", "industrial", "operations", "team", "hero"]),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  mimeType: z.string().min(3).max(100).optional(),
  placeholder: z.boolean(),
  createdAt: z.string().datetime().optional(),
});
export type MediaAsset = z.infer<typeof mediaAssetSchema>;

export const editorialLineSchema = z.object({
  text: z.string().min(1).max(100),
  emphasis: z.boolean().optional(),
  breakAfter: z.boolean().optional(),
});
export type EditorialLine = z.infer<typeof editorialLineSchema>;

export const routeKeySchema = z.enum([
  "home",
  "about",
  "coal",
  "industries",
  "capabilities",
  "operations",
  "contact",
  "privacy",
]);
export type RouteKey = z.infer<typeof routeKeySchema>;

export const navigationItemSchema = z.object({
  route: routeKeySchema,
  label: z.string().min(2).max(40),
});
export type NavigationItem = z.infer<typeof navigationItemSchema>;

export const siteSettingsSchema = z.object({
  businessName: z.string().min(2).max(100),
  brandName: z.string().min(2).max(100),
  legalName: z.string().min(2).max(140).optional(),
  tagline: z.string().min(10).max(140),
  shortDescription: z.string().min(30).max(180),
  footerDescription: z.string().min(20).max(180),
  footerMeta: z.string().min(5).max(100),
  contact: z.object({
    phoneDisplay: z.string().min(8).max(30),
    phoneHref: z.string().startsWith("tel:"),
    whatsappHref: z.string().url(),
    email: z.string().email(),
    emailHref: z.string().startsWith("mailto:"),
    isPlaceholder: z.boolean(),
  }),
  address: z.object({
    display: z.string().min(8).max(180),
    city: z.string().min(2).max(80),
    district: z.string().min(2).max(80),
    state: z.string().min(2).max(80),
    postalCode: z.string().min(3).max(20).optional(),
    country: z.string().min(2).max(80),
  }),
  gstin: z.string().min(5).max(30).optional(),
  businessHours: z.string().min(2).max(120).optional(),
  primaryQuoteCTA: callToActionSchema,
  secondaryContactCTA: callToActionSchema,
  socialLinks: z.array(z.object({ label: z.string().min(2).max(40), href: z.string().url() })).optional(),
  defaultSeo: seoMetadataSchema,
  logo: z.object({ assetId: z.string().min(2).max(100), altText: z.string().min(4).max(150) }),
  navigation: z.array(navigationItemSchema).min(1),
});
export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const productSchema = z.object({
  id: z.string().min(2).max(100),
  slug: slugSchema,
  name: z.string().min(2).max(100),
  shortDescription: z.string().min(20).max(300),
  longDescription: z.string().min(30).max(700).optional(),
  sourceType: z.string().min(2).max(100).optional(),
  grades: z.array(z.string().min(1).max(80)).optional(),
  gcvInfo: z.string().min(2).max(160).optional(),
  sizes: z.array(z.string().min(1).max(80)).optional(),
  applications: z.array(z.string().min(1).max(100)).optional(),
  availabilityNote: z.string().min(10).max(300).optional(),
  imageId: z.string().min(2).max(100).optional(),
  featured: z.boolean(),
  active: z.boolean(),
  status: contentStatusSchema,
  displayOrder: z.number().int().min(0).max(999),
  consideredAgainst: z.string().min(3).max(100),
  seo: seoMetadataSchema.optional(),
});
export type Product = z.infer<typeof productSchema>;

export const industrySchema = z.object({
  id: z.string().min(2).max(100),
  slug: slugSchema,
  name: z.string().min(2).max(100),
  shortDescription: z.string().min(20).max(300),
  longDescription: z.string().min(30).max(700).optional(),
  imageId: z.string().min(2).max(100).optional(),
  icon: z.string().min(1).max(80).optional(),
  featured: z.boolean(),
  active: z.boolean(),
  status: contentStatusSchema,
  displayOrder: z.number().int().min(0).max(999),
  seo: seoMetadataSchema.optional(),
});
export type Industry = z.infer<typeof industrySchema>;

export const capabilitySchema = z.object({
  id: z.string().min(2).max(100),
  slug: slugSchema,
  title: z.string().min(2).max(100),
  shortDescription: z.string().min(20).max(300),
  longDescription: z.string().min(30).max(700).optional(),
  icon: z.string().min(1).max(80).optional(),
  mediaId: z.string().min(2).max(100).optional(),
  featured: z.boolean(),
  active: z.boolean(),
  status: contentStatusSchema,
  displayOrder: z.number().int().min(0).max(999),
  seo: seoMetadataSchema.optional(),
});
export type Capability = z.infer<typeof capabilitySchema>;

export const coverageRegionSchema = z.object({
  id: z.string().min(2).max(100),
  name: z.string().min(2).max(100),
  label: z.string().min(2).max(120),
  state: z.string().min(2).max(80),
  cityOrMarket: z.string().min(2).max(100).optional(),
  experienceType: z.enum(["industry-experience"]),
  active: z.boolean(),
  displayOrder: z.number().int().min(0).max(999),
  mapLabel: z.string().min(2).max(100),
});
export type CoverageRegion = z.infer<typeof coverageRegionSchema>;

export const qualityParameterSchema = z.object({
  id: z.string().min(2).max(100),
  name: z.string().min(2).max(100),
  shortLabel: z.string().min(2).max(20),
  description: z.string().min(2).max(220).optional(),
  unit: z.string().min(1).max(30).optional(),
  displayOrder: z.number().int().min(0).max(999),
  active: z.boolean(),
});
export type QualityParameter = z.infer<typeof qualityParameterSchema>;

export const requirementDimensionSchema = z.object({
  id: z.string().min(2).max(100),
  label: z.string().min(2).max(80),
  detail: z.string().min(10).max(280),
  displayOrder: z.number().int().min(0).max(999),
});
export type RequirementDimension = z.infer<typeof requirementDimensionSchema>;

export const enquiryFieldSchema = z.object({
  name: z.string().min(2).max(100),
  label: z.string().min(2).max(80),
  type: z.enum(["text", "tel", "email", "select"]),
  required: z.boolean(),
  optional: z.boolean().optional(),
  width: z.enum(["half", "full"]),
  autoComplete: z.string().min(2).max(80).optional(),
  placeholder: z.string().min(2).max(80).optional(),
  options: z.array(z.string().min(1).max(80)).optional(),
});
export type EnquiryField = z.infer<typeof enquiryFieldSchema>;

export const enquiryFieldGroupSchema = z.object({
  id: z.string().min(2).max(100),
  label: z.string().min(1).max(20),
  fields: z.array(enquiryFieldSchema).min(1),
});
export type EnquiryFieldGroup = z.infer<typeof enquiryFieldGroupSchema>;

export const quoteFormContentSchema = z.object({
  heading: z.string().min(2).max(80),
  helperText: z.string().min(20).max(250),
  groups: z.array(enquiryFieldGroupSchema).min(1),
  messageLabel: z.string().min(2).max(100),
  messageOptionalLabel: z.string().min(2).max(30),
  submitLabel: z.string().min(2).max(60),
  validationMessages: z.object({
    incomplete: z.string().min(10).max(250),
    contactMethod: z.string().min(10).max(250),
    success: z.string().min(10).max(350),
  }),
});
export type QuoteFormContent = z.infer<typeof quoteFormContentSchema>;

export type PrivacySection = { id: string; title: string; text: string; displayOrder: number };

export type HomePageContent = {
  seo: SeoMetadata;
  hero: {
    meta: readonly [string, string];
    kicker: string;
    heading: readonly EditorialLine[];
    primaryCTA: CallToAction;
    secondaryCTA: CallToAction;
    media: MediaAsset;
    sceneCaption: string;
    sceneScale: string;
    requirementDimensionIds: readonly string[];
    scrollLabel: string;
    progressLabel: string;
  };
  capabilityIntro: { label: string; technicalCopy: string; intro: string; heading: readonly EditorialLine[]; body: string; cta: CallToAction; diagramLabels: readonly [string, string] };
  requirementSourcing: { label: string; heading: string; body: string; resultLabel: string; result: readonly EditorialLine[] };
  sourcing: { label: string; heading: string; body: string; productIds: readonly string[]; media: MediaAsset; mediaCaption: readonly [string, string] };
  industries: { label: string; body: string; industryIds: readonly string[]; footLabels: readonly [string, string] };
  coverage: { label: string; heading: string; body: string; qualification: string; mapNote: string; regionIds: readonly string[] };
  facility: { label: string; heading: string; body: string; logisticsNoteLabel: string; logisticsNote: string; media: MediaAsset; mediaCaption: readonly [string, string]; figureCaption: string };
  quality: { label: string; heading: string; body: string; parameterIds: readonly string[]; tableHeadings: readonly [string, string, string]; footLabels: readonly [string, string] };
  experience: { label: string; pretitle: string; heading: readonly EditorialLine[]; body: string; measure: readonly [string, string, string] };
  finalCTA: { label: string; heading: readonly EditorialLine[]; body: string; primaryCTA: CallToAction; secondaryCTA: CallToAction; contactLabels: readonly [string, string] };
};

export type AboutPageContent = {
  seo: SeoMetadata;
  opening: { label: string; statement: string; heading: readonly EditorialLine[]; experiencePrefix: string; experienceValue: string; experienceLabel: string; footLabels: readonly [string, string] };
  distinction: { label: string; lead: string; body: string; markers: readonly [string, string] };
  approach: { label: string; heading: string; items: readonly { id: string; title: string; description: string; displayOrder: number }[] };
  people: { label: string; intro: string; entries: readonly { id: string; label: string; name: string; description: string }[] };
  ambition: { label: string; heading: readonly EditorialLine[]; body: string; cta: CallToAction; coordinates: readonly [string, string, string] };
  finalCTA: { eyebrow: string; heading: readonly EditorialLine[]; primaryCTA: CallToAction; secondaryCTA: CallToAction };
};

export type CoalPageContent = {
  seo: SeoMetadata;
  intro: { label: string; note: string; heading: readonly EditorialLine[]; body: string; discussionLabel: string; discussionInputs: readonly string[] };
  flow: { label: string; heading: readonly EditorialLine[]; steps: readonly { id: string; label: readonly EditorialLine[]; displayOrder: number }[] };
  categories: { label: string; body: string; productIds: readonly string[] };
  material: { label: string; heading: readonly EditorialLine[]; body: string; cta: CallToAction; media: MediaAsset; mediaCaption: string };
  quality: { label: string; heading: string; body: string; parameterIds: readonly string[] };
  requirement: { promptLabel: string; heading: readonly EditorialLine[]; body: string; cta: CallToAction };
};

export type IndustriesPageContent = {
  seo: SeoMetadata;
  opening: { label: string; statement: string; heading: readonly EditorialLine[]; indexLabel: string };
  directory: { label: string; heading: string; body: string; industryIds: readonly string[]; media: MediaAsset; mediaCaption: string };
  logic: { label: string; heading: string; questions: readonly string[] };
  other: { eyebrow: string; heading: readonly EditorialLine[]; body: string; cta: CallToAction };
  finalCTA: { eyebrow: string; heading: readonly EditorialLine[]; cta: CallToAction };
};

export type CapabilitiesPageContent = {
  seo: SeoMetadata;
  opening: { label: string; heading: readonly EditorialLine[]; body: string; key: readonly [string, string] };
  index: { label: string; heading: string; capabilityIds: readonly string[] };
  volume: { label: string; heading: readonly EditorialLine[]; body: string; axis: readonly [string, string] };
  commercial: { label: string; heading: readonly EditorialLine[]; tableHeadings: readonly [string, string]; rows: readonly { id: string; title: string; description: string }[] };
  direct: { eyebrow: string; heading: readonly EditorialLine[]; primaryCTA: CallToAction; secondaryCTA: CallToAction };
};

export type OperationsPageContent = {
  seo: SeoMetadata;
  opening: { label: string; heading: readonly EditorialLine[]; body: string; locationLabel: string; media: MediaAsset; mediaCaption: string };
  sequence: { label: string; heading: string; items: readonly { id: string; title: string; description: string; displayOrder: number }[] };
  coverage: { label: string; heading: readonly EditorialLine[]; body: string; regionIds: readonly string[]; mapNote: string };
  transport: { eyebrow: string; heading: readonly EditorialLine[]; lead: string; body: string; cta: CallToAction };
  finalCTA: { eyebrow: string; heading: readonly EditorialLine[]; cta: CallToAction };
};

export type ContactPageContent = {
  seo: SeoMetadata;
  opening: { label: string; heading: readonly EditorialLine[]; body: string; channelLabels: readonly [string, string, string]; whatsappLabel: string };
  formIntro: { label: string; heading: readonly EditorialLine[]; helper: string; requirementPromptLabel: string; requirementDimensionIds: readonly string[]; quoteForm: QuoteFormContent };
  reassurance: { eyebrow: string; body: string; cta: CallToAction };
};

export type PrivacyPageContent = {
  seo: SeoMetadata;
  opening: { label: string; heading: readonly EditorialLine[]; body: string; lastUpdated: string };
  sections: readonly PrivacySection[];
  contactText: string;
};
