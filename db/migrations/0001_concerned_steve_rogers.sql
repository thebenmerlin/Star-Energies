ALTER TABLE "capabilities" ADD CONSTRAINT "capabilities_display_order_nonnegative" CHECK ("capabilities"."display_order" >= 0);--> statement-breakpoint
ALTER TABLE "coverage_regions" ADD CONSTRAINT "coverage_regions_display_order_nonnegative" CHECK ("coverage_regions"."display_order" >= 0);--> statement-breakpoint
ALTER TABLE "industries" ADD CONSTRAINT "industries_display_order_nonnegative" CHECK ("industries"."display_order" >= 0);--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_display_order_nonnegative" CHECK ("products"."display_order" >= 0);--> statement-breakpoint
ALTER TABLE "quality_parameters" ADD CONSTRAINT "quality_parameters_display_order_nonnegative" CHECK ("quality_parameters"."display_order" >= 0);--> statement-breakpoint
ALTER TABLE "requirement_dimensions" ADD CONSTRAINT "requirement_dimensions_display_order_nonnegative" CHECK ("requirement_dimensions"."display_order" >= 0);--> statement-breakpoint
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_singleton_check" CHECK ("site_settings"."id" = 'star-energies');