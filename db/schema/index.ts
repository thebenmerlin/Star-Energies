import {
  bigint,
  boolean,
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * Better Auth tables. These follow Better Auth's current Drizzle/Postgres
 * adapter naming convention; do not rename fields without updating auth.ts.
 */
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const accounts = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verifications = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const rateLimits = pgTable("rate_limit", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

/** A user only receives CMS access when explicitly bootstrapped as an admin. */
export const administrators = pgTable("administrator", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contentStatus = pgEnum("content_status", ["draft", "published"]);
export const enquiryStatus = pgEnum("enquiry_status", ["new", "contacted", "quoted", "closed", "archived"]);
export const enquirySource = pgEnum("enquiry_source", ["website_quote_form"]);

const contentTimestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

/** Singleton central business/contact configuration. */
export const siteSettings = pgTable(
  "site_settings",
  {
    id: text("id").primaryKey().default("star-energies"),
    content: jsonb("content").$type<unknown>().notNull(),
    ...contentTimestamps,
  },
  (table) => [check("site_settings_singleton_check", sql`${table.id} = 'star-energies'`)],
);

/**
 * Fixed page documents preserve the approved layouts: each table represents a
 * known page model, not a configurable page builder.
 */
const pageDocument = () => ({
  id: text("id").primaryKey().default("primary"),
  draftContent: jsonb("draft_content").$type<unknown>().notNull(),
  publishedContent: jsonb("published_content").$type<unknown>().notNull(),
  status: contentStatus("status").notNull().default("draft"),
  ...contentTimestamps,
});

export const homePageContent = pgTable("home_page_content", pageDocument());
export const aboutPageContent = pgTable("about_page_content", pageDocument());
export const coalPageContent = pgTable("coal_page_content", pageDocument());
export const industriesPageContent = pgTable("industries_page_content", pageDocument());
export const capabilitiesPageContent = pgTable("capabilities_page_content", pageDocument());
export const operationsPageContent = pgTable("operations_page_content", pageDocument());
export const contactPageContent = pgTable("contact_page_content", pageDocument());
export const privacyPageContent = pgTable("privacy_page_content", pageDocument());

export const mediaCategory = pgEnum("media_category", [
  "logo",
  "coal",
  "facility",
  "industrial",
  "operations",
  "team",
  "hero",
]);

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: text("id").primaryKey(),
    cloudinaryPublicId: text("cloudinary_public_id"),
    secureUrl: text("secure_url").notNull(),
    originalFilename: text("original_filename"),
    title: text("title").notNull(),
    altText: text("alt_text").notNull(),
    label: text("label").notNull(),
    caption: text("caption"),
    category: mediaCategory("category").notNull(),
    width: integer("width"),
    height: integer("height"),
    format: text("format"),
    mimeType: text("mime_type"),
    sizeBytes: integer("size_bytes"),
    placeholder: boolean("placeholder").notNull().default(false),
    ...contentTimestamps,
  },
  (table) => [index("media_assets_category_idx").on(table.category)],
);

export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    shortDescription: text("short_description").notNull(),
    longDescription: text("long_description"),
    sourceType: text("source_type"),
    grades: text("grades").array(),
    gcvInfo: text("gcv_info"),
    sizes: text("sizes").array(),
    applications: text("applications").array(),
    availabilityNote: text("availability_note"),
    imageId: text("image_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    featured: boolean("featured").notNull().default(false),
    active: boolean("active").notNull().default(true),
    status: contentStatus("status").notNull().default("draft"),
    publishedContent: jsonb("published_content").$type<unknown>(),
    displayOrder: integer("display_order").notNull().default(0),
    consideredAgainst: text("considered_against").notNull(),
    ...contentTimestamps,
  },
  (table) => [uniqueIndex("products_slug_unique").on(table.slug), index("products_public_idx").on(table.status, table.active, table.displayOrder), check("products_display_order_nonnegative", sql`${table.displayOrder} >= 0`)],
);

export const industries = pgTable(
  "industries",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    shortDescription: text("short_description").notNull(),
    longDescription: text("long_description"),
    imageId: text("image_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    icon: text("icon"),
    featured: boolean("featured").notNull().default(false),
    active: boolean("active").notNull().default(true),
    status: contentStatus("status").notNull().default("draft"),
    publishedContent: jsonb("published_content").$type<unknown>(),
    displayOrder: integer("display_order").notNull().default(0),
    ...contentTimestamps,
  },
  (table) => [uniqueIndex("industries_slug_unique").on(table.slug), index("industries_public_idx").on(table.status, table.active, table.displayOrder), check("industries_display_order_nonnegative", sql`${table.displayOrder} >= 0`)],
);

