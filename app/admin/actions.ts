"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { requireAdmin, AdminAuthorizationError } from "@/lib/auth";
import { getAdminPageContent } from "@/lib/content";
import { getDatabase } from "@/db";
import {
  aboutPageContent,
  capabilities as capabilityRecords,
  capabilitiesPageContent,
  coalPageContent,
  contactPageContent,
  coverageRegions,
  homePageContent,
  industries as industryRecords,
  industriesPageContent,
  mediaReferences,
  operationsPageContent,
  privacyPageContent,
  products as productRecords,
  seoMetadata,
  siteSettings,
} from "@/db/schema";
import {
  capabilitySchema,
  coverageRegionSchema,
  industrySchema,
  productSchema,
  routeKeySchema,
  seoMetadataSchema,
  siteSettingsSchema,
  type Capability,
  type Industry,
  type Product,
  type RouteKey,
  type SeoMetadata,
  type SiteSettings,
} from "@/types/content";

export type AdminActionResult = { ok: true; message: string } | { ok: false; message: string; field?: string };

const pagePath: Record<RouteKey, string> = {
  home: "/",
  about: "/about",
  coal: "/coal",
  industries: "/industries",
  capabilities: "/capabilities",
  operations: "/operations",
  contact: "/contact",
  privacy: "/privacy",
};

const pageTags: Record<RouteKey, string[]> = {
  home: ["home"],
  about: ["about"],
  coal: ["coal"],
  industries: ["industries"],
  capabilities: ["capabilities"],
  operations: ["operations"],
  contact: ["contact"],
  privacy: ["privacy"],
};

function errorResult(error: unknown): AdminActionResult {
  if (error instanceof z.ZodError) return { ok: false, message: error.issues[0]?.message ?? "Check the highlighted content and try again." };
  if (error instanceof AdminAuthorizationError) return { ok: false, message: "Your admin session has expired. Sign in again." };
  console.error("CMS action failed", error instanceof Error ? error.message : "Unknown error");
  return { ok: false, message: "We could not save that change. Please try again." };
}

function invalidate(tags: readonly string[], paths: readonly string[]) {
  tags.forEach((tag) => revalidateTag(tag, "max"));
  paths.forEach((path) => revalidatePath(path));
}

