/**
 * ADMIN CONTROLLER - MongoDB Version
 * 
 * Handles admin-related operations
 */

import { StudentPayment } from '../models/StudentPayment.js';
import { PaymentTransaction } from '../models/PaymentTransaction.js';
import { PurchasedTest } from '../models/PurchasedTest.js';

// Helper function to safely parse JSON
const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
  } catch (error) {
    console.error('JSON Parse Error:', error.message);
    return fallback;
  }
};

// ========== ADMIN PROFILE ==========
export const getAdminProfile = async (req, res) => {
  try {
    console.log('🔹 Getting admin profile...');
    
    // Get admin stats
    const totalStudents = await StudentPayment.countDocuments();
    const totalTransactions = await PaymentTransaction.countDocuments();
    const totalRevenue = await PaymentTransaction.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const adminProfile = {
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@vigyanprep.com',
      role: 'Administrator',
      stats: {
        totalStudents,
        totalTransactions,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
      },
      permissions: ['manage_tests', 'manage_students', 'view_analytics'],
      lastLogin: new Date().toISOString()
    };

    console.log('✅ Admin profile retrieved successfully');
    res.status(200).json({
      success: true,
      profile: adminProfile
    });

  } catch (error) {
    console.error('❌ Error getting admin profile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin profile',
      error: error.message
    });
  }
};

// ========== TEMP: Not implemented functions ==========
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
