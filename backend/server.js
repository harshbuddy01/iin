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

// 🔥 CRITICAL: CORS must be FIRST before any other middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins for now (production should restrict this)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Initialize Razorpay
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY || "dummy_id",
  key_secret: process.env.RAZORPAY_API_SECRET || "dummy_secret",
});

// 🔥 CRITICAL: Health checks MUST come before static files
// Railway hits these endpoints to check if server is alive

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    database: 'MySQL', 
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    database: 'MySQL', 
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    port: process.env.PORT || 8400
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'IIN Backend API', 
    status: 'running',
    version: '1.0.0',
    endpoints: [
      '/health',
      '/api/health',
      '/api/verify-user-full',
      '/api/getkey',
      '/api/checkout',
      '/api/paymentverification'
    ]
  });
});

// ✅ LOGIN ROUTE
app.post("/api/verify-user-full", async (req, res) => {
  try {
    const { email, rollNumber } = req.body;
    
    console.log('🔍 Verify request:', { email, rollNumber });
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.log('❌ Invalid email format');
      return res.status(400).json({ 
        success: false, 
        status: 'ERROR',
        message: 'Valid email is required' 
      });
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    
    const [rows] = await pool.query(
      "SELECT * FROM students_payments WHERE email = ?", 
      [normalizedEmail]
    );
    
    console.log(`📊 Query result: ${rows.length} rows found`);
    
    if (rows.length === 0) {
      console.log('✅ NEW_USER');
      return res.json({ status: "NEW_USER" }); 
    }

    const student = rows[0];
    console.log('👤 Existing student found:', student.email);
    
    if (!rollNumber) {
      console.log('⚠️ EXISTING_USER_NEED_ROLL');
      return res.json({ status: "EXISTING_USER_NEED_ROLL" }); 
    }
    
    if (student.roll_number === rollNumber) {
      console.log('✅ VERIFIED');
      return res.json({ status: "VERIFIED" });
    } else {
      console.log('❌ WRONG_ROLL');
      return res.json({ status: "WRONG_ROLL" });
    }
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ 
      success: false, 
      status: 'ERROR',
      message: 'Server error. Please try again.' 
    });
  }
});

// ✅ FEEDBACK ROUTE
app.post("/api/feedback", async (req, res) => {
  try {
    const { email, rollNumber, testId, ratings, comment } = req.body;
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
      message: "Feedback submitted successfully."
    });
  } catch (error) {
    console.error("Feedback Error:", error);
    res.status(500).json({ success: false });
  }
});

// Mount API Routes
app.use("/api", paymentRoutes);
app.use("/api", adminRoutes);
app.use("/api", examRoutes);

// Static files LAST (so API routes take precedence)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../")));

// Error handler LAST
app.use(errorHandler);

const PORT = process.env.PORT || 8400;

(async () => {
  try {
    console.log('🔗 Connecting to database...');
    await connectDB();
    
    console.log('🛠️ Running migrations...');
    await runMigrations();
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server successfully started!`);
      console.log(`🚀 Listening on Port ${PORT}`);
      console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
      console.log(`🌐 CORS: Enabled for all origins`);
    });
  } catch (error) {
    console.error('❌ Startup Error:', error);
    process.exit(1);
  }
})();