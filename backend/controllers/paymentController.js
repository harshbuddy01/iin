import { instance } from "../server.js";
import crypto from "crypto";
import Payment from "../models/payment.js";
import nodemailer from "nodemailer";

// Send the Razorpay Key to the frontend
export const getApiKey = (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
};

// Create a new Razorpay Order
export const checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
      notes: { courseId: req.body.testId } 
    };
    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Verify the payment and handle the Roll Number (Token) logic
export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString()).digest("hex");

    if (expectedSignature === razorpay_signature) {
      const order = await instance.orders.fetch(razorpay_order_id);
      const testId = order.notes.courseId; 
      const paymentDetails = await instance.payments.fetch(razorpay_payment_id);
      const userEmail = paymentDetails.email.toLowerCase(); 
      
      // LOGIC: Reuse existing Roll Number for the same email
      let rollNumber;
      const existingUser = await Payment.findOne({ email: userEmail });
      
      if (existingUser) {
        rollNumber = existingUser.rollNumber;
      } else {
        rollNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
      }

      // Save the record to database
      await Payment.create({
        razorpay_order_id, razorpay_payment_id, razorpay_signature,
        rollNumber, email: userEmail, isUsed: false, testId 
      });

      // EMAIL: Asynchronous (no 'await') to prevent 1-minute loading
      if (userEmail) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
        });

        const emailText = `Success! \n\nAccess granted for ${testId.toUpperCase()}. \n\nYour Exam Token: ${rollNumber} \n\nUse this same token for all purchases at IIN.`;
        const mailOptions = { from: process.env.GMAIL_USER, to: userEmail, subject: "IIN Test Access Activated", text: emailText };
        
        // This fires in the background
        transporter.sendMail(mailOptions).catch(err => console.log("Email error:", err));
      }

      // REDIRECT: To live Vercel success page
      const redirectURL = "https://iin-theta.vercel.app/paymentsuccess.html";
      res.redirect(`${redirectURL}?reference=${razorpay_payment_id}&roll=${rollNumber}`);
      
    } else {
      res.status(400).json({ success: false, error: "Signature mismatch" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};