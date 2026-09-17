import "server-only";

import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fileTypeFromBuffer } from "file-type";

const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
export const maxImageBytes = 12 * 1024 * 1024;

type StorageConfiguration = {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl: string;
};

function getStorageConfiguration(): StorageConfiguration {
  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL;

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey || !publicBaseUrl) {
    throw new Error("S3 storage is not fully configured.");
  }

  return {
    endpoint,
    bucket,
    accessKeyId,
    secretAccessKey,
    publicBaseUrl: publicBaseUrl.replace(/\/$/, ""),
    region: process.env.S3_REGION ?? "auto",
  };
}

let client: S3Client | undefined;

function getStorageClient() {
  const config = getStorageConfiguration();

  if (!client) {
    client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  return { client, config };
}

function fileExtension(mimeType: string) {
  return {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  }[mimeType];
}

export type ValidatedImage = {
  buffer: Buffer;
  mimeType: "image/jpeg" | "image/png" | "image/webp" | "image/avif";
  sizeBytes: number;
  originalFilename: string;
};

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

export async function uploadImage(image: ValidatedImage) {
  const { client: storageClient, config } = getStorageClient();
  const extension = fileExtension(image.mimeType);
  const id = crypto.randomUUID();
  const storageKey = `star-energies/media/${id}.${extension}`;

  await storageClient.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: storageKey,
      Body: image.buffer,
      ContentType: image.mimeType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    id,
    storageKey,
    publicUrl: `${config.publicBaseUrl}/${storageKey}`,
    mimeType: image.mimeType,
    sizeBytes: image.sizeBytes,
    originalFilename: image.originalFilename,
  };
}

export async function deleteStoredObject(storageKey: string) {
  const { client: storageClient, config } = getStorageClient();
  await storageClient.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: storageKey }));
}
