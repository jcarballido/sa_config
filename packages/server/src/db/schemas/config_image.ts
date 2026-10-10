import { pgTable as table, uuid } from "drizzle-orm/pg-core";
import { configurations } from "./configurations.js";
import { processedImages } from "./processed_image_assets.js";

export const configImage = table('config_image',{
  id: uuid('id').defaultRandom().primaryKey(),
  configID: uuid('config_id').references(() => configurations.id).notNull(),
  imageId: uuid('image_id').references(() => processedImages.id).notNull()
})