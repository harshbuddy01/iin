import express from "express";
import { config } from "dotenv";
import Razorpay from "razorpay";
import cors from "cors";
import connectDB from "./config/db.js";

// Route Imports
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import examRoutes from "./routes/examRoutes.js";

// Middleware Imports
import { errorHandler } from "./middlewares/errorMiddleware.js";

// 1. Load Environment Variables (Do this before anything else)
config();

// 2. Connect to MongoDB
connectDB();

const app = express();

// 3. Global Middleware (CORS and Body Parsers)
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 4. Initialize Razorpay Instance
// We check for variables here to help you debug Railway logs
console.log("Checking Razorpay ID:", process.env.RAZORPAY_API_KEY ? "EXISTS" : "MISSING");
console.log("Checking Razorpay Secret:", process.env.RAZORPAY_API_SECRET ? "EXISTS" : "MISSING");

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY || "dummy_id",
  key_secret: process.env.RAZORPAY_API_SECRET || "dummy_secret",
});

// 5. API Routes
app.use("/api", paymentRoutes);
app.use("/api", adminRoutes);
app.use("/api", examRoutes);

// 6. Error Handler (MUST be the final middleware)
app.use(errorHandler);

// 7. Server Listener - Configured for Railway
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on Port ${PORT}`);
});