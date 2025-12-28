import express from 'express';
import { pool } from '../config/mysql.js';

const router = express.Router();

// GET all questions with better error handling
router.get('/questions', async (req, res) => {
    try {
        console.log('🔍 [QUESTIONS] Fetching questions from database...');
        
        const subject = req.query.subject || '';
        const difficulty = req.query.difficulty || '';
        const search = req.query.search || '';
        
        let query = 'SELECT * FROM questions';
        let conditions = [];
        let params = [];
        
        if (subject) {
            conditions.push('section = ?');
            params.push(subject);
        }
        if (difficulty) {
            conditions.push('difficulty = ?');
            params.push(difficulty);
        }
        if (search) {
            conditions.push('(question_text LIKE ? OR test_id LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY id DESC LIMIT 100';
        
        const [rows] = await pool.query(query, params);
        
        console.log(`📊 [QUESTIONS] Found ${rows.length} questions`);
        
        const questions = rows.map((q, index) => {
            let options = [];
            
            // Safe JSON parsing with fallback
            try {
                if (q.options) {
                    if (typeof q.options === 'string') {
                        options = JSON.parse(q.options);
                    } else if (Array.isArray(q.options)) {
                        options = q.options;
                    } else {
                        console.warn(`⚠️ Question ${q.id}: Invalid options format`);
                        options = [];
                    }
                }
            } catch (parseError) {
                console.error(`❌ Question ${q.id}: Failed to parse options:`, parseError.message);
                options = [];
            }
            
            return {
                id: q.id,
                subject: q.section || 'Physics',
                topic: q.topic || 'General',
                difficulty: q.difficulty || 'Medium',
                marks: q.marks_positive || 4,
                question: q.question_text || '',
                type: 'MCQ',
                options: options,
                answer: q.correct_answer || '',
                testId: q.test_id || 'UNKNOWN'
            };
        });
        
        console.log(`✅ [QUESTIONS] Returning ${questions.length} questions`);
        res.json({ questions });
        
    } catch (error) {
        console.error('❌ [QUESTIONS] Error fetching questions:', error);
        res.status(500).json({
            questions: [],
            error: error.message,
            message: 'Failed to fetch questions. Please check server logs.'
        });
    }
});

// POST new question
router.post('/questions', async (req, res) => {
    try {
        console.log('➕ [QUESTIONS] Adding new question:', req.body);
        
        const { testId, questionText, options, correctAnswer, section, marks } = req.body;
        
        // Validate required fields
        if (!testId || !questionText || !correctAnswer || !section) {
            return res.status(400).json({
                error: 'Missing required fields: testId, questionText, correctAnswer, section'
            });
        }
        
        if (!Array.isArray(options) || options.length === 0) {
            return res.status(400).json({
                error: 'Options must be a non-empty array'
            });
        }
        
        // Get next question number for this test
        const [maxQ] = await pool.query(
            'SELECT MAX(question_number) as max_num FROM questions WHERE test_id = ?',
            [testId]
        );
        const questionNumber = (maxQ[0]?.max_num || 0) + 1;
        
        // Insert question
        const [result] = await pool.query(
            `INSERT INTO questions 
             (test_id, question_number, question_text, options, correct_answer, section, marks_positive) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                testId,
                questionNumber,
                questionText,
                JSON.stringify(options),
                correctAnswer,
                section,
                marks || 4
            ]
        );
        
        console.log(`✅ [QUESTIONS] Question added with ID: ${result.insertId}`);
        
        res.status(201).json({
            question: {
                id: result.insertId,
                questionNumber,
                testId,
                questionText,
                options,
                correctAnswer,
                section,
                marks: marks || 4
            }
        });
        
    } catch (error) {
        console.error('❌ [QUESTIONS] Error adding question:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT update question
router.put('/questions/:id', async (req, res) => {
    try {
        console.log(`✏️ [QUESTIONS] Updating question ${req.params.id}`);
        
        const { questionText, options, correctAnswer, section, marks } = req.body;
        
        await pool.query(
            `UPDATE questions 
             SET question_text=?, options=?, correct_answer=?, section=?, marks_positive=? 
             WHERE id=?`,
            [
                questionText,
                JSON.stringify(options),
                correctAnswer,
                section,
                marks,
                req.params.id
            ]
        );
        
        console.log(`✅ [QUESTIONS] Question ${req.params.id} updated`);
        
        res.json({
            question: {
                id: parseInt(req.params.id),
                ...req.body
            }
        });
        
    } catch (error) {
        console.error(`❌ [QUESTIONS] Error updating question ${req.params.id}:`, error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE question
router.delete('/questions/:id', async (req, res) => {
    try {
        console.log(`🗑️ [QUESTIONS] Deleting question ${req.params.id}`);
        
        await pool.query('DELETE FROM questions WHERE id=?', [req.params.id]);
        
        console.log(`✅ [QUESTIONS] Question ${req.params.id} deleted`);
        
        res.json({ message: 'Question deleted successfully' });
        
    } catch (error) {
        console.error(`❌ [QUESTIONS] Error deleting question ${req.params.id}:`, error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
