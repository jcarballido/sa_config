import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

// const connectionString = process.env.DATABASE_URL
// if (!connectionString) {
//   throw new Error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.')
// }

// export default defineConfig({
//   schema: './src/schema.ts',
//   out: './drizzle',
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: connectionString,
//     ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
//   },
// })
// :