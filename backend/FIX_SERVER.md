# 🔧 FIX: Enable OOP Routes in server.js

## ❌ Current Problem

Railway deployed successfully BUT OOP routes are NOT working because:
- `server.js` has hardcoded question routes
- `questionRoutes.js` exists but is NOT imported
- Result: `/api/admin/questions-v2` returns 404

---

## ✅ Quick Fix (2 Minutes)

### Step 1: Open `backend/server.js`

### Step 2: Add this import (after line 14, after other route imports):

```javascript
// Route Imports
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import pdfRoutes from "./routes/pdf.js";
import questionRoutes from "./routes/questionRoutes.js"; // 👈 ADD THIS LINE
import { errorHandler } from "./middlewares/errorMiddleware.js";
```

### Step 3: Find the hardcoded question routes (around line 260-350)

Look for:
```javascript
// Questions API
app.get('/api/admin/questions', async (req, res) => {
    try {
        console.log('🔍 Fetching questions from MySQL database...');
        // ... lots of code ...
    }
});
```

### Step 4: REPLACE all hardcoded question routes with:

```javascript
// ========== QUESTION ROUTES (OLD + NEW OOP) ==========
app.use('/api/admin', questionRoutes);
console.log('✅ Question routes mounted (OLD + NEW OOP routes)');
// =====================================================
```

### Step 5: DELETE these hardcoded routes (they're now in questionRoutes.js):

```javascript
// DELETE from line ~260 to ~350:
- app.get('/api/admin/questions', ...)
- app.post('/api/admin/questions', ...)
- app.put('/api/admin/questions/:id', ...)
- app.delete('/api/admin/questions/:id', ...)
- app.post('/api/admin/questions/:id/image', ...)
```

---

## 🚀 Deploy Fix

After making changes:

```bash
cd backend
git add server.js
git commit -m "fix: Import questionRoutes to enable OOP endpoints"
git push origin main
```

Railway will auto-deploy in 2-3 minutes!

---

## ✅ Verify Fix

After deployment, test:

```bash
# Test OLD route (should still work)
curl https://iin-production.up.railway.app/api/admin/questions?limit=1

# Test NEW OOP route (should NOW work!)
curl https://iin-production.up.railway.app/api/admin/questions-v2?limit=1

# Test NEW statistics feature
curl https://iin-production.up.railway.app/api/admin/questions-v2/stats/all
```

---

## 🎯 Expected Railway Logs After Fix

You should see:
```
✅ Question routes mounted (OLD + NEW OOP routes)
🆕 [QUESTIONS-OOP] Fetching questions with OOP service...
```

---

## ⚡ Alternative: Let Me Create the Fixed File

If you want, I can:
1. Create the complete fixed `server.js`
2. Push it to GitHub
3. Railway auto-deploys
4. OOP routes work immediately!

Just say "create fixed server.js" and I'll do it!
