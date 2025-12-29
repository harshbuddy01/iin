import express from 'express';
import { pool } from '../config/mysql.js';
import { QuestionService } from '../services/QuestionService.js';

const router = express.Router();

// Initialize OOP service
const questionService = new QuestionService();

// =============================================================================
// OLD ROUTES (Keep working during migration)
// =============================================================================

// GET all questions with better error handling (OLD - WORKING)
router.get('/questions', async (req, res) => {
    try {
        console.log('🔍 [QUESTIONS-OLD] Fetching questions from database...');
        
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
        
        console.log(`📊 [QUESTIONS-OLD] Found ${rows.length} questions`);
        
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
        
        console.log(`✅ [QUESTIONS-OLD] Returning ${questions.length} questions`);
        res.json({ questions });
        
    } catch (error) {
        console.error('❌ [QUESTIONS-OLD] Error fetching questions:', error);
        res.status(500).json({
            questions: [],
            error: error.message,
            message: 'Failed to fetch questions. Please check server logs.'
        });
    }
});

// POST new question (OLD - WORKING)
router.post('/questions', async (req, res) => {
    try {
        console.log('➕ [QUESTIONS-OLD] Adding new question:', req.body);
        
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
        
        console.log(`✅ [QUESTIONS-OLD] Question added with ID: ${result.insertId}`);
        
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
        console.error('❌ [QUESTIONS-OLD] Error adding question:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT update question (OLD - WORKING)
router.put('/questions/:id', async (req, res) => {
    try {
        console.log(`✏️ [QUESTIONS-OLD] Updating question ${req.params.id}`);
        
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
        
        console.log(`✅ [QUESTIONS-OLD] Question ${req.params.id} updated`);
        
        res.json({
            question: {
                id: parseInt(req.params.id),
                ...req.body
            }
        });
        
    } catch (error) {
        console.error(`❌ [QUESTIONS-OLD] Error updating question ${req.params.id}:`, error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE question (OLD - WORKING)
router.delete('/questions/:id', async (req, res) => {
    try {
        console.log(`🗑️ [QUESTIONS-OLD] Deleting question ${req.params.id}`);
        
        await pool.query('DELETE FROM questions WHERE id=?', [req.params.id]);
        
        console.log(`✅ [QUESTIONS-OLD] Question ${req.params.id} deleted`);
        
        res.json({ message: 'Question deleted successfully' });
        
    } catch (error) {
        console.error(`❌ [QUESTIONS-OLD] Error deleting question ${req.params.id}:`, error);
        res.status(500).json({ error: error.message });
    }
});

// =============================================================================
// NEW OOP ROUTES (For testing and gradual migration)
// =============================================================================

// GET all questions with OOP (NEW - TESTING)
router.get('/questions-v2', async (req, res) => {
    try {
        console.log('🆕 [QUESTIONS-OOP] Fetching questions with OOP service...');
        
        const filters = {
            section: req.query.subject || req.query.section,
            difficulty: req.query.difficulty,
            search: req.query.search,
            limit: parseInt(req.query.limit) || 100,
            offset: parseInt(req.query.offset) || 0
        };
        
        const result = await questionService.getAllQuestions(filters);
        
        console.log(`✅ [QUESTIONS-OOP] Returning ${result.count} questions`);
        res.json(result);
        
    } catch (error) {
        console.error('❌ [QUESTIONS-OOP] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            questions: []
        });
    }
});

// GET single question by ID (NEW - OOP)
router.get('/questions-v2/:id', async (req, res) => {
    try {
        console.log(`🆕 [QUESTIONS-OOP] Fetching question ${req.params.id}`);
        
        const result = await questionService.getQuestionById(req.params.id);
        
        console.log(`✅ [QUESTIONS-OOP] Found question ${req.params.id}`);
        res.json(result);
        
    } catch (error) {
        console.error(`❌ [QUESTIONS-OOP] Error:`, error);
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
});

// POST new question with OOP (NEW - TESTING)
router.post('/questions-v2', async (req, res) => {
    try {
        console.log('🆕 [QUESTIONS-OOP] Creating question with OOP service');
        
        const result = await questionService.createQuestion(req.body);
        
        console.log(`✅ [QUESTIONS-OOP] Question created: ${result.question.id}`);
        res.status(201).json(result);
        
    } catch (error) {
        console.error('❌ [QUESTIONS-OOP] Error:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// PUT update question with OOP (NEW - TESTING)
router.put('/questions-v2/:id', async (req, res) => {
    try {
        console.log(`🆕 [QUESTIONS-OOP] Updating question ${req.params.id}`);
        
        const result = await questionService.updateQuestion(req.params.id, req.body);
        
        console.log(`✅ [QUESTIONS-OOP] Question updated: ${req.params.id}`);
        res.json(result);
        
    } catch (error) {
        console.error(`❌ [QUESTIONS-OOP] Error:`, error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// DELETE question with OOP (NEW - TESTING)
router.delete('/questions-v2/:id', async (req, res) => {
    try {
        console.log(`🆕 [QUESTIONS-OOP] Deleting question ${req.params.id}`);
        
        const result = await questionService.deleteQuestion(req.params.id);
        
        console.log(`✅ [QUESTIONS-OOP] Question deleted: ${req.params.id}`);
        res.json(result);
        
    } catch (error) {
        console.error(`❌ [QUESTIONS-OOP] Error:`, error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET questions by test ID (NEW - OOP)
router.get('/questions-v2/test/:testId', async (req, res) => {
    try {
        console.log(`🆕 [QUESTIONS-OOP] Fetching questions for test ${req.params.testId}`);
        
        const result = await questionService.getQuestionsByTestId(req.params.testId);
        
        console.log(`✅ [QUESTIONS-OOP] Found ${result.count} questions for test`);
        res.json(result);
        
    } catch (error) {
        console.error('❌ [QUESTIONS-OOP] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET question statistics (NEW - OOP ONLY)
router.get('/questions-v2/stats/all', async (req, res) => {
    try {
        console.log('🆕 [QUESTIONS-OOP] Getting statistics');
        
        const result = await questionService.getStatistics();
        
        console.log('✅ [QUESTIONS-OOP] Statistics calculated');
        res.json(result);
        
    } catch (error) {
        console.error('❌ [QUESTIONS-OOP] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST bulk import questions (NEW - OOP ONLY)
router.post('/questions-v2/bulk', async (req, res) => {
    try {
        console.log(`🆕 [QUESTIONS-OOP] Bulk importing ${req.body.questions?.length || 0} questions`);
        
        if (!req.body.questions || !Array.isArray(req.body.questions)) {
            return res.status(400).json({
                success: false,
                error: 'questions array is required'
            });
        }
        
        const result = await questionService.bulkImportQuestions(req.body.questions);
        
        console.log(`✅ [QUESTIONS-OOP] Bulk import completed`);
        res.json(result);
        
    } catch (error) {
        console.error('❌ [QUESTIONS-OOP] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
