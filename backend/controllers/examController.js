import { Payment } from "../models/payment.js";
import Question from "../models/question.js";
import ExamResult from "../models/results.js";

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

    // Find student by email or roll number
    const query = email 
      ? { email: email.toLowerCase().trim() }
      : { rollNumber };
    
    const student = await Payment.findOne(query);

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }

    res.status(200).json({
      success: true,
      email: student.email,
      rollNumber: student.rollNumber,
      purchasedTests: student.purchasedTests
    });
    
  } catch (error) {
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
    
    // Find student
    const student = await Payment.findOne({ 
      email: normalizedEmail, 
      rollNumber 
    });

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: "Invalid Roll Number or Email" 
      });
    }

    // Return purchased tests
    res.status(200).json({ 
      success: true, 
      purchasedTests: student.purchasedTests,
      rollNumber: student.rollNumber
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Submit exam
export const submitExam = async (req, res) => {
  try {
    const { email, testId, userResponses } = req.body;
    
    const student = await Payment.findOne({ email: email.toLowerCase() });
    const rollNumber = student ? student.rollNumber : "N/A";

    await ExamResult.create({ 
      email: email.toLowerCase(), 
      rollNumber, 
      testId, 
      answers: userResponses 
    });

    res.status(200).json({ success: true, message: "Exam Saved Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get questions for a specific test
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ testId: req.query.testId });
    res.status(200).json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};