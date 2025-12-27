import express from 'express';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// ========== SCHEDULED TESTS MANAGEMENT ==========

// Create new scheduled test
router.post('/create-test', adminController.createScheduledTest);

// Get all scheduled tests
router.get('/scheduled-tests', adminController.getScheduledTests);

// Get specific test details
router.get('/test/:testId', adminController.getTestDetails);

// Update test status
router.put('/test/:testId/status', adminController.updateTestStatus);

// Delete test
router.delete('/delete-test/:testId', adminController.deleteTest);

// ========== QUESTIONS MANAGEMENT ==========

// Add question to test
router.post('/add-question', adminController.addQuestion);

// Get questions for a test (with optional section filter)
router.get('/questions', adminController.getTestQuestions);

// Update question
router.put('/update-question/:questionId', adminController.updateQuestion);

// Delete question
router.delete('/delete-question/:questionId', adminController.deleteQuestion);

// ========== STUDENT ACCESS ==========

// Get available tests for students (tests active on current date/time)
router.get('/available-tests', adminController.getAvailableTests);

export default router;