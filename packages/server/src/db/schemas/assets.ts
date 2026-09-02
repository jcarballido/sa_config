import { pgTable as table, integer, uuid, varchar } from 'drizzle-orm/pg-core'
import { categories } from './categories.js'

export const assets = table('assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  hash: varchar('hash').unique().notNull(),
  storageKey: varchar('storage_key').unique().notNull(),
  mime: varchar('mime', { length: 64 }).notNull(),
  type: varchar('type', { length: 16 }).notNull(),
  size: integer('size').notNull(),
  categoryId: uuid('category_id').references( () => categories.id)
})

export type Asset = typeof assets.$inferSelect
export type NewAsset = typeof assets.$inferInsert
