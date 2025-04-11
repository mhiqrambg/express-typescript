import { Pool } from 'pg';
import 'dotenv/config';

async function setupTestDatabase() {
  // Create a connection to PostgreSQL
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin123',
    database: 'postgres' // Connect to default postgres database first
  });

  try {
    // Connect to PostgreSQL
    const client = await pool.connect();
    
    try {
      // Check if test_database exists
      const dbCheckResult = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = 'test_database'"
      );
      
      // If test_database doesn't exist, create it
      if (dbCheckResult.rowCount === 0) {
        console.log('Creating test_database...');
        // Disconnect all active connections to the database if it exists
        await client.query(
          "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'test_database' AND pid <> pg_backend_pid()"
        );
        // Create the database
        await client.query('CREATE DATABASE test_database');
        console.log('test_database created successfully');
      } else {
        console.log('test_database already exists');
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the setup function
setupTestDatabase();