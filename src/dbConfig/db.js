import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // โหลดค่าจาก .env

// --- PostgreSQL pool ---
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;