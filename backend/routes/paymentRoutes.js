import express from "express";
import rateLimit from "express-rate-limit";
// Ensure all three functions are imported correctly
import { checkout, paymentVerification, getApiKey } from "../controllers/paymentController.js";
import { 
  validateCheckout, 
  validatePaymentVerification,
  paymentRateLimit 
} from "../middlewares/validation.js";

const router = express.Router();

// 🔴 FIX #8: ADD RATE LIMITING ON PAYMENT ENDPOINTS
// Prevents abuse and excessive payment attempts
const limiter = rateLimit(paymentRateLimit);

// 🔴 FIX #8: ADD INPUT VALIDATION TO ALL PAYMENT ENDPOINTS
router.route("/getkey").get(getApiKey);
router.route("/checkout")
  .post(limiter, validateCheckout, checkout);
router.route("/paymentverification")
  .post(limiter, validatePaymentVerification, paymentVerification);

export default router;
