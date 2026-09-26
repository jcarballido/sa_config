import { pgTable, unique, uuid, varchar, foreignKey, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const categories = pgTable("categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar().notNull(),
}, (table) => [
	unique("categories_name_unique").on(table.name),
]);

export const assets = pgTable("assets", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	hash: varchar().notNull(),
	storageKey: varchar("storage_key").notNull(),
	mime: varchar({ length: 64 }).notNull(),
	type: varchar({ length: 16 }).notNull(),
	size: integer().notNull(),
	categoryId: uuid("category_id"),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "assets_category_id_categories_id_fk"
		}),
	unique("assets_hash_unique").on(table.hash),
	unique("assets_storage_key_unique").on(table.storageKey),
]);

export const configurations = pgTable("configurations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	modelNumber: varchar("model_number"),
	signature: uuid().array(),
}, (table) => [
	unique("configurations_model_number_unique").on(table.modelNumber),
	unique("configurations_signature_unique").on(table.signature),
]);

export const configAssets = pgTable("config_assets", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	configId: uuid("config_id").notNull(),
	assetId: uuid("asset_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.configId],
			foreignColumns: [configurations.id],
			name: "config_assets_config_id_configurations_id_fk"
		}),
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [assets.id],
			name: "config_assets_asset_id_assets_id_fk"
		}),
]);
