import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
  connectionString
    ? { connectionString }
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER || "gis_user",
        password: process.env.DB_PASSWORD || "gis_password",
        database: process.env.DB_DATABASE || "gis_db",
      }
);

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error", err);
});

export const query = (text, params) => pool.query(text, params);

export default pool;
