// export const configurations = table('configurations', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   modelNumber: varchar('model_number').unique(),
//   signature: uuid('signature').array().unique()
// })

// export const assets = table('assets', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   hash: varchar('hash').unique().notNull(),
//   storageKey: varchar('storage_key').unique().notNull(),
//   mime: varchar('mime', { length: 64 }).notNull(),
//   type: varchar('type', { length: 16 }).notNull(),
//   size: integer('size').notNull(),
//   categoryId: uuid('category_id').references( () => categories.id)
// })

import z from "zod";

export const ConfigurationsSchema = z.object({
  id:z.uuid(),
  modelNumber:z.string(),
  signature:z.array(z.string())
})

export const ConfigurationsArraySchema = z.array(ConfigurationsSchema)

export const AssetMetadataSchema = z.object({
  id: z.uuid(),
  hash: z.string(),
  storageKey: z.string(),
  mime: z.string(),
  type:  z.string(),
  size: z.int(),
  category: z.enum(['Body','Handle','Entry']),
  displayName: z.string()
})

export const AssetMetadataArraySchema = z.array(AssetMetadataSchema)

export const ImageAssetMetadataSchema = z.object({
  id: z.uuid(),
  hash: z.string(),
  storageKey: z.string(),
  mime: z.string(),
  format: z.literal('heif'),
  size: z.int(),
  height: z.int(),
  width: z.int(),
  hasAlpha: z.boolean(),
  configurationId: z.uuid() 
})

export const ImageAssetMetadataArraySchema = z.array(ImageAssetMetadataSchema)

export type Configuration = z.infer<typeof ConfigurationsSchema>
export type ConfigurationsArray = z.infer<typeof ConfigurationsArraySchema>
export type AssetMetadata = z.infer<typeof AssetMetadataSchema>
export type AssetMetadataArray = z.infer<typeof AssetMetadataArraySchema>
export type ImageAssetMetadata = z.infer<typeof ImageAssetMetadataSchema>