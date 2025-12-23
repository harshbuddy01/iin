import Question from "../models/question.js";
import ExamResult from "../models/results.js";
import { Payment } from "../models/payment.js";
import Feedback from "../models/feedback.js";

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
    const { testId, questionText, image, options, correctAnswer, subject } = req.body;
    const newQuestion = await Question.create({ testId, questionText, image, options, correctAnswer, subject });
    console.log('Question uploaded:', newQuestion._id);
    res.status(200).json({ success: true, message: "Question Added!", questionId: newQuestion._id });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all questions (for admin panel analytics and manage)
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    console.log(`Found ${questions.length} questions`);
    res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all students (using Payment model which stores user data)
export const getAllStudents = async (req, res) => {
  try {
    const students = await Payment.find().sort({ createdAt: -1 });
    console.log(`Found ${students.length} students`);
    res.status(200).json({ success: true, students });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all feedbacks
export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    console.log(`Found ${feedbacks.length} feedbacks`);
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    console.error('Get feedbacks error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Data Viewing - Results with Questions
export const getResults = async (req, res) => {
  try {
    const results = await ExamResult.find().sort({ submissionTime: -1 });
    const questions = await Question.find();
    console.log(`Found ${results.length} results and ${questions.length} questions`);
    res.status(200).json({ success: true, results, questions });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};