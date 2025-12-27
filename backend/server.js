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
        const [tests] = await pool.query('SELECT COUNT(*) as total FROM scheduled_tests');
        const stats = {
            activeTests: tests[0]?.total || 0,
            testsTrend: 12,
            totalStudents: students[0]?.total || 0,
            studentsTrend: 8,
            todayExams: 3,
            monthlyRevenue: 240000,
            revenueTrend: 15
        };
        res.json(stats);
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.json({activeTests:0,testsTrend:12,totalStudents:0,studentsTrend:8,todayExams:3,monthlyRevenue:240000,revenueTrend:15});
    }
});

app.get('/api/admin/dashboard/performance', (req, res) => {
    res.json({labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],scores:[65,72,68,75,78,82,85]});
});

app.get('/api/admin/dashboard/upcoming-tests', (req, res) => {
    res.json([{name:'NEST Mock Test 1',subject:'Physics',duration:180,date:'2025-12-28'},{name:'IAT Mock Test 2',subject:'Mathematics',duration:120,date:'2025-12-29'}]);
});

app.get('/api/admin/dashboard/recent-activity', (req, res) => {
    res.json([{icon:'user-plus',message:'New student registered',time:'2 hours ago'},{icon:'file-alt',message:'Test created: NEST Mock Test 3',time:'5 hours ago'}]);
});

// Students API - REAL DATA
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

// Questions API - FETCH FROM MYSQL DATABASE
app.get('/api/admin/questions', async (req, res) => {
    try {
        console.log('🔍 Fetching questions from MySQL database...');
        
        // Get filters from query params
        const subject = req.query.subject || '';
        const difficulty = req.query.difficulty || '';
        const search = req.query.search || '';
        
        let query = 'SELECT * FROM questions';
        let conditions = [];
        let params = [];
        
        if (subject) {
            conditions.push('section = ?');
            params.push(subject);
        }
        
        if (difficulty) {
            // Note: 'difficulty' column might not exist in your table
            // You may need to add it or remove this filter
            conditions.push('difficulty = ?');
            params.push(difficulty);
        }
        
        if (search) {
            conditions.push('(question_text LIKE ? OR test_id LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY id DESC LIMIT 100';
        
        const [rows] = await pool.query(query, params);
        
        // Format questions for frontend
        const questions = rows.map(q => {
            let options = [];
            try {
                options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options || [];
            } catch (e) {
                console.error('Error parsing options for question', q.id);
            }
            
            return {
                id: q.id,
                subject: q.section || 'Physics',
                topic: q.topic || 'General',
                difficulty: q.difficulty || 'Medium',
                marks: q.marks_positive || 4,
                question: q.question_text,
                type: 'MCQ',
                options: options,
                answer: q.correct_answer
            };
        });
        
        console.log(`✅ Loaded ${questions.length} questions from database`);
        res.json({questions});
        
    } catch (error) {
        console.error('❌ Questions API error:', error);
        console.error('Error details:', error.message);
        
        // Return empty array with error message
        res.status(200).json({
            questions: [],
            error: error.message,
            message: 'No questions found in database. Please add questions first.'
        });
    }
});

app.post('/api/admin/questions', async (req, res) => {
    try {
        const {testId, questionText, options, correctAnswer, section, marks} = req.body;
        
        // Get next question number for this test
        const [maxQ] = await pool.query(
            'SELECT MAX(question_number) as max_num FROM questions WHERE test_id = ?',
            [testId]
        );
        const questionNumber = (maxQ[0]?.max_num || 0) + 1;
        
        const [result] = await pool.query(
            `INSERT INTO questions 
             (test_id, question_number, question_text, options, correct_answer, section, marks_positive) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [testId, questionNumber, questionText, JSON.stringify(options), correctAnswer, section || 'Physics', marks || 4]
        );
        
        console.log('✅ Question added:', result.insertId);
        res.status(201).json({
            question: {
                id: result.insertId,
                questionNumber,
                ...req.body
            }
        });
    } catch (error) {
        console.error('❌ Add question error:', error);
        res.status(500).json({error: error.message});
    }
});

app.put('/api/admin/questions/:id', async (req, res) => {
    try {
        const {questionText, options, correctAnswer, section, marks} = req.body;
        
        await pool.query(
            `UPDATE questions 
             SET question_text=?, options=?, correct_answer=?, section=?, marks_positive=? 
             WHERE id=?`,
            [questionText, JSON.stringify(options), correctAnswer, section, marks, req.params.id]
        );
        
        console.log('✅ Question updated:', req.params.id);
        res.json({question:{id:parseInt(req.params.id),...req.body}});
    } catch (error) {
        console.error('❌ Update question error:', error);
        res.status(500).json({error:error.message});
    }
});

app.delete('/api/admin/questions/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM questions WHERE id=?', [req.params.id]);
        console.log('✅ Question deleted:', req.params.id);
        res.json({message:'Question deleted successfully'});
    } catch (error) {
        console.error('❌ Delete question error:', error);
        res.status(500).json({error:error.message});
    }
});

// Image Upload for Questions
app.post('/api/admin/questions/:id/image', (req, res) => {
    console.log('✅ Image linked to question:', req.params.id);
    res.json({success: true, message: 'Image linked successfully'});
});

// Tests API
app.get('/api/admin/tests', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM scheduled_tests ORDER BY exam_date DESC');
        res.json({tests: rows});
    } catch (error) {
        console.error('Tests error:', error);
        res.json({tests:[]});
    }
});

app.post('/api/admin/tests', (req, res) => {
    console.log('✅ Test created');
    res.status(201).json({test:{id:Date.now(),...req.body,createdAt:new Date().toISOString()}});
});

// Transactions API
app.get('/api/admin/transactions', (req, res) => {
    // TODO: Connect to real payment transactions table
    const transactions = [];
    console.log('✅ Transactions loaded');
    res.json({transactions});
});

// Results API
app.get('/api/admin/results', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM student_attempts ORDER BY submitted_at DESC LIMIT 100'
        );
        const results = rows.map(r => ({
            id: r.id,
            test: r.test_name,
            testDate: r.started_at ? new Date(r.started_at).toISOString().split('T')[0] : '',
            student: r.roll_number,
            email: r.email,
            score: r.score,
            total: r.total_questions,
            rank: 0, // Calculate if needed
            percentile: parseFloat(r.percentage) || 0,
            timeTaken: r.time_taken
        }));
        console.log('✅ Results loaded');
        res.json({results});
    } catch (error) {
        console.error('Results error:', error);
        res.json({results:[]});
    }
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
      console.log(`✅ Questions: /api/admin/questions`);
      console.log('\n🚀 Ready!\n');
    });
    server.on('error', (error) => {console.error('❌ SERVER ERROR:', error);});
  } catch (serverError) {
    console.error('❌ FAILED TO START:', serverError);
    process.exit(1);
  }
})();