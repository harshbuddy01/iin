import express from 'express';
import { pool } from '../config/mysql.js';
import { QuestionService } from '../services/QuestionService.js';

const router = express.Router();

// Initialize OOP service
const questionService = new QuestionService();

// =============================================================================
// 🎯 NEW UNIFIED API - ADMIN TO STUDENT FLOW
// =============================================================================

/**
 * POST /api/admin/questions
 * 
 * Admin uploads question → Backend saves to MySQL → Student fetches
 * 
 * Expected payload:
 * {
 *   testId: "IISER_2025" | "ISI_2025_A" | "NEST_2025",
 *   examType: "IISER" | "ISI" | "NEST",
 *   year: "2025",
 *   paperType: "A" | "B" | null,
 *   questionNumber: 1,
 *   questionText: "Question text here...",
 *   options: ["Option A", "Option B", "Option C", "Option D"],
 *   correctAnswer: "A" | "B" | "C" | "D",
 *   section: "Physics" | "Chemistry" | "Mathematics" | "Biology",
 *   marks: 4,
 *   difficulty: "Easy" | "Medium" | "Hard",
 *   topic: "Mechanics" (optional),
 *   explanation: "Solution explanation" (optional)
 * }
 */
router.post('/questions', async (req, res) => {
    try {
        console.log('📥 [ADMIN] Receiving new question...');
        console.log('📦 Payload:', JSON.stringify(req.body, null, 2));
        
        const {
            testId,
            examType,
            year,
            paperType,
            questionNumber,
            questionText,
            options,
            correctAnswer,
            section,
            marks,
            difficulty,
            topic,
            explanation
        } = req.body;
        
        // ===== VALIDATION =====
        if (!testId || !examType || !year) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: testId, examType, year'
            });
        }
        
        if (!questionNumber || !questionText || !section) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: questionNumber, questionText, section'
            });
        }
        
        if (!Array.isArray(options) || options.length !== 4) {
            return res.status(400).json({
                success: false,
                error: 'Options must be an array of exactly 4 items'
            });
        }
        
        if (!correctAnswer || !['A', 'B', 'C', 'D'].includes(correctAnswer)) {
            return res.status(400).json({
                success: false,
                error: 'correctAnswer must be A, B, C, or D'
            });
        }
        
        // Validate exam type
        if (!['IISER', 'ISI', 'NEST'].includes(examType)) {
            return res.status(400).json({
                success: false,
                error: 'examType must be IISER, ISI, or NEST'
            });
        }
        
        // For ISI, paperType is required
        if (examType === 'ISI' && !paperType) {
            return res.status(400).json({
                success: false,
                error: 'paperType (A or B) is required for ISI exams'
            });
        }
        
        // Check if question number already exists for this test+section
        const [existingQuestions] = await pool.query(
            'SELECT id FROM questions WHERE test_id = ? AND question_number = ? AND section = ?',
            [testId, questionNumber, section]
        );
        
        if (existingQuestions.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Question number ${questionNumber} already exists for ${testId} - ${section}. Please use a different number or update the existing question.`
            });
        }
        
        // ===== INSERT QUESTION INTO DATABASE =====
        const [result] = await pool.query(
            `INSERT INTO questions (
                test_id, 
                question_number, 
                question_text, 
                options, 
                correct_answer, 
                section, 
                marks_positive,
                marks_negative,
                difficulty,
                topic,
                input_method,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
                testId,
                questionNumber,
                questionText,
                JSON.stringify(options),
                correctAnswer,
                section,
                marks || 4,
                -1, // Default negative marking
                difficulty || 'Medium',
                topic || null,
                'manual'
            ]
        );
        
        console.log(`✅ [ADMIN] Question added with ID: ${result.insertId}`);
        console.log(`📊 Test ID: ${testId}`);
        console.log(`📝 Question Number: ${questionNumber}`);
        console.log(`📚 Subject: ${section}`);
        
        // Return success response
        res.status(201).json({
            success: true,
            message: 'Question added successfully',
            question: {
                id: result.insertId,
                testId,
                examType,
                year,
                paperType,
                questionNumber,
                section,
                marks: marks || 4,
                difficulty: difficulty || 'Medium',
                topic
            }
        });
        
    } catch (error) {
        console.error('❌ [ADMIN] Error adding question:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            details: 'Failed to add question. Please check server logs.'
        });
    }
});

// =============================================================================
// 🎓 STUDENT-FACING API - GET QUESTIONS BY TEST ID
// =============================================================================

/**
 * GET /api/exam/questions?testId=IISER_2025
 * 
 * Student selects exam → Fetches questions for that testId
 * 
 * Used by: exam.html
 */
router.get('/exam/questions', async (req, res) => {
    try {
        const { testId } = req.query;
        
        console.log(`🎓 [STUDENT] Fetching questions for testId: ${testId}`);
        
        if (!testId) {
            return res.status(400).json({
                success: false,
                error: 'testId parameter is required'
            });
        }
        
        // Fetch all questions for this test, ordered by question_number
        const [questions] = await pool.query(
            `SELECT 
                id,
                test_id as testId,
                question_number as questionNumber,
                question_text as questionText,
                options,
                correct_answer as correctAnswer,
                section,
                marks_positive as marks,
                marks_negative as negativeMarks,
                difficulty,
                topic
            FROM questions 
            WHERE test_id = ? 
            ORDER BY question_number ASC`,
            [testId]
        );
        
        if (questions.length === 0) {
            console.log(`⚠️ [STUDENT] No questions found for testId: ${testId}`);
            return res.status(404).json({
                success: false,
                error: `No questions found for test: ${testId}`
            });
        }
        
        // Parse options JSON for each question
        const parsedQuestions = questions.map(q => {
            let options = [];
            try {
                options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
            } catch (e) {
                console.error(`⚠️ Failed to parse options for question ${q.id}:`, e);
                options = [];
            }
            
            return {
                ...q,
                options: options,
                optionA: options[0] || '',
                optionB: options[1] || '',
                optionC: options[2] || '',
                optionD: options[3] || ''
            };
        });
        
        console.log(`✅ [STUDENT] Returning ${parsedQuestions.length} questions for ${testId}`);
        
        res.json({
            success: true,
            testId: testId,
            count: parsedQuestions.length,
            questions: parsedQuestions
        });
        
    } catch (error) {
        console.error('❌ [STUDENT] Error fetching questions:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            questions: []
        });
    }
});

// =============================================================================
// OLD ROUTES (Keep for backward compatibility)
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
            
            try {
                if (q.options) {
                    if (typeof q.options === 'string') {
                        options = JSON.parse(q.options);
                    } else if (Array.isArray(q.options)) {
                        options = q.options;
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
// OOP ROUTES (For testing and gradual migration)
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

export default router;
