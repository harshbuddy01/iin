import { pool } from "../config/mysql.js";

// Login Logic
export const adminLogin = (req, res) => {
  if (req.body.password === process.env.ADMIN_PASSWORD) {
    res.status(200).json({ success: true, message: "Welcome Boss!" });
  } else {
    res.status(403).json({ success: false, message: "Wrong Password!" });
  }
};

// Question Management
export const uploadQuestion = async (req, res) => {
  try {
    const { testId, questionNumber, questionText, image, options, correctAnswer, subject, difficulty, topic, explanation } = req.body;
    
    // Insert question into MySQL
    const [result] = await pool.query(
      `INSERT INTO questions 
       (test_id, question_number, question_text, options, correct_answer, difficulty, topic, explanation) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        testId,
        questionNumber || 1,
        questionText,
        JSON.stringify(options), // Store as JSON
        correctAnswer,
        difficulty || 'medium',
        topic || subject,
        explanation || ''
      ]
    );
    
    console.log('Question uploaded:', result.insertId);
    res.status(200).json({ 
      success: true, 
      message: "Question Added!", 
      questionId: result.insertId 
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    await pool.query("DELETE FROM questions WHERE id = ?", [req.params.id]);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all questions (for admin panel analytics and manage)
export const getAllQuestions = async (req, res) => {
  try {
    const [questions] = await pool.query(
      "SELECT * FROM questions ORDER BY created_at DESC"
    );
    
    // Parse JSON options field
    const formattedQuestions = questions.map(q => ({
      _id: q.id, // For compatibility with frontend
      id: q.id,
      testId: q.test_id,
      questionNumber: q.question_number,
      questionText: q.question_text,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      correctAnswer: q.correct_answer,
      difficulty: q.difficulty,
      topic: q.topic,
      explanation: q.explanation,
      createdAt: q.created_at,
      updatedAt: q.updated_at
    }));
    
    console.log(`Found ${formattedQuestions.length} questions`);
    res.status(200).json({ success: true, questions: formattedQuestions });
    
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all students (using students_payments table)
export const getAllStudents = async (req, res) => {
  try {
    // Get all students with their purchased tests
    const [students] = await pool.query(
      `SELECT 
        sp.email,
        sp.roll_number,
        sp.created_at,
        sp.updated_at,
        GROUP_CONCAT(pt.test_id) as purchased_tests,
        COUNT(pt.test_id) as total_purchases
      FROM students_payments sp
      LEFT JOIN purchased_tests pt ON sp.email = pt.email
      GROUP BY sp.email, sp.roll_number, sp.created_at, sp.updated_at
      ORDER BY sp.created_at DESC`
    );
    
    // Format for frontend compatibility
    const formattedStudents = students.map(s => ({
      _id: s.email, // Use email as ID for compatibility
      email: s.email,
      rollNumber: s.roll_number,
      purchasedTests: s.purchased_tests ? s.purchased_tests.split(',') : [],
      totalPurchases: s.total_purchases,
      createdAt: s.created_at,
      updatedAt: s.updated_at
    }));
    
    console.log(`Found ${formattedStudents.length} students`);
    res.status(200).json({ success: true, students: formattedStudents });
    
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all feedbacks (Note: Feedback table not yet created, return empty for now)
export const getFeedbacks = async (req, res) => {
  try {
    // Check if feedback table exists
    const [tables] = await pool.query(
      "SHOW TABLES LIKE 'feedbacks'"
    );
    
    if (tables.length === 0) {
      console.log('Feedback table does not exist yet');
      return res.status(200).json({ success: true, feedbacks: [] });
    }
    
    const [feedbacks] = await pool.query(
      "SELECT * FROM feedbacks ORDER BY created_at DESC"
    );
    
    console.log(`Found ${feedbacks.length} feedbacks`);
    res.status(200).json({ success: true, feedbacks });
    
  } catch (error) {
    console.error('Get feedbacks error:', error);
    // Return empty array instead of error to prevent admin panel crash
    res.status(200).json({ success: true, feedbacks: [] });
  }
};

// Data Viewing - Results with Questions
export const getResults = async (req, res) => {
  try {
    // Get all student attempts (results)
    const [results] = await pool.query(
      "SELECT * FROM student_attempts ORDER BY submitted_at DESC"
    );
    
    // Get all questions
    const [questions] = await pool.query(
      "SELECT * FROM questions ORDER BY test_id, question_number"
    );
    
    // Parse JSON fields in results
    const formattedResults = results.map(r => ({
      _id: r.id, // For compatibility
      id: r.id,
      email: r.email,
      rollNumber: r.roll_number,
      testId: r.test_id,
      testName: r.test_name,
      totalQuestions: r.total_questions,
      attemptedQuestions: r.attempted_questions,
      correctAnswers: r.correct_answers,
      wrongAnswers: r.wrong_answers,
      unanswered: r.unanswered,
      score: parseFloat(r.score),
      percentage: parseFloat(r.percentage),
      timeTaken: r.time_taken,
      answers: typeof r.answers === 'string' ? JSON.parse(r.answers) : r.answers,
      questionWiseResults: typeof r.question_wise_results === 'string' 
        ? JSON.parse(r.question_wise_results) 
        : r.question_wise_results,
      startedAt: r.started_at,
      submittedAt: r.submitted_at,
      submissionTime: r.submitted_at, // For compatibility
      status: r.status
    }));
    
    // Parse JSON fields in questions
    const formattedQuestions = questions.map(q => ({
      _id: q.id,
      id: q.id,
      testId: q.test_id,
      questionNumber: q.question_number,
      questionText: q.question_text,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      correctAnswer: q.correct_answer,
      difficulty: q.difficulty,
      topic: q.topic,
      explanation: q.explanation
    }));
    
    console.log(`Found ${formattedResults.length} results and ${formattedQuestions.length} questions`);
    res.status(200).json({ 
      success: true, 
      results: formattedResults, 
      questions: formattedQuestions 
    });
    
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Additional admin endpoints

// Get analytics/statistics
export const getAnalytics = async (req, res) => {
  try {
    // Total students
    const [studentCount] = await pool.query(
      "SELECT COUNT(*) as total FROM students_payments"
    );
    
    // Total questions
    const [questionCount] = await pool.query(
      "SELECT COUNT(*) as total FROM questions"
    );
    
    // Total attempts
    const [attemptCount] = await pool.query(
      "SELECT COUNT(*) as total FROM student_attempts"
    );
    
    // Total revenue (sum of all payments)
    const [revenue] = await pool.query(
      "SELECT SUM(amount) as total FROM payment_transactions"
    );
    
    res.status(200).json({
      success: true,
      analytics: {
        totalStudents: studentCount[0].total,
        totalQuestions: questionCount[0].total,
        totalAttempts: attemptCount[0].total,
        totalRevenue: revenue[0].total || 0
      }
    });
    
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};