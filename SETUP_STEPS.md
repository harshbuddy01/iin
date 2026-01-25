# 🚀 ADMIN LOGIN SETUP - STEP BY STEP

**Date:** January 26, 2026, 1:15 AM IST  
**Status:** ✅ Files Created | ⏳ Waiting for Your Action

---

## ✅ WHAT I'VE DONE IN GIT (COMPLETED)

### Files Created:
1. ✅ **admin-login.html** - Beautiful login page
2. ✅ **frontend/js/admin-session-manager.js** - Session timeout & activity tracking  
3. ✅ **backend/routes/adminAuthRoutes.js** - Admin login API
4. ✅ **ADMIN_LOGIN_SETUP.md** - Complete documentation
5. ✅ **SETUP_STEPS.md** - This file (step-by-step guide)

---

## 📋 YOUR TODO LIST (3 SIMPLE STEPS)

### 🔴 STEP 1: Install bcryptjs Package

```bash
cd backend
npm install bcryptjs
```

**Why?** This package is needed to verify passwords securely.

**Expected output:**
```
+ bcryptjs@2.4.3
added 1 package
```

---

### 🔴 STEP 2: Update backend/server.js

**Add these 2 lines to your server.js:**

#### Line 1: Import admin auth routes

Find this section (around line 86):
```javascript
import authRoutes from './routes/authRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
```

**ADD THIS LINE AFTER IT:**
```javascript
import adminAuthRoutes from './routes/adminAuthRoutes.js';
```

#### Line 2: Register admin auth routes

Find this section (around line 145):
```javascript
app.use('/api', authRoutes);
console.log('✅ Auth routes mounted - /api/verify-user-full');
```

**ADD THESE LINES AFTER IT:**
```javascript
app.use('/api/admin/auth', adminAuthRoutes);
console.log('✅ Admin auth routes mounted - /api/admin/auth/*');
```

**Full example of what it should look like:**
```javascript
// Mount other API routes
console.log('🔵 Mounting API routes...');
app.use('/api', authRoutes);
console.log('✅ Auth routes mounted - /api/verify-user-full');
app.use('/api/admin/auth', adminAuthRoutes);  // ← ADD THIS
console.log('✅ Admin auth routes mounted - /api/admin/auth/*');  // ← ADD THIS
app.use('/api/payment', paymentRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/news', newsRoutes);
```

---

### 🔴 STEP 3: Update admin-dashboard-v2.html

**Add session manager script:**

Find this line in `admin-dashboard-v2.html` (around line 381):
```html
<script src="frontend/js/config.js?v=10"></script>
```

**ADD THIS LINE RIGHT AFTER IT:**
```html
<script src="frontend/js/admin-session-manager.js?v=11"></script>
```

**Also update the logout function (around line 400):**

Find:
```javascript
function logout() {
    if (confirm('Logout?')) window.location.href = 'admin-login.html';
}
```

**Replace with:**
```javascript
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.SessionManager.logout('Manual logout');
    }
}
```

**Update version number:**

Find all instances of `?v=10` and change to `?v=11` to force browser cache refresh.

---

## 🧪 STEP 4: Test Everything

### Test 1: Restart Backend Server

```bash
cd backend
node server.js
```

**Expected output (look for these lines):**
```
🔐 Admin Auth routes loaded
👤 Admin username: admin
✅ Admin auth routes mounted - /api/admin/auth/*
✅ Server running on port 3000
```

### Test 2: Test Auth Endpoint

```bash
curl http://localhost:3000/api/admin/auth/test
```

**Expected response:**
```json
{
  "success": true,
  "message": "Admin auth routes are working!",
  "defaultCredentials": {
    "username": "admin",
    "password": "admin123"
  }
}
```

### Test 3: Test Login

```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "username": "admin",
    "role": "admin",
    "loginTime": "2026-01-26T..."
  }
}
```

### Test 4: Test Frontend

1. Open browser: `http://localhost/admin-login.html`
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Sign In"
4. Should redirect to `admin-dashboard-v2.html`
5. Try to go back to dashboard without login → should redirect to login

### Test 5: Test Session Timeout

1. Login to dashboard
2. Leave browser open for 55 minutes
3. Warning should appear: "Session timeout in 5 minutes"
4. Move mouse → warning should disappear
5. Leave for 60 minutes → auto-logout

