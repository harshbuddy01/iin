/**
 * CLEANUP ROUTE
 * Provides admin endpoint to cleanup corrupted questions
 * Access: GET /api/admin/cleanup-questions
 * Date: 2025-12-29
 */

import express from 'express';
import { pool } from '../config/mysql.js';

const router = express.Router();

// Cleanup corrupted questions endpoint
router.get('/cleanup-questions', async (req, res) => {
    try {
        console.log('🧹 [CLEANUP] Starting questions cleanup...');
        
        // Count total before cleanup
        const [beforeCount] = await pool.query('SELECT COUNT(*) as count FROM questions');
        const before = beforeCount[0]?.count || 0;
        console.log(`📊 [CLEANUP] Questions before cleanup: ${before}`);
        
        // Delete questions with invalid test_id
        const [deleted1] = await pool.query(`
            DELETE FROM questions 
            WHERE test_id IS NULL 
               OR test_id = '' 
               OR test_id = '0'
               OR (CAST(test_id AS CHAR) REGEXP '^[0-9]+$' AND CAST(test_id AS UNSIGNED) < 1000)
        `);
        console.log(`🗑️ [CLEANUP] Deleted ${deleted1.affectedRows} questions with invalid test_id`);
        
        // Delete questions with NULL or empty correct_answer
        const [deleted2] = await pool.query(`
            DELETE FROM questions 
            WHERE correct_answer IS NULL 
               OR correct_answer = ''
        `);
        console.log(`🗑️ [CLEANUP] Deleted ${deleted2.affectedRows} questions with empty answers`);
        
        // Delete questions with NULL or invalid options
        const [deleted3] = await pool.query(`
            DELETE FROM questions 
            WHERE options IS NULL 
               OR options = '' 
               OR options = '[]'
        `);
        console.log(`🗑️ [CLEANUP] Deleted ${deleted3.affectedRows} questions with empty options`);
        
        // Count remaining questions
        const [afterCount] = await pool.query('SELECT COUNT(*) as count FROM questions');
        const after = afterCount[0]?.count || 0;
        console.log(`📊 [CLEANUP] Questions after cleanup: ${after}`);
        
        // Get remaining questions for verification
        const [remaining] = await pool.query(
            'SELECT id, test_id, section, correct_answer FROM questions ORDER BY id DESC LIMIT 10'
        );
        
        const summary = {
            success: true,
            message: 'Cleanup completed successfully',
            stats: {
                before,
                after,
                deleted: before - after,
                deletedByInvalidTestId: deleted1.affectedRows,
                deletedByEmptyAnswer: deleted2.affectedRows,
                deletedByEmptyOptions: deleted3.affectedRows
            },
            remainingQuestions: remaining
        };
        
        console.log('✅ [CLEANUP] Cleanup completed!');
        console.log('📋 [CLEANUP] Summary:', summary);
        
        res.json(summary);
        
    } catch (error) {
        console.error('❌ [CLEANUP] Error during cleanup:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Cleanup failed. Please check server logs.'
        });
    }
});

// Optional: Delete ALL questions (use with caution!)
router.delete('/cleanup-questions/all', async (req, res) => {
    try {
        console.log('⚠️ [CLEANUP] Deleting ALL questions...');
        
        const [result] = await pool.query('DELETE FROM questions');
        console.log(`🗑️ [CLEANUP] Deleted ${result.affectedRows} questions`);
        
        res.json({
            success: true,
            message: 'All questions deleted successfully',
            deletedCount: result.affectedRows
        });
        
    } catch (error) {
        console.error('❌ [CLEANUP] Error deleting all questions:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
