import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { mediaAssets } from "@/db/schema";
import { requireAdmin, AdminAuthorizationError } from "@/lib/auth";
import { uploadImage, validateImageUpload } from "@/lib/storage";

export const runtime = "nodejs";

type FormDataReader = { get(name: string): FormDataEntryValue | null };

const mediaCategorySchema = z.enum(["logo", "coal", "facility", "industrial", "operations", "team", "hero"]);
const uploadMessages = new Set([
  "Choose an image file to upload.",
  "Images must be 12 MB or smaller.",
  "Use a JPEG, PNG, WebP, or AVIF image.",
  "The image file type does not match its contents.",
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
  return { id: asset.id, url: asset.publicUrl, storagePath: asset.storageKey ?? undefined, title: asset.title, altText: asset.altText, label: asset.label, caption: asset.caption ?? undefined, category: asset.category, width: asset.width ?? undefined, height: asset.height ?? undefined, mimeType: asset.mimeType ?? undefined, placeholder: asset.placeholder, createdAt: asset.createdAt.toISOString() };
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData() as unknown as FormDataReader;
    const file = formData.get("file");
    if (!(file instanceof File)) throw new Error("Choose an image file to upload.");

    const image = await validateImageUpload(file);
    const upload = await uploadImage(image);
    const title = (String(formData.get("title") ?? file.name.replace(/\.[^.]+$/, "")).trim() || "Untitled image").slice(0, 120);
    const category = mediaCategorySchema.parse(formData.get("category") ?? "industrial");
    const altText = (String(formData.get("altText") ?? "Uploaded image awaiting final descriptive alt text.").trim()).slice(0, 180);
    const label = (String(formData.get("label") ?? "UPLOADED MEDIA").trim() || "UPLOADED MEDIA").slice(0, 100);

    const [asset] = await getDatabase().insert(mediaAssets).values({
      id: upload.id,
      storageKey: upload.storageKey,
      publicUrl: upload.publicUrl,
      originalFilename: upload.originalFilename,
      title,
      altText,
      label,
      category,
      mimeType: upload.mimeType,
      sizeBytes: upload.sizeBytes,
      placeholder: false,
    }).returning();

    refreshMedia();
    return NextResponse.json({ asset: serializeMedia(asset) });
  } catch (error) {
    console.error("Media upload failed", error instanceof Error ? error.message : "Unknown error");
    return mediaError(error);
  }
}
