ALTER TABLE "enquiries" ALTER COLUMN "company_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "company_type" text NOT NULL DEFAULT 'Not specified';--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "contact_role" text NOT NULL DEFAULT 'Not specified';--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "requirement_frequency" text NOT NULL DEFAULT 'Not specified';--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "lab_report_public_id" text;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "lab_report_name" text;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "lab_report_mime_type" text;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "lab_report_size_bytes" integer;--> statement-breakpoint
ALTER TABLE "enquiries" ALTER COLUMN "company_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "enquiries" ALTER COLUMN "contact_role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "enquiries" ALTER COLUMN "requirement_frequency" DROP DEFAULT;