function shallowPageValidation(page: RouteKey, content: unknown) {
  const base = z.object({ seo: seoMetadataSchema }).passthrough().parse(content) as Record<string, unknown>;
  const requiredSections: Record<RouteKey, string[]> = {
    home: ["hero", "process", "whyStar", "capabilityIntro", "finalCTA"],
    about: ["opening", "distinction", "finalCTA"],
    coal: ["intro", "flow", "categories"],
    industries: ["opening", "directory", "finalCTA"],
    capabilities: ["opening", "index", "commercial"],
    operations: ["opening", "sequence", "transport"],
    contact: ["opening", "formIntro", "reassurance"],
    privacy: ["opening", "sections"],
  };
  requiredSections[page].forEach((section) => {
    if (!base[section] || typeof base[section] !== "object") throw new Error(`The ${section} section is incomplete.`);
  });
  return content;
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

async function syncPageMediaReferences(page: RouteKey, content: unknown, version: "draft" | "published") {
  const db = getDatabase();
  const field = `${version}-content`;
  await db.delete(mediaReferences).where(and(eq(mediaReferences.scope, "page"), eq(mediaReferences.recordId, page), eq(mediaReferences.field, field)));
  const references = [...collectMediaIds(content)].map((mediaId) => ({ mediaId, scope: "page", recordId: page, field }));
  if (references.length) await db.insert(mediaReferences).values(references);
}

async function updatePageDraft(page: RouteKey, content: unknown) {
  const values = { draftContent: content, updatedAt: new Date() };
  const db = getDatabase();
  switch (page) {
    case "home": return db.update(homePageContent).set(values).where(eq(homePageContent.id, "primary"));
    case "about": return db.update(aboutPageContent).set(values).where(eq(aboutPageContent.id, "primary"));
    case "coal": return db.update(coalPageContent).set(values).where(eq(coalPageContent.id, "primary"));
    case "industries": return db.update(industriesPageContent).set(values).where(eq(industriesPageContent.id, "primary"));
    case "capabilities": return db.update(capabilitiesPageContent).set(values).where(eq(capabilitiesPageContent.id, "primary"));
    case "operations": return db.update(operationsPageContent).set(values).where(eq(operationsPageContent.id, "primary"));
    case "contact": return db.update(contactPageContent).set(values).where(eq(contactPageContent.id, "primary"));
    case "privacy": return db.update(privacyPageContent).set(values).where(eq(privacyPageContent.id, "primary"));
  }
}

async function publishPageDocument(page: RouteKey) {
  const db = getDatabase();
  const now = new Date();
  switch (page) {
    case "home": {
      const [record] = await db.select({ draftContent: homePageContent.draftContent }).from(homePageContent).where(eq(homePageContent.id, "primary"));
      if (!record) throw new Error("Home page content is missing.");
      return db.update(homePageContent).set({ publishedContent: record.draftContent, status: "published", updatedAt: now }).where(eq(homePageContent.id, "primary"));
    }
    case "about": {
      const [record] = await db.select({ draftContent: aboutPageContent.draftContent }).from(aboutPageContent).where(eq(aboutPageContent.id, "primary"));
      if (!record) throw new Error("About page content is missing.");
      return db.update(aboutPageContent).set({ publishedContent: record.draftContent, status: "published", updatedAt: now }).where(eq(aboutPageContent.id, "primary"));
    }
    case "coal": {
      const [record] = await db.select({ draftContent: coalPageContent.draftContent }).from(coalPageContent).where(eq(coalPageContent.id, "primary"));
      if (!record) throw new Error("Coal page content is missing.");
      return db.update(coalPageContent).set({ publishedContent: record.draftContent, status: "published", updatedAt: now }).where(eq(coalPageContent.id, "primary"));
    }
    case "industries": {
      const [record] = await db.select({ draftContent: industriesPageContent.draftContent }).from(industriesPageContent).where(eq(industriesPageContent.id, "primary"));
      if (!record) throw new Error("Industries page content is missing.");
      return db.update(industriesPageContent).set({ publishedContent: record.draftContent, status: "published", updatedAt: now }).where(eq(industriesPageContent.id, "primary"));
    }
    case "capabilities": {
      const [record] = await db.select({ draftContent: capabilitiesPageContent.draftContent }).from(capabilitiesPageContent).where(eq(capabilitiesPageContent.id, "primary"));
      if (!record) throw new Error("Capabilities page content is missing.");
      return db.update(capabilitiesPageContent).set({ publishedContent: record.draftContent, status: "published", updatedAt: now }).where(eq(capabilitiesPageContent.id, "primary"));
    }
    case "operations": {
      const [record] = await db.select({ draftContent: operationsPageContent.draftContent }).from(operationsPageContent).where(eq(operationsPageContent.id, "primary"));
      if (!record) throw new Error("Operations page content is missing.");
      return db.update(operationsPageContent).set({ publishedContent: record.draftContent, status: "published", updatedAt: now }).where(eq(operationsPageContent.id, "primary"));
    }
    case "contact": {
      const [record] = await db.select({ draftContent: contactPageContent.draftContent }).from(contactPageContent).where(eq(contactPageContent.id, "primary"));
      if (!record) throw new Error("Contact page content is missing.");
      return db.update(contactPageContent).set({ publishedContent: record.draftContent, status: "published", updatedAt: now }).where(eq(contactPageContent.id, "primary"));
    }
    case "privacy": {
      const [record] = await db.select({ draftContent: privacyPageContent.draftContent }).from(privacyPageContent).where(eq(privacyPageContent.id, "primary"));
      if (!record) throw new Error("Privacy page content is missing.");
      return db.update(privacyPageContent).set({ publishedContent: record.draftContent, status: "published", updatedAt: now }).where(eq(privacyPageContent.id, "primary"));
    }
  }
}

export async function savePageDraftAction(pageInput: unknown, content: unknown): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const page = routeKeySchema.parse(pageInput);
    const document = shallowPageValidation(page, content);
    await updatePageDraft(page, document);
    await syncPageMediaReferences(page, document, "draft");
    return { ok: true, message: "Draft saved." };
  } catch (error) { return errorResult(error); }
}

