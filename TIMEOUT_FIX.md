# ⚡ TIMEOUT ERROR FIX - URGENT

## 🔴 Current Problem

**Error in browser console:**
```
❌ AxiosError: timeout of 15000ms exceeded
❌ POST https://iin-production.up.railway.app/api/verify-user-full
```

**Root Cause:** Backend server is not responding within 15 seconds

---

## 🔧 IMMEDIATE FIXES APPLIED

### 1. ✅ Better Error Handling in Auth Route
- Added MongoDB connection check
- Added 5-second query timeout
- Better error messages
- Health check endpoint added

### 2. ✅ Quick Diagnostics Endpoint
- `/api/auth-health` - Check if auth system is working

---

## 👉 WHAT YOU NEED TO DO NOW

### Step 1: Check Railway Deployment Status

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Find your `vigyan` project
3. Check deployment status:
   - ✅ **Running** = Good
   - 🟡 **Building** = Wait 2-3 minutes
   - ❌ **Failed** = Check logs

### Step 2: Verify Environment Variables

Make sure these are set in Railway:

```env
MONGODB_URI=mongodb+srv://your-connection-string
RAZORPAY_API_KEY=rzp_test_...
RAZORPAY_API_SECRET=your-secret
PORT=3000
NODE_ENV=production
```

### Step 3: Test Health Endpoints

Open these URLs in browser:

1. **Server Health:**
   ```
   https://iin-production.up.railway.app/health
   ```
   **Expected:** `{"status":"ok", "database":"MongoDB"}`

2. **Auth Health:**
   ```
   https://iin-production.up.railway.app/api/auth-health
   ```
   **Expected:** `{"status":"ok", "mongoConnected":true}`

### Step 4: Check Railway Logs

1. Go to Railway Dashboard
2. Click on your deployment
3. Go to **Logs** tab
4. Look for:
   ```
   ✅ MongoDB Connected Successfully!
   ✅ Server running on port 3000
   ✅ Auth routes mounted
   ```

---

## 🐛 Common Issues & Solutions

### Issue 1: MongoDB Not Connecting

**Symptoms:**
- Timeout errors
- `mongoConnected: false` in health check

**Fix:**
```bash
# Check MongoDB URI is correct
# Should look like:
mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/<database>

# Whitelist Railway IP in MongoDB Atlas:
1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Add: 0.0.0.0/0 (Allow from anywhere)
```

### Issue 2: Server Not Starting

**Symptoms:**
- Deployment shows "Failed"
- No response from any endpoint

**Fix:**
```bash
# Check Railway logs for errors
# Common issues:
- Missing dependencies
- Syntax errors
- Port binding issues

# Restart deployment:
1. Railway Dashboard → Your Project
2. Click "Redeploy"
```

### Issue 3: CORS Errors

**Symptoms:**
- Request blocked by CORS policy

**Fix:** Already configured in `server.js`:
```javascript
app.use(cors({
  origin: [
    'https://vigyanprep.com',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

---

## 🚀 FORCE REDEPLOY (If Nothing Works)

### Option 1: Railway Manual Redeploy

1. Go to Railway Dashboard
2. Select your project
3. Click **"Redeploy"** button
4. Wait 3-5 minutes

### Option 2: Trigger GitHub Redeploy

```bash
# Make a small change and push
echo "# Deployment trigger $(date)" >> .railway-trigger
git add .
git commit -m "Force redeploy - fix timeout"
git push origin main
```

---

## ✅ VERIFICATION CHECKLIST

After deployment completes (5 minutes), test:

- [ ] `/health` returns 200 OK
- [ ] `/api/auth-health` shows `mongoConnected: true`
- [ ] Railway logs show "✅ MongoDB Connected"
- [ ] Railway logs show "✅ Server running on port 3000"
- [ ] Test email verification from browser

---

## 📞 QUICK TEST COMMANDS

```bash
# Test 1: Server is alive
curl https://iin-production.up.railway.app/health

# Test 2: Auth system ready
curl https://iin-production.up.railway.app/api/auth-health

# Test 3: Verify user endpoint
curl -X POST https://iin-production.up.railway.app/api/verify-user-full \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Expected response:
# {"success":true,"studentId":"...","isNewUser":true}
```

---

## 🚨 EMERGENCY: If Still Timing Out

### Most Likely Causes:

1. **MongoDB Atlas Firewall**
   - Go to MongoDB Atlas → Network Access
   - Add `0.0.0.0/0` to IP whitelist

2. **Wrong MongoDB URI**
   - Check environment variable in Railway
   - Should start with `mongodb+srv://`

3. **Railway Cold Start**
   - First request after idle takes 30+ seconds
   - Try requesting `/health` endpoint first
   - Wait 30 seconds, then try verify-user-full

4. **Database Cluster Paused**
   - Check MongoDB Atlas dashboard
   - Ensure cluster is running (not paused)

---

## 📊 Expected Timeline

- **Now:** Code pushed to GitHub ✅
- **+1 min:** Railway detects changes
- **+2 min:** Build starts
- **+4 min:** Build completes
- **+5 min:** New deployment live
- **+6 min:** Test endpoint working

**Current Status:** Waiting for Railway auto-deploy (ETA: 3-5 minutes)

---

## 🔗 Important Links

- [Railway Dashboard](https://railway.app/dashboard)
- [MongoDB Atlas](https://cloud.mongodb.com)
- [GitHub Repo](https://github.com/harshbuddy01/vigyan)
- API Base: `https://iin-production.up.railway.app`

---

**⏰ Last Updated:** January 24, 2026 2:28 AM IST

**✅ Status:** Timeout fix deployed, waiting for Railway restart
