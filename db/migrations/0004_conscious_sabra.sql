CREATE TYPE "public"."enquiry_source" AS ENUM('website_quote_form');--> statement-breakpoint
CREATE TYPE "public"."enquiry_status" AS ENUM('new', 'contacted', 'quoted', 'closed', 'archived');--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_submission_id" uuid NOT NULL,
	"dedupe_hash" text NOT NULL,
	"contact_name" text NOT NULL,
	"company_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"whatsapp" text,
	"coal_requirement" text NOT NULL,
	"grade_gcv" text,
	"size" text,
	"quantity" numeric(14, 2) NOT NULL,
	"unit" text NOT NULL,
	"delivery_city" text NOT NULL,
	"delivery_state" text NOT NULL,
	"pincode" text,
	"desired_timeline" text,
	"message" text,
	"status" "enquiry_status" DEFAULT 'new' NOT NULL,
	"source" "enquiry_source" DEFAULT 'website_quote_form' NOT NULL,
	"submission_ip_hash" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enquiry_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" uuid NOT NULL,
	"note" text NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enquiry_rate_limit_buckets" (
	"bucket" text PRIMARY KEY NOT NULL,
	"window_started_at" timestamp with time zone NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "enquiry_rate_limit_count_nonnegative" CHECK ("enquiry_rate_limit_buckets"."count" >= 0)
);
--> statement-breakpoint
ALTER TABLE "enquiry_notes" ADD CONSTRAINT "enquiry_notes_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiry_notes" ADD CONSTRAINT "enquiry_notes_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "enquiries_submission_id_unique" ON "enquiries" USING btree ("client_submission_id");--> statement-breakpoint
CREATE INDEX "enquiries_status_created_at_idx" ON "enquiries" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "enquiries_company_name_idx" ON "enquiries" USING btree ("company_name");--> statement-breakpoint
CREATE INDEX "enquiries_dedupe_created_at_idx" ON "enquiries" USING btree ("dedupe_hash","created_at");--> statement-breakpoint
CREATE INDEX "enquiry_notes_enquiry_created_at_idx" ON "enquiry_notes" USING btree ("enquiry_id","created_at");