export async function publishPageAction(pageInput: unknown): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const page = routeKeySchema.parse(pageInput);
    const draft = await getAdminPageContent(page);
    await publishPageDocument(page);
    await syncPageMediaReferences(page, draft, "published");
    invalidate([...pageTags[page], "media"], [pagePath[page]]);
    return { ok: true, message: "Page published." };
  } catch (error) { return errorResult(error); }
}

async function syncEntityMediaReference(scope: "product" | "industry" | "capability", recordId: string, mediaId: string | undefined, version: "draft" | "published") {
  const db = getDatabase();
  const field = `${version}-${scope === "capability" ? "media" : "image"}`;
  await db.delete(mediaReferences).where(and(eq(mediaReferences.scope, scope), eq(mediaReferences.recordId, recordId), eq(mediaReferences.field, field)));
  if (mediaId) await db.insert(mediaReferences).values({ mediaId, scope, recordId, field });
}

async function saveEntitySeo(scope: string, content: SeoMetadata | undefined, publish: boolean) {
  const db = getDatabase();
  if (!content) {
    await db.delete(seoMetadata).where(eq(seoMetadata.scope, scope));
    return;
  }
  const values = { id: `seo-${scope.replace(/[^a-z0-9-]/gi, "-")}`, scope, draftContent: content, publishedContent: content, status: publish ? "published" as const : "draft" as const, updatedAt: new Date() };
  await db.insert(seoMetadata).values(values).onConflictDoUpdate({
    target: seoMetadata.scope,
    set: publish
      ? values
      : { draftContent: content, status: "draft", updatedAt: new Date() },
  });
}

export async function saveProductAction(input: unknown, publish = false): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const product = productSchema.parse(input) as Product;
    const values = { ...product, status: publish ? "published" as const : "draft" as const, publishedContent: publish ? { ...product, status: "published" as const } : undefined, updatedAt: new Date() };
    await getDatabase().insert(productRecords).values(values).onConflictDoUpdate({ target: productRecords.id, set: values });
    await syncEntityMediaReference("product", product.id, product.imageId, "draft");
    if (publish) await syncEntityMediaReference("product", product.id, product.imageId, "published");
    await saveEntitySeo(`product:${product.id}`, product.seo, values.status === "published");
    if (publish) invalidate(["products", "home", "coal"], ["/", "/coal"]);
    return { ok: true, message: publish ? "Coal category published." : "Draft saved." };
  } catch (error) { return errorResult(error); }
}

export async function saveIndustryAction(input: unknown, publish = false): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const industry = industrySchema.parse(input) as Industry;
    const values = { ...industry, status: publish ? "published" as const : "draft" as const, publishedContent: publish ? { ...industry, status: "published" as const } : undefined, updatedAt: new Date() };
    await getDatabase().insert(industryRecords).values(values).onConflictDoUpdate({ target: industryRecords.id, set: values });
    await syncEntityMediaReference("industry", industry.id, industry.imageId, "draft");
    if (publish) await syncEntityMediaReference("industry", industry.id, industry.imageId, "published");
    await saveEntitySeo(`industry:${industry.id}`, industry.seo, values.status === "published");
    if (publish) invalidate(["industries", "home"], ["/", "/industries"]);
    return { ok: true, message: publish ? "Industry published." : "Draft saved." };
  } catch (error) { return errorResult(error); }
}

export async function saveCapabilityAction(input: unknown, publish = false): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const capability = capabilitySchema.parse(input) as Capability;
    const values = { ...capability, status: publish ? "published" as const : "draft" as const, publishedContent: publish ? { ...capability, status: "published" as const } : undefined, updatedAt: new Date() };
    await getDatabase().insert(capabilityRecords).values(values).onConflictDoUpdate({ target: capabilityRecords.id, set: values });
    await syncEntityMediaReference("capability", capability.id, capability.mediaId, "draft");
    if (publish) await syncEntityMediaReference("capability", capability.id, capability.mediaId, "published");
    await saveEntitySeo(`capability:${capability.id}`, capability.seo, values.status === "published");
    if (publish) invalidate(["capabilities", "home"], ["/", "/capabilities"]);
    return { ok: true, message: publish ? "Capability published." : "Draft saved." };
  } catch (error) { return errorResult(error); }
}

