import { integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const assets = pgTable('assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  type: varchar('type', { length: 16 }).notNull(),
  format: varchar('format', { length: 16 }).notNull(),
  mime: varchar('mime', { length: 64 }).notNull(),
  size: integer('size').notNull(),
  path: text('path').notNull(),
  width: integer('width'),
  height: integer('height'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Asset = typeof assets.$inferSelect
export type NewAsset = typeof assets.$inferInsert
