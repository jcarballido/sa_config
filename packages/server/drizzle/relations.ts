import { relations } from "drizzle-orm/relations";
import { categories, assets, configurations, configAssets } from "./schema";

export const assetsRelations = relations(assets, ({one, many}) => ({
	category: one(categories, {
		fields: [assets.categoryId],
		references: [categories.id]
	}),
	configAssets: many(configAssets),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	assets: many(assets),
}));

export const configAssetsRelations = relations(configAssets, ({one}) => ({
	configuration: one(configurations, {
		fields: [configAssets.configId],
		references: [configurations.id]
	}),
	asset: one(assets, {
		fields: [configAssets.assetId],
		references: [assets.id]
	}),
}));

export const configurationsRelations = relations(configurations, ({many}) => ({
	configAssets: many(configAssets),
}));