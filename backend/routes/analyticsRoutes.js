import express from 'express';
import mongoose from 'mongoose';
import { verifyAuth } from '../middlewares/auth.js';  // ✅ SECURITY FIX: Import auth middleware

const router = express.Router();

// Create PaymentLog schema
const PaymentLogSchema = new mongoose.Schema({
    event: {
        type: String,
        enum: ['initiated', 'failed', 'success'],
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    testId: String,
    error: String,
    timestamp: {
        type: Date,
        default: Date.now
    },
    userAgent: String
});

const PaymentLog = mongoose.model('PaymentLog', PaymentLogSchema);

// ✅ SECURITY FIX (Issue #47): Added authentication to analytics endpoints
// POST /api/analytics/payment-event - Log payment events
router.post('/payment-event', verifyAuth, async (req, res) => {
    try {
        const { event, data, timestamp, userAgent } = req.body;

        // ✅ SECURITY: Use authenticated user's email from JWT token
        const authenticatedEmail = req.user.email;

        await PaymentLog.create({
            event,
            email: authenticatedEmail,  // Use JWT email, not body data
            testId: data.testId,
            error: data.error || null,
            timestamp: new Date(timestamp),
            userAgent: userAgent
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error logging payment event:', error);
        res.status(500).json({ success: false });
    }
});

// ✅ SECURITY FIX (Issue #47): Added authentication to analytics endpoints
// POST /api/analytics/payment-failed - Log failed payments (backward compatibility)
router.post('/payment-failed', verifyAuth, async (req, res) => {
    try {
        const { testId, error, errorCode, timestamp } = req.body;

        // ✅ SECURITY: Use authenticated user's email from JWT token
        const authenticatedEmail = req.user.email;

        await PaymentLog.create({
            event: 'failed',
            email: authenticatedEmail,  // Use JWT email, not body data
            testId,
            error: error || errorCode,
            timestamp: new Date(timestamp),
            userAgent: req.headers['user-agent']
        });

        res.json({ success: true });
    } catch (err) {
        console.error('Error logging failed payment:', err);
        res.status(500).json({ success: false });
    }
});

export default router;
