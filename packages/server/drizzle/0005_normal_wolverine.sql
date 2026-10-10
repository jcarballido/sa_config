ALTER TABLE "processed_images" ALTER COLUMN "height" SET DATA TYPE integer USING height::integer;--> statement-breakpoint
ALTER TABLE "processed_images" ALTER COLUMN "width" SET DATA TYPE integer USING width::integer;--> statement-breakpoint
ALTER TABLE "source_images" ALTER COLUMN "height" SET DATA TYPE integer USING height::integer;--> statement-breakpoint
ALTER TABLE "source_images" ALTER COLUMN "width" SET DATA TYPE integer USING width::integer;