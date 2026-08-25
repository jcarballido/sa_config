import { pgTable as table, integer, uuid, varchar } from 'drizzle-orm/pg-core'
import { assets } from './assets.js'
import { base } from './base.js'
import { entry } from './entry.js'
import { handle } from './handle.js'

export const configurations = table('configurations', {
  id: uuid('id').defaultRandom().primaryKey(),
  base: uuid('base').references(() => base.id).notNull(),
  entry: uuid('entry').references(() => entry.id).notNull(),
  handle: uuid('handle').references(() => handle.id).notNull(),
})

// export type Asset = typeof assets.$inferSelect
// export type NewAsset = typeof assets.$inferInsert
