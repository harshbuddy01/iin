import express from 'express';
import Student from '../models/Student.js';
import { isMongoDBConnected, lastConnectionError } from '../config/mongodb.js';

const router = express.Router();

// 🔴 CRITICAL FIX: Temporary in-memory storage to bypass MongoDB for now
const tempStudents = new Map();
const tempTokens = new Map();

// Email verification endpoint - Creates/finds student
// GET method for debugging availability
router.get('/verify-email', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Verify Email endpoint is reachable',
    method: 'GET'
  });
});

router.post('/verify-email', async (req, res) => {
  const { email, rollNumber } = req.body;

  try {
    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log(`🔵 Verifying user: ${normalizedEmail}`);

    const startTime = Date.now();

    // 🟢 TEMPORARY: Try MongoDB first if connected
    if (isMongoDBConnected) {
      try {
        // Set timeout for database operations
        let student = await Student.findOne({ email: normalizedEmail })
          .maxTimeMS(3000) // 3 second max query time
          .lean();

        if (student) {
          const duration = Date.now() - startTime;
          console.log(`✅ Existing user verified (MongoDB): ${normalizedEmail} (${duration}ms)`);

          return res.json({
            success: true,
            studentId: student._id.toString(),
            isNewUser: false,
            email: student.email,
            status: 'VERIFIED'
          });
        }

        // Create new student
        student = await Student.create({
          email: normalizedEmail,
          rollNumber: rollNumber || null,
          createdAt: new Date(),
          lastLoginAt: new Date()
        });

        const duration = Date.now() - startTime;
        console.log(`✅ New student created (MongoDB): ${normalizedEmail} (${duration}ms)`);

        return res.json({
          success: true,
          studentId: student._id.toString(),
          isNewUser: true,
          email: student.email,
          status: 'NEW_USER'
        });
      } catch (mongoError) {
        console.warn('⚠️ MongoDB failed, falling back to temp storage:', mongoError.message);
        // Fall through to temp storage below
      }
    }

    // 🟡 FALLBACK: Use temporary in-memory storage (no MongoDB dependency)
    console.log('📝 Using temporary storage (MongoDB unavailable)');

    if (tempStudents.has(normalizedEmail)) {
      const student = tempStudents.get(normalizedEmail);
      const duration = Date.now() - startTime;
      console.log(`✅ Existing user verified (TEMP): ${normalizedEmail} (${duration}ms)`);

      return res.json({
        success: true,
        studentId: student.id,
        isNewUser: false,
        email: student.email,
        status: 'VERIFIED'
      });
    }

    // Create new student in temporary storage
    const newStudent = {
      id: 'temp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      email: normalizedEmail,
      rollNumber: rollNumber || null,
      createdAt: new Date(),
      isPermanent: false
    };

    tempStudents.set(normalizedEmail, newStudent);

    const duration = Date.now() - startTime;
    console.log(`✅ New student created (TEMP): ${normalizedEmail} (${duration}ms)`);

    res.json({
      success: true,
      studentId: newStudent.id,
      isNewUser: true,
      email: newStudent.email,
      status: 'NEW_USER'
    });

  } catch (error) {
    console.error('❌ Email verification error:', error);

    res.status(500).json({
      error: 'Server error during verification',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Enhanced health check for debugging DB connection
router.get('/auth-health', async (req, res) => {
  const mongoose = await import('mongoose');
  const readyState = mongoose.default.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  res.json({
    status: 'ok',
    version: 'DEBUG-V2-DEPLOYED-TEMP-STORAGE', // Check this to confirm code update
    mongo_var_connected: isMongoDBConnected,
    mongo_uri_configured: !!process.env.MONGODB_URI,
    last_error: lastConnectionError,
    mongoose_ready_state: readyState,
    mongoose_state_name: states[readyState] || 'unknown',
    host: mongoose.default.connection.host,
    timestamp: new Date().toISOString(),
    temp_users_stored: tempStudents.size
  });
});

export default router;