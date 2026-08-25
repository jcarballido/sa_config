CREATE TABLE "base" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "handle" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "configurations" DROP CONSTRAINT "configurations_asset_id_assets_id_fk";
--> statement-breakpoint
ALTER TABLE "configurations" ADD COLUMN "base" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "configurations" ADD COLUMN "entry" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "configurations" ADD COLUMN "handle" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "base" ADD CONSTRAINT "base_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entry" ADD CONSTRAINT "entry_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handle" ADD CONSTRAINT "handle_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_base_assets_id_fk" FOREIGN KEY ("base") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_entry_assets_id_fk" FOREIGN KEY ("entry") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_handle_assets_id_fk" FOREIGN KEY ("handle") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configurations" DROP COLUMN "asset_id";--> statement-breakpoint
ALTER TABLE "configurations" DROP COLUMN "config_id";--> statement-breakpoint
ALTER TABLE "configurations" DROP COLUMN "volume";