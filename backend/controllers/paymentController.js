import crypto from "crypto";
import { instance } from "../server.js";
import { Payment } from "../models/payment.js";

// 1. GET API KEY
export const getApiKey = (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
};

// 2. CHECKOUT
export const checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. PAYMENT VERIFICATION (Using Resend API)
export const paymentVerification = async (req, res) => {
  console.log("🔹 Verification Started...");
  
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body;
    
    // Validate required fields
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const examToken = Math.floor(10000000 + Math.random() * 90000000).toString();

      // Save to database
      try {
        await Payment.create({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          email: email.toLowerCase(),
          examToken,
          status: "paid",
        });
        console.log("✅ Payment saved to DB");
      } catch (dbError) {
        console.error("⚠️ DB Save Error:", dbError.message);
      }

      // Send email using Resend API (Much more reliable!)
      try {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px;">
                  <h1 style="margin: 0; font-size: 28px;">✅ Payment Successful!</h1>
                </div>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="font-size: 16px; color: #333; margin: 0 0 10px 0;">Your exam token has been generated:</p>
                <div style="background-color: white; padding: 15px; border-radius: 5px; text-align: center; border: 2px dashed #667eea;">
                  <p style="margin: 0; font-size: 14px; color: #666;">8-Digit Exam Token</p>
                  <h2 style="margin: 10px 0 0 0; font-size: 36px; color: #667eea; letter-spacing: 3px; font-family: 'Courier New', monospace;">${examToken}</h2>
                </div>
              </div>

              <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 14px; color: #856404;">
                  <strong>⚠️ Important:</strong> Save this token securely. You'll need it to access your exam.
                </p>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://iin-theta.vercel.app" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
                  Enter Exam Hall 🚀
                </a>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #999;">
                  If you have any questions, reply to this email.<br>
                  © ${new Date().getFullYear()} IIN Exams. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        `;

        // Call Resend API
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'IIN Exams <onboarding@resend.dev>', // Use your verified domain later
            to: email.toLowerCase(),
            subject: '🎓 Your IIN Exam Token - Payment Successful',
            html: emailHtml
          })
        });

        const resendData = await resendResponse.json();

        if (resendResponse.ok) {
          console.log(`✅ Email sent successfully to ${email}`);
          console.log(`📧 Resend ID: ${resendData.id}`);
        } else {
          console.error("❌ Resend Error:", resendData);
        }
        
      } catch (emailError) {
        console.error("❌ Email FAILED:", emailError.message);
        // Don't fail the payment if email fails
        console.log("⚠️ Payment succeeded but email failed - Token:", examToken);
      }

      // Always return success if payment is verified
      res.status(200).json({ 
        success: true, 
        token: examToken,
        message: "Payment verified successfully"
      });
      
    } else {
      res.status(400).json({ success: false, message: "Invalid Signature" });
    }
    
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};