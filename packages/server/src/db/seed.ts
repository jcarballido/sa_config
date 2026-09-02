import { client,db } from './db.js'
import { categories } from './schemas/categories.js'

const seed = async() => {
  await db.insert(categories).values([{
    name: "Body"
  }])
}

await seed()
console.log("Table seeded.")
await client.end()