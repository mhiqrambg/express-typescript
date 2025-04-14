import 'dotenv/config';
import { Pool } from 'pg';
import {DatabaseError} from '../errors/index';

let pool: Pool;

if (process.env.NODE_ENV === 'test') {
  console.log("Using 'test' database configuration");
  pool = new Pool({
    host: process.env.TEST_DB_HOST,
    port: parseInt(process.env.TEST_DB_PORT || '5432', 10),
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
  });
} else {
  console.log("Using 'development' database configuration");
  pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

// Buat objek `db` untuk mengelola koneksi database
export const db = {
    connect: async (): Promise<void> => {
      try {
        const client = await pool.connect();
        client.release();
        console.log('Connected to the database');
      } catch (error) {
        console.error('Error connecting to the database:', error);
        throw new DatabaseError('Failed to connect to the database');
      }
    },
    query: (text: string, params?: any[]): Promise<any> => {
      return pool.query(text, params);
    },
  
    clearDatabase: async (): Promise<void> => {
      if (process.env.NODE_ENV === 'test') {
        try {
          await pool.query('DELETE FROM users');
          console.log('Database cleared');
        } catch (error) {
          console.error('Error clearing database:', error);
          throw new DatabaseError('Failed to clear database');
        }
      }
    },
  
    closeConnection: async (): Promise<void> => {
        try {
          await pool.end();
          console.log('Database connection closed');
        } catch (error) {
          console.error('Error closing database connection:', error);
        }
      },
      
};
