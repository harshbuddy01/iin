# Schedule Test Integration Guide

## ✅ COMPLETED: Backend + Frontend Integration

Date: December 28, 2025

---

## 📋 What Was Done

### 1. **Backend Analysis** ✅
- **Endpoint:** `POST /api/admin/create-test`
- **Location:** `backend/routes/adminRoutes.js`
- **Controller:** `backend/controllers/adminController.js`
- **Function:** `createScheduledTest()`
- **Status:** ✅ Working and tested

### 2. **Frontend Handler Created** ✅
- **File:** `frontend/js/schedule-test-handler.js`
- **Purpose:** Connects Schedule Test modal form to Railway backend
- **Status:** ✅ Production-ready code

---

## 🔧 How It Works

### Backend Expected Data Format:
```javascript
{
  testId: "TEST-1735377669000-abc123",    // Auto-generated unique ID
  testName: "IAT Physics Mock Test",       // From form input
  testType: "mock",                        // From dropdown (lowercased)
  examDate: "2025-12-28",                  // From date picker (YYYY-MM-DD)
  startTime: "10:00",                      // From time picker (HH:MM)
  durationMinutes: 180,                    // From number input (minutes)
  description: "Subject: Physics"          // Optional - built from subject field
}
```

### Frontend Handler Features:

1. **Auto-generates unique Test ID** using timestamp + random string
2. **Validates all required fields** before submission
3. **Checks for past dates** - prevents scheduling tests in the past
4. **Multiple selector fallbacks** - works even if HTML structure changes
5. **Proper error handling** with user-friendly messages
6. **Success notifications** with auto-reload
7. **Loading states** on submit button

---

## 📝 Integration Steps

### Step 1: Include the Script in HTML

Add this line in your `admin-dashboard-v2.html` BEFORE the closing `</body>` tag:

```html
<!-- Schedule Test Handler -->
<script src="js/schedule-test-handler.js"></script>
```

**IMPORTANT:** This script should load AFTER:
- jQuery (if used)
- Admin utilities
- Other admin scripts

### Step 2: Verify Railway Backend is Running

Check that Railway backend is accessible:
```bash
https://iin-production.up.railway.app/api/admin/scheduled-tests
```

Should return list of tests (or empty array if no tests exist).

### Step 3: Test the Integration

1. Go to: `https://iinedu.vercel.app/admin-dashboard-v2.html`
2. Click "+ Schedule New Test" button
3. Fill in the form:
   - Test Name: "Test Integration"
   - Exam Type: Select "Mock"
   - Subject: "Physics"
   - Date: Select tomorrow's date
   - Time: Select "10:00"
   - Duration: 180 minutes
   - Questions: 50
   - Total Marks: 100
4. Click "Schedule Test" button
5. **Expected Result:** Success message + test appears in list

---

## 🐛 Troubleshooting

### Issue 1: "Failed to schedule test"
**Cause:** Backend endpoint not reachable
**Solution:** 
- Check Railway deployment status
- Verify backend is running
- Check browser console for CORS errors

### Issue 2: "Missing required fields"
**Cause:** Form validation failed
**Solution:**
- Fill in all required fields (marked with *)
- Check date is not in the past
- Ensure exam type is selected (not "Select Type")

### Issue 3: "Test with this ID already exists"
**Cause:** Duplicate testId (very rare)
**Solution:**
- Refresh page and try again
- The auto-generated ID uses timestamp, so this is nearly impossible

### Issue 4: Button doesn't work
**Cause:** Script not loaded
**Solution:**
- Check browser console for JavaScript errors
- Verify `schedule-test-handler.js` is included in HTML
- Check file path is correct: `js/schedule-test-handler.js`

---

## 🔐 Security Notes

1. **No authentication included yet** - Backend endpoint is open
2. **TODO:** Add JWT token authentication
3. **TODO:** Add admin role verification
4. **TODO:** Add rate limiting to prevent spam

---

## 📊 Database Structure

The backend creates these records:

### Table: `scheduled_tests`
```sql
CREATE TABLE scheduled_tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_id VARCHAR(100) UNIQUE NOT NULL,
  test_name VARCHAR(255) NOT NULL,
  test_type VARCHAR(50) NOT NULL,
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INT DEFAULT 180,
  description TEXT,
  status ENUM('scheduled', 'active', 'completed', 'cancelled') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table: `test_sections`
Auto-creates 4 default sections:
- Physics (30 questions)
- Chemistry (30 questions)
- Maths (30 questions)
- Biology (30 questions)

---

## 🚀 Next Steps

### Phase 2: Load Tests from Backend
**File to update:** `frontend/js/scheduled-tests.js`
**Status:** Already configured! Endpoint: `/api/admin/scheduled-tests`

### Phase 3: Test Calendar Integration
**Purpose:** Show scheduled tests to students
**Endpoint:** `/api/admin/scheduled-tests` (same endpoint, different UI)
**Student URL:** `https://iinedu.vercel.app/student-calendar.html`

### Phase 4: Create Test Questions
**Workflow:**
1. Admin schedules test ✅ (Done)
2. Test appears in "Scheduled Tests" list ✅ (Working)
3. Admin clicks "Add Questions" → Redirects to "Create Test" page
4. Admin adds questions for that specific `testId`

---

## 📞 Support

If you encounter any issues:
1. Check browser console (F12) for errors
2. Check Railway backend logs
3. Verify database connection
4. Test backend endpoint directly using Postman/curl

---

## ✅ Success Checklist

- [x] Backend endpoint created and tested
- [x] Frontend handler created with validation
- [x] Data format matches backend expectations
- [x] Error handling implemented
- [x] Success notifications added
- [x] Auto-reload after success
- [ ] Script included in HTML (PENDING - You need to add this)
- [ ] Live test completed (PENDING - Test after script inclusion)
- [ ] Authentication added (FUTURE)
- [ ] Student calendar integration (FUTURE)

---

**Last Updated:** December 28, 2025, 1:31 PM IST
**Status:** Ready for integration testing
