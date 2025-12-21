import crypto from "crypto";
import nodemailer from "nodemailer";
import { instance } from "../server.js";
import { Payment } from "../models/payment.js";

// ... (Keep getApiKey and checkout functions exactly as they are) ...
export const getApiKey = (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
};
  
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

export const paymentVerification = async (req, res) => {
  console.log("🔹 Verification Started..."); 
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      
      // --- LOGIC UPDATE: SAME USER, SAME ROLL NUMBER ---
      let examToken;
      
      // 1. Check if this student exists already
      const existingStudent = await Payment.findOne({ email: email });

      if (existingStudent) {
        // RETURNING USER: Reuse their existing Roll Number
        examToken = existingStudent.examToken;
        console.log(`🔹 Existing Student Found. Reusing Token: ${examToken}`);
      } else {
        // NEW USER: Generate a new Roll Number
        examToken = Math.floor(10000000 + Math.random() * 90000000).toString();
        console.log(`🔹 New Student. Generated Token: ${examToken}`);
      }
      // --------------------------------------------------

      // 2. Save the NEW Payment to DB (History of all purchases)
      try {
        await Payment.create({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          email,
          examToken, // Will be same if returning, new if new
          status: "paid",
        });
        console.log("✅ Payment saved to DB");
      } catch (dbError) {
        console.error("⚠️ DB Save Error:", dbError.message);
      }

      // 3. Send Email (Port 587)
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        await transporter.sendMail({
          from: `"IIN Exams" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: 'Your IIN Exam Token',
          text: `Payment Successful! Your 8-digit Exam Token (Roll No) is: ${examToken}. Use this for all your tests. Login at iin-theta.vercel.app`
        });
        
        console.log(`✅ Email sent to ${email}`);
      } catch (emailError) {
        console.error("❌ Email FAILED:", emailError);
      }

      // 4. Return Success
      res.status(200).json({ success: true, token: examToken });

    } else {
      res.status(400).json({ success: false, message: "Invalid Signature" });
    }
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};