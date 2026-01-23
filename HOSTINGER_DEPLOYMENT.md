# 🚀 HOSTINGER DEPLOYMENT GUIDE

## 🎯 Current Situation

You're using **Hostinger** but the error shows **Railway** URL:
```
https://iin-production.up.railway.app/api/verify-user-full
```

**Problem:** Frontend is pointing to the wrong backend URL!

---

## ✅ IMMEDIATE FIX NEEDED

### Step 1: Find Your Hostinger Backend URL

1. **Login to Hostinger hPanel:** [https://hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Go to **Websites** → Select your Node.js app
3. Copy your backend URL (should look like):
   ```
   https://backend-vigyanprep.vigyanprep.com
   OR
   https://api.vigyanprep.com
   OR  
   https://vigyanprep.com:3000
   ```

### Step 2: Update Frontend to Use Hostinger Backend

Find the file that sets `API_URL` - likely in:
- `testfirstpage.html`
- `config.js`
- Or inline JavaScript

Change from:
```javascript
const API_URL = 'https://iin-production.up.railway.app';
```

To:
```javascript
const API_URL = 'https://YOUR-HOSTINGER-BACKEND-URL';
```

---

## 🔧 HOSTINGER DEPLOYMENT OPTIONS

### Option A: Using Hostinger Node.js Web App

**Available on:**
- Business Web Hosting
- Cloud Startup/Professional/Enterprise

**Steps:**

1. **Login to hPanel**
2. **Websites** → **Add Website** → **Node.js Apps**
3. **Import from GitHub:**
   - Connect your GitHub account
   - Select `harshbuddy01/vigyan` repository
   - Set build folder: `backend`
   - Build command: `npm install`
   - Start command: `node server.js`
4. **Set Environment Variables:**
   ```env
   MONGODB_URI=mongodb+srv://...
   RAZORPAY_API_KEY=rzp_test_...
   RAZORPAY_API_SECRET=...
   NODE_ENV=production
   PORT=3000
   ```
5. **Deploy** → Wait 5 minutes
6. **Copy the deployed URL**

---

### Option B: Using Hostinger VPS (Manual Setup)

**If you have VPS plan:**

```bash
# 1. SSH into your VPS
ssh root@your-vps-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 3. Install PM2 (Process Manager)
npm install -g pm2

# 4. Clone your repository
cd /var/www
git clone https://github.com/harshbuddy01/vigyan.git
cd vigyan/backend

# 5. Install dependencies
npm install

# 6. Create .env file
nano .env
# Paste your environment variables
# Ctrl+X, Y, Enter to save

# 7. Start with PM2
pm2 start server.js --name vigyan-backend
pm2 save
pm2 startup

# 8. Setup Nginx reverse proxy
nano /etc/nginx/sites-available/vigyan-api
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name api.vigyanprep.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/vigyan-api /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Setup SSL (free)
apt-get install certbot python3-certbot-nginx
certbot --nginx -d api.vigyanprep.com
```

---

## 📍 WHERE IS YOUR BACKEND NOW?

### Check Current Deployments:

1. **Hostinger Check:**
   - Login to hPanel
   - Go to **Websites**
   - Look for Node.js app
   - Copy the URL

2. **Railway Check:**
   - If you have Railway account
   - Check if deployment exists there
   - **You might want to DELETE Railway deployment** if not needed

3. **Domain Check:**
   ```bash
   # Check where vigyanprep.com points to
   nslookup vigyanprep.com
   
   # Check backend subdomain
   nslookup api.vigyanprep.com
   nslookup backend.vigyanprep.com
   ```

---

## 🔥 QUICK FIX - Update Frontend Config

I need to see which file has the API URL. Can you check:

### File to check: `testfirstpage.html`

Look for lines like:
```javascript
const API_URL = '...';
const baseURL = '...';
axios.defaults.baseURL = '...';
```

**Tell me:**
1. What's your actual Hostinger backend URL?
2. Where is the API_URL defined in your frontend?

I'll create a commit to fix it immediately!

---

## 🎯 Expected URLs After Fix

**Frontend (Already working):**
```
https://vigyanprep.com/testfirstpage.html ✅
```

**Backend (Need to fix):**
```
https://YOUR-HOSTINGER-URL/health ← Should return {"status":"ok"}
https://YOUR-HOSTINGER-URL/api/verify-user-full ← Should work
```

---

## ✅ NEXT STEPS

1. **Find your Hostinger backend URL** (from hPanel)
2. **Tell me the URL**
3. **Tell me which file has `API_URL` configuration**
4. I'll push the fix in 2 minutes!

---

**Current Status:** Waiting for Hostinger backend URL to update frontend configuration
