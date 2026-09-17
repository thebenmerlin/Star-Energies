import "server-only";

import { v2 as cloudinary } from "cloudinary";

import type { MediaAsset } from "@/types/content";

const acceptedImageFormats = new Map([
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["png", "image/png"],
  ["webp", "image/webp"],
  ["avif", "image/avif"],
]);
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

export function getCloudinaryPublicId(assetId: string, category: MediaAsset["category"]) {
  return `star-energies/${folderByCategory[category]}/${assetId}`;
}

export type CloudinaryUploadSignature = {
  assetId: string;
  cloudName: string;
  apiKey: string;
  folder: string;
  publicId: string;
  timestamp: number;
  signature: string;
  tags: string;
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

/**
 * Vercel functions accept a maximum 4.5 MB request body. Images therefore go
 * directly from the authenticated browser to Cloudinary with this short-lived
 * signature; the API secret never leaves the server.
 */
export function createCloudinaryUploadSignature(category: MediaAsset["category"]): CloudinaryUploadSignature {
  const id = crypto.randomUUID();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary storage is not fully configured.");

  const folder = `star-energies/${folderByCategory[category]}`;
  const timestamp = Math.floor(Date.now() / 1_000);
  const tags = `star-energies,${category}`;
  const signature = cloudinary.utils.api_sign_request({ folder, public_id: id, tags, timestamp }, apiSecret);

  return { assetId: id, cloudName, apiKey, folder, publicId: id, timestamp, signature, tags };
}

/** Verifies the final Cloudinary resource before its metadata reaches Neon. */
export async function verifyCloudinaryImageUpload(assetId: string, category: MediaAsset["category"]) {
  const publicId = getCloudinaryPublicId(assetId, category);
  const resource = await getCloudinary().api.resource(publicId, { resource_type: "image" });
  const format = String(resource.format ?? "").toLowerCase();
  const mimeType = acceptedImageFormats.get(format);
  const sizeBytes = Number(resource.bytes ?? 0);
  if (!mimeType) throw new Error("Use a JPEG, PNG, WebP, or AVIF image.");
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0 || sizeBytes > maxImageBytes) {
    throw new Error("Images must be 12 MB or smaller.");
  }
  if (!resource.secure_url || !resource.public_id || resource.public_id !== publicId) {
    throw new Error("Cloudinary did not return a valid uploaded image.");
  }

  return {
    id: assetId,
    cloudinaryPublicId: resource.public_id as string,
    secureUrl: resource.secure_url as string,
    originalFilename: String(resource.original_filename ?? assetId).slice(0, 180),
    format,
    mimeType,
    width: Number(resource.width) || undefined,
    height: Number(resource.height) || undefined,
    sizeBytes,
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
