import { pgTable as table, integer, uuid, varchar } from 'drizzle-orm/pg-core'

export const assets = table('assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  modelNumber: varchar('model_number').notNull(),
  hash: varchar('hash').unique().notNull(),
  storageKey: varchar('storage_key').unique().notNull(),
  mime: varchar('mime', { length: 64 }).notNull(),
  type: varchar('type', { length: 16 }).notNull(),
  size: integer('size').notNull()
})

export type Asset = typeof assets.$inferSelect
export type NewAsset = typeof assets.$inferInsert
