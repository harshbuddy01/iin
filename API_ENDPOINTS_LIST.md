# 📡 Complete API Endpoints List - Vigyan.prep

**Base URL:** `https://vigyan-production.up.railway.app`

---

## 🔑 AUTHENTICATION

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/admin/auth/login` | Admin login | No |
| POST | `/api/admin/auth/logout` | Admin logout | Yes |
| GET | `/api/admin/profile` | Get admin profile | Yes |
| PUT | `/api/admin/profile` | Update profile | Yes |
| POST | `/api/admin/profile/password` | Change password | Yes |

---

## 📊 DASHBOARD

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/dashboard/stats` | Dashboard statistics | Yes |
| GET | `/api/admin/dashboard/performance` | Performance data | Yes |
| GET | `/api/admin/dashboard/upcoming-tests` | Upcoming tests | Yes |
| GET | `/api/admin/dashboard/recent-activity` | Recent activity | Yes |
| GET | `/api/admin/dashboard/notifications` | All notifications | Yes |
| GET | `/api/admin/dashboard/notifications/count` | Unread count | Yes |
| POST | `/api/admin/dashboard/notifications/:id/read` | Mark as read | Yes |
| POST | `/api/admin/dashboard/notifications/mark-all-read` | Mark all read | Yes |

---

## 📋 TESTS MANAGEMENT

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/tests` | Get all tests | Yes |
| GET | `/api/admin/tests/:id` | Get single test | Yes |
| POST | `/api/admin/tests` | Create new test | Yes |
| PUT | `/api/admin/tests/:id` | Update test | Yes |
| DELETE | `/api/admin/tests/:id` | Delete test | Yes |
| GET | `/api/admin/scheduled-tests` | Get scheduled tests | Yes |
| POST | `/api/admin/scheduled-tests` | Schedule a test | Yes |
| GET | `/api/admin/past-tests` | Get past tests | Yes |

---

## ❓ QUESTIONS MANAGEMENT

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/questions` | Get all questions | Yes |
| GET | `/api/admin/questions/:id` | Get single question | Yes |
| GET | `/api/admin/questions?subject=Physics` | Filter by subject | Yes |
| POST | `/api/admin/questions` | Create question | Yes |
| PUT | `/api/admin/questions/:id` | Update question | Yes |
| DELETE | `/api/admin/questions/:id` | Delete question | Yes |

---

## 👥 STUDENTS MANAGEMENT

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/students` | Get all students | Yes |
| GET | `/api/admin/students/:id` | Get single student | Yes |
| POST | `/api/admin/students` | Create student | Yes |
| PUT | `/api/admin/students/:id` | Update student | Yes |
| DELETE | `/api/admin/students/:id` | Delete student | Yes |

---

## 💰 TRANSACTIONS & PAYMENTS

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/transactions` | Get all transactions | Yes |
| GET | `/api/admin/transactions/:id` | Get transaction details | Yes |
| POST | `/api/payment/create-order` | Create Razorpay order | No |
| POST | `/api/payment/verify` | Verify payment | No |

---

## 📝 PDF UPLOAD

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/pdf/upload` | Upload PDF for AI processing | Yes |
| GET | `/api/pdf/history` | Get upload history | Yes |
| DELETE | `/api/pdf/delete/:id` | Delete uploaded PDF | Yes |

---

## 📈 RESULTS & PERFORMANCE

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/results` | Get all test results | Yes |
| GET | `/api/admin/results/student/:studentId` | Student results | Yes |
| GET | `/api/admin/results/test/:testId` | Test results | Yes |
| GET | `/api/admin/performance` | Performance analytics | Yes |

---

## ✅ HEALTH & STATUS

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Server health check | No |
| GET | `/health/db` | Database health check | No |
| GET | `/api/status` | API status | No |

---

## 📊 SUMMARY

**Total Endpoints:** 52

### By Category:
- **Authentication:** 5 endpoints
- **Dashboard:** 8 endpoints
- **Tests:** 8 endpoints
- **Questions:** 6 endpoints
- **Students:** 5 endpoints
- **Transactions:** 4 endpoints
- **PDF Upload:** 3 endpoints
- **Results:** 4 endpoints
- **Health:** 3 endpoints

### By Auth Requirement:
- **Public (No Auth):** 6 endpoints
- **Protected (Auth Required):** 46 endpoints

### By HTTP Method:
- **GET:** 34 endpoints
- **POST:** 11 endpoints
- **PUT:** 5 endpoints
- **DELETE:** 5 endpoints

---

## 🧠 Quick Test Commands

### Test Backend Health
```bash
curl https://vigyan-production.up.railway.app/health
```

### Test Admin Login
```bash
curl -X POST 'https://vigyan-production.up.railway.app/api/admin/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@vigyanprep.com","password":"YOUR_PASSWORD"}'
```

### Test Get All Tests (After Login)
```bash
curl 'https://vigyan-production.up.railway.app/api/admin/tests' \
  -H 'Cookie: admin_token=YOUR_TOKEN'
```

---

## 🔗 Related Documents

- **Full Testing Guide:** [API_TESTING_CHECKLIST.md](./API_TESTING_CHECKLIST.md)
- **Quick Start:** [QUICK_TEST_GUIDE.md](./QUICK_TEST_GUIDE.md)
- **Changes Summary:** [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)

---

## 📝 Notes

1. **All protected endpoints require admin authentication cookie**
2. **Use `credentials: 'include'` in fetch requests**
3. **CORS is configured for `vigyanprep.com` domain**
4. **Rate limiting applies to all endpoints**
5. **MongoDB connection required for all data endpoints**

---

**Last Updated:** January 31, 2026
