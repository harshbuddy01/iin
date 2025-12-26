import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function connectDB() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Railway MySQL Connected Successfully!');
        connection.release();
    } catch (error) {
        console.error('❌ MySQL Connection Failed:', error.message);
    }
}

export { pool, connectDB };