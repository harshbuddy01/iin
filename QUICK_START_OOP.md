# ⚡ Quick Start - Using OOP Code

**Time to read:** 5 minutes  
**Time to implement:** 30 minutes

---

## 🚀 For Hostinger Migration (Jan 2, 2026)

### Step 1: Update .env File (2 minutes)

```bash
# OLD (Railway)
MYSQLHOST=railway-host
MYSQLUSER=root
MYSQLPASSWORD=railway-password
MYSQL_DATABASE=railway

# NEW (Hostinger) - Just uncomment these!
DB_HOST=hostinger-mysql-host    # ← Get from Hostinger
DB_USER=your-username           # ← Get from Hostinger  
DB_PASSWORD=your-password       # ← Get from Hostinger
DB_NAME=your-database           # ← Get from Hostinger
DB_PORT=3306

# That's it! Code stays the same!
```

### Step 2: Test Connection (1 minute)

```bash
# Start your server
npm start

# You should see:
✅ Database connection successful!
   Host: hostinger-mysql-host
   Database: your-database
```

**Done!** Your database is now connected to Hostinger!

---

## 💻 Using OOP in Routes (Easy Way)

### Method 1: Add New Route (Safest - Recommended!)

```javascript
// backend/routes/questionRoutes.js

import express from 'express';
import { pool } from '../config/mysql.js';  // OLD
import { QuestionService } from '../services/QuestionService.js';  // NEW

const router = express.Router();
const questionService = new QuestionService();  // NEW

// OLD route - Keep it working!
router.get('/questions', async (req, res) => {
    // ... your existing code stays here
    // DON'T TOUCH THIS!
});

// NEW OOP route - Add this!
router.get('/questions-v2', async (req, res) => {
    try {
        const result = await questionService.getAllQuestions(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

export default router;
```

**Test both:**
```bash
# Old version (should work)
curl http://localhost:3000/api/admin/questions

# New OOP version (should also work)
curl http://localhost:3000/api/admin/questions-v2

# Compare results - should be IDENTICAL!
```

---

## 🎯 Available OOP Methods

### QuestionService Methods:

```javascript
import { QuestionService } from '../services/QuestionService.js';
const questionService = new QuestionService();

// 1. Get all questions
const result = await questionService.getAllQuestions({
    subject: 'Physics',      // Optional
    difficulty: 'Medium',    // Optional
    search: 'Newton',        // Optional
    limit: 50,              // Optional (default: 100)
    offset: 0               // Optional (for pagination)
});

// 2. Get single question
const result = await questionService.getQuestionById(123);

// 3. Get questions for a test
const result = await questionService.getQuestionsByTestId('TEST001');

// 4. Get exam questions (no answers shown)
const result = await questionService.getExamQuestions('TEST001');

// 5. Create new question
const result = await questionService.createQuestion({
    testId: 'TEST001',
    questionText: 'What is 2+2?',
    options: ['2', '3', '4', '5'],
    correctAnswer: '4',
    section: 'Mathematics',
    difficulty: 'Easy',
    marks: 4
});

// 6. Update question
const result = await questionService.updateQuestion(123, {
    questionText: 'Updated question',
    marks: 5
});

// 7. Delete question
const result = await questionService.deleteQuestion(123);

// 8. Check answer
const result = await questionService.checkAnswer(123, 'Student answer');

// 9. Get statistics
const result = await questionService.getStatistics({
    testId: 'TEST001'  // Optional
});
```

---

## 🛡️ Error Handling (Built-in!)

### Before OOP:
```javascript
// ❌ No validation
const [rows] = await pool.query('INSERT INTO questions VALUES (?)', [data]);
// If data is bad, database crashes!
```

### After OOP:
```javascript
// ✅ Automatic validation
try {
    const result = await questionService.createQuestion(badData);
} catch (error) {
    console.error(error.message);
    // "Validation failed: Question text must be at least 5 characters long"
}
// Database never sees bad data!
```

---

## 💡 Common Patterns

### Pattern 1: GET with Filters

