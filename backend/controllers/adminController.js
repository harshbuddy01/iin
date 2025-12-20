import Question from "../models/question.js";
import ExamResult from "../models/results.js";
import { Payment } from "../models/payment.js"; // This matches the new named export

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
    await Question.create({ testId, questionText, image, options, correctAnswer, subject });
    res.status(200).json({ success: true, message: "Question Added!" });
  } catch (error) {
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

// Data Viewing
export const getResults = async (req, res) => {
  try {
    const results = await ExamResult.find().sort({ submissionTime: -1 });
    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};