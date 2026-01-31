# 📋 VIGYAN.PREP API Testing Checklist

**Backend URL:** `https://vigyan-production.up.railway.app`  
**Frontend URL:** `https://vigyanprep.com`  
**Created:** January 31, 2026

---

## 🔑 1. AUTHENTICATION ENDPOINTS

### Admin Login
```bash
POST https://vigyan-production.up.railway.app/api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@vigyanprep.com",
  "password": "your_password"
}
```
**Expected Response:** 200 OK with admin token in cookies

### Admin Profile
```bash
GET https://vigyan-production.up.railway.app/api/admin/profile
Cookie: admin_token=<your_token>
```
**Expected Response:** 200 OK with admin profile data

### Admin Logout
```bash
POST https://vigyan-production.up.railway.app/api/admin/auth/logout
Cookie: admin_token=<your_token>
```
**Expected Response:** 200 OK

---

## 📊 2. DASHBOARD ENDPOINTS

### Dashboard Stats
```bash
GET https://vigyan-production.up.railway.app/api/admin/dashboard/stats
Cookie: admin_token=<your_token>
```
**Expected Response:** Total tests, students, revenue, etc.

### Performance Data
```bash
GET https://vigyan-production.up.railway.app/api/admin/dashboard/performance?period=7d
Cookie: admin_token=<your_token>
```
**Expected Response:** Chart data for performance trends

### Upcoming Tests
```bash
GET https://vigyan-production.up.railway.app/api/admin/dashboard/upcoming-tests
Cookie: admin_token=<your_token>
```
**Expected Response:** List of upcoming scheduled tests

### Recent Activity
```bash
GET https://vigyan-production.up.railway.app/api/admin/dashboard/recent-activity
Cookie: admin_token=<your_token>
```
**Expected Response:** Recent activities (logins, tests, payments)

### Notifications
```bash
GET https://vigyan-production.up.railway.app/api/admin/dashboard/notifications
Cookie: admin_token=<your_token>
```
**Expected Response:** List of notifications

### Notification Count
```bash
GET https://vigyan-production.up.railway.app/api/admin/dashboard/notifications/count
Cookie: admin_token=<your_token>
```
**Expected Response:** `{ "count": 5 }`

---

## 📋 3. TESTS MANAGEMENT

### Get All Tests
```bash
GET https://vigyan-production.up.railway.app/api/admin/tests
Cookie: admin_token=<your_token>
```
**Expected Response:** Array of all tests

### Get Single Test
```bash
GET https://vigyan-production.up.railway.app/api/admin/tests/:testId
Cookie: admin_token=<your_token>
```
**Expected Response:** Single test details

### Create Test
```bash
POST https://vigyan-production.up.railway.app/api/admin/tests
Cookie: admin_token=<your_token>
Content-Type: application/json

{
  "title": "Physics Mock Test",
  "subject": "Physics",
  "duration": 60,
  "totalMarks": 100,
  "scheduledDate": "2026-02-15T10:00:00Z",
  "questions": []
}
```
**Expected Response:** 201 Created with test ID

### Update Test
```bash
PUT https://vigyan-production.up.railway.app/api/admin/tests/:testId
Cookie: admin_token=<your_token>
Content-Type: application/json

{
  "title": "Updated Test Title",
  "duration": 90
}
```
**Expected Response:** 200 OK with updated test

### Delete Test
```bash
DELETE https://vigyan-production.up.railway.app/api/admin/tests/:testId
Cookie: admin_token=<your_token>
```
**Expected Response:** 200 OK with success message

### Scheduled Tests
```bash
GET https://vigyan-production.up.railway.app/api/admin/scheduled-tests
Cookie: admin_token=<your_token>
```
**Expected Response:** Array of scheduled tests

### Past Tests
```bash
GET https://vigyan-production.up.railway.app/api/admin/past-tests
Cookie: admin_token=<your_token>
```
**Expected Response:** Array of past/completed tests

---

## ❓ 4. QUESTIONS MANAGEMENT

### Get All Questions
```bash
GET https://vigyan-production.up.railway.app/api/admin/questions
Cookie: admin_token=<your_token>
```
**Expected Response:** Array of questions

### Get Questions by Subject
```bash
GET https://vigyan-production.up.railway.app/api/admin/questions?subject=Physics
Cookie: admin_token=<your_token>
```
**Expected Response:** Filtered array of Physics questions

### Create Question
```bash
POST https://vigyan-production.up.railway.app/api/admin/questions
Cookie: admin_token=<your_token>
Content-Type: application/json

{
  "subject": "Physics",
  "questionText": "What is Newton's First Law?",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "A",
  "marks": 4,
  "difficulty": "medium"
}
```
**Expected Response:** 201 Created with question ID

### Update Question
```bash
PUT https://vigyan-production.up.railway.app/api/admin/questions/:questionId
Cookie: admin_token=<your_token>
Content-Type: application/json

{
  "questionText": "Updated question text"
}
```
**Expected Response:** 200 OK

### Delete Question
```bash
DELETE https://vigyan-production.up.railway.app/api/admin/questions/:questionId
Cookie: admin_token=<your_token>
```
**Expected Response:** 200 OK

---

## 👥 5. STUDENTS MANAGEMENT

### Get All Students
```bash
GET https://vigyan-production.up.railway.app/api/admin/students
Cookie: admin_token=<your_token>
```
**Expected Response:** Array of students

### Get Single Student
```bash
GET https://vigyan-production.up.railway.app/api/admin/students/:studentId
Cookie: admin_token=<your_token>
```
**Expected Response:** Student details

