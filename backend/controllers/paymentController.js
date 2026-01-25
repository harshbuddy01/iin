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
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <div style="max-width: 650px; margin: 40px auto; background-color: #0f172a; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
        
        <!-- Golden Header -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 50px 60px 40px; border-bottom: 3px solid #f59e0b; position: relative; overflow: hidden;">
            <!-- Background Pattern -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.03; background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 30px 30px;"></div>
            
            <div style="position: relative; z-index: 1;">
                <!-- Vigyan.prep Logo with Golden Effect -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 700; font-style: italic; font-size: 48px; letter-spacing: 3px; text-transform: uppercase; background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 15%, #f59e0b 30%, #ffffff 50%, #fcd34d 70%, #f59e0b 85%, #fef3c7 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 8px; animation: shimmer 4s ease-in-out infinite;">
                        Vigyan
                    </div>
                    <div style="font-family: 'Inter', sans-serif; font-weight: 300; font-size: 14px; letter-spacing: 6px; text-transform: lowercase; color: #94a3b8; margin-top: -10px;">.prep</div>
                    <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 2px; margin-top: 12px; border-top: 1px solid #334155; padding-top: 12px; display: inline-block; padding-left: 20px; padding-right: 20px;">
                        EXAMINATION AUTHORITY
                    </div>
                </div>
                
                <!-- Date Badge -->
                <div style="text-align: center;">
                    <div style="display: inline-block; background: rgba(251, 191, 36, 0.1); border: 1px solid #f59e0b; border-radius: 8px; padding: 10px 24px;">
                        <div style="font-size: 9px; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">DATE OF REGISTRATION</div>
                        <div style="font-size: 14px; font-weight: 800; color: #fcd34d; font-family: 'Inter', monospace;">${currentDate}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div style="padding: 60px 60px 50px; background: #0f172a;">
            <!-- Success Icon -->
            <div style="text-align: center; margin-bottom: 35px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 40px rgba(16, 185, 129, 0.4);">
                    <div style="font-size: 40px; color: white;">✓</div>
                </div>
            </div>

            <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 800; color: #f8fafc; margin: 0 0 35px 0; letter-spacing: -0.5px; text-align: center; line-height: 1.2;">
                Registration Confirmed
            </h1>
            
            <p style="font-size: 16px; color: #cbd5e1; line-height: 1.8; margin: 0 0 12px 0; text-align: center;">
                Dear <strong style="color: #fbbf24; font-weight: 700;">${firstName}</strong>,
            </p>
            <p style="font-size: 15px; color: #94a3b8; line-height: 1.8; margin: 0 0 45px 0; text-align: center;">
                You have been successfully enrolled in the <strong style="color: #fcd34d;">${testSeriesName}</strong>.
            </p>

            <!-- Roll Number Card -->
            <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 3px solid #f59e0b; border-radius: 16px; padding: 45px 40px; text-align: center; margin-bottom: 40px; box-shadow: 0 20px 60px rgba(245, 158, 11, 0.3);">
                <div style="font-size: 11px; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 25px;">
                    ⚡ YOUR ROLL NUMBER ⚡
                </div>
                <div style="font-family: 'Courier New', monospace; font-size: 52px; font-weight: 900; color: #1f2937; letter-spacing: 6px; margin-bottom: 25px; text-shadow: 2px 2px 0px rgba(245, 158, 11, 0.2);">
                    ${rollNumber}
                </div>
                <div style="background: #dc2626; color: white; display: inline-block; padding: 8px 20px; border-radius: 6px; font-size: 10px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
                    ★ CONFIDENTIAL - DO NOT SHARE ★
                </div>
            </div>

            <!-- Warning Box -->
            <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%); border-left: 5px solid #ef4444; border-radius: 12px; padding: 22px 28px; margin-bottom: 45px;">
                <p style="margin: 0; font-size: 14px; color: #fca5a5; line-height: 1.7; font-weight: 500;">
                    <strong style="font-weight: 800; color: #fecaca;">⚠️ IMPORTANT NOTICE:</strong><br>
                    Save this Roll Number in a secure location. You will need it to access all your purchased test series and track your progress.
                </p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 50px 0 30px;">
                <a href="https://vigyanprep.com" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 18px 55px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 15px; letter-spacing: 1.5px; text-transform: uppercase; box-shadow: 0 10px 40px rgba(59, 130, 246, 0.4); transition: all 0.3s;">
                    PROCEED TO DASHBOARD →
                </a>
            </div>

            <p style="text-align: center; font-size: 13px; color: #64748b; margin: 35px 0 0 0; line-height: 1.6;">
                Need help? Reply to this email or visit our support center.
            </p>
        </div>

        <!-- Footer -->
        <div style="background: #020617; padding: 40px 60px; text-align: center; border-top: 1px solid #1e293b;">
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; line-height: 1.6;">
                This is an automated confirmation email from Vigyan.prep Examination System.
            </p>
            <p style="margin: 0; font-size: 12px; color: #475569; font-weight: 500;">
                © ${new Date().getFullYear()} <span style="background: linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 700;">Vigyan.prep</span> Exams. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
        `;

        const mailOptions = {
          from: `"Vigyan.prep Exams" <${process.env.EMAIL_USER}>`,
          to: normalizedEmail,
          subject: `✅ Registration Confirmed - ${testSeriesName}`,
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
