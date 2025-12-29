/**
 * Question Repository
 * Created: Dec 29, 2025
 * Purpose: Handle all database operations for questions
 * 
 * REPOSITORY PATTERN BENEFITS:
 * - Separates business logic from database logic
 * - Easy to test (can mock database)
 * - Easy to switch databases (just change repository)
 * - Reusable query methods
 */

import { db } from '../config/DatabaseConnection.js';
import { Question } from '../models/Question.js';

export class QuestionRepository {
    constructor() {
        this.tableName = 'questions';
    }
    
    /**
     * Find all questions with optional filters
     */
    async findAll(filters = {}) {
        try {
            let query = `SELECT * FROM ${this.tableName} WHERE 1=1`;
            const params = [];
            
            // Filter by section (subject)
            if (filters.section || filters.subject) {
                query += ' AND section = ?';
                params.push(filters.section || filters.subject);
            }
            
            // Filter by difficulty (if column exists)
            if (filters.difficulty) {
                query += ' AND difficulty = ?';
                params.push(filters.difficulty);
            }
            
            // Filter by test ID
            if (filters.testId || filters.test_id) {
                query += ' AND test_id = ?';
                params.push(filters.testId || filters.test_id);
            }
            
            // Search in question text
            if (filters.search) {
                query += ' AND (question_text LIKE ? OR test_id LIKE ?)';
                params.push(`%${filters.search}%`, `%${filters.search}%`);
            }
            
            // Ordering
            const orderBy = filters.orderBy || 'id';
            const order = filters.order || 'DESC';
            query += ` ORDER BY ${orderBy} ${order}`;
            
            // Pagination
            const limit = parseInt(filters.limit) || 100;
            const offset = parseInt(filters.offset) || 0;
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
            
            const rows = await db.query(query, params);
            return Question.fromDatabaseRows(rows);
            
        } catch (error) {
            console.error('❌ QuestionRepository.findAll error:', error);
            throw new Error(`Failed to fetch questions: ${error.message}`);
        }
    }
    
    /**
     * Find question by ID
     */
    async findById(id) {
        try {
            const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
            const rows = await db.query(query, [id]);
            
            if (rows.length === 0) {
                return null;
            }
            
            return Question.fromDatabase(rows[0]);
            
        } catch (error) {
            console.error(`❌ QuestionRepository.findById(${id}) error:`, error);
            throw new Error(`Failed to fetch question: ${error.message}`);
        }
    }
    
    /**
     * Find questions by test ID
     */
    async findByTestId(testId) {
        try {
            const query = `SELECT * FROM ${this.tableName} WHERE test_id = ? ORDER BY question_number ASC`;
            const rows = await db.query(query, [testId]);
            return Question.fromDatabaseRows(rows);
            
        } catch (error) {
            console.error(`❌ QuestionRepository.findByTestId(${testId}) error:`, error);
            throw new Error(`Failed to fetch questions for test: ${error.message}`);
        }
    }
    
    /**
     * Count questions (useful for pagination)
     */
    async count(filters = {}) {
        try {
            let query = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE 1=1`;
            const params = [];
            
            if (filters.section || filters.subject) {
                query += ' AND section = ?';
                params.push(filters.section || filters.subject);
            }
            
            if (filters.difficulty) {
                query += ' AND difficulty = ?';
                params.push(filters.difficulty);
            }
            
            if (filters.testId) {
                query += ' AND test_id = ?';
                params.push(filters.testId);
            }
            
            const rows = await db.query(query, params);
            return rows[0].total;
            
        } catch (error) {
            console.error('❌ QuestionRepository.count error:', error);
            throw new Error(`Failed to count questions: ${error.message}`);
        }
    }
    
    /**
     * Create new question
     */
    async create(question) {
        try {
            const data = question.toDatabaseFormat();
            
            const query = `
                INSERT INTO ${this.tableName} 
                (test_id, question_number, question_text, options, correct_answer, section, topic, difficulty, marks_positive, marks_negative, type) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const params = [
                data.test_id,
                data.question_number,
                data.question_text,
                data.options, // Already JSON.stringify() in model
                data.correct_answer,
                data.section,
                data.topic,
                data.difficulty,
                data.marks_positive,
                data.marks_negative,
                data.type
            ];
            
            const result = await db.query(query, params);
            question.id = result.insertId;
            
            console.log(`✅ Question created with ID: ${question.id}`);
            return question;
            
        } catch (error) {
            console.error('❌ QuestionRepository.create error:', error);
            throw new Error(`Failed to create question: ${error.message}`);
        }
    }
    
    /**
     * Update existing question
     */
    async update(id, question) {
        try {
            const data = question.toDatabaseFormat();
            
            const query = `
                UPDATE ${this.tableName} 
                SET 
                    question_text = ?,
                    options = ?,
                    correct_answer = ?,
                    section = ?,
                    topic = ?,
                    difficulty = ?,
                    marks_positive = ?,
                    marks_negative = ?,
                    type = ?
                WHERE id = ?
            `;
            
            const params = [
                data.question_text,
                data.options,
                data.correct_answer,
                data.section,
                data.topic,
                data.difficulty,
                data.marks_positive,
                data.marks_negative,
                data.type,
                id
            ];
            
            await db.query(query, params);
            console.log(`✅ Question ${id} updated`);
            
            return question;
            
        } catch (error) {
            console.error(`❌ QuestionRepository.update(${id}) error:`, error);
            throw new Error(`Failed to update question: ${error.message}`);
        }
    }
    
