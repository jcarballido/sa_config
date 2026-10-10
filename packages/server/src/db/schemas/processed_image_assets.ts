import { pgTable as table, integer, uuid, varchar, boolean } from 'drizzle-orm/pg-core'
import { categories } from './categories.js'
import { configurations } from './configurations.js'
// import { boolean } from 'zod'

export const processedImages = table('processed_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  hash: varchar('hash').unique().notNull(),
  storageKey: varchar('storage_key').unique().notNull(),
  mime: varchar('mime', { length: 64 }).notNull(),
  format: varchar('format', { length: 16 }).notNull(),
  size: integer('size').notNull(),
  height: integer('height').notNull(),
  width: integer('width').notNull(),
  hasAlpha: boolean('has_alpha').notNull(),
  configurationId: uuid('config_id').references(() => configurations.id) 
})

export type ProcessedImage = typeof processedImages.$inferSelect
export type NewProcessedImage = typeof processedImages.$inferInsert
