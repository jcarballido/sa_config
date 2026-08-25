CREATE TABLE "configurations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"config_id" uuid NOT NULL,
	"volume" integer
);
--> statement-breakpoint
ALTER TABLE "assets" DROP CONSTRAINT "assets_asset_id_assets_id_fk";
--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "hash" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "storage_key" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "mime" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "type" varchar(16) NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "size" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" DROP COLUMN "asset_id";--> statement-breakpoint
ALTER TABLE "assets" DROP COLUMN "config_id";--> statement-breakpoint
ALTER TABLE "assets" DROP COLUMN "volume";--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_hash_unique" UNIQUE("hash");--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_storage_key_unique" UNIQUE("storage_key");