    /**
     * Delete question
     */
    async delete(id) {
        try {
            const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
            await db.query(query, [id]);
            console.log(`✅ Question ${id} deleted`);
            return true;
            
        } catch (error) {
            console.error(`❌ QuestionRepository.delete(${id}) error:`, error);
            throw new Error(`Failed to delete question: ${error.message}`);
        }
    }
    
    /**
     * Get next question number for a test
     */
    async getNextQuestionNumber(testId) {
        try {
            const query = `SELECT MAX(question_number) as max_num FROM ${this.tableName} WHERE test_id = ?`;
            const rows = await db.query(query, [testId]);
            return (rows[0]?.max_num || 0) + 1;
            
        } catch (error) {
            console.error(`❌ QuestionRepository.getNextQuestionNumber(${testId}) error:`, error);
            throw new Error(`Failed to get next question number: ${error.message}`);
        }
    }
    
    /**
     * Check if a column exists in the table
     */
    async columnExists(columnName) {
        try {
            const query = `
                SELECT COUNT(*) as count 
                FROM information_schema.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = ? 
                AND COLUMN_NAME = ?
            `;
            const rows = await db.query(query, [this.tableName, columnName]);
            return rows[0].count > 0;
        } catch (error) {
            console.warn(`⚠️ Could not check if column ${columnName} exists:`, error.message);
            return false;
        }
    }
    
    /**
     * Get statistics about questions
     * Gracefully handles missing columns (difficulty, topic)
     */
    async getStatistics() {
        try {
            // Check if difficulty column exists
            const hasDifficulty = await this.columnExists('difficulty');
            const hasTopic = await this.columnExists('topic');
            
            console.log(`📊 Statistics: difficulty=${hasDifficulty}, topic=${hasTopic}`);
            
            // Total questions
            const totalQuery = `SELECT COUNT(*) as total FROM ${this.tableName}`;
            const totalRows = await db.query(totalQuery);
            
            // By section (always exists)
            const sectionQuery = `
                SELECT section, COUNT(*) as count 
                FROM ${this.tableName} 
                GROUP BY section
            `;
            const sectionRows = await db.query(sectionQuery);
            
            const statistics = {
                total: totalRows[0].total,
                bySection: sectionRows.reduce((acc, row) => {
                    acc[row.section || 'Unknown'] = row.count;
                    return acc;
                }, {})
            };
            
            // By difficulty (only if column exists)
            if (hasDifficulty) {
                const difficultyQuery = `
                    SELECT difficulty, COUNT(*) as count 
                    FROM ${this.tableName} 
                    WHERE difficulty IS NOT NULL
                    GROUP BY difficulty
                `;
                const difficultyRows = await db.query(difficultyQuery);
                
                statistics.byDifficulty = difficultyRows.reduce((acc, row) => {
                    acc[row.difficulty || 'Unknown'] = row.count;
                    return acc;
                }, {});
            } else {
                console.log('⚠️ Difficulty column not found - skipping difficulty statistics');
                statistics.byDifficulty = {
                    note: 'Difficulty column not yet added to database'
                };
            }
            
            // By test
            const testQuery = `
                SELECT test_id, COUNT(*) as count 
                FROM ${this.tableName} 
                GROUP BY test_id 
                ORDER BY count DESC 
                LIMIT 10
            `;
            const testRows = await db.query(testQuery);
            
            statistics.topTests = testRows.map(row => ({
                testId: row.test_id,
                questionCount: row.count
            }));
            
            return statistics;
            
        } catch (error) {
            console.error('❌ QuestionRepository.getStatistics error:', error);
            throw new Error(`Failed to get statistics: ${error.message}`);
        }
    }
    
    /**
     * Bulk insert questions (useful for importing)
     */
    async bulkCreate(questions) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            const insertedQuestions = [];
            for (const question of questions) {
                const data = question.toDatabaseFormat();
                
                const query = `
                    INSERT INTO ${this.tableName} 
                    (test_id, question_number, question_text, options, correct_answer, section, topic, difficulty, marks_positive, marks_negative, type) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                
                const [result] = await connection.query(query, [
                    data.test_id,
                    data.question_number,
                    data.question_text,
                    data.options,
                    data.correct_answer,
                    data.section,
                    data.topic,
                    data.difficulty,
                    data.marks_positive,
                    data.marks_negative,
                    data.type
                ]);
                
                question.id = result.insertId;
                insertedQuestions.push(question);
            }
            
            await connection.commit();
            console.log(`✅ Bulk created ${insertedQuestions.length} questions`);
            return insertedQuestions;
            
        } catch (error) {
            await connection.rollback();
            console.error('❌ QuestionRepository.bulkCreate error:', error);
            throw new Error(`Failed to bulk create questions: ${error.message}`);
        } finally {
            connection.release();
        }
    }
}

export default QuestionRepository;
