# 🚂 Railway Migration - Complete URL Update Report

**Date:** January 28, 2026, 4:00 AM IST  
**Status:** ✅ **COMPLETED**  
**Migration:** Hostinger → Railway

---

## 📊 URL Migration Summary

### Old Backend URL (Hostinger):
```
https://backend-vigyanpreap.vigyanprep.com
https://vigyanprep.com:3000
```

### New Backend URL (Railway):
```
https://vigyan-production.up.railway.app
```

---

## ✅ Files Updated

### 1. **backend/server.js** ✅ UPDATED
**Commit:** [e8c44f9a](https://github.com/harshbuddy01/vigyan/commit/e8c44f9a225f797b23acbae11efae305f3e20e07)

#### Changes Made:

**Line 105-117:** Updated CORS `allowedOrigins` array
```javascript
const allowedOrigins = [
  // Local development
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:3000',

  // Production domains
  'https://vigyanprep.com',
  'http://vigyanprep.com',
  'https://www.vigyanprep.com',
  'http://www.vigyanprep.com',

  // 🚂 RAILWAY BACKEND (Updated)
  'https://vigyan-production.up.railway.app',
  'http://vigyan-production.up.railway.app',

  // Environment variable
  process.env.FRONTEND_URL
].filter(Boolean);
```

**Line 133-136:** Updated CORS origin checking
```javascript
// 🔧 FIX: Allow vigyanprep.com and railway.app subdomains
if (origin.includes('vigyanprep.com') || origin.includes('railway.app')) {
  console.log(`✅ CORS: Allowing trusted subdomain: ${origin}`);
  return callback(null, true);
}
```

**Line 159-171:** Updated environment injection middleware
```javascript
const envScript = `
<script>
  window.__ENV__ = {
    API_URL: "${process.env.API_URL || 'https://vigyan-production.up.railway.app'}",
    ENVIRONMENT: "${process.env.NODE_ENV || 'production'}",
    DEBUG: ${process.env.DEBUG_MODE === 'true' ? 'true' : 'false'}
  };
  console.log('🔧 Environment loaded:', window.__ENV__);
</script>`;
```

**Line 189-195:** Updated `/api/config` endpoint
```javascript
app.get('/api/config', (req, res) => {
  res.json({
    RAZORPAY_KEY_ID: process.env.RAZORPAY_API_KEY || '',
    NODE_ENV: process.env.NODE_ENV || 'production',
    // 🚂 RAILWAY DEPLOYMENT
    API_URL: process.env.API_URL || 'https://vigyan-production.up.railway.app',
    FRONTEND_URL: process.env.FRONTEND_URL || 'https://vigyanprep.com'
  });
});
```

**Line 285:** Updated health check
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'MongoDB',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    deployment: 'Railway'  // ✅ Added
  });
});
```

**Line 300-307:** Updated API info endpoint
```javascript
app.get('/api', (req, res) => {
  res.json({
    message: 'Vigyan.prep Platform API',
    version: '2.0.0',
    database: 'MongoDB',
    deployment: 'Railway',  // ✅ Added
    endpoints: { ... }
  });
});
```

**Line 345-350:** Updated server startup logs
```javascript
console.log(`📊 Database: MongoDB ${isMongoDBConnected ? '(Connected)' : '(Not Connected)'}`);
console.log(`📏 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🚂 Deployment: Railway`);  // ✅ Added
console.log(`🌐 API URL: ${process.env.API_URL || 'https://vigyan-production.up.railway.app'}`);
console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'https://vigyanprep.com'}`);
```

---

### 2. **frontend/js/config.js** ✅ ALREADY UPDATED
**Status:** Already pointing to Railway (no changes needed)

**Line 16-32:** Production API URL
```javascript
API_BASE_URL: (() => {
    const hostname = window.location.hostname;
    
    // 1. Check for server-injected environment variable first
    if (window.__ENV__ && window.__ENV__.API_URL) {
        return window.__ENV__.API_URL;
    }

    // 2. Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000';
    }

    // 3. PRODUCTION: Railway backend
    return 'https://vigyan-production.up.railway.app';
})(),
```

---

### 3. **index.html** ✅ AUTO-INJECTED
**Status:** Environment variables automatically injected by server.js  
**Method:** Server-side HTML modification middleware

The `window.__ENV__` object is injected by the server when serving HTML files:
```html
<script>
  window.__ENV__ = {
    API_URL: "https://vigyan-production.up.railway.app",
    ENVIRONMENT: "production",
    DEBUG: false
  };
  console.log('🔧 Environment loaded:', window.__ENV__);
</script>
```

