CREATE TABLE "source_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hash" varchar NOT NULL,
	"storage_key" varchar NOT NULL,
	"mime" varchar(64) NOT NULL,
	"format" varchar(16) NOT NULL,
	"size" integer NOT NULL,
	"height" varchar NOT NULL,
	"width" varchar NOT NULL,
	"has_alpha" boolean NOT NULL,
	CONSTRAINT "source_images_hash_unique" UNIQUE("hash"),
	CONSTRAINT "source_images_storage_key_unique" UNIQUE("storage_key")
);