---

## 🔑 DEFAULT CREDENTIALS

```
Username: admin
Password: admin123
```

⚠️ **IMPORTANT:** Change password after first login!

---

## 🔐 HOW TO CHANGE PASSWORD

### Method 1: Using API

```bash
curl -X POST http://localhost:3000/api/admin/auth/generate-hash \
  -H "Content-Type: application/json" \
  -d '{"password": "your-new-password"}'
```

Copy the hash from response and add to `backend/.env`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<paste-hash-here>
```

Restart server:
```bash
cd backend
node server.js
```

### Method 2: Using Node Script

Create `backend/hash-password.js`:

```javascript
import bcrypt from 'bcryptjs';

const password = process.argv[2] || 'admin123';
bcrypt.hash(password, 10).then(hash => {
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\nAdd to .env:');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
});
```

Run:
```bash
node backend/hash-password.js "your-new-password"
```

---

## 🐛 TROUBLESHOOTING

### Problem: "Cannot find module 'bcryptjs'"

**Solution:**
```bash
cd backend
npm install bcryptjs
```

### Problem: "Cannot GET /api/admin/auth/login"

**Solution:** 
- Check if `adminAuthRoutes.js` is imported in server.js
- Check if route is registered: `app.use('/api/admin/auth', adminAuthRoutes)`
- Restart backend server

### Problem: Login fails with correct password

**Check:**
1. Backend server is running
2. CORS is enabled
3. Check backend logs for error messages
4. Test with curl command above

### Problem: Session timeout not working

**Check:**
1. `admin-session-manager.js` is loaded in HTML
2. Check browser console for errors
3. Check if `sessionStorage` has `adminAuth` key

### Problem: Warning doesn't appear

**Wait:** Warning appears at 55 minutes, not immediately!
- Session timeout: 60 minutes
- Warning time: 5 minutes before (at 55 min mark)

---

## 📊 WHAT HAPPENS WHEN

| Action | Result |
|--------|--------|
| Open admin-login.html | Shows login form |
| Login with correct creds | Redirects to dashboard |
| Login with wrong creds | Shows error message |
| Open dashboard without login | Redirects to login |
| Stay active on dashboard | Session stays alive |
| Stay inactive 55 min | Warning appears |
| Click "I'm Still Here" | Warning disappears, session refreshed |
| Stay inactive 60 min | Auto-logout, redirect to login |
| Move mouse/type/scroll | Activity detected, timer resets |
| Click logout button | Confirmation, then logout |

---

## ✅ COMPLETION CHECKLIST

### Files (All Done ✅)
- [x] admin-login.html created
- [x] admin-session-manager.js created
- [x] adminAuthRoutes.js created
- [x] Documentation created

### Your Tasks (⏳ Pending)
- [ ] Install bcryptjs: `npm install bcryptjs`
- [ ] Add import to server.js: `import adminAuthRoutes from './routes/adminAuthRoutes.js';`
- [ ] Register route in server.js: `app.use('/api/admin/auth', adminAuthRoutes);`
- [ ] Add session manager to admin-dashboard-v2.html
- [ ] Update logout function in HTML
- [ ] Test backend endpoint
- [ ] Test login page
- [ ] Test session timeout
- [ ] Change default password

---

## 🚀 DEPLOYMENT TO HOSTINGER

After testing locally:

1. **Upload files to VPS:**
   - All files are already in Git
   - Pull latest from Git on your VPS

2. **Install dependencies:**
```bash
ssh into VPS
cd /path/to/vigyan/backend
npm install bcryptjs
```

3. **Restart backend:**
```bash
pm2 restart vigyan-backend  # or your process name
```

4. **Test production:**
```bash
curl https://backend-vigyanpreap.vigyanprep.com/api/admin/auth/test
```

5. **Change password immediately!**

---

## 📞 NEED HELP?

If stuck:
1. Check backend server logs
2. Check browser console (F12)
3. Test with curl commands
4. Read ADMIN_LOGIN_SETUP.md for details

---

## 🎯 SUMMARY

**I've created:** All files needed (✅)

**You need to do:** 3 simple edits:
1. Install bcryptjs
2. Add 2 lines to server.js  
3. Add 1 line to admin-dashboard-v2.html

**Then test and deploy!**

---

**Ready?** Start with Step 1! 🚀