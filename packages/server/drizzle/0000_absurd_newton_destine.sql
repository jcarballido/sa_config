CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"config_id" uuid NOT NULL,
	"volume" integer
);
--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;