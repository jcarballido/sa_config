import { pgTable as table, integer, uuid, varchar } from 'drizzle-orm/pg-core'
import { assets } from './assets.js'

export const configurations = table('configurations', {
  id: uuid('id').defaultRandom().primaryKey(),
  modelNumber: varchar('model_number').unique(),
  signature: uuid('signature').array().unique()
})
