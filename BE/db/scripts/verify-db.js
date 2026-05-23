import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Pool } from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(projectRoot, ".env"), quiet: true });

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

const checks = [
  {
    label: "provinces",
    sql: "SELECT COUNT(*)::int AS count FROM provinces",
    validate: (rows) => rows[0].count >= 3,
    expected: "at least 3 rows",
  },
  {
    label: "tourist_destinations",
    sql: "SELECT COUNT(*)::int AS count FROM tourist_destinations",
    validate: (rows) => rows[0].count >= 6,
    expected: "at least 6 rows",
  },
  {
    label: "service_facilities",
    sql: "SELECT COUNT(*)::int AS count FROM service_facilities",
    validate: (rows) => rows[0].count >= 6,
    expected: "at least 6 rows",
  },
  {
    label: "provinces boundary SRID",
    sql: "SELECT DISTINCT ST_SRID(boundary_geom)::int AS srid FROM provinces WHERE boundary_geom IS NOT NULL",
    validate: (rows) => rows.length === 1 && rows[0].srid === 4326,
    expected: "only SRID 4326 for non-null boundaries",
  },
  {
    label: "tourist_destinations SRID",
    sql: "SELECT DISTINCT ST_SRID(location_geom)::int AS srid FROM tourist_destinations",
    validate: (rows) => rows.length === 1 && rows[0].srid === 4326,
    expected: "only SRID 4326",
  },
  {
    label: "service_facilities SRID",
    sql: "SELECT DISTINCT ST_SRID(location_geom)::int AS srid FROM service_facilities",
    validate: (rows) => rows.length === 1 && rows[0].srid === 4326,
    expected: "only SRID 4326",
  },
  {
    label: "weather_info SRID",
    sql: "SELECT DISTINCT ST_SRID(location_geom)::int AS srid FROM weather_info",
    validate: (rows) => rows.length === 1 && rows[0].srid === 4326,
    expected: "only SRID 4326",
  },
  {
    label: "traffic_info SRID",
    sql: "SELECT DISTINCT ST_SRID(location_geom)::int AS srid FROM traffic_info",
    validate: (rows) => rows.length === 1 && rows[0].srid === 4326,
    expected: "only SRID 4326",
  },
];

try {
  const version = await pool.query("SELECT postgis_full_version() AS version");
  console.log("PostGIS is available.");
  console.log(version.rows[0].version);

  let failed = false;

  for (const check of checks) {
    const result = await pool.query(check.sql);
    const ok = check.validate(result.rows);
    const value = JSON.stringify(result.rows);

    if (ok) {
      console.log(`[ok] ${check.label}: ${value}`);
    } else {
      failed = true;
      console.error(`[fail] ${check.label}: expected ${check.expected}, got ${value}`);
    }
  }

  if (failed) {
    process.exitCode = 1;
  } else {
    console.log("Database verification passed.");
  }
} catch (error) {
  console.error("Database verification failed.");
  console.error(error.stack || error.message || error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
