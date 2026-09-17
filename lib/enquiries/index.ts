import "server-only";

import { createHash } from "node:crypto";
import { and, asc, desc, eq, gte, ilike, inArray, or, sql, type SQL } from "drizzle-orm";

import { getDatabase } from "@/db";
import { enquiries, enquiryNotes, enquiryRateLimitBuckets, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import {
  enquiryNoteInputSchema,
  enquiryStatusSchema,
  enquiryStatusUpdateSchema,
  type AdminEnquiry,
  type EnquiryListResult,
  type EnquiryNote,
  type EnquiryStatus,
  type PublicEnquiryRequest,
} from "@/types/enquiry";

const RATE_LIMIT_MAXIMUM = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1_000;
const DEDUPE_WINDOW_MS = 2 * 60 * 1_000;
const PAGE_SIZE = 25;

type EnquiryRecord = typeof enquiries.$inferSelect;
type EnquiryNoteRecord = typeof enquiryNotes.$inferSelect;

export class EnquiryRateLimitError extends Error {
  constructor() {
    super("Too many enquiries have been sent from this connection. Please wait a few minutes or contact us directly.");
    this.name = "EnquiryRateLimitError";
  }
}

export class EnquiryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnquiryValidationError";
  }
}

export function getEnquiryIpAddress(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  return (forwarded?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown").slice(0, 120);
}

function hash(value: string) {
  const salt = process.env.BETTER_AUTH_SECRET || "star-energies-development-rate-limit";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

function normalized(value: string | undefined) {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function isUniqueConstraintError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "23505";
}

async function consumeRateLimit(ipAddress: string) {
  const db = getDatabase();
  const now = new Date();
  const resetBefore = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);
  const bucket = hash(ipAddress);
  const [result] = await db.insert(enquiryRateLimitBuckets).values({
    bucket,
    windowStartedAt: now,
    count: 1,
    updatedAt: now,
  }).onConflictDoUpdate({
    target: enquiryRateLimitBuckets.bucket,
    set: {
      windowStartedAt: sql<Date>`case when ${enquiryRateLimitBuckets.windowStartedAt} <= ${resetBefore} then ${now} else ${enquiryRateLimitBuckets.windowStartedAt} end`,
      count: sql<number>`case when ${enquiryRateLimitBuckets.windowStartedAt} <= ${resetBefore} then 1 else ${enquiryRateLimitBuckets.count} + 1 end`,
      updatedAt: now,
    },
  }).returning({ count: enquiryRateLimitBuckets.count });

  if (!result || result.count > RATE_LIMIT_MAXIMUM) throw new EnquiryRateLimitError();
  return bucket;
}

function toAdminNote(record: EnquiryNoteRecord, author?: string | null): EnquiryNote {
  return {
    id: record.id,
    createdAt: record.createdAt.toISOString(),
    author: author || "Star Energies",
    text: record.note,
  };
}

function toAdminEnquiry(record: EnquiryRecord, notes: EnquiryNote[] = []): AdminEnquiry {
  return {
    id: record.id,
    submittedAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    status: record.status,
    source: record.source,
    contactPerson: record.contactName,
    companyName: record.companyName,
    phone: record.phone,
    email: record.email ?? undefined,
    whatsapp: record.whatsapp ?? undefined,
    coalRequirement: record.coalRequirement,
    gradeGcv: record.gradeGcv ?? undefined,
    size: record.size ?? undefined,
    quantity: record.quantity,
    unit: record.unit,
    deliveryCity: record.deliveryCity,
    state: record.deliveryState,
    pincode: record.pincode ?? undefined,
    timeline: record.desiredTimeline ?? undefined,
    message: record.message ?? undefined,
    notes,
  };
}

async function notesForEnquiries(enquiryIds: string[]) {
  if (!enquiryIds.length) return new Map<string, EnquiryNote[]>();

  const rows = await getDatabase()
    .select({ note: enquiryNotes, author: users.name })
    .from(enquiryNotes)
    .leftJoin(users, eq(enquiryNotes.createdBy, users.id))
    .where(inArray(enquiryNotes.enquiryId, enquiryIds))
    .orderBy(desc(enquiryNotes.createdAt));
  const grouped = new Map<string, EnquiryNote[]>();
  rows.forEach((row) => {
    const existing = grouped.get(row.note.enquiryId) ?? [];
    existing.push(toAdminNote(row.note, row.author));
    grouped.set(row.note.enquiryId, existing);
  });
  return grouped;
}

async function getEnquiryById(id: string) {
  const [record] = await getDatabase().select().from(enquiries).where(eq(enquiries.id, id)).limit(1);
  if (!record) return undefined;
  const notes = await notesForEnquiries([record.id]);
  return toAdminEnquiry(record, notes.get(record.id) ?? []);
}

/**
 * Insert a validated public enquiry. The request metadata is retained only as
 * a one-way IP hash and a short user-agent string for operational abuse checks.
 */
export async function createPublicEnquiry(input: PublicEnquiryRequest, metadata: { ipAddress: string; userAgent?: string | null }) {
  if (input.website.trim()) return { accepted: true, duplicate: true, enquiry: undefined } as const;

  const elapsed = Date.now() - input.formStartedAt;
  if (elapsed < 750 || elapsed > 24 * 60 * 60 * 1_000) {
    throw new EnquiryValidationError("Please take a moment to review the form and try again.");
  }

  const ipHash = await consumeRateLimit(metadata.ipAddress);
  const dedupeHash = hash([
    normalized(input.phone),
    normalized(input.companyName),
    normalized(input.coalRequirement),
    normalized(input.deliveryCity),
    String(input.quantity),
    normalized(input.unit),
  ].join("|"));
  const duplicateAfter = new Date(Date.now() - DEDUPE_WINDOW_MS);
  const [recentDuplicate] = await getDatabase().select({ id: enquiries.id }).from(enquiries).where(and(
    eq(enquiries.dedupeHash, dedupeHash),
    gte(enquiries.createdAt, duplicateAfter),
  )).limit(1);

  if (recentDuplicate) {
    return { accepted: true, duplicate: true, enquiry: await getEnquiryById(recentDuplicate.id) } as const;
  }

  let record: EnquiryRecord | undefined;
  try {
    [record] = await getDatabase().insert(enquiries).values({
      clientSubmissionId: input.clientSubmissionId,
      dedupeHash,
      contactName: input.contactPerson,
      companyName: input.companyName,
      phone: input.phone,
      email: input.email,
      whatsapp: input.whatsapp,
      coalRequirement: input.coalRequirement,
      gradeGcv: input.gradeGcv,
      size: input.size,
      quantity: String(input.quantity),
      unit: input.unit,
      deliveryCity: input.deliveryCity,
      deliveryState: input.state,
      pincode: input.pincode,
      desiredTimeline: input.timeline,
      message: input.message,
      status: "new",
      source: "website_quote_form",
      submissionIpHash: ipHash,
      userAgent: metadata.userAgent?.slice(0, 500) || undefined,
    }).returning();
  } catch (error) {
    if (!isUniqueConstraintError(error)) throw error;
    const [existing] = await getDatabase().select({ id: enquiries.id }).from(enquiries).where(eq(enquiries.clientSubmissionId, input.clientSubmissionId)).limit(1);
    if (existing) return { accepted: true, duplicate: true, enquiry: await getEnquiryById(existing.id) } as const;
    throw error;
  }

  if (!record) throw new Error("The enquiry could not be saved.");
  return { accepted: true, duplicate: false, enquiry: toAdminEnquiry(record) } as const;
}

export async function getAdminEnquiries(options: { query?: string; status?: string; page?: number; pageSize?: number; sort?: "newest" | "oldest" } = {}): Promise<EnquiryListResult> {
  await requireAdmin();
  const pageSize = Math.min(Math.max(options.pageSize ?? PAGE_SIZE, 1), 100);
  const page = Math.max(options.page ?? 1, 1);
  const query = options.query?.trim().slice(0, 120);
  const status = enquiryStatusSchema.safeParse(options.status).data;
  const filters: SQL[] = [];
  if (status) filters.push(eq(enquiries.status, status));
  if (query) {
    const match = `%${query.replace(/[\\%_]/g, "\\$&")}%`;
    filters.push(or(
      ilike(enquiries.companyName, match),
      ilike(enquiries.contactName, match),
      ilike(enquiries.phone, match),
      ilike(enquiries.deliveryCity, match),
      ilike(enquiries.coalRequirement, match),
    )!);
  }
  const where = filters.length ? and(...filters) : undefined;
  const db = getDatabase();
  const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(enquiries).where(where);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const resolvedPage = Math.min(page, totalPages);
  const records = await db.select().from(enquiries).where(where)
    .orderBy(options.sort === "oldest" ? asc(enquiries.createdAt) : desc(enquiries.createdAt))
    .limit(pageSize)
    .offset((resolvedPage - 1) * pageSize);
  const notes = await notesForEnquiries(records.map((record) => record.id));
  return {
    enquiries: records.map((record) => toAdminEnquiry(record, notes.get(record.id) ?? [])),
    total,
    page: resolvedPage,
    pageSize,
    totalPages,
  };
}

export async function getAdminEnquiry(id: string) {
  await requireAdmin();
  return getEnquiryById(id);
}

export async function getAdminEnquiryDashboard() {
  await requireAdmin();
  const db = getDatabase();
  const [[{ newCount }], [{ openCount }], recent] = await Promise.all([
    db.select({ newCount: sql<number>`count(*)::int` }).from(enquiries).where(eq(enquiries.status, "new")),
    db.select({ openCount: sql<number>`count(*)::int` }).from(enquiries).where(inArray(enquiries.status, ["new", "contacted", "quoted"])),
    db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(5),
  ]);
  const notes = await notesForEnquiries(recent.map((record) => record.id));
  return { newCount, openCount, recent: recent.map((record) => toAdminEnquiry(record, notes.get(record.id) ?? [])) };
}

export async function updateAdminEnquiryStatus(input: unknown) {
  const { enquiryId, status } = enquiryStatusUpdateSchema.parse(input);
  await requireAdmin();
  const [updated] = await getDatabase().update(enquiries).set({ status, updatedAt: new Date() }).where(eq(enquiries.id, enquiryId)).returning();
  if (!updated) throw new Error("The enquiry could not be found.");
  return toAdminEnquiry(updated);
}

export async function addAdminEnquiryNote(input: unknown) {
  const { enquiryId, note } = enquiryNoteInputSchema.parse(input);
  const { session } = await requireAdmin();
  const [created] = await getDatabase().insert(enquiryNotes).values({ enquiryId, note, createdBy: session.user.id }).returning();
  if (!created) throw new Error("The note could not be saved.");
  return toAdminNote(created, session.user.name || "Star Energies");
}
