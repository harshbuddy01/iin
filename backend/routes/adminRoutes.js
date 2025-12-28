import express from 'express';
import * as adminController from '../controllers/adminController.js';
import cleanupRoute from './cleanupRoute.js';
import questionsRouteFixed from './questionsRouteFixed.js';

const router = express.Router();

// ========== SCHEDULED TESTS MANAGEMENT ==========
// All routes here will be prefixed with /api/admin in server.js

// Create new scheduled test - POST /api/admin/create-test
router.post('/admin/create-test', adminController.createScheduledTest);

// Get all scheduled tests - GET /api/admin/scheduled-tests
router.get('/admin/scheduled-tests', adminController.getScheduledTests);

// Get specific test details - GET /api/admin/test/:testId
router.get('/admin/test/:testId', adminController.getTestDetails);

// Update test status - PUT /api/admin/test/:testId/status
router.put('/admin/test/:testId/status', adminController.updateTestStatus);

// Delete test - DELETE /api/admin/delete-test/:testId
router.delete('/admin/delete-test/:testId', adminController.deleteTest);

// ========== QUESTIONS MANAGEMENT ==========

// Add question to test - POST /api/admin/add-question
router.post('/admin/add-question', adminController.addQuestion);

// Get questions for a test - GET /api/admin/questions?testId=xxx&section=xxx
router.get('/admin/questions', adminController.getTestQuestions);

// Update question - PUT /api/admin/update-question/:questionId
router.put('/admin/update-question/:questionId', adminController.updateQuestion);

// Delete question - DELETE /api/admin/delete-question/:questionId
router.delete('/admin/delete-question/:questionId', adminController.deleteQuestion);

// ========== STUDENT ACCESS ==========

// Get available tests for students - GET /api/admin/available-tests
router.get('/admin/available-tests', adminController.getAvailableTests);

// ========== CLEANUP & FIXED ENDPOINTS ==========

// Cleanup corrupted questions - GET /api/admin/cleanup-questions
router.use('/admin', cleanupRoute);

// Fixed questions endpoint - GET /api/admin/questions-fixed
router.use('/admin', questionsRouteFixed);

console.log('✅ Admin routes configured with /admin prefix');
console.log('✅ Cleanup endpoint: GET /api/admin/cleanup-questions');
console.log('✅ Fixed questions endpoint: GET /api/admin/questions-fixed');

export default router;
