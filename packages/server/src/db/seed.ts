import { client,db } from './db.js'
import { assets } from './schemas/assets.js'
import { configurations } from './schemas/configurations.js'
// import { categories } from './schemas/categories.js'

// export const assets = table('assets', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   hash: varchar('hash').unique().notNull(),
//   storageKey: varchar('storage_key').unique().notNull(),
//   mime: varchar('mime', { length: 64 }).notNull(),
//   type: varchar('type', { length: 16 }).notNull(),
//   size: integer('size').notNull(),
//   categoryId: uuid('category_id').references( () => categories.id)
// })


const seed = async() => {
  await db.insert(configurations).values([{
    modelNumber:'R',
    signature:['7df7a244-171b-49aa-8314-081d80f3523d','4bd55f89-0e2b-4244-b155-1ba7a667128a',]
  }])
}

await seed()
console.log("Table seeded.")
await client.end()