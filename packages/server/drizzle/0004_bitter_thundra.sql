ALTER TABLE "configurations" DROP CONSTRAINT "configurations_base_assets_id_fk";
--> statement-breakpoint
ALTER TABLE "configurations" DROP CONSTRAINT "configurations_entry_assets_id_fk";
--> statement-breakpoint
ALTER TABLE "configurations" DROP CONSTRAINT "configurations_handle_assets_id_fk";
--> statement-breakpoint
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_base_base_id_fk" FOREIGN KEY ("base") REFERENCES "public"."base"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_entry_entry_id_fk" FOREIGN KEY ("entry") REFERENCES "public"."entry"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_handle_handle_id_fk" FOREIGN KEY ("handle") REFERENCES "public"."handle"("id") ON DELETE no action ON UPDATE no action;