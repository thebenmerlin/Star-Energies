ALTER TABLE "media_assets" RENAME COLUMN "storage_key" TO "cloudinary_public_id";--> statement-breakpoint
ALTER TABLE "media_assets" RENAME COLUMN "public_url" TO "secure_url";--> statement-breakpoint
ALTER TABLE "media_assets" ADD COLUMN "format" text;