-- Fix questions table schema - Add missing columns
-- This migration adds columns that might be missing from older table versions

-- Add marks_positive column if it doesn't exist
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS marks_positive DECIMAL(4,2) DEFAULT 4.00;

-- Add marks_negative column if it doesn't exist
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS marks_negative DECIMAL(4,2) DEFAULT -1.00;

-- Add has_math column if it doesn't exist (for PDF extraction)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS has_math BOOLEAN DEFAULT FALSE;

-- Add exam_type column if it doesn't exist (for PDF metadata)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS exam_type VARCHAR(50) DEFAULT NULL;

-- Add year column if it doesn't exist (for PDF metadata)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS year VARCHAR(10) DEFAULT NULL;

-- Add has_latex column if it doesn't exist (legacy name for has_math)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS has_latex BOOLEAN DEFAULT FALSE;

-- Add subject column if it doesn't exist (metadata)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS subject VARCHAR(100) DEFAULT NULL;

-- Update existing rows to have default values
UPDATE questions 
SET marks_positive = 4.00 
WHERE marks_positive IS NULL;

UPDATE questions 
SET marks_negative = -1.00 
WHERE marks_negative IS NULL;

-- Create index on exam_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_exam_type ON questions(exam_type);

-- Create index on year for faster filtering
CREATE INDEX IF NOT EXISTS idx_year ON questions(year);

SELECT 'Questions table schema fixed successfully' as message;