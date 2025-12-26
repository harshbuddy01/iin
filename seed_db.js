import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

async function seedDatabase() {
    try {
        const connection = await mysql.createConnection(DATABASE_URL);
        console.log("🔌 Connected to Railway...");

        // 1. Insert a Test Exam
        const [result] = await connection.query(`
            INSERT INTO tests (
                title, 
                series_name, 
                window_open_time, 
                window_close_time, 
                result_release_time, 
                duration_minutes, 
                total_questions
            ) VALUES (
                'JEE Mock Test - Trial Run',
                'iat',
                NOW(),                       
                NOW() + INTERVAL 4 HOUR,     
                NOW() + INTERVAL 1 DAY,      
                180,
                60
            )
        `);
        
        const testId = result.insertId;
        console.log(`✅ Test Created! ID: ${testId}`);

        // 2. Insert a Sample Question
        await connection.query(`
            INSERT INTO questions (
                test_id,
                section,
                question_number,
                question_text,
                options,
                correct_answer,
                marks,
                negative_marks
            ) VALUES (
                ?, 
                'Physics', 
                1, 
                'What is the unit of Force?', 
                '["Newton", "Joule", "Watt", "Pascal"]', 
                0, 
                4, 
                -1
            )
        `, [testId]);

        console.log("✅ Sample Question Added!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

seedDatabase();
