import express from "express";
import { 
  startTest, 
  submitExam, 
  getQuestions,
  getUserInfo 
} from "../controllers/examController.js";

const router = express.Router();

// Get user info (email, roll number, purchased tests)
router.post("/user-info", getUserInfo);

// Start test (verify access)
router.post("/start-test", startTest);

// Submit exam
router.post("/submit-exam", submitExam);

// Get questions
router.get("/questions", getQuestions);

export default router;