export const capabilities = pgTable(
  "capabilities",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    shortDescription: text("short_description").notNull(),
    longDescription: text("long_description"),
    icon: text("icon"),
    mediaId: text("media_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    featured: boolean("featured").notNull().default(false),
    active: boolean("active").notNull().default(true),
    status: contentStatus("status").notNull().default("draft"),
    publishedContent: jsonb("published_content").$type<unknown>(),
    displayOrder: integer("display_order").notNull().default(0),
    ...contentTimestamps,
  },
  (table) => [uniqueIndex("capabilities_slug_unique").on(table.slug), index("capabilities_public_idx").on(table.status, table.active, table.displayOrder), check("capabilities_display_order_nonnegative", sql`${table.displayOrder} >= 0`)],
);

export const coverageRegions = pgTable(
  "coverage_regions",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    label: text("label").notNull(),
    state: text("state").notNull(),
    cityOrMarket: text("city_or_market"),
    experienceType: text("experience_type").notNull().default("industry-experience"),
    active: boolean("active").notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),
    mapLabel: text("map_label").notNull(),
    ...contentTimestamps,
  },
  (table) => [index("coverage_regions_display_order_idx").on(table.active, table.displayOrder), check("coverage_regions_display_order_nonnegative", sql`${table.displayOrder} >= 0`)],
);

export const qualityParameters = pgTable(
  "quality_parameters",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    shortLabel: text("short_label").notNull(),
    description: text("description"),
    unit: text("unit"),
    displayOrder: integer("display_order").notNull().default(0),
    active: boolean("active").notNull().default(true),
    ...contentTimestamps,
  },
  (table) => [index("quality_parameters_display_order_idx").on(table.active, table.displayOrder), check("quality_parameters_display_order_nonnegative", sql`${table.displayOrder} >= 0`)],
);

export const requirementDimensions = pgTable(
  "requirement_dimensions",
  {
    id: text("id").primaryKey(),
    label: text("label").notNull(),
    detail: text("detail").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    ...contentTimestamps,
  },
  (table) => [check("requirement_dimensions_display_order_nonnegative", sql`${table.displayOrder} >= 0`)],
);

/** SEO is scoped to a fixed page or a specific catalogue entity. */
export const seoMetadata = pgTable(
  "seo_metadata",
  {
    id: text("id").primaryKey(),
    scope: text("scope").notNull(),
    draftContent: jsonb("draft_content").$type<unknown>().notNull(),
    publishedContent: jsonb("published_content").$type<unknown>().notNull(),
    status: contentStatus("status").notNull().default("draft"),
    ...contentTimestamps,
  },
  (table) => [uniqueIndex("seo_metadata_scope_unique").on(table.scope)],
);

export const mediaReferences = pgTable(
  "media_references",
  {
    mediaId: text("media_id")
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "cascade" }),
    scope: text("scope").notNull(),
    recordId: text("record_id").notNull(),
    field: text("field").notNull(),
    ...contentTimestamps,
  },
  (table) => [primaryKey({ columns: [table.mediaId, table.scope, table.recordId, table.field] }), index("media_references_media_idx").on(table.mediaId)],
);

/** Private B2B lead records. These are never part of public content queries. */
export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientSubmissionId: uuid("client_submission_id").notNull(),
    dedupeHash: text("dedupe_hash").notNull(),
    contactName: text("contact_name").notNull(),
    companyName: text("company_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    whatsapp: text("whatsapp"),
    coalRequirement: text("coal_requirement").notNull(),
    gradeGcv: text("grade_gcv"),
    size: text("size"),
    quantity: numeric("quantity", { precision: 14, scale: 2 }).notNull(),
    unit: text("unit").notNull(),
    deliveryCity: text("delivery_city").notNull(),
    deliveryState: text("delivery_state").notNull(),
    pincode: text("pincode"),
    desiredTimeline: text("desired_timeline"),
    message: text("message"),
    status: enquiryStatus("status").notNull().default("new"),
    source: enquirySource("source").notNull().default("website_quote_form"),
    submissionIpHash: text("submission_ip_hash"),
    userAgent: text("user_agent"),
    ...contentTimestamps,
  },
  (table) => [
    uniqueIndex("enquiries_submission_id_unique").on(table.clientSubmissionId),
    index("enquiries_status_created_at_idx").on(table.status, table.createdAt),
    index("enquiries_created_at_idx").on(table.createdAt),
    index("enquiries_company_name_idx").on(table.companyName),
    index("enquiries_dedupe_created_at_idx").on(table.dedupeHash, table.createdAt),
  ],
);

/** Brief, private notes for the administrator's conversation record. */
export const enquiryNotes = pgTable(
  "enquiry_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enquiryId: uuid("enquiry_id")
      .notNull()
      .references(() => enquiries.id, { onDelete: "cascade" }),
    note: text("note").notNull(),
    createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("enquiry_notes_enquiry_created_at_idx").on(table.enquiryId, table.createdAt)],
);

/** Short-lived, server-side rate-limit buckets keyed by a one-way client IP hash. */
export const enquiryRateLimitBuckets = pgTable(
  "enquiry_rate_limit_buckets",
  {
    bucket: text("bucket").primaryKey(),
    windowStartedAt: timestamp("window_started_at", { withTimezone: true }).notNull(),
    count: integer("count").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("enquiry_rate_limit_count_nonnegative", sql`${table.count} >= 0`)],
);
