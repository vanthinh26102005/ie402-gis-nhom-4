import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Pool } from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(projectRoot, ".env"), quiet: true });

const sqlFileArg = process.argv[2];

if (!sqlFileArg) {
  console.error("Usage: node db/scripts/run-sql.js <path-to-sql-file>");
  process.exit(1);
}

const sqlFilePath = path.resolve(projectRoot, sqlFileArg);

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER || "gis_user",
        password: process.env.DB_PASSWORD || "gis_password",
        database: process.env.DB_DATABASE || "gis_db",
      }
);

try {
  const sql = await fs.readFile(sqlFilePath, "utf8");

  if (!sql.trim()) {
    throw new Error(`SQL file is empty: ${sqlFilePath}`);
  }

  console.log(`Applying ${path.relative(projectRoot, sqlFilePath)}...`);
  await pool.query(sql);
  console.log("Done.");
} catch (error) {
  console.error("Failed to apply SQL file.");
  console.error(error.stack || error.message || error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
