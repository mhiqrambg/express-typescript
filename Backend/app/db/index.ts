// app/config/db.ts
import 'dotenv/config'
import { Pool } from 'pg'

const pool = new Pool({
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME
})

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
        console.error('Database connection failed:', err);
        return false;
    } finally {
        if (client) client.release();
    }
}

// Export the pool for use in other parts of the application
export default pool;
