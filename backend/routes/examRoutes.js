import express from "express";
import { startTest, submitExam, getQuestions } from "../controllers/examController.js";

const router = express.Router();

router.post("/start-test", startTest);
router.post("/submit-exam", submitExam);
router.get("/get-questions", getQuestions);

export default router;