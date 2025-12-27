import { pool } from "../config/mysql.js";

// Helper function to safely parse JSON
const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
  } catch (error) {
    console.error('JSON Parse Error:', error.message);
    return fallback;
  }
};

// Get user info (email, roll number, purchased tests)
export const getUserInfo = async (req, res) => {
  try {
    const { email, rollNumber } = req.body;
    
    if (!email && !rollNumber) {
      return res.status(400).json({ 
        success: false, 
        message: "Email or Roll Number required" 
      });
    }

    // Find student by email or roll number in MySQL
    let query, params;
    
    if (email) {
      query = "SELECT * FROM students_payments WHERE email = ?";
      params = [email.toLowerCase().trim()];
    } else {
      query = "SELECT * FROM students_payments WHERE roll_number = ?";
      params = [rollNumber];
    }
    
    const [students] = await pool.query(query, params);

    if (students.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }

    const student = students[0];
    
    // Get purchased tests
    const [purchasedTests] = await pool.query(
      "SELECT test_id FROM purchased_tests WHERE email = ?",
      [student.email]
    );

    res.status(200).json({
      success: true,
      email: student.email,
      rollNumber: student.roll_number,
      purchasedTests: purchasedTests.map(t => t.test_id)
    });
    
  } catch (error) {
    console.error("getUserInfo Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Start test (verify student has access)
export const startTest = async (req, res) => {
  try {
    const { rollNumber, email } = req.body;
    
    if (!email || !rollNumber) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and Roll Number required" 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Find student in MySQL
    const [students] = await pool.query(
      "SELECT * FROM students_payments WHERE email = ? AND roll_number = ?",
      [normalizedEmail, rollNumber]
    );

    if (students.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Invalid Roll Number or Email" 
      });
    }

    // Get purchased tests
    const [purchasedTests] = await pool.query(
      "SELECT test_id FROM purchased_tests WHERE email = ?",
      [normalizedEmail]
    );

    // Return purchased tests
    res.status(200).json({ 
      success: true, 
      purchasedTests: purchasedTests.map(t => t.test_id),
      rollNumber: students[0].roll_number
    });
    
  } catch (error) {
    console.error("startTest Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Submit exam
export const submitExam = async (req, res) => {
  try {
    const { email, rollNumber, testId, testName, userResponses, timeTaken, startedAt } = req.body;
    
    // Validate required fields
    if (!email || !testId || !userResponses || !Array.isArray(userResponses)) {
      return res.status(400).json({ 
        success: false, 
        message: "Email, testId, and userResponses (array) are required" 
      });
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    
    // Get student roll number if not provided
    let finalRollNumber = rollNumber;
    
    if (!finalRollNumber) {
      const [students] = await pool.query(
        "SELECT roll_number FROM students_payments WHERE email = ?",
        [normalizedEmail]
      );
      
      if (students.length > 0) {
        finalRollNumber = students[0].roll_number;
      } else {
        finalRollNumber = "N/A";
      }
    }
    
    // Calculate results
    const totalQuestions = userResponses.length;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;
    
    // Get correct answers from questions table
    const [questions] = await pool.query(
      "SELECT question_number, correct_answer FROM questions WHERE test_id = ? ORDER BY question_number",
      [testId]
    );
    
    if (questions.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No questions found for this test" 
      });
    }
    
    // ✅ FIXED: Create a map for easier lookup by question number
    const correctAnswersMap = {};
    questions.forEach(q => {
      correctAnswersMap[q.question_number] = q.correct_answer;
    });
    
    const questionWiseResults = [];
    
    userResponses.forEach((userAnswer, index) => {
      const questionNumber = index + 1;
      const correctAnswer = correctAnswersMap[questionNumber];
      
      if (userAnswer === null || userAnswer === undefined) {
        unanswered++;
        questionWiseResults.push({
          questionNumber,
          userAnswer: null,
          correctAnswer,
          isCorrect: false,
          status: 'unanswered'
        });
      } else if (userAnswer === correctAnswer) {
        correctAnswers++;
        questionWiseResults.push({
          questionNumber,
          userAnswer,
          correctAnswer,
          isCorrect: true,
          status: 'correct'
        });
      } else {
        wrongAnswers++;
        questionWiseResults.push({
          questionNumber,
          userAnswer,
          correctAnswer,
          isCorrect: false,
          status: 'wrong'
        });
      }
    });
    
    const score = correctAnswers;
    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    // Save to student_attempts table
    await pool.query(
      `INSERT INTO student_attempts 
       (email, roll_number, test_id, test_name, total_questions, attempted_questions, 
        correct_answers, wrong_answers, unanswered, score, percentage, time_taken, 
        answers, question_wise_results, started_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        normalizedEmail,
        finalRollNumber,
        testId,
        testName || testId,
        totalQuestions,
        totalQuestions - unanswered,
        correctAnswers,
        wrongAnswers,
        unanswered,
        score,
        percentage.toFixed(2),
        timeTaken || 0,
        JSON.stringify(userResponses),
        JSON.stringify(questionWiseResults),
        startedAt || new Date()
      ]
    );

    res.status(200).json({ 
      success: true, 
      message: "Exam Saved Successfully",
      results: {
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        unanswered,
        score,
        percentage: percentage.toFixed(2)
      }
    });
    
  } catch (error) {
    console.error("submitExam Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get questions for a specific test
export const getQuestions = async (req, res) => {
  try {
    const { testId } = req.query;
    
    if (!testId) {
      return res.status(400).json({ 
        success: false, 
        message: "Test ID required" 
      });
    }
    
    // Get questions from MySQL - REMOVED 'difficulty' and 'topic' columns
    const [questions] = await pool.query(
      "SELECT id, test_id, question_number, question_text, options FROM questions WHERE test_id = ? ORDER BY question_number",
      [testId]
    );
    
    if (questions.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No questions found for this test" 
      });
    }
    
    // Parse JSON options field with safe parsing
    const formattedQuestions = questions.map(q => ({
      _id: q.id,
      testId: q.test_id,
      questionNumber: q.question_number,
      questionText: q.question_text,
      options: safeJsonParse(q.options, []) // ✅ Safe parsing
    }));
    
    res.status(200).json({ 
      success: true, 
      questions: formattedQuestions 
    });
    
  } catch (error) {
    console.error("getQuestions Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get student results/attempts
export const getStudentResults = async (req, res) => {
  try {
    const { email, rollNumber } = req.query;
    
    if (!email && !rollNumber) {
      return res.status(400).json({ 
        success: false, 
        message: "Email or Roll Number required" 
      });
    }
    
    let query, params;
    
    if (email) {
      query = "SELECT * FROM student_attempts WHERE email = ? ORDER BY submitted_at DESC";
      params = [email.toLowerCase().trim()];
    } else {
      query = "SELECT * FROM student_attempts WHERE roll_number = ? ORDER BY submitted_at DESC";
      params = [rollNumber];
    }
    
    const [attempts] = await pool.query(query, params);
    
    // Parse JSON fields with safe parsing
    const formattedAttempts = attempts.map(attempt => ({
      ...attempt,
      answers: safeJsonParse(attempt.answers, []), // ✅ Safe parsing
      question_wise_results: safeJsonParse(attempt.question_wise_results, []) // ✅ Safe parsing
    }));
    
    res.status(200).json({ 
      success: true, 
      attempts: formattedAttempts 
    });
    
  } catch (error) {
    console.error("getStudentResults Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};