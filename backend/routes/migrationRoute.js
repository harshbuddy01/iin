import express from 'express';
// DISABLED FOR MONGODB: import { pool } from '../config/mysql.js';

const router = express.Router();

/**
 * DEPRECATED ROUTE - Migration Helper (MySQL Only)
 * 
 * This route was used to add difficulty and topic columns to MySQL tables.
 * Since we've migrated to MongoDB, this endpoint is no longer needed.
 * 
 * MongoDB already supports these fields natively in the schema.
 * 
 * If you need to run migrations in MongoDB:
 * 1. Use MongoDB schema validation
 * 2. Use Mongoose schema updates
 * 3. Use database index management tools
 */

router.get('/run-difficulty-migration', async (req, res) => {
  try {
    console.log('⚠️ [DEPRECATED] Migration route called but disabled for MongoDB');
    
    res.status(410).json({
      success: false,
      status: 'deprecated',
      message: 'This migration endpoint is deprecated. MongoDB migration is complete.',
      information: {
        reason: 'MySQL migration helper - no longer needed for MongoDB',
        migration_status: 'Complete - All data migrated to MongoDB',
        next_steps: [
          'If you need to manage MongoDB schema, use MongoDB Atlas',
          'If you need to add indexes, use MongoDB index management',
          'If you need to migrate data, contact DevOps'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Migration route error:', error);
    res.status(500).json({
      success: false,
      error: 'This endpoint is deprecated and no longer functional',
      message: error.message
    });
  }
});

export default router;