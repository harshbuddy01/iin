import express from 'express';
import Student from '../models/Student.js';
import { isMongoDBConnected, lastConnectionError } from '../config/mongodb.js';

const router = express.Router();

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

    // Check if MongoDB is connected
    if (!isMongoDBConnected) {
      console.warn('⚠️ MongoDB not connected - checking if still available...');
    }

    try {
      // Check if student exists
      let student = await Student.findOne({ email: normalizedEmail })
        .maxTimeMS(5000) // 5 second max query time
        .lean();

      if (student) {
        // Update last login (fire and forget)
        Student.updateOne(
          { _id: student._id },
          { lastLoginAt: new Date() }
        ).catch(err => console.error('Failed to update lastLoginAt:', err));

        const duration = Date.now() - startTime;
        console.log(`✅ Existing user verified: ${normalizedEmail} (${duration}ms)`);

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
      console.log(`✅ New student created: ${normalizedEmail} (${duration}ms)`);

      res.json({
        success: true,
        studentId: student._id.toString(),
        isNewUser: true,
        email: student.email,
        status: 'NEW_USER'
      });
    } catch (mongoError) {
      console.error('❌ MongoDB Error:', mongoError.message);
      
      // Return clear error message
      if (mongoError.name === 'MongooseError' && mongoError.message.includes('buffering timed out')) {
        return res.status(503).json({
          error: 'Database timeout',
          message: 'MongoDB connection unavailable. Make sure MONGODB_URI is set in Hostinger environment variables.',
          helpText: 'Go to Hostinger → Environment Variables → Add MONGODB_URI with your MongoDB Atlas connection string'
        });
      }

      if (mongoError.code === 11000) {
        return res.status(409).json({
          error: 'Duplicate entry',
          message: 'This email is already registered'
        });
      }

      return res.status(500).json({
        error: 'Server error during verification',
        message: mongoError.message
      });
    }
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
    version: 'PRODUCTION-MONGODB-PERMANENT',
    mongo_var_connected: isMongoDBConnected,
    mongo_uri_configured: !!process.env.MONGODB_URI,
    last_error: lastConnectionError,
    mongoose_ready_state: readyState,
    mongoose_state_name: states[readyState] || 'unknown',
    host: mongoose.default.connection.host,
    timestamp: new Date().toISOString(),
    setup_help: !process.env.MONGODB_URI ? 'Set MONGODB_URI environment variable in Hostinger' : 'Configured'
  });
});

export default router;