import pg from "pg";
const { Pool } = pg;
const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } = process.env;

const pool = new Pool({
  host: "localhost",
  database: "disease_db",
  user: "postgres",
  password: "NourhanAdel",
});

export default pool;
