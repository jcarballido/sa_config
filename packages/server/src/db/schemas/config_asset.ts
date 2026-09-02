import { pgTable as table, uuid } from "drizzle-orm/pg-core";
import { categories } from "./categories.js";
import { configurations } from "./configurations.js";
import { assets } from "./assets.js";

export const configAsset = table('config_assets',{
  id: uuid('id').defaultRandom().primaryKey(),
  configID: uuid('config_id').references(() => configurations.id).notNull(),
  assetId: uuid('asset_id').references(() => assets.id).notNull()
})