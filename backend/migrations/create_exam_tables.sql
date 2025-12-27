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
    section VARCHAR(50) DEFAULT 'Physics' COMMENT 'Physics, Chemistry, Mathematics, Biology',
    marks_positive INT DEFAULT 4,
    marks_negative DECIMAL(3,2) DEFAULT -1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_test_id (test_id),
    INDEX idx_question_number (question_number),
    INDEX idx_section (section),
    UNIQUE KEY unique_test_question (test_id, question_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create scheduled_tests table
CREATE TABLE IF NOT EXISTS scheduled_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_name VARCHAR(255) NOT NULL,
    test_id VARCHAR(50) NOT NULL COMMENT 'iat, nest, or isi',
    exam_date DATE NOT NULL,
    exam_time TIME DEFAULT '10:00:00',
    duration INT NOT NULL DEFAULT 180 COMMENT 'Duration in minutes',
    total_marks INT NOT NULL DEFAULT 100,
    total_questions INT DEFAULT 0,
    sections VARCHAR(255) DEFAULT 'Physics,Chemistry,Mathematics' COMMENT 'Comma-separated sections',
    description TEXT,
    status VARCHAR(20) DEFAULT 'scheduled' COMMENT 'scheduled, ongoing, completed, cancelled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_test_id (test_id),
    INDEX idx_exam_date (exam_date),
    INDEX idx_status (status)
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