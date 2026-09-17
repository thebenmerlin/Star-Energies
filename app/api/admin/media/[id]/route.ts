import { and, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { mediaAssets, mediaReferences } from "@/db/schema";
import { requireAdmin, AdminAuthorizationError } from "@/lib/auth";
import { deleteCloudinaryImage, getCloudinaryDeliveryUrl, uploadImageToCloudinary, validateImageUpload } from "@/lib/cloudinary";

export const runtime = "nodejs";

type FormDataReader = { get(name: string): FormDataEntryValue | null };

const metadataSchema = z.object({
  title: z.string().trim().min(2).max(120),
  altText: z.string().trim().min(8).max(180),
  label: z.string().trim().min(2).max(100),
  caption: z.string().trim().min(2).max(160).optional(),
  category: z.enum(["logo", "coal", "facility", "industrial", "operations", "team", "hero"]),
  placeholder: z.boolean(),
});
const uploadMessages = new Set([
  "Choose an image file to replace this media item.",
  "Choose an image file to upload.",
  "Images must be 12 MB or smaller.",
  "Use a JPEG, PNG, WebP, or AVIF image.",
  "The image file type does not match its contents.",
]);

function refreshMedia() {
  revalidateTag("media", "max");
  ["/", "/about", "/coal", "/industries", "/capabilities", "/operations", "/contact"].forEach((path) => revalidatePath(path));
}

function serializeMedia(asset: typeof mediaAssets.$inferSelect) {
  return { id: asset.id, url: getCloudinaryDeliveryUrl(asset.cloudinaryPublicId ?? undefined, asset.secureUrl), cloudinaryPublicId: asset.cloudinaryPublicId ?? undefined, secureUrl: asset.secureUrl, title: asset.title, altText: asset.altText, label: asset.label, caption: asset.caption ?? undefined, category: asset.category, width: asset.width ?? undefined, height: asset.height ?? undefined, format: asset.format ?? undefined, mimeType: asset.mimeType ?? undefined, placeholder: asset.placeholder, createdAt: asset.createdAt.toISOString() };
}

function routeError(error: unknown) {
  if (error instanceof AdminAuthorizationError) return NextResponse.json({ message: "Authentication is required." }, { status: 401 });
  if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0]?.message ?? "Check the media details." }, { status: 400 });
  if (error instanceof Error && uploadMessages.has(error.message)) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ message: "The media operation could not be completed." }, { status: 500 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const input = metadataSchema.parse(await request.json());
    const [asset] = await getDatabase().update(mediaAssets).set({ ...input, caption: input.caption || null, updatedAt: new Date() }).where(eq(mediaAssets.id, id)).returning();
    if (!asset) return NextResponse.json({ message: "This media item no longer exists." }, { status: 404 });
    refreshMedia();
    return NextResponse.json({ asset: serializeMedia(asset) });
  } catch (error) {
    console.error("Media metadata update failed", error instanceof Error ? error.message : "Unknown error");
    return routeError(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const db = getDatabase();
    const [existing] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
    if (!existing) return NextResponse.json({ message: "This media item no longer exists." }, { status: 404 });
    const formData = await request.formData() as unknown as FormDataReader;
    const file = formData.get("file");
    if (!(file instanceof File)) throw new Error("Choose an image file to replace this media item.");
    const upload = await uploadImageToCloudinary(await validateImageUpload(file), existing.category);

    const [asset] = await db.update(mediaAssets).set({
      cloudinaryPublicId: upload.cloudinaryPublicId,
      secureUrl: upload.secureUrl,
      originalFilename: upload.originalFilename,
      width: upload.width,
      height: upload.height,
      format: upload.format,
      mimeType: upload.mimeType,
      sizeBytes: upload.sizeBytes,
      placeholder: false,
      updatedAt: new Date(),
    }).where(eq(mediaAssets.id, id)).returning();

    if (existing.cloudinaryPublicId) {
      deleteCloudinaryImage(existing.cloudinaryPublicId).catch((error: unknown) => console.error("Previous Cloudinary asset cleanup failed", error instanceof Error ? error.message : "Unknown error"));
    }
    refreshMedia();
    return NextResponse.json({ asset: serializeMedia(asset) });
  } catch (error) {
    console.error("Media replacement failed", error instanceof Error ? error.message : "Unknown error");
    return routeError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const db = getDatabase();
    const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
    if (!asset) return NextResponse.json({ message: "This media item no longer exists." }, { status: 404 });
    const references = await db.select().from(mediaReferences).where(eq(mediaReferences.mediaId, id));
    if (references.length) {
      const usage = references.slice(0, 3).map((reference) => `${reference.scope} ${reference.recordId}`).join(", ");
      return NextResponse.json({ message: `This image is currently used by ${usage}. Replace it there before deleting.` }, { status: 409 });
    }
    if (asset.cloudinaryPublicId) await deleteCloudinaryImage(asset.cloudinaryPublicId);
    await db.delete(mediaAssets).where(and(eq(mediaAssets.id, id), eq(mediaAssets.id, asset.id)));
    refreshMedia();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Media deletion failed", error instanceof Error ? error.message : "Unknown error");
    return routeError(error);
  }
}
