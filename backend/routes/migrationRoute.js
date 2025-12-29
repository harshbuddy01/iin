import express from 'express';
import { pool } from '../config/mysql.js';

const router = express.Router();

// One-time migration endpoint to add difficulty and topic columns
router.get('/run-difficulty-migration', async (req, res) => {
  try {
    console.log('🔧 Running difficulty migration...');
    
    const migrations = [
      {
        name: 'Add difficulty column',
        sql: "ALTER TABLE questions ADD COLUMN difficulty VARCHAR(20) DEFAULT 'Medium' AFTER section"
      },
      {
        name: 'Add topic column',
        sql: "ALTER TABLE questions ADD COLUMN topic VARCHAR(100) DEFAULT 'General' AFTER difficulty"
      },
      {
        name: 'Create difficulty index',
        sql: 'CREATE INDEX idx_difficulty ON questions(difficulty)'
      },
      {
        name: 'Create topic index',
        sql: 'CREATE INDEX idx_topic ON questions(topic)'
      },
      {
        name: 'Update existing difficulty values',
        sql: "UPDATE questions SET difficulty = 'Medium' WHERE difficulty IS NULL"
      },
      {
        name: 'Update existing topic values',
        sql: "UPDATE questions SET topic = 'General' WHERE topic IS NULL"
      }
    ];

    const results = [];

    for (const migration of migrations) {
      try {
        await pool.query(migration.sql);
        results.push({
          migration: migration.name,
          status: 'success',
          message: '✅ Executed successfully'
        });
        console.log(`✅ ${migration.name}`);
      } catch (error) {
        // Ignore "already exists" errors
        if (error.message.includes('Duplicate column') || 
            error.message.includes('Duplicate key') ||
            error.message.includes('already exists')) {
          results.push({
            migration: migration.name,
            status: 'skipped',
            message: 'ℹ️ Already exists (skipped)'
          });
          console.log(`ℹ️ ${migration.name} - Already exists`);
        } else {
          results.push({
            migration: migration.name,
            status: 'error',
            message: error.message
          });
          console.error(`❌ ${migration.name} - ${error.message}`);
        }
      }
    }

    res.json({
      success: true,
      message: '🎉 Migration completed!',
      results,
      nextStep: 'Visit /api/admin/questions-v2/stats/all to see statistics with difficulty'
    });

  } catch (error) {
    console.error('❌ Migration error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
