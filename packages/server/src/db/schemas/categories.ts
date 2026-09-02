import { pgTable as table, uuid, varchar } from 'drizzle-orm/pg-core'

export const categories = table('categories',{
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull().unique()
})