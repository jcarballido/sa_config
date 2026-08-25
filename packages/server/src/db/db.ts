// import 'dotenv/config'
// import { drizzle } from 'drizzle-orm/postgres-js'
// import postgres from 'postgres'

// const connectionString = process.env.DATABASE_URL

// if (!connectionString) {
//   console.error('DATABASE_URL is not set. Copy packages/server/.env.example to .env and fill it in.')
//   process.exit(1)
// }

// const client = postgres(connectionString)

// export const db = drizzle(client)

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env' }); // or .env.local

const client = postgres(process.env.DATABASE_URL!,  { prepare: false });
export const db = drizzle({ client });

