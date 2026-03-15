import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

export default client;
