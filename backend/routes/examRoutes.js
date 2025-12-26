import express from 'express';
import { startExam } from '../api/startExam.js';
import { syncAnswer } from '../api/syncAnswer.js';
import { submitExam } from '../api/submitExam.js';
import { getResult } from '../api/getResult.js';

const router = express.Router();

// New Exam System Routes (Phase 2)
router.post('/exam/start', startExam);
router.post('/exam/sync', syncAnswer);
router.post('/exam/submit', submitExam);
router.get('/exam/result/:attemptId', getResult);

export default router;
