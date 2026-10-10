CREATE TABLE "config_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"config_id" uuid NOT NULL,
	"image_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "processed_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hash" varchar NOT NULL,
	"storage_key" varchar NOT NULL,
	"mime" varchar(64) NOT NULL,
	"format" varchar(16) NOT NULL,
	"size" integer NOT NULL,
	"height" varchar NOT NULL,
	"width" varchar NOT NULL,
	"has_alpha" boolean NOT NULL,
	CONSTRAINT "processed_images_hash_unique" UNIQUE("hash"),
	CONSTRAINT "processed_images_storage_key_unique" UNIQUE("storage_key")
);
--> statement-breakpoint
ALTER TABLE "config_image" ADD CONSTRAINT "config_image_config_id_configurations_id_fk" FOREIGN KEY ("config_id") REFERENCES "public"."configurations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "config_image" ADD CONSTRAINT "config_image_image_id_processed_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."processed_images"("id") ON DELETE no action ON UPDATE no action;