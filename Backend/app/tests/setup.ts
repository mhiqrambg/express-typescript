// app/tests/setup.ts
import 'dotenv/config';
import { Pool } from 'pg';

// This file runs before tests to set up the test environment

// Force NODE_ENV to be 'test' during testing
process.env.NODE_ENV = 'test';

// Ensure we're using test database configuration
if (!process.env.DB_NAME || process.env.DB_NAME !== 'test_database') {
  console.log('Setting test database environment variables');
  process.env.DB_HOST = process.env.DB_HOST || 'localhost';
  process.env.DB_PORT = process.env.DB_PORT || '5432';
  process.env.DB_USER = process.env.DB_USER || 'admin';
  process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'admin123';
  process.env.DB_NAME = 'test_database';
}

// Function to reset the test database between tests if needed
export async function resetTestDatabase() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const client = await pool.connect();
    try {
      // Truncate all tables or perform other cleanup
      // This is just an example - adjust based on your schema
      await client.query('BEGIN');
      // Add truncate statements for your tables here
      // Example: await client.query('TRUNCATE users CASCADE');
      await client.query('COMMIT');
      console.log('Test database reset complete');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error resetting test database:', error);
      throw error;
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}