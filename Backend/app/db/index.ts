// app/db/index.ts
import 'dotenv/config'
import { Pool } from 'pg'
import pool from './config' // Import pool from config.ts

// Simple function to check database connection status
export async function checkDatabaseConnection() {
    let client;
    try {
        client = await pool.connect();
        console.log('Connected to PostgreSQL database');
        
        // Simple connection test query
        await client.query('SELECT 1');
        console.log('Database query executed successfully');
        return true;
    } catch (err) {
        const error = err as Error;
        console.log('Database tidak terhubung', error.message)
        return false;
    } finally {
        if (client) client.release();
    }
}

// Export the pool for use in other parts of the application
export default pool;
