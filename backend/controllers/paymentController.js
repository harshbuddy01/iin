import crypto from "crypto";
import nodemailer from "nodemailer";
import { instance } from "../server.js";
import { Payment } from "../models/payment.js";

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
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // 1. Generate Token
    const examToken = Math.floor(10000000 + Math.random() * 90000000).toString();

    // 2. Save to DB First
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      examToken,
      status: "paid",
    });

    // 3. Send Email (The Fix for Timeout)
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,  // SSL Port
        secure: true,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        },
        tls: {
          // THIS IS THE CRITICAL FIX FOR RAILWAY TIMEOUTS
          rejectUnauthorized: false,
          family: 4 
        }
      });

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Your IIN Exam Token',
        text: `Success! Your 8-digit Exam Token is: ${examToken}. Login at iin-theta.vercel.app`
      });
      console.log("✅ Email sent successfully");
    } catch (err) {
      console.error("❌ Email failed:", err.message);
    }

    res.status(200).json({ success: true, token: examToken });
  } else {
    res.status(400).json({ success: false, message: "Invalid Signature" });
  }
};