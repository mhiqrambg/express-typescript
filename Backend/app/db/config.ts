// app/db/config.ts
import 'dotenv/config';
import { Pool, PoolConfig } from 'pg';

// Load the appropriate .env file based on NODE_ENV
const isTestEnvironment = process.env.NODE_ENV === 'test';

// Configure database connection based on environment
const dbConfig: PoolConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Log which environment we're using
console.log(`Using ${isTestEnvironment ? 'test' : 'development'} database configuration`);
console.log(`Database: ${dbConfig.database}`);

// Create and export the database pool
const pool = new Pool(dbConfig);

export default pool;