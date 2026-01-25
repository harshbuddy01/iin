# Admin Login System Setup Guide

**Created:** January 26, 2026  
**Version:** 1.0  
**Status:** ✅ Complete

---

## 🎯 Overview

Your admin portal now has a complete authentication system with:

- ✅ Secure login page (`admin-login.html`)
- ✅ Backend password verification
- ✅ 60-minute inactivity timeout
- ✅ Activity detection (mouse, keyboard, scroll)
- ✅ Auto-logout with 5-minute warning
- ✅ Session protection (redirects to login if not authenticated)

---

## 📁 New Files Created

### 1. **admin-login.html** (Root Directory)
- Beautiful login interface
- Username and password fields
- "Remember me" functionality
- Backend API integration
- Error handling
- Auto-redirect to dashboard on success

### 2. **frontend/js/admin-session-manager.js**
- Authentication check on page load
- Activity tracking (mouse, keyboard, scroll, clicks)
- 60-minute session timeout
- 5-minute warning before logout
- Auto-logout on inactivity
- Session refresh on activity

### 3. **backend/routes/auth.js**
- `POST /api/admin/auth/login` - Login endpoint
- `POST /api/admin/auth/validate-session` - Session validation
- `POST /api/admin/auth/logout` - Logout endpoint
- `POST /api/admin/auth/generate-hash` - Password hash generator

---

## 🔧 Setup Instructions

### Step 1: Install Required Dependencies

```bash
cd backend
npm install bcryptjs
```

### Step 2: Register Auth Routes in Server

Add these lines to your `backend/server.js`:

```javascript
// Import auth routes
const authRoutes = require('./routes/auth');

// Register routes
app.use('/api/admin/auth', authRoutes);
```

**Example placement in server.js:**

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');  // Your existing routes

// Register routes
app.use('/api/admin/auth', authRoutes);  // ← Add this
app.use('/api/admin', adminRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
```

### Step 3: Add Session Manager to Dashboard

Edit `admin-dashboard-v2.html` and add this script **after** `config.js`:

```html
<!-- 🔥 CENTRALIZED CONFIG -->
<script src="frontend/js/config.js?v=11"></script>

<!-- 🔒 SESSION MANAGER - Add this line -->
<script src="frontend/js/admin-session-manager.js?v=11"></script>
```

Also update the logout function:

```javascript
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.SessionManager.logout('Manual logout');
    }
}
```

### Step 4: Set Environment Variables (Optional)

Edit `backend/.env` to customize credentials:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$X8h1jBqPqEQxV.6lY7bQz.Yz7e8TwKWVxJvqDkR5YJ0gLZXg1K1LS
```

---

## 🔐 Default Credentials

**Username:** `admin`  
**Password:** `admin123`

⚠️ **IMPORTANT:** Change these credentials in production!

---

## 🔑 How to Change Password

### Method 1: Using API Endpoint

1. Start your backend server
2. Make a POST request to generate hash:

```bash
curl -X POST http://localhost:3000/api/admin/auth/generate-hash \
  -H "Content-Type: application/json" \
  -d '{"password": "your-new-password"}'
```

3. Copy the hash from response
4. Add to `backend/.env`:

```env
ADMIN_PASSWORD_HASH=<paste-hash-here>
```

5. Restart server

### Method 2: Using Node.js Script

Create `backend/generate-hash.js`:

```javascript
const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'admin123';
bcrypt.hash(password, 10).then(hash => {
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\nAdd this to .env:');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
});
```

Run:

```bash
node backend/generate-hash.js "your-new-password"
```

---

## 📊 How It Works

### Login Flow

1. User visits `admin-login.html`
2. Enters username and password
3. Frontend sends POST to `/api/admin/auth/login`
4. Backend verifies credentials using bcrypt
5. On success:
   - Session data stored in `sessionStorage`
   - User redirected to `admin-dashboard-v2.html`
6. On failure:
   - Error message displayed
   - User stays on login page

### Session Management Flow

1. **Page Load:**
   - `admin-session-manager.js` checks if `adminAuth` exists in `sessionStorage`
   - If not authenticated → redirect to login
   - If authenticated → start activity tracking

2. **Activity Tracking:**
   - Monitors: mouse movement, clicks, keyboard, scroll
   - Updates `lastActivityTime` on any activity
   - Stores in `sessionStorage`

3. **Timeout Check (Every 30 seconds):**
   - Calculates time since last activity
   - If > 55 minutes → show warning
   - If > 60 minutes → auto-logout

4. **Warning (5 minutes before timeout):**
   - Yellow banner appears
   - Shows countdown timer
   - "I'm Still Here" button to refresh session
   - Auto-dismisses if user becomes active

5. **Logout:**
   - Clears all session data
   - Redirects to login page
   - Shows logout reason (if applicable)

---

## 🎨 Session States

### ✅ Active Session
- User is authenticated
- Activity detected within last 60 minutes
- Full access to admin dashboard