```javascript
router.get('/questions', async (req, res) => {
    try {
        // req.query automatically passed to service
        const result = await questionService.getAllQuestions(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

### Pattern 2: POST with Validation

```javascript
router.post('/questions', async (req, res) => {
    try {
        // Validation happens automatically in service
        const result = await questionService.createQuestion(req.body);
        res.status(201).json(result);
    } catch (error) {
        // Validation errors caught here
        res.status(400).json({ error: error.message });
    }
});
```

### Pattern 3: PUT with Existence Check

```javascript
router.put('/questions/:id', async (req, res) => {
    try {
        // Service checks if question exists
        const result = await questionService.updateQuestion(
            req.params.id, 
            req.body
        );
        res.json(result);
    } catch (error) {
        // "Question not found" if doesn't exist
        res.status(404).json({ error: error.message });
    }
});
```

---

## ✅ Response Format

### All responses follow this structure:

```javascript
// Success
{
    "success": true,
    "questions": [...],
    "count": 50,
    "responseTime": "45ms"
}

// Error
{
    "success": false,
    "error": "Validation failed: ..."
}
```

---

## 🐞 Debugging

### Check Environment:

```javascript
import { env } from './config/Environment.js';

// Print all config
env.printConfig();

// Check specific values
console.log('Database host:', env.database.host);
console.log('Is production?', env.isProduction);
console.log('OOP enabled?', env.features.useOOPQuestions);
```

### Check Database Connection:

```javascript
import { db } from './config/DatabaseConnection.js';

// Test connection
await db.testConnection();

// Get health check
const health = await db.getHealthCheck();
console.log(health);
```

### Check Question Parsing:

```javascript
import { Question } from './models/Question.js';

// Test with your problematic data
const question = new Question({
    options: '"[\"A\", \"B\", \"C\"]"'  // Your double-encoded JSON
});

console.log(question.options);  // Should be: ['A', 'B', 'C']
```

---

## 📊 Performance Tips

### 1. Use Pagination

```javascript
// Bad: Get all questions (slow if 1000+ questions)
const result = await questionService.getAllQuestions();

// Good: Get 50 at a time
const result = await questionService.getAllQuestions({
    limit: 50,
    offset: 0  // Page 1
});
```

### 2. Use Specific Filters

```javascript
// Bad: Get all, filter in JavaScript
const all = await questionService.getAllQuestions();
const physics = all.questions.filter(q => q.subject === 'Physics');

// Good: Filter in database (faster)
const physics = await questionService.getAllQuestions({
    subject: 'Physics'
});
```

### 3. Cache Static Data

```javascript
// If questions don't change often
let questionsCache = null;
let cacheTime = null;

router.get('/questions', async (req, res) => {
    // Cache for 5 minutes
    if (!questionsCache || Date.now() - cacheTime > 300000) {
        questionsCache = await questionService.getAllQuestions();
        cacheTime = Date.now();
    }
    res.json(questionsCache);
});
```

---

## ❓ FAQ

### Q: Will this break my current website?
**A:** No! New OOP code is separate. Old code still works.

### Q: Do I need to change my frontend?
**A:** No! API responses have the same format.

### Q: What if OOP has bugs?
**A:** Use old route (`/questions`) instead of new (`/questions-v2`).

### Q: When should I switch to OOP?
**A:** After testing both routes and confirming identical results.

### Q: Can I mix old and new code?
**A:** Yes! Use OOP for new features, keep old code working.

### Q: How do I roll back?
**A:** Change `USE_OOP_QUESTIONS=false` in .env file.

---

## 🎯 Next Steps

1. ✅ Read [OOP_MIGRATION_GUIDE.md](./OOP_MIGRATION_GUIDE.md) for full details
2. ⏳ Test OOP locally with `/questions-v2` route
3. ⏳ Compare old vs new responses
4. ⏳ Update .env for Hostinger (Jan 2)
5. ⏳ Deploy and test
6. ⏳ Gradually switch to OOP

---

## 📞 Need Help?

### Check these files:
- `backend/models/Question.js` - Data structure & validation
- `backend/services/QuestionService.js` - Business logic
- `backend/repositories/QuestionRepository.js` - Database queries
- `backend/config/Environment.js` - Configuration

### Test examples:
- Look in `OOP_MIGRATION_GUIDE.md` under "Testing Guide"

---

**Good luck! 🚀**

*Remember: Take it slow, test thoroughly, and you'll be fine!*
