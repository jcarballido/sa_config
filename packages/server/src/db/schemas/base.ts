import { pgTable as table, integer, uuid, varchar } from 'drizzle-orm/pg-core'
import { assets } from './assets.js'

export const base = table('base',{
  id: uuid('id').defaultRandom().primaryKey(),
  assetId:uuid('asset_id').references(() => assets.id).notNull(),  
})

// export type Asset = typeof assets.$inferSelect
// export type NewAsset = typeof assets.$inferInsert