---

## 🔍 File-by-File URL Analysis

### Frontend Files Checked:

✅ **instructions.html** - Uses localStorage, no hardcoded URLs  
✅ **exam.html** - Uses `API_BASE_URL` from config.js  
✅ **testfirstpage.html** - Uses `API_BASE_URL` from config.js  
✅ **signinpage.html** - Uses `API_BASE_URL` from config.js  
✅ **sciencenews.html** - Uses `API_BASE_URL` from config.js  
✅ **aboutpage.html** - No API calls  
✅ **future.html** - No API calls  
✅ **shoutouts.html** - No API calls  

### Backend Files Checked:

✅ **backend/server.js** - Updated to Railway URLs  
✅ **backend/config/env.js** - Uses environment variables  
✅ **backend/controllers/*.js** - No hardcoded URLs  
✅ **backend/routes/*.js** - Relative paths only  

---

## 🌐 API Endpoints (Railway)

All API endpoints now accessible at Railway URL:

### Public Endpoints:
```
GET  https://vigyan-production.up.railway.app/health
GET  https://vigyan-production.up.railway.app/api
GET  https://vigyan-production.up.railway.app/api/config
```

### Authentication:
```
POST https://vigyan-production.up.railway.app/api/verify-user-full
POST https://vigyan-production.up.railway.app/api/admin/auth/login
POST https://vigyan-production.up.railway.app/api/admin/auth/refresh
```

### Payment (Razorpay):
```
GET  https://vigyan-production.up.railway.app/api/payment/getkey
POST https://vigyan-production.up.railway.app/api/payment/checkout
POST https://vigyan-production.up.railway.app/api/payment/paymentverification
```

### Exams:
```
GET  https://vigyan-production.up.railway.app/api/exam/list
POST https://vigyan-production.up.railway.app/api/exam/start
GET  https://vigyan-production.up.railway.app/api/exam/questions?testId=iat
POST https://vigyan-production.up.railway.app/api/exam/submit
GET  https://vigyan-production.up.railway.app/api/exam/results
GET  https://vigyan-production.up.railway.app/api/exam/verify-access/:testId
GET  https://vigyan-production.up.railway.app/api/exam/my-tests
```

### Admin Panel:
```
GET  https://vigyan-production.up.railway.app/api/admin/dashboard/stats
GET  https://vigyan-production.up.railway.app/api/admin/students
POST https://vigyan-production.up.railway.app/api/admin/students/create
GET  https://vigyan-production.up.railway.app/api/admin/transactions
GET  https://vigyan-production.up.railway.app/api/admin/results
```

### News:
```
GET  https://vigyan-production.up.railway.app/api/news
```

---

## 🧪 Testing Checklist

### Backend Health Check:
```bash
# Test 1: Server health
curl https://vigyan-production.up.railway.app/health

# Expected Response:
{
  "status": "ok",
  "database": "MongoDB",
  "timestamp": "2026-01-28T...",
  "environment": "production",
  "deployment": "Railway"
}
```

### Config Endpoint:
```bash
# Test 2: Get configuration
curl https://vigyan-production.up.railway.app/api/config

# Expected Response:
{
  "RAZORPAY_KEY_ID": "rzp_...",
  "NODE_ENV": "production",
  "API_URL": "https://vigyan-production.up.railway.app",
  "FRONTEND_URL": "https://vigyanprep.com"
}
```

### CORS Test:
```bash
# Test 3: CORS preflight
curl -X OPTIONS https://vigyan-production.up.railway.app/api/exam/questions \
  -H "Origin: https://vigyanprep.com" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Expected: Access-Control-Allow-Origin header present
```

### Frontend Integration:
```bash
# Test 4: Check frontend loads correct API URL
# Open browser console on https://vigyanprep.com
# Run: console.log(API_BASE_URL)

# Expected Output:
"https://vigyan-production.up.railway.app"
```

### Authentication Test:
```bash
# Test 5: Login endpoint
curl -X POST https://vigyan-production.up.railway.app/api/exam/start \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","rollNumber":"12345678"}'

# Expected: JWT token in response
```

---

## 🔐 Environment Variables (Railway Dashboard)

### Required Variables:
```bash
# Database
MONGODB_URI=mongodb+srv://...

# Payment Gateway
RAZORPAY_API_KEY=rzp_live_...
RAZORPAY_API_SECRET=...

# JWT Authentication
JWT_SECRET=<64-character-random-string>

# Email (Optional)
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_USER=noreply@vigyanprep.com
EMAIL_PASSWORD=...

# Server Configuration
NODE_ENV=production
PORT=3000

# URLs (Railway auto-provides RAILWAY_PUBLIC_DOMAIN)
API_URL=https://vigyan-production.up.railway.app
FRONTEND_URL=https://vigyanprep.com
```

### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🚀 Deployment Status

### ✅ Completed:
- [x] Updated backend CORS configuration
- [x] Updated environment injection middleware
- [x] Updated API config endpoint
- [x] Updated health check response
- [x] Updated server startup logs
- [x] Verified frontend config.js
- [x] All code pushed to GitHub
- [x] Documentation created

### ⚠️ Pending (Manual Steps):
- [ ] Verify Railway environment variables are set
- [ ] Test all API endpoints on Railway
- [ ] Test payment flow with Railway backend
- [ ] Test authentication with Railway backend
- [ ] Verify email notifications work
- [ ] Check database connectivity
- [ ] Monitor Railway deployment logs

---

## 📋 Frontend Code Examples

### How Frontend Gets API URL:

**Method 1: Server-Injected (Automatic)**
```html
<!-- Injected by server.js middleware -->
<script>
  window.__ENV__ = {
    API_URL: "https://vigyan-production.up.railway.app",
    ENVIRONMENT: "production",
    DEBUG: false
  };
</script>
```

**Method 2: Config.js (Fallback)**
```javascript
// frontend/js/config.js
window.APP_CONFIG = {
    API_BASE_URL: (() => {
        // 1. Check server-injected first
        if (window.__ENV__ && window.__ENV__.API_URL) {
            return window.__ENV__.API_URL;
        }
        
        // 2. Local development
        if (window.location.hostname.includes('localhost')) {
            return 'http://localhost:3000';
        }
        
        // 3. Production fallback
        return 'https://vigyan-production.up.railway.app';
    })()
};
```

### Making API Calls:
```javascript
// Example: Get exam questions
const API_BASE_URL = window.APP_CONFIG.API_BASE_URL;
const token = sessionStorage.getItem('auth_token');

const response = await axios.get(
    `${API_BASE_URL}/api/exam/questions?testId=iat`,
    {
        withCredentials: true,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
);
```

---

## 🔍 Verification Commands

### Check Current API URL:
```bash
# SSH into Railway container
railway run bash

# Check environment
echo $API_URL
echo $FRONTEND_URL
echo $NODE_ENV

# Check server logs
railway logs
```

### Monitor Deployment:
```bash
# Real-time logs
railway logs --follow

# Recent deployments
railway status

# Environment variables
railway variables
```

---

## ⚠️ Potential Issues & Solutions

### Issue 1: CORS Errors
**Symptom:** Browser console shows CORS policy error  
**Solution:** 
- Verify `vigyanprep.com` is in `allowedOrigins`
- Check Railway deployment has correct CORS settings
- Ensure `withCredentials: true` in frontend requests

### Issue 2: 404 on API Calls
**Symptom:** API endpoints return 404  
**Solution:**
- Verify Railway deployment is running: `railway status`
- Check route mounting in server.js logs
- Test health endpoint first: `/health`

### Issue 3: Environment Variables Not Loading
**Symptom:** Server uses default values instead of env vars  
**Solution:**
- Check Railway Dashboard > Variables tab
- Verify variable names match exactly (case-sensitive)
- Redeploy after adding variables

### Issue 4: Database Connection Failed
**Symptom:** MongoDB connection errors in logs  
**Solution:**
- Verify `MONGODB_URI` is set correctly
- Check MongoDB Atlas whitelist includes Railway IPs
- Test connection string manually

---

## 🎉 Migration Complete!

**Old System:**
- Hostinger cPanel hosting
- URL: `backend-vigyanpreap.vigyanprep.com`
- Manual deployments

**New System:**
- Railway cloud platform
- URL: `vigyan-production.up.railway.app`
- Automatic deployments from GitHub
- Better logging and monitoring
- Environment variable management
- Scalable infrastructure

---

## 📞 Support

If you encounter issues:

1. **Check Railway Logs:** `railway logs --follow`
2. **Test Health Endpoint:** `curl https://vigyan-production.up.railway.app/health`
3. **Verify Environment:** Check Railway Dashboard > Variables
4. **Review Documentation:** See `SECURITY_UPDATE_JWT_AUTH.md` and `JWT_IMPLEMENTATION_STATUS.md`

---

*Railway migration completed by Perplexity AI*  
*All changes committed to GitHub: [harshbuddy01/vigyan](https://github.com/harshbuddy01/vigyan)*  
*Date: January 28, 2026, 4:00 AM IST*
