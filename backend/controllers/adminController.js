/**
 * OLD ADMIN CONTROLLER - DISABLED FOR MONGODB MIGRATION
 * 
 * This file uses raw MySQL queries.
 * TODO: Replace with OOP/Repository pattern controllers
 * 
 * For now, all functions return "Not implemented" to prevent import errors.
 */

// Disabled: import { pool } from "../config/mysql.js";

// Helper function to safely parse JSON
const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
  } catch (error) {
    console.error('JSON Parse Error:', error.message);
    return fallback;
  }
};

// TEMP: Return "not implemented" for all functions
const notImplemented = (req, res) => {
  res.status(501).json({ 
    success: false, 
    message: "This endpoint is temporarily disabled during MongoDB migration. Use OOP endpoints instead." 
  });
};

export const createScheduledTest = notImplemented;
export const getScheduledTests = notImplemented;
export const addQuestion = notImplemented;
export const getTestQuestions = notImplemented;
export const updateQuestion = notImplemented;
export const deleteQuestion = notImplemented;
export const deleteTest = notImplemented;
export const getTestDetails = notImplemented;
export const getAvailableTests = notImplemented;
export const updateTestStatus = notImplemented;