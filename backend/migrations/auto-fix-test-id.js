/**
 * AUTO-MIGRATION: Fix test_id column from INT to VARCHAR
 * This runs automatically when server starts
 * Date: 2025-12-28
 */

import { pool } from '../config/mysql.js';

export async function fixTestIdColumn() {
    try {
        console.log('\n🔧 Checking if test_id column needs migration...');
        
        // Check current column type
        const [columns] = await pool.query(`
            SELECT COLUMN_TYPE, DATA_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'questions' 
                AND COLUMN_NAME = 'test_id'
                AND TABLE_SCHEMA = DATABASE()
        `);
        
        if (columns.length === 0) {
            console.log('⚠️ test_id column not found in questions table');
            return;
        }
        
        const currentType = columns[0].DATA_TYPE;
        console.log(`📊 Current test_id type: ${currentType}`);
        
        // If it's not varchar, fix it
        if (currentType !== 'varchar' && currentType !== 'text') {
            console.log('🔨 Migrating test_id from INT to VARCHAR(50)...');
            
            await pool.query(`
                ALTER TABLE questions 
                MODIFY COLUMN test_id VARCHAR(50) NOT NULL
            `);
            
            console.log('✅ Migration successful! test_id is now VARCHAR(50)');
            console.log('✅ You can now use test IDs like: NEST_2026_01, IAT_2026_01, ISI_2026_01');
            
            // Add index for better performance
            try {
                await pool.query(`
                    ALTER TABLE questions 
                    ADD INDEX idx_test_id (test_id)
                `);
                console.log('✅ Added index on test_id for better performance');
            } catch (indexError) {
                if (indexError.code === 'ER_DUP_KEYNAME') {
                    console.log('ℹ️ Index already exists (OK)');
                } else {
                    console.log('⚠️ Could not add index:', indexError.message);
                }
            }
        } else {
            console.log('✅ test_id column is already VARCHAR - no migration needed');
        }
        
    } catch (error) {
        console.error('❌ Migration error:', error.message);
        console.error('💡 This is not critical - server will continue to run');
        console.error('💡 But you won\'t be able to use text-based test IDs until this is fixed');
    }
}
