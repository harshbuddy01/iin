/**
 * Vercel Serverless Function: /api/admin/questions-fixed
 * Fetches questions from MySQL database with safe JSON parsing
 */

const mysql = require('mysql2/promise');

// MySQL connection pool
let pool;

function getPool() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.MYSQLHOST || 'localhost',
            user: process.env.MYSQLUSER || 'root',
            password: process.env.MYSQLPASSWORD || '',
            database: process.env.MYSQL_DATABASE || 'railway',
            port: parseInt(process.env.MYSQLPORT || '3306'),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return pool;
}

// Safe JSON parsing function
const safeParseJSON = (str) => {
    if (!str) return null;
    try {
        // Handle double-stringified JSON
        let parsed = str;
        while (typeof parsed === 'string') {
            parsed = JSON.parse(parsed);
        }
        return parsed;
    } catch (e) {
        console.warn('Failed to parse JSON:', str);
        return null;
    }
};

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    let connection;
    
    try {
        console.log('📥 Fetching questions from MySQL database...');
        
        const dbPool = getPool();
        connection = await dbPool.getConnection();
        
        const [rows] = await connection.query(
            'SELECT * FROM questions ORDER BY id'
        );
        
        const questions = rows.map(row => {
            return {
                id: row.id,
                subject: row.subject,
                topic: row.topic || '',
                difficulty: row.difficulty,
                marks: row.marks,
                question: row.question_text,
                type: row.question_type || 'MCQ',
                options: safeParseJSON(row.options) || [],
                answer: row.correct_answer,
                created_at: row.created_at
            };
        });
        
        console.log(`✅ Successfully fetched ${questions.length} questions`);
        
        return res.status(200).json({ 
            success: true,
            count: questions.length,
            questions 
        });
        
    } catch (error) {
        console.error('❌ Database error:', error);
        
        return res.status(500).json({ 
            success: false,
            error: 'Failed to fetch questions',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};