ALTER TABLE "assets" ADD COLUMN "display_name" varchar;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_display_name_unique" UNIQUE("display_name");