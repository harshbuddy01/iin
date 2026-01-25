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

// ========== DASHBOARD STATS ==========
export const getDashboardStats = async (req, res) => {
  try {
    console.log('🔹 Getting dashboard stats...');
    
    // Get total students
    const totalStudents = await StudentPayment.countDocuments();
    
    // Get total transactions count
    const totalTransactions = await PaymentTransaction.countDocuments();
    
    // Get paid transactions for revenue calculation
    const paidTransactions = await PaymentTransaction.find({ status: 'paid' });
    const monthlyRevenue = paidTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    // Get total purchased tests (active tests count)
    const activeTests = await PurchasedTest.countDocuments();
    
    // Get today's exams (tests purchased today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayExams = await PurchasedTest.countDocuments({
      purchased_at: { $gte: today, $lt: tomorrow }
    });
    
    // Calculate trends (simplified - compare with yesterday)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdayStudents = await StudentPayment.countDocuments({
      created_at: { $gte: yesterday, $lt: today }
    });
    
    const studentsTrend = yesterdayStudents > 0 
      ? Math.round(((totalStudents - yesterdayStudents) / yesterdayStudents) * 100) 
      : 0;
    
    const yesterdayRevenue = (await PaymentTransaction.find({
      status: 'paid',
      created_at: { $gte: yesterday, $lt: today }
    })).reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const revenueTrend = yesterdayRevenue > 0
      ? Math.round(((monthlyRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
      : 15; // Default positive trend
    
    // Performance data for chart (last 7 days)
    const performanceData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      scores: [0, 0, 0, 0, 0, 0, 0] // Placeholder - add actual performance calculation
    };
    
    const stats = {
      activeTests,
      totalStudents,
      todayExams,
      monthlyRevenue,
      testsTrend: 12, // Placeholder
      studentsTrend,
      revenueTrend,
      performanceData
    };
    
    console.log('✅ Dashboard stats:', stats);
    res.status(200).json({
      success: true,
      ...stats
    });
    
  } catch (error) {
    console.error('❌ Error getting dashboard stats:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard stats',
      error: error.message
    });
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

// ========== NOTIFICATIONS ==========
export const getNotifications = async (req, res) => {
  try {
    console.log('🔹 Getting admin notifications...');
    
    // Get recent transactions and students for notifications
    const recentTransactions = await PaymentTransaction.find()
      .sort({ created_at: -1 })
      .limit(10);
    
    const recentStudents = await StudentPayment.find()
      .sort({ created_at: -1 })
      .limit(10);

    // Create notifications from recent activity
    const notifications = [];

    // Add student registration notifications
    for (const student of recentStudents) {
      notifications.push({
        id: `student_${student._id}`,
        type: 'student_registration',
        title: 'New Student Registration',
        message: `${student.email} registered with roll number ${student.roll_number}`,
        createdAt: student.created_at,
        unread: true
      });
    }

    // Add payment notifications
    for (const transaction of recentTransactions) {
      notifications.push({
        id: `payment_${transaction._id}`,
        type: 'payment_received',
        title: 'Payment Received',
        message: `Payment of ₹${transaction.amount} received from ${transaction.email}`,
        createdAt: transaction.created_at,
        unread: true
      });
    }

    // Sort by timestamp descending
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log(`✅ Retrieved ${notifications.length} notifications`);
    res.status(200).json({
      success: true,
      notifications: notifications.slice(0, 20) // Return max 20
    });

  } catch (error) {
    console.error('❌ Error getting notifications:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
      error: error.message
    });
  }
};

// ========== NOTIFICATIONS COUNT ==========
export const getNotificationsCount = async (req, res) => {
  try {
    console.log('🔹 Getting notifications count...');
    
    // Count recent activity (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const recentStudents = await StudentPayment.countDocuments({
      created_at: { $gte: yesterday }
    });

    const recentTransactions = await PaymentTransaction.countDocuments({
      created_at: { $gte: yesterday }
    });

    const count = recentStudents + recentTransactions;

    console.log(`✅ Unread notifications count: ${count}`);
    res.status(200).json({
      success: true,
      count
    });

  } catch (error) {
    console.error('❌ Error getting notifications count:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications count',
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
