-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id VARCHAR(50) NOT NULL,
    question_number INT NOT NULL,
    question_text TEXT NOT NULL,
    options JSON NOT NULL COMMENT 'Array of 4 options',
    correct_answer INT NOT NULL COMMENT 'Index of correct option (0-3)',
    explanation TEXT,
    difficulty VARCHAR(20) DEFAULT 'medium',
    topic VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_test_id (test_id),
    INDEX idx_question_number (question_number),
    UNIQUE KEY unique_test_question (test_id, question_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create student_attempts table
CREATE TABLE IF NOT EXISTS student_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    roll_number VARCHAR(20) NOT NULL,
    test_id VARCHAR(50) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    total_questions INT NOT NULL,
    attempted_questions INT NOT NULL DEFAULT 0,
    correct_answers INT NOT NULL DEFAULT 0,
    wrong_answers INT NOT NULL DEFAULT 0,
    unanswered INT NOT NULL DEFAULT 0,
    score DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    percentage DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    time_taken INT NOT NULL COMMENT 'Time in seconds',
    answers JSON NOT NULL COMMENT 'Array of student answers',
    question_wise_results JSON COMMENT 'Detailed question-wise analysis',
    started_at TIMESTAMP NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'completed',
    INDEX idx_email (email),
    INDEX idx_roll_number (roll_number),
    INDEX idx_test_id (test_id),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;