import express from 'express';
import {
  // Admin dashboard
  getDashboardStats,
  getAdminProfile,
  getNotifications,
  getNotificationsCount,
  // Scheduled tests
  getScheduledTests,
  getPastTests, // ✅ Added past tests
  createScheduledTest,
  getTestDetails,
  updateTestStatus,
  deleteTest,
  // Questions
  addQuestion,
  getTestQuestions,
  updateQuestion,
  deleteQuestion,
  getAvailableTests
} from '../controllers/adminController.js';

const router = express.Router();

// ========== DASHBOARD ENDPOINTS ==========
router.get('/stats', getDashboardStats);
router.get('/profile', getAdminProfile);
router.get('/notifications', getNotifications);
router.get('/notifications-count', getNotificationsCount);

// ========== SCHEDULED TESTS ENDPOINTS ==========
router.post('/create-test', createScheduledTest);  // ✅ FIXED: Create test endpoint
router.get('/scheduled-tests', getScheduledTests);  // ✅ Get all scheduled tests
router.get('/tests', getScheduledTests);            // ✅ Alias for /tests (Fixes 404)
router.get('/past-tests', getPastTests);            // ✅ Get past tests (Fixes 404)
router.get('/test/:testId', getTestDetails);       // ✅ Get specific test
router.put('/test/:testId', updateTestStatus);     // ✅ Update test status
router.delete('/test/:testId', deleteTest);        // ✅ Delete test

// ========== QUESTIONS ENDPOINTS ==========
router.post('/questions/add', addQuestion);
router.get('/questions/:testId', getTestQuestions);
router.put('/questions/:questionId', updateQuestion);
router.delete('/questions/:questionId', deleteQuestion);
router.get('/available-tests', getAvailableTests);

export default router;
