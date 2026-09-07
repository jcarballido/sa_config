// export const configurations = table('configurations', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   modelNumber: varchar('model_number').unique(),
//   signature: uuid('signature').array().unique()
// })

// export const assets = table('assets', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   hash: varchar('hash').unique().notNull(),
//   storageKey: varchar('storage_key').unique().notNull(),
//   mime: varchar('mime', { length: 64 }).notNull(),
//   type: varchar('type', { length: 16 }).notNull(),
//   size: integer('size').notNull(),
//   categoryId: uuid('category_id').references( () => categories.id)
// })

import z from "zod";

export const Configurations = z.array(z.object({
  id:z.uuid(),
  modelNumber:z.string(),
  signature:z.array(z.string())
}))

export const Assets = z.array(z.object({
  id: z.uuid(),
  // hash: z.string(),
  // storageKey: z.string(),
  // mime: z.string(),
  // type:  z.string(),
  // size: z.int(),
  category: z.string()
}))

export type Configurations = z.infer<typeof Configurations>
export type Assets = z.infer<typeof Assets>