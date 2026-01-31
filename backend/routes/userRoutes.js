import express from 'express';
import Student from '../models/Student.js';
import { PurchasedTest } from '../models/PurchasedTest.js';
import { verifyAuth } from '../middlewares/auth.js';  // ✅ SECURITY FIX: Import auth middleware

const router = express.Router();

// ✅ SECURITY FIX (Issue #48): Added authentication to user routes
// GET /api/user/profile - Get user profile data
router.get('/profile', verifyAuth, async (req, res) => {
    try {
        // ✅ SECURITY: Get email from JWT token, not query param
        const email = req.user.email;
        const normalizedEmail = email.toLowerCase().trim();

        // Get student data
        const student = await Student.findOne({ email: normalizedEmail });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Get purchased tests
        const purchases = await PurchasedTest.find({ email: normalizedEmail });
        const purchasedTests = purchases.map(p => p.test_id);

        res.json({
            success: true,
            fullName: student.fullName,
            email: student.email,
            rollNumber: student.rollNumber,
            purchasedTests: purchasedTests,
            course: student.course
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
});

// ✅ FIX: PUBLIC endpoint for pre-purchase verification
// No authentication required - used before payment to check duplicates
// GET /api/check-purchase/:testId?email=user@example.com
router.get('/check-purchase/:testId', async (req, res) => {
    try {
        const { testId } = req.params;
        const { email } = req.query;  // Get email from query parameter

        // Validate email parameter
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email parameter is required'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Email format validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        const purchase = await PurchasedTest.findOne({
            email: normalizedEmail,
            test_id: testId
        });

        res.json({
            success: true,
            alreadyPurchased: !!purchase,
            purchaseDate: purchase?.purchased_at || null
        });

    } catch (error) {
        console.error('Error checking purchase:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check purchase status'
        });
    }
});

export default router;