export async function archiveEntityAction(kind: "products" | "industries" | "capabilities", id: string): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const now = new Date();
    const db = getDatabase();
    if (kind === "products") {
      const [record] = await db.select({ publishedContent: productRecords.publishedContent }).from(productRecords).where(eq(productRecords.id, id));
      const publishedContent = record?.publishedContent && { ...(record.publishedContent as Product), active: false, featured: false };
      await db.update(productRecords).set({ active: false, featured: false, status: "draft", publishedContent, updatedAt: now }).where(eq(productRecords.id, id));
    }
    if (kind === "industries") {
      const [record] = await db.select({ publishedContent: industryRecords.publishedContent }).from(industryRecords).where(eq(industryRecords.id, id));
      const publishedContent = record?.publishedContent && { ...(record.publishedContent as Industry), active: false, featured: false };
      await db.update(industryRecords).set({ active: false, featured: false, status: "draft", publishedContent, updatedAt: now }).where(eq(industryRecords.id, id));
    }
    if (kind === "capabilities") {
      const [record] = await db.select({ publishedContent: capabilityRecords.publishedContent }).from(capabilityRecords).where(eq(capabilityRecords.id, id));
      const publishedContent = record?.publishedContent && { ...(record.publishedContent as Capability), active: false, featured: false };
      await db.update(capabilityRecords).set({ active: false, featured: false, status: "draft", publishedContent, updatedAt: now }).where(eq(capabilityRecords.id, id));
    }
    invalidate(kind === "products" ? ["products", "home", "coal"] : kind === "industries" ? ["industries", "home"] : ["capabilities", "home"], kind === "products" ? ["/", "/coal"] : kind === "industries" ? ["/", "/industries"] : ["/", "/capabilities"]);
    return { ok: true, message: "Removed from the public website." };
  } catch (error) { return errorResult(error); }
}

export async function saveCoverageRegionAction(input: unknown): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const region = coverageRegionSchema.parse(input);
    const values = { ...region, cityOrMarket: region.cityOrMarket ?? null, updatedAt: new Date() };
    await getDatabase().insert(coverageRegions).values(values).onConflictDoUpdate({ target: coverageRegions.id, set: values });
    invalidate(["coverage", "home", "operations"], ["/", "/operations"]);
    return { ok: true, message: "Coverage region saved." };
  } catch (error) { return errorResult(error); }
}

export async function saveSiteSettingsAction(input: unknown): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const settings = siteSettingsSchema.parse(input) as SiteSettings;
    await getDatabase().insert(siteSettings).values({ id: "star-energies", content: settings, updatedAt: new Date() }).onConflictDoUpdate({ target: siteSettings.id, set: { content: settings, updatedAt: new Date() } });
    invalidate(["site-settings"], ["/"]);
    return { ok: true, message: "Site settings saved." };
  } catch (error) { return errorResult(error); }
}

export async function saveSeoAction(pageInput: unknown, input: unknown, publish = false): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const page = routeKeySchema.parse(pageInput);
    const seo = seoMetadataSchema.parse(input) as SeoMetadata;
    const db = getDatabase();
    const scope = `page:${page}`;
    await db.insert(seoMetadata).values({ id: `seo-${page}`, scope, draftContent: seo, publishedContent: publish ? seo : seo, status: publish ? "published" : "draft", updatedAt: new Date() }).onConflictDoUpdate({ target: seoMetadata.scope, set: publish ? { draftContent: seo, publishedContent: seo, status: "published", updatedAt: new Date() } : { draftContent: seo, updatedAt: new Date() } });
    if (publish) invalidate(pageTags[page], [pagePath[page]]);
    return { ok: true, message: publish ? "SEO metadata published." : "SEO draft saved." };
  } catch (error) { return errorResult(error); }
}
