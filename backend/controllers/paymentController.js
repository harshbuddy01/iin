import crypto from "crypto";
import razorpayInstance from "../config/razorpay.js";
import nodemailer from "nodemailer";
import { StudentPayment } from "../models/StudentPayment.js";
import { PurchasedTest } from "../models/PurchasedTest.js";
import { PaymentTransaction } from "../models/PaymentTransaction.js";

// Create Nodemailer transporter with Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email transporter verification failed:', error);
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });
} else {
  console.warn('⚠️ Email credentials not configured - email functionality disabled');
}

// Helper function to safely extract first name from email
const extractFirstName = (email) => {
  try {
    if (!email || typeof email !== 'string') return 'User';

    const emailParts = email.split('@');
    if (emailParts.length < 2) return 'User';

    const username = emailParts[0];
    const nameParts = username.split('.');
    const firstName = nameParts[0] || 'User';

    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  } catch (error) {
    console.error('Error extracting first name:', error.message);
    return 'User';
  }
};

// 1. GET API KEY
export const getApiKey = (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
};

// 2. CHECKOUT - 🔧 ENHANCED ERROR LOGGING
export const checkout = async (req, res) => {
  console.log('🔵 ========== CHECKOUT ENDPOINT CALLED ==========');
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    // CHECK 1: Is Razorpay configured?
    console.log('🔍 Check 1: Razorpay instance exists?', razorpayInstance ? '✅ YES' : '❌ NO');
    
    if (!razorpayInstance) {
      console.error('❌ CRITICAL: Razorpay instance is NULL!');
      console.error('   Possible reasons:');
      console.error('   1. RAZORPAY_API_KEY not set in environment variables');
      console.error('   2. RAZORPAY_API_SECRET not set in environment variables');
      console.error('   3. Razorpay initialization failed in config/razorpay.js');
      
      return res.status(500).json({
        success: false,
        message: "Payment gateway not configured. Missing Razorpay credentials.",
        debug: {
          razorpayConfigured: false,
          envCheck: {
            hasApiKey: !!process.env.RAZORPAY_API_KEY,
            hasApiSecret: !!process.env.RAZORPAY_API_SECRET
          }
        }
      });
    }

    // CHECK 2: Validate request body
    const { amount, testId, email } = req.body;
    console.log('🔍 Check 2: Request validation');
    console.log('   Amount:', amount, typeof amount);
    console.log('   TestId:', testId, typeof testId);
    console.log('   Email:', email, typeof email);

    if (!amount || isNaN(amount) || amount <= 0) {
      console.error('❌ Invalid amount:', amount);
      return res.status(400).json({
        success: false,
        message: "Valid amount is required"
      });
    }

    if (!testId || typeof testId !== 'string') {
      console.error('❌ Invalid testId:', testId);
      return res.status(400).json({
        success: false,
        message: "Valid testId is required"
      });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.error('❌ Invalid email:', email);
      return res.status(400).json({
        success: false,
        message: "Valid email is required"
      });
    }

    console.log('✅ Request validation passed');

    // CHECK 3: Create Razorpay order
    console.log('🔍 Check 3: Creating Razorpay order...');
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}_${testId}`,
      notes: {
        email: email,
        testId: testId
      }
    };

    console.log('📤 Sending to Razorpay:', JSON.stringify(options, null, 2));

    const order = await razorpayInstance.orders.create(options);
    
    console.log('✅ Razorpay order created successfully!');
    console.log('   Order ID:', order.id);
    console.log('   Amount:', order.amount);
    console.log('   Currency:', order.currency);

    // CHECK 4: Prepare response
    const responseData = { 
      success: true, 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_API_KEY
    };

    console.log('📤 Sending response:', JSON.stringify(responseData, null, 2));
    console.log('🔵 ========== CHECKOUT SUCCESS ==========');
    
    res.status(200).json(responseData);
    
  } catch (error) {
    console.error('🔴 ========== CHECKOUT ERROR ==========');
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // Check if it's a Razorpay API error
    if (error.error) {
      console.error('❌ Razorpay API error details:', JSON.stringify(error.error, null, 2));
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error',
      debug: {
        errorName: error.name,
        errorMessage: error.message,
        razorpayError: error.error || null
      }
    });
  }
};

// 3. PAYMENT VERIFICATION
export const paymentVerification = async (req, res) => {
  console.log("🔹 ========== PAYMENT VERIFICATION STARTED ==========");
  console.log("📦 Request Body:", JSON.stringify(req.body, null, 2));

  try {
    if (!razorpayInstance) {
      console.error('❌ Razorpay instance not configured for payment verification');
      return res.status(500).json({
        success: false,
        message: "Payment gateway not configured"
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, testId, amount } = req.body;

    console.log(`🔹 Email: ${email}`);
    console.log(`🔹 TestId: ${testId}`);
    console.log(`🔹 Amount: ${amount}`);

    // Validate required fields
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.log("❌ Invalid or missing email!");
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    if (!testId || typeof testId !== 'string') {
      console.log("❌ TestId is missing or invalid!");
      return res.status(400).json({ success: false, message: "Valid TestId is required" });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.log("❌ Missing payment verification parameters!");
      return res.status(400).json({ success: false, message: "Missing payment verification data" });
    }

    // Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.log("❌ Invalid payment signature!");
      return res.status(400).json({ success: false, message: "Invalid Payment Signature" });
    }

    console.log("✅ Payment signature verified!");

    // Payment verified! Now handle roll number logic
    const normalizedEmail = email.toLowerCase().trim();

    let existingStudent = await StudentPayment.findOne({ email: normalizedEmail });

    let rollNumber;
    let isNewStudent = false;
    let purchasedTests = [];
    let emailWarning = null;

    if (existingStudent) {
      // EXISTING STUDENT
      rollNumber = existingStudent.roll_number;
      console.log(`👤 Existing student found: ${normalizedEmail}, Roll: ${rollNumber}`);

      const existingPurchase = await PurchasedTest.findOne({
        email: normalizedEmail,
        test_id: testId
      });

      if (existingPurchase) {
        console.log(`⚠️ Student already purchased ${testId}`);
        return res.status(400).json({
          success: false,
          message: "You have already purchased this test"
        });
      }

      await PurchasedTest.create({
        email: normalizedEmail,
        test_id: testId,
        purchased_at: new Date()
      });

      await PaymentTransaction.create({
        email: normalizedEmail,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        test_id: testId,
        amount: amount || 199,
        status: 'paid',
        created_at: new Date()
      });

      const tests = await PurchasedTest.find({ email: normalizedEmail });
      purchasedTests = tests.map(t => t.test_id);

      console.log(`✅ Updated existing student: ${normalizedEmail}, Tests: ${purchasedTests.join(', ')}`);

    } else {
      // NEW STUDENT - Generate roll number ONLY after payment success
      rollNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
      isNewStudent = true;

      console.log(`🆕 New Student! Generated Roll Number: ${rollNumber}`);

      await StudentPayment.create({
        email: normalizedEmail,
        roll_number: rollNumber,
        created_at: new Date()
      });

      await PurchasedTest.create({
        email: normalizedEmail,
        test_id: testId,
        purchased_at: new Date()
      });

      await PaymentTransaction.create({
        email: normalizedEmail,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        test_id: testId,
        amount: amount || 199,
        status: 'paid',
        created_at: new Date()
      });

      purchasedTests = [testId];

      console.log(`✅ Created new student: ${normalizedEmail}, Roll: ${rollNumber}`);
    }

    // Send email
    console.log("📧 Attempting to send email via Nodemailer...");

    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        const firstName = extractFirstName(normalizedEmail);
        const currentDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const testSeriesName = testId.toUpperCase() + " Test Series";

        const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Confirmed - Vigyan.prep</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 0;">
        <div style="background-color: #059669; height: 8px;"></div>
        <div style="padding: 40px 60px 20px; border-bottom: 2px solid #e5e7eb;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <div style="font-size: 28px; font-weight: 900; color: #1f2937; letter-spacing: -0.5px;">
                        Vigyan<span style="color: #059669;">.prep</span>
                    </div>
                    <div style="font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">
                        EXAMINATION CELL
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
                        DATE:
                    </div>
                    <div style="font-size: 13px; font-weight: 700; color: #1f2937; margin-top: 2px;">
                        ${currentDate}
                    </div>
                </div>
            </div>
        </div>
        <div style="padding: 50px 60px;">
            <h1 style="font-size: 22px; font-weight: 700; color: #1f2937; margin: 0 0 30px 0; letter-spacing: -0.3px;">
                Registration Confirmed.
            </h1>
            <p style="font-size: 15px; color: #374151; line-height: 1.6; margin: 0 0 8px 0;">
                Dear <strong style="color: #1f2937;">${firstName}</strong>,
            </p>
            <p style="font-size: 15px; color: #374151; line-height: 1.7; margin: 0 0 10px 0;">
                You have been successfully enrolled in the <strong style="color: #1f2937;">${testSeriesName}</strong>.
            </p>
            <p style="font-size: 15px; color: #374151; line-height: 1.7; margin: 0 0 40px 0;">
                The competent authority has generated your unique examination credentials.
            </p>
            <div style="background: linear-gradient(to bottom, #fffbeb 0%, #fef3c7 100%); border: 2px solid #f59e0b; border-radius: 8px; padding: 35px 30px; text-align: center; margin-bottom: 35px;">
                <div style="font-size: 11px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 18px;">
                    YOUR ROLL NUMBER
                </div>
                <div style="font-size: 38px; font-weight: 700; color: #1f2937; font-family: 'Courier New', monospace; letter-spacing: 4px; margin-bottom: 20px;">
                    ${rollNumber}
                </div>
                <div style="font-size: 11px; font-weight: 600; color: #b45309; text-transform: uppercase; letter-spacing: 0.5px;">
                    ★ DO NOT SHARE THIS CREDENTIAL
                </div>
            </div>
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 18px 22px; margin-bottom: 40px;">
                <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.6;">
                    <strong style="font-weight: 700;">⚠️ Important:</strong> Save this Roll Number securely. You will need it to access all your purchased tests.
                </p>
            </div>
            <div style="text-align: center; margin: 45px 0 20px;">
                <a href="https://vigyanprep.com" style="display: inline-block; background-color: #1f2937; color: white; padding: 16px 50px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase;">
                    PROCEED TO DASHBOARD →
                </a>
            </div>
        </div>
        <div style="background-color: #1f2937; padding: 35px 60px; text-align: center;">
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                If you have any questions, reply to this email.
            </p>
            <p style="margin: 0; font-size: 11px; color: #6b7280;">
                © ${new Date().getFullYear()} Vigyan.prep Exams. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
        `;

        const mailOptions = {
          from: `"Vigyan.prep" <${process.env.EMAIL_USER}>`,
          to: normalizedEmail,
          subject: `Registration Confirmed - ${testSeriesName}`,
          html: emailHtml,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${normalizedEmail}`);

      } catch (emailError) {
        console.error("❌ Email Error:", emailError.message);
        emailWarning = "Email notification could not be sent, but your registration is complete";
      }
    } else {
      console.warn('⚠️ Email credentials not configured');
      emailWarning = "Email notifications are currently disabled";
    }

    console.log("✅ Sending success response to frontend...");

    const responseData = {
      success: true,
      rollNumber,
      isNewStudent,
      purchasedTests,
      message: isNewStudent
        ? "Payment successful! Your Roll Number has been sent to your email."
        : "Payment successful! Test added to your account."
    };

    if (emailWarning) {
      responseData.warning = emailWarning;
      console.warn(`⚠️ Response includes email warning: ${emailWarning}`);
    }

    console.log("🔹 ========== PAYMENT VERIFICATION SUCCESS ==========");
    res.status(200).json(responseData);

  } catch (error) {
    console.error("🔴 ========== PAYMENT VERIFICATION ERROR ==========");
    console.error("❌ Error:", error.message);
    console.error("❌ Stack:", error.stack);
    res.status(500).json({ success: false, message: "Internal Server Error: " + error.message });
  }
};
