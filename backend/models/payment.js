import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String, required: true },
  razorpay_signature: { type: String, required: true },
  rollNumber: { 
    type: String, 
    index: true // <--- Optimized for fast student lookup
  }, 
  email: { 
    type: String, 
    index: true // <--- Optimized for fast login checks
  },      
  isUsed: { type: Boolean, default: false },
  testId: { type: String } 
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;