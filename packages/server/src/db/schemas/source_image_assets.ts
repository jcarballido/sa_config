import { pgTable as table, integer, uuid, varchar, boolean } from 'drizzle-orm/pg-core'

export const sourceImages = table('source_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  hash: varchar('hash').unique().notNull(),
  storageKey: varchar('storage_key').unique().notNull(),
  mime: varchar('mime', { length: 64 }).notNull(),
  format: varchar('format', { length: 16 }).notNull(),
  size: integer('size').notNull(),
  height: integer('height').notNull(),
  width: integer('width').notNull(),
  hasAlpha: boolean('has_alpha').notNull()
})

export type SourceImages = typeof sourceImages.$inferSelect
export type NewSourceImages = typeof sourceImages.$inferInsert
