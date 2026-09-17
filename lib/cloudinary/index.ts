import "server-only";

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { fileTypeFromBuffer } from "file-type";

import type { MediaAsset } from "@/types/content";

const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const folderByCategory: Record<MediaAsset["category"], string> = {
  logo: "general",
  hero: "general",
  facility: "facility",
  coal: "coal",
  operations: "operations",
  industrial: "industries",
  team: "team",
};

export const maxImageBytes = 12 * 1024 * 1024;

export type ValidatedImage = {
  buffer: Buffer;
  mimeType: "image/jpeg" | "image/png" | "image/webp" | "image/avif";
  sizeBytes: number;
  originalFilename: string;
};

function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary storage is not fully configured.");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

/** Validates actual file bytes rather than trusting the browser's filename/type. */
export async function validateImageUpload(file: File): Promise<ValidatedImage> {
  if (file.size === 0) throw new Error("Choose an image file to upload.");
  if (file.size > maxImageBytes) throw new Error("Images must be 12 MB or smaller.");

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = await fileTypeFromBuffer(buffer);

  if (!detected || !acceptedImageTypes.has(detected.mime)) {
    throw new Error("Use a JPEG, PNG, WebP, or AVIF image.");
  }

  if (file.type && file.type !== detected.mime) {
    throw new Error("The image file type does not match its contents.");
  }

  return {
    buffer,
    mimeType: detected.mime as ValidatedImage["mimeType"],
    sizeBytes: file.size,
    originalFilename: file.name.slice(0, 180),
  };
}

function uploadStream(image: ValidatedImage, category: MediaAsset["category"], assetId: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = getCloudinary().uploader.upload_stream(
      {
        resource_type: "image",
        folder: `star-energies/${folderByCategory[category]}`,
        public_id: assetId,
        use_filename: false,
        unique_filename: false,
        overwrite: false,
        tags: ["star-energies", category],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary did not return an uploaded image."));
          return;
        }
        resolve(result);
      },
    );
    stream.end(image.buffer);
  });
}

export async function uploadImageToCloudinary(image: ValidatedImage, category: MediaAsset["category"]) {
  const id = crypto.randomUUID();
  const result = await uploadStream(image, category, id);

  return {
    id,
    cloudinaryPublicId: result.public_id,
    secureUrl: result.secure_url,
    originalFilename: image.originalFilename,
    format: result.format,
    mimeType: image.mimeType,
    width: result.width,
    height: result.height,
    sizeBytes: result.bytes || image.sizeBytes,
  };
}

/**
 * Use a single restrained delivery treatment throughout the public site.
 * Cloudinary retains the original while serving modern formats, automatic
 * quality, and no asset wider than the site's practical photographic ceiling.
 */
export function getCloudinaryDeliveryUrl(cloudinaryPublicId: string | undefined, secureUrl: string) {
  if (!cloudinaryPublicId || !process.env.CLOUDINARY_CLOUD_NAME) return secureUrl;

  return getCloudinary().url(cloudinaryPublicId, {
    secure: true,
    resource_type: "image",
    transformation: [{ fetch_format: "auto", quality: "auto", width: 2400, crop: "limit" }],
  });
}

export async function deleteCloudinaryImage(cloudinaryPublicId: string) {
  const result = await getCloudinary().uploader.destroy(cloudinaryPublicId, {
    resource_type: "image",
    invalidate: true,
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error("Cloudinary could not remove the image.");
  }
}
