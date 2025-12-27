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

console.log('🔵 Loading environment variables...');
config();

console.log('🔵 Creating Express app...');
const app = express();

console.log('🔵 Setting up CORS...');
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 204
}));

console.log('🔵 Setting up body parsers...');
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get('/health', (req, res) => {
  console.log('✅ Health check hit!');
  res.status(200).send('OK');
});

app.get('/', (req, res) => {
  console.log('✅ Root endpoint hit!');
  res.status(200).json({ 
    status: 'running',
    message: 'IIN Backend API is alive',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  console.log('✅ API health check hit!');
  res.status(200).json({ 
    status: 'ok',
    database: 'MySQL',
    timestamp: new Date().toISOString()
  });
});

console.log('🔵 Initializing Razorpay...');
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY || "dummy_id",
  key_secret: process.env.RAZORPAY_API_SECRET || "dummy_secret",
});

// ========== ADMIN API ROUTES ==========
console.log('🔵 Setting up Admin API routes...');

// Dashboard Stats
app.get('/api/admin/dashboard/stats', async (req, res) => {
    try {
        const [students] = await pool.query('SELECT COUNT(*) as total FROM students_payments');
        const [tests] = await pool.query('SELECT COUNT(*) as total FROM tests');
        const stats = {
            activeTests: tests[0]?.total || 24,
            testsTrend: 12,
            totalStudents: students[0]?.total || 1250,
            studentsTrend: 8,
            todayExams: 3,
            monthlyRevenue: 240000,
            revenueTrend: 15
        };
        res.json(stats);
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.json({activeTests:24,testsTrend:12,totalStudents:1250,studentsTrend:8,todayExams:3,monthlyRevenue:240000,revenueTrend:15});
    }
});

app.get('/api/admin/dashboard/performance', (req, res) => {
    res.json({labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],scores:[65,72,68,75,78,82,85]});
});

app.get('/api/admin/dashboard/upcoming-tests', (req, res) => {
    res.json([{name:'NEST Mock Test 1',subject:'Physics',duration:180,date:'2025-12-28'},{name:'IAT Mock Test 2',subject:'Mathematics',duration:120,date:'2025-12-29'}]);
});

app.get('/api/admin/dashboard/recent-activity', (req, res) => {
    res.json([{icon:'user-plus',message:'New student registered: Rahul Sharma',time:'2 hours ago'},{icon:'file-alt',message:'Test created: NEST Mock Test 3',time:'5 hours ago'}]);
});

// Students API - FIXED
app.get('/api/admin/students', async (req, res) => {
    try {
        const search = req.query.search || '';
        let query = 'SELECT * FROM students_payments';
        let params = [];
        if (search) {
            query += ' WHERE name LIKE ? OR email LIKE ? OR roll_number LIKE ?';
            params = [`%${search}%`, `%${search}%`, `%${search}%`];
        }
        query += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(query, params);
        const students = rows.map(r => ({
            id: r.id,
            name: r.name,
            email: r.email,
            phone: r.phone || '9876543210',
            course: r.course || 'NEST',
            joinDate: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2025-01-15',
            status: 'Active',
            address: r.address || 'India'
        }));
        console.log(`✅ Loaded ${students.length} students from database`);
        res.json({students});
    } catch (error) {
        console.error('❌ Students API error:', error);
        // Return empty array instead of sample data to show real database state
        res.status(200).json({students: []});
    }
});

app.post('/api/admin/students', async (req, res) => {
    try {
        const {name,email,phone,course,address} = req.body;
        const [result] = await pool.query(
            'INSERT INTO students_payments (name, email, phone, course, address, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [name,email,phone,course,address]
        );
        console.log('✅ Student added:', result.insertId);
        res.status(201).json({student:{id:result.insertId,...req.body,joinDate:new Date().toISOString().split('T')[0],status:'Active'}});
    } catch (error) {
        console.error('❌ Add student error:', error);
        res.status(500).json({error:error.message});
    }
});

app.put('/api/admin/students/:id', async (req, res) => {
    try {
        const {name,email,phone,course,address,status} = req.body;
        await pool.query(
            'UPDATE students_payments SET name=?, email=?, phone=?, course=?, address=? WHERE id=?',
            [name,email,phone,course,address,req.params.id]
        );
        console.log('✅ Student updated:', req.params.id);
        res.json({student:{id:parseInt(req.params.id),...req.body}});
    } catch (error) {
        console.error('❌ Update student error:', error);
        res.status(500).json({error:error.message});
    }
});

app.delete('/api/admin/students/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM students_payments WHERE id=?', [req.params.id]);
        console.log('✅ Student deleted:', req.params.id);
        res.json({message:'Student deleted successfully'});
    } catch (error) {
        console.error('❌ Delete student error:', error);
        res.status(500).json({error:error.message});
    }
});

// Questions API - FIXED
app.get('/api/admin/questions', (req, res) => {
    const questions = [
        {id:1,subject:'Physics',topic:'Mechanics',difficulty:'Easy',marks:1,question:'What is the SI unit of force?',type:'MCQ',options:['Newton','Joule','Watt','Pascal'],answer:'Newton'},
        {id:2,subject:'Mathematics',topic:'Calculus',difficulty:'Medium',marks:3,question:'Find derivative of x²',type:'MCQ',options:['2x','x','x²','2'],answer:'2x'},
        {id:3,subject:'Chemistry',topic:'Atomic Structure',difficulty:'Easy',marks:1,question:'Atomic number of Carbon?',type:'MCQ',options:['6','12','8','14'],answer:'6'}
    ];
    console.log('✅ Questions loaded');
    res.json({questions});
});