### Create Student
```bash
POST https://vigyan-production.up.railway.app/api/admin/students
Cookie: admin_token=<your_token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "course": "JEE Main"
}
```
**Expected Response:** 201 Created

### Update Student
```bash
PUT https://vigyan-production.up.railway.app/api/admin/students/:studentId
Cookie: admin_token=<your_token>
Content-Type: application/json

{
  "name": "John Updated",
  "course": "JEE Advanced"
}
```
**Expected Response:** 200 OK

### Delete Student
```bash
DELETE https://vigyan-production.up.railway.app/api/admin/students/:studentId
Cookie: admin_token=<your_token>
```
**Expected Response:** 200 OK

---

## 💰 6. TRANSACTIONS & PAYMENTS

### Get All Transactions
```bash
GET https://vigyan-production.up.railway.app/api/admin/transactions
Cookie: admin_token=<your_token>
```
**Expected Response:** Array of payment transactions

### Get Transaction Details
```bash
GET https://vigyan-production.up.railway.app/api/admin/transactions/:transactionId
Cookie: admin_token=<your_token>
```
**Expected Response:** Transaction details

### Create Payment Order (Razorpay)
```bash
POST https://vigyan-production.up.railway.app/api/payment/create-order
Content-Type: application/json

{
  "amount": 1999,
  "studentId": "<student_id>",
  "courseId": "<course_id>"
}
```
**Expected Response:** Razorpay order ID

### Verify Payment
```bash
POST https://vigyan-production.up.railway.app/api/payment/verify
Content-Type: application/json

{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```
**Expected Response:** 200 OK with verification status

---

## 📝 7. PDF UPLOAD & AI PROCESSING

### Upload PDF
```bash
POST https://vigyan-production.up.railway.app/api/pdf/upload
Cookie: admin_token=<your_token>
Content-Type: multipart/form-data

Form Data:
- file: <pdf_file>
- subject: "Physics"
- questionCount: 20
```
**Expected Response:** 200 OK with extracted questions

### Get PDF History
```bash
GET https://vigyan-production.up.railway.app/api/pdf/history
Cookie: admin_token=<your_token>
```
**Expected Response:** Array of uploaded PDFs

### Delete PDF
```bash
DELETE https://vigyan-production.up.railway.app/api/pdf/delete/:pdfId
Cookie: admin_token=<your_token>
```
**Expected Response:** 200 OK

---

## 📈 8. RESULTS & PERFORMANCE

### Get All Results
```bash
GET https://vigyan-production.up.railway.app/api/admin/results
Cookie: admin_token=<your_token>
```
**Expected Response:** Array of test results

### Get Student Results
```bash
GET https://vigyan-production.up.railway.app/api/admin/results/student/:studentId
Cookie: admin_token=<your_token>
```
**Expected Response:** Student's test results

### Get Test Results
```bash
GET https://vigyan-production.up.railway.app/api/admin/results/test/:testId
Cookie: admin_token=<your_token>
```
**Expected Response:** All results for specific test

### Performance Analytics
```bash
GET https://vigyan-production.up.railway.app/api/admin/performance
Cookie: admin_token=<your_token>
```
**Expected Response:** Performance metrics and analytics

---

## ✅ 9. HEALTH CHECK ENDPOINTS

### Server Health
```bash
GET https://vigyan-production.up.railway.app/health
```
**Expected Response:** `{ "status": "ok", "timestamp": "..." }`

### Database Health
```bash
GET https://vigyan-production.up.railway.app/health/db
```
**Expected Response:** `{ "status": "connected", "database": "MongoDB" }`

---

## 🛠️ HOW TO TEST MANUALLY

### Using Browser (For GET requests)
1. Login first at `https://vigyanprep.com/admin-login.html`
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run:
```javascript
fetch('https://vigyan-production.up.railway.app/api/admin/tests', {
  method: 'GET',
  credentials: 'include'
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e));
```

### Using Postman
1. Import this checklist as collection
2. Set environment variable: `BASE_URL = https://vigyan-production.up.railway.app`
3. Login first to get cookies
4. Test each endpoint

### Using cURL
```bash
# Example: Get all tests
curl -X GET \
  'https://vigyan-production.up.railway.app/api/admin/tests' \
  -H 'Cookie: admin_token=YOUR_TOKEN_HERE' \
  -H 'Content-Type: application/json'
```

---

## 🚨 COMMON ERRORS & FIXES

| Error Code | Message | Fix |
|------------|---------|-----|
| 401 | Unauthorized | Login first or token expired |
| 403 | Forbidden | Not admin or insufficient permissions |
| 404 | Not Found | Endpoint doesn't exist - check route |
| 500 | Internal Server Error | Backend issue - check Railway logs |
| CORS Error | CORS policy blocked | Backend CORS config issue |

---

## 📝 TESTING CHECKLIST

### Priority 1: Critical
- [ ] Health endpoint working
- [ ] Admin login working
- [ ] Admin profile retrieval
- [ ] Dashboard stats loading

### Priority 2: Core Features
- [ ] Get all tests
- [ ] Get all students
- [ ] Get all questions
- [ ] Create test
- [ ] Create student

### Priority 3: Advanced Features
- [ ] PDF upload working
- [ ] Payment integration
- [ ] Results analytics
- [ ] Performance charts

---

## 📞 SUPPORT

If any endpoint is not working:
1. Check Railway deployment logs
2. Verify MongoDB connection
3. Check environment variables
4. Review backend route files
5. Test with Postman first before frontend

**Last Updated:** January 31, 2026
