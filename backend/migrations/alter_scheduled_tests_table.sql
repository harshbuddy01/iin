-- Migration to update existing scheduled_tests table
-- This adds missing columns that the backend code expects

-- Add test_type column if it doesn't exist
ALTER TABLE scheduled_tests 
ADD COLUMN IF NOT EXISTS test_type VARCHAR(50) DEFAULT 'NEST' COMMENT 'IAT, NEST, ISI';

-- Rename exam_time to start_time if it exists
ALTER TABLE scheduled_tests 
CHANGE COLUMN exam_time start_time TIME DEFAULT '10:00:00';

-- Rename duration to duration_minutes if it exists
ALTER TABLE scheduled_tests 
CHANGE COLUMN duration duration_minutes INT NOT NULL DEFAULT 180 COMMENT 'Duration in minutes';

-- Rename sections to subjects if it exists
ALTER TABLE scheduled_tests 
CHANGE COLUMN sections subjects VARCHAR(255) DEFAULT 'Physics, Chemistry, Mathematics' COMMENT 'Comma-separated subjects';

-- Add index on test_type
ALTER TABLE scheduled_tests 
ADD INDEX IF NOT EXISTS idx_test_type (test_type);

-- Make test_id UNIQUE if not already
ALTER TABLE scheduled_tests 
ADD UNIQUE INDEX IF NOT EXISTS unique_test_id (test_id);