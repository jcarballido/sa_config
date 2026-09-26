import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  console.log("Starting migration...");

  try {
    await migrate(db, {
      migrationsFolder: "./drizzle",
    });

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("\n\n===== MIGRATION ERROR =====");
    console.error(error);
    console.error("===========================\n");

    process.exitCode = 1;
  }
}

main();