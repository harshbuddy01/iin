import express from "express";
import { config } from "dotenv";
import Razorpay from "razorpay";
import cors from "cors";
import path from "path";               
import { fileURLToPath } from "url";   

// 👇 DATABASE CONNECTION
import { connectDB, pool } from "./config/mysql.js"; 
import { runMigrations } from "./config/runMigrations.js";
import { sendFeedbackEmail, sendUserConfirmation } from "./config/email.js";

// Route Imports
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

config();

const app = express();

// ✅ 1. THE BRIDGE: Serve your Frontend Files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../"))); 

// 🔥 EXPLICIT OPTIONS HANDLER - MUST BE FIRST!
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Check if origin is from Vercel or localhost
  if (origin && (/^https:\/\/.*\.vercel\.app$/.test(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  }
  
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// 🔥 DYNAMIC CORS - Allows ALL Vercel deployments
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // List of allowed patterns
    const allowedOrigins = [
      /^https:\/\/.*\.vercel\.app$/,  // Any Vercel subdomain
      /^http:\/\/localhost(:\d+)?$/,   // Localhost with any port
      /^http:\/\/127\.0\.0\.1(:\d+)?$/ // 127.0.0.1 with any port
    ];
    
    // Check if origin matches any pattern
    const isAllowed = allowedOrigins.some(pattern => pattern.test(origin));
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Razorpay
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY || "dummy_id",
  key_secret: process.env.RAZORPAY_API_SECRET || "dummy_secret",
});

// --- RESTORED ROUTES ---

// ✅ 2. LOGIN ROUTE (Fixed for MySQL)
app.post("/api/verify-user-full", async (req, res) => {
  try {
    const { email, rollNumber } = req.body;
    
    // Check MySQL Database
    const [rows] = await pool.query("SELECT * FROM students WHERE email = ?", [email.toLowerCase()]);
    
    if (rows.length === 0) return res.json({ status: "NEW_USER" }); 

    const student = rows[0];
    if (!rollNumber) return res.json({ status: "EXISTING_USER_NEED_ROLL" }); 
    
    if (student.roll_number === rollNumber) {
        return res.json({ status: "VERIFIED" });
    } else {
        return res.json({ status: "WRONG_ROLL" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false });
  }
});

// ✅ 3. FEEDBACK ROUTE (Email Works, DB Save Skipped)
// This keeps your email service alive without crashing the database
app.post("/api/feedback", async (req, res) => {
  try {
    const { email, rollNumber, testId, ratings, comment } = req.body;

    // Send Emails (This functionality is preserved!)
    const feedbackData = { email, rollNumber, testId, ratings, comment };
    
    try {
        await sendFeedbackEmail(feedbackData);
        await sendUserConfirmation(email.toLowerCase());
        console.log("✅ Feedback Emails Sent!");
    } catch (emailError) {
        console.error("❌ Email failed:", emailError);
    }

    res.json({ 
      success: true, 
      message: "Feedback submitted successfully. (Database save skipped during migration)"
    });

  } catch (error) {
    console.error("Feedback Error:", error);
    res.status(500).json({ success: false });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'MySQL', timestamp: new Date().toISOString() });
});

// Mount Routes
app.use("/api", paymentRoutes);
app.use("/api", adminRoutes);
app.use("/api", examRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8400;

// ✅ FIXED: Wrap async operations in IIFE to prevent top-level await crash
(async () => {
  try {
    await connectDB();
    await runMigrations();
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on Port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Fatal Error:', error);
    process.exit(1);
  }
})();