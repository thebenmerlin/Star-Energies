import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { mediaAssets } from "@/db/schema";
import { requireAdmin, AdminAuthorizationError } from "@/lib/auth";
import { deleteCloudinaryImage, getCloudinaryDeliveryUrl, getCloudinaryPublicId, verifyCloudinaryImageUpload } from "@/lib/cloudinary";

export const runtime = "nodejs";

const mediaCategorySchema = z.enum(["logo", "coal", "facility", "industrial", "operations", "team", "hero"]);
const uploadedMediaSchema = z.object({
  assetId: z.string().uuid(),
  category: mediaCategorySchema,
});
const uploadMessages = new Set([
  "Images must be 12 MB or smaller.",
  "Use a JPEG, PNG, WebP, or AVIF image.",
  "Cloudinary did not return a valid uploaded image.",
]);

function mediaError(error: unknown) {
  if (error instanceof AdminAuthorizationError) return NextResponse.json({ message: "Authentication is required." }, { status: 401 });
  if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0]?.message ?? "Check the media details." }, { status: 400 });
  if (error instanceof Error && uploadMessages.has(error.message)) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ message: "The image could not be uploaded." }, { status: 500 });
}

function refreshMedia() {
  revalidateTag("media", "max");
  ["/", "/about", "/coal", "/industries", "/capabilities", "/operations", "/contact"].forEach((path) => revalidatePath(path));
}

function serializeMedia(asset: typeof mediaAssets.$inferSelect) {
  return { id: asset.id, url: getCloudinaryDeliveryUrl(asset.cloudinaryPublicId ?? undefined, asset.secureUrl), cloudinaryPublicId: asset.cloudinaryPublicId ?? undefined, secureUrl: asset.secureUrl, title: asset.title, altText: asset.altText, label: asset.label, caption: asset.caption ?? undefined, category: asset.category, width: asset.width ?? undefined, height: asset.height ?? undefined, format: asset.format ?? undefined, mimeType: asset.mimeType ?? undefined, placeholder: asset.placeholder, createdAt: asset.createdAt.toISOString() };
}

export async function POST(request: Request) {
  let orphanedCloudinaryPublicId: string | undefined;
  try {
    await requireAdmin();
    const { assetId, category } = uploadedMediaSchema.parse(await request.json());
    orphanedCloudinaryPublicId = getCloudinaryPublicId(assetId, category);
    const upload = await verifyCloudinaryImageUpload(assetId, category);
    const title = (upload.originalFilename.replace(/[-_]+/g, " ").trim() || "Untitled image").slice(0, 120);
    const altText = "Uploaded image awaiting final descriptive alt text.";
    const label = "UPLOADED MEDIA";

    const [asset] = await getDatabase().insert(mediaAssets).values({
      id: assetId,
      cloudinaryPublicId: upload.cloudinaryPublicId,
      secureUrl: upload.secureUrl,
      originalFilename: upload.originalFilename,
      title,
      altText,
      label,
      category,
      width: upload.width,
      height: upload.height,
      format: upload.format,
      mimeType: upload.mimeType,
      sizeBytes: upload.sizeBytes,
      placeholder: false,
    }).returning();

    orphanedCloudinaryPublicId = undefined;
    refreshMedia();
    return NextResponse.json({ asset: serializeMedia(asset) });
  } catch (error) {
    if (orphanedCloudinaryPublicId) {
      await deleteCloudinaryImage(orphanedCloudinaryPublicId).catch(() => undefined);
    }
    console.error("Media upload failed", error instanceof Error ? error.message : "Unknown error");
    return mediaError(error);
  }
}
