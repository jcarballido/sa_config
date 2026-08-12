import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.js'

// const connectionString = process.env.DATABASE_URL
// if (!connectionString) {
//   console.error('DATABASE_URL is not set. Copy packages/server/.env.example to .env and fill it in.')
//   process.exit(1)
// }

// const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined

// const pool = new Pool({ connectionString, ssl })

// export const db = drizzle(pool, { schema })