### ⚠️ Warning State
- 5-10 minutes remaining before timeout
- Yellow warning banner shown
- Countdown timer visible
- Can refresh by clicking "I'm Still Here" or any activity

### ❌ Expired Session
- No activity for 60+ minutes
- Auto-logout triggered
- Redirect to login page
- Message: "Session expired due to inactivity"

---

## 🔒 Security Features

1. **Password Hashing:**
   - bcrypt with 10 salt rounds
   - Never stores plain text passwords
   - Secure comparison using `bcrypt.compare()`

2. **Session Storage:**
   - Uses `sessionStorage` (cleared on browser close)
   - Not persistent across tabs
   - Automatic cleanup on logout

3. **Protected Routes:**
   - Dashboard checks authentication on load
   - Redirects to login if not authenticated
   - No access without valid session

4. **Activity Tracking:**
   - Multiple event types monitored
   - Passive event listeners (performance)
   - Real-time session refresh

5. **Timeout Protection:**
   - Prevents indefinite sessions
   - Warning before logout
   - Graceful session termination

---

## 🧪 Testing Checklist

### Login Tests
- [ ] Login with correct credentials → Success
- [ ] Login with wrong username → Error
- [ ] Login with wrong password → Error
- [ ] Login with empty fields → Validation error
- [ ] "Remember me" saves username
- [ ] Redirect to dashboard after login

### Session Tests
- [ ] Access dashboard without login → Redirect to login
- [ ] Stay active for 50 minutes → No logout
- [ ] Stay inactive for 55 minutes → Warning appears
- [ ] Stay inactive for 60 minutes → Auto-logout
- [ ] Move mouse during warning → Warning disappears
- [ ] Click "I'm Still Here" → Session refreshed

### Logout Tests
- [ ] Click logout button → Confirmation dialog
- [ ] Confirm logout → Redirect to login
- [ ] Try to access dashboard after logout → Redirect to login
- [ ] Login again after logout → Success

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'bcryptjs'"
**Solution:**
```bash
cd backend
npm install bcryptjs
```

### Issue: Login always fails
**Check:**
1. Backend server is running
2. `backend/routes/auth.js` is registered in server
3. CORS is enabled
4. Password hash is correct

**Test backend:**
```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Issue: Session timeout not working
**Check:**
1. `admin-session-manager.js` is loaded in HTML
2. Script is loaded **before** dashboard scripts
3. Check browser console for errors
4. Verify `sessionStorage` has `adminAuth` and `lastActivity`

### Issue: Warning doesn't appear
**Check:**
1. Session timeout is 60 minutes (default)
2. Warning appears at 55 minutes
3. Check browser console for timer logs
4. Ensure JavaScript is enabled

---

## 📝 Configuration Options

### Adjust Timeout Duration

Edit `frontend/js/admin-session-manager.js`:

```javascript
// Change these values
const SESSION_TIMEOUT = 60 * 60 * 1000; // 60 minutes (in milliseconds)
const WARNING_TIME = 5 * 60 * 1000;     // 5 minute warning
const CHECK_INTERVAL = 30 * 1000;        // Check every 30 seconds
```

**Examples:**
- 30 minutes: `SESSION_TIMEOUT = 30 * 60 * 1000`
- 2 hours: `SESSION_TIMEOUT = 2 * 60 * 60 * 1000`
- 15 minute warning: `WARNING_TIME = 15 * 60 * 1000`

### Customize Login Page

Edit `admin-login.html` styles in `<style>` tag to match your branding.

---

## 🚀 Deployment Notes

### Hostinger VPS Deployment

1. **Upload files:**
   - `admin-login.html` → root directory
   - `frontend/js/admin-session-manager.js` → frontend/js/
   - `backend/routes/auth.js` → backend/routes/

2. **Install dependencies:**
```bash
ssh into your VPS
cd /path/to/vigyan/backend
npm install bcryptjs
```

3. **Update server.js:**
   - Add auth routes registration
   - Restart Node.js server:
```bash
pm2 restart vigyan-backend  # or your process name
```

4. **Test production:**
```bash
curl https://backend-vigyanpreap.vigyanprep.com/api/admin/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

5. **Change default password** (IMPORTANT!):
   - Generate new hash
   - Update `.env` on server
   - Restart backend

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Check backend server logs
3. Verify all files are uploaded
4. Test API endpoints directly
5. Review this documentation

---

## ✅ Completion Checklist

- [x] `admin-login.html` created
- [x] `frontend/js/admin-session-manager.js` created
- [x] `backend/routes/auth.js` created
- [ ] Install `bcryptjs` dependency
- [ ] Register auth routes in `server.js`
- [ ] Add session manager to `admin-dashboard-v2.html`
- [ ] Test login functionality
- [ ] Test session timeout
- [ ] Change default password
- [ ] Deploy to production

---

**Status:** ✅ All files created and ready for integration

**Next Steps:**
1. Follow "Setup Instructions" above
2. Test locally
3. Deploy to Hostinger
4. Change default password

---

**Last Updated:** January 26, 2026, 1:05 AM IST