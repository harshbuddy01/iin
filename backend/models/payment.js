import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String, required: true },
  razorpay_signature: { type: String, required: true },
  email: { type: String, required: true, index: true },      
  examToken: { type: String, required: true, index: true }, 
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export const Payment = mongoose.model("Payment", paymentSchema);