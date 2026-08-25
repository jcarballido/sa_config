/// <reference types="node" />
import "dotenv/config"
import { defineConfig } from 'drizzle-kit'

const connectionString = process.env.DATABASE_URL
console.log("CONNECTION STRING: ", connectionString)
if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.')
}
// console.log("DB: ", process.env.DB_HOST)
// console.log("DB: ", process.env.DB_PORT)
// console.log("DB: ", process.env.DB_PASSWORD)
// console.log("DB: ", process.env.DB_NAME)

export default defineConfig({
  schema: './src/db/schemas',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString
  },
  schemaFilter:['public']
})