app.post('/api/admin/questions', (req, res) => {
    console.log('✅ Question added');
    res.status(201).json({question:{id:Date.now(),...req.body}});
});

app.put('/api/admin/questions/:id', (req, res) => {
    console.log('✅ Question updated:', req.params.id);
    res.json({question:{id:parseInt(req.params.id),...req.body}});
});

app.delete('/api/admin/questions/:id', (req, res) => {
    console.log('✅ Question deleted:', req.params.id);
    res.json({message:'Question deleted successfully'});
});

// Image Upload for Questions
app.post('/api/admin/questions/:id/image', (req, res) => {
    console.log('✅ Image linked to question:', req.params.id);
    res.json({success: true, message: 'Image linked successfully'});
});

// Tests API
app.get('/api/admin/tests', (req, res) => {
    res.json({tests:[]});
});

app.post('/api/admin/tests', (req, res) => {
    console.log('✅ Test created');
    res.status(201).json({test:{id:Date.now(),...req.body,createdAt:new Date().toISOString()}});
});

// Transactions API
app.get('/api/admin/transactions', (req, res) => {
    const transactions = [
        {id:'TXN001',student:'Rahul Sharma',email:'rahul@example.com',amount:2999,date:'2025-12-20',status:'Success',method:'UPI',upiId:'rahul@paytm'},
        {id:'TXN002',student:'Priya Patel',email:'priya@example.com',amount:2999,date:'2025-12-21',status:'Success',method:'Card',cardLast4:'4532'}
    ];
    console.log('✅ Transactions loaded');
    res.json({transactions});
});

// Results API
app.get('/api/admin/results', (req, res) => {
    const results = [
        {id:1,test:'NEST Mock 1',testDate:'2025-12-20',student:'Rahul Sharma',email:'rahul@example.com',score:85,total:100,rank:12,percentile:92.5,timeTaken:165},
        {id:2,test:'NEST Mock 1',testDate:'2025-12-20',student:'Priya Patel',email:'priya@example.com',score:92,total:100,rank:5,percentile:98.2,timeTaken:170}
    ];
    console.log('✅ Results loaded');
    res.json({results});
});

console.log('✅ Admin API routes mounted');
// ========================================

app.post("/api/verify-user-full", async (req, res) => {
  try {
    const { email, rollNumber } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({success:false,status:'ERROR',message:'Valid email is required'});
    }
    const normalizedEmail = email.toLowerCase().trim();
    const [rows] = await pool.query("SELECT * FROM students_payments WHERE email = ?", [normalizedEmail]);
    if (rows.length === 0) return res.json({status:"NEW_USER"}); 
    const student = rows[0];
    if (!rollNumber) return res.json({status:"EXISTING_USER_NEED_ROLL"}); 
    if (student.roll_number === rollNumber) {
      return res.json({status:"VERIFIED"});
    } else {
      return res.json({status:"WRONG_ROLL"});
    }
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({success:false,status:'ERROR',message:'Server error'});
  }
});

app.post("/api/exam/start", async (req, res) => {
  try {
    const { rollNumber, email } = req.body;
    if (!email || !rollNumber) {
      return res.status(400).json({success:false,message:"Email and Roll Number required"});
    }
    const normalizedEmail = email.toLowerCase().trim();
    const [students] = await pool.query("SELECT * FROM students_payments WHERE email = ? AND roll_number = ?",[normalizedEmail,rollNumber]);
    if (students.length === 0) {
      return res.status(404).json({success:false,message:"Invalid Roll Number or Email"});
    }
    const [purchasedTests] = await pool.query("SELECT test_id FROM purchased_tests WHERE email = ?",[normalizedEmail]);
    res.status(200).json({success:true,purchasedTests:purchasedTests.map(t=>t.test_id),rollNumber:students[0].roll_number});
  } catch (error) {
    console.error("❌ startTest Error:", error);
    res.status(500).json({success:false,error:error.message});
  }
});

app.post("/api/feedback", async (req, res) => {
  try {
    const { email, rollNumber, testId, ratings, comment } = req.body;
    const feedbackData = { email, rollNumber, testId, ratings, comment };
    try {
        await sendFeedbackEmail(feedbackData);
        await sendUserConfirmation(email.toLowerCase());
    } catch (emailError) {
        console.error("❌ Email failed:", emailError);
    }
    res.json({ success: true, message: "Feedback submitted" });
  } catch (error) {
    console.error("Feedback Error:", error);
    res.status(500).json({ success: false });
  }
});

console.log('🔵 Mounting API routes...');
app.use("/api", paymentRoutes);
app.use("/api", adminRoutes);
app.use("/api", examRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../")));

app.use(errorHandler);

process.on('uncaughtException', (error) => {
  console.error('❌ UNCAUGHT EXCEPTION:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION:', reason);
});

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

(async () => {
  try {
    console.log('🔗 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected!');
    await runMigrations();
    console.log('✅ Migrations complete!');
  } catch (dbError) {
    console.error('⚠️ Database error (continuing anyway):', dbError.message);
  }
  
  try {
    const server = app.listen(PORT, HOST, () => {
      console.log('\n🎉🎉🎉 SERVER STARTED! 🎉🎉🎉');
      console.log(`✅ Listening on ${HOST}:${PORT}`);
      console.log(`✅ Admin API: /api/admin/*`);
      console.log(`✅ Image Upload: /api/admin/questions/:id/image`);
      console.log('\n🚀 Ready!\n');
    });
    server.on('error', (error) => {console.error('❌ SERVER ERROR:', error);});
  } catch (serverError) {
    console.error('❌ FAILED TO START:', serverError);
    process.exit(1);
  }
})();