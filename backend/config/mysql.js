import mysql from 'mysql2/promise';

// Railway automatically injects environment variables
// No need for dotenv in production
const pool = mysql.createPool({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'railway',
    port: parseInt(process.env.MYSQLPORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function connectDB() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Railway MySQL Connected Successfully!');
        console.log(`📊 Connected to database: ${process.env.MYSQL_DATABASE}`);
        connection.release();
    } catch (error) {
        console.error('❌ MySQL Connection Failed:', error.message);
        console.error('🔍 Check Railway MySQL environment variables');
    }
}

export { pool, connectDB };