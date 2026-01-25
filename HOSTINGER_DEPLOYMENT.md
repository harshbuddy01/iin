# 🚀 Hostinger Deployment Guide - Admin Login System

**Date:** January 26, 2026, 1:20 AM IST  
**For:** Live Hostinger Website  
**Time Required:** 10-15 minutes

---

## 📋 WHAT YOU'LL DO:

1. Connect to your Hostinger via SSH
2. Navigate to your project folder
3. Pull latest code from GitHub
4. Install bcryptjs package
5. Edit 2 files on server
6. Restart your Node.js application
7. Test the login page

---

## 🔧 STEP-BY-STEP INSTRUCTIONS

### **STEP 1: Connect to Hostinger via SSH** ⏱️ 2 minutes

#### Option A: Using Terminal (Mac/Linux) or CMD (Windows)

1. **Get your SSH details from Hostinger:**
   - Login to [Hostinger Panel](https://hpanel.hostinger.com)
   - Go to **VPS** → Your VPS → **SSH Access**
   - Copy the SSH command (looks like: `ssh root@123.45.67.89`)

2. **Open Terminal/CMD and connect:**

```bash
# Paste your SSH command from Hostinger
ssh root@YOUR_VPS_IP

# Enter password when prompted (you set this during VPS setup)
```

**Expected output:**
```
Welcome to Ubuntu 22.04.x LTS
root@vps-xxxxx:~#
```

✅ **You're now connected to Hostinger!**

#### Option B: Using PuTTY (Windows)

1. Download [PuTTY](https://www.putty.org/)
2. Open PuTTY
3. Enter your VPS IP address
4. Port: 22
5. Click "Open"
6. Login as: `root`
7. Enter password

---

### **STEP 2: Navigate to Your Project Folder** ⏱️ 1 minute

```bash
# Find your project location
# Common locations:
# - /home/vigyanprep/public_html
# - /var/www/vigyanprep.com
# - ~/vigyan

# Example (adjust based on your setup):
cd /home/vigyanprep/public_html

# OR if your project is in root:
cd ~/vigyan

# Verify you're in the right place:
ls -la

# You should see:
# - backend/
# - frontend/
# - admin-login.html
# - admin-dashboard-v2.html
```

**Can't find your project?** Try:
```bash
find / -name "admin-dashboard-v2.html" 2>/dev/null
```

---

### **STEP 3: Pull Latest Code from GitHub** ⏱️ 1 minute

```bash
# Make sure you're in project root
pwd

# Pull latest changes
git pull origin main

# If you get "fatal: not a git repository":
git init
git remote add origin https://github.com/harshbuddy01/vigyan.git
git pull origin main
```

**Expected output:**
```
Updating abc1234..def5678
Fast-forward
 admin-login.html                          | 150 +++++
 frontend/js/admin-session-manager.js      | 230 +++++
 backend/routes/adminAuthRoutes.js         | 180 +++++
 SETUP_STEPS.md                            | 290 +++++
 4 files changed, 850 insertions(+)
```

✅ **New files downloaded!**

---

### **STEP 4: Install bcryptjs Package** ⏱️ 2 minutes

```bash
# Go to backend folder
cd backend

# Check if npm is installed
npm -v

# If npm not found, install Node.js:
# curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
# sudo apt-get install -y nodejs

# Install bcryptjs
npm install bcryptjs

# Wait for installation...
```

**Expected output:**
```
added 1 package, and audited 120 packages in 3s

found 0 vulnerabilities
```

✅ **bcryptjs installed!**

**Verify installation:**
```bash
npm list bcryptjs
```

Should show:
```
vigyan-backend@1.0.0 /path/to/backend
└── bcryptjs@2.4.3
```

---

### **STEP 5: Edit server.js File** ⏱️ 3 minutes

**Option A: Using nano editor (Recommended for beginners)**

```bash
# Open server.js
nano server.js
```

**Add these lines:**

1. **Find the imports section** (around line 86):
   - Press `Ctrl + W` and search for: `import authRoutes`
   - You'll see:
     ```javascript
     import authRoutes from './routes/authRoutes.js';
     import newsRoutes from './routes/newsRoutes.js';
     ```

2. **Add this line after it:**
   ```javascript
   import adminAuthRoutes from './routes/adminAuthRoutes.js';
   ```

3. **Find the routes mounting section** (around line 145):
   - Press `Ctrl + W` and search for: `app.use('/api', authRoutes)`
   - You'll see:
     ```javascript
     app.use('/api', authRoutes);
     console.log('✅ Auth routes mounted');
     ```

4. **Add these lines after it:**
   ```javascript
   app.use('/api/admin/auth', adminAuthRoutes);
   console.log('✅ Admin auth routes mounted - /api/admin/auth/*');
   ```

5. **Save and exit:**
   - Press `Ctrl + X`
   - Press `Y` (Yes to save)
   - Press `Enter` (confirm filename)

✅ **server.js updated!**

**Option B: Using vi/vim editor**

```bash
vi server.js

# Press 'i' to enter INSERT mode
# Make the changes above
# Press 'Esc' to exit INSERT mode
# Type ':wq' and press Enter to save and quit
```

---

### **STEP 6: Edit admin-dashboard-v2.html** ⏱️ 2 minutes

```bash
# Go back to project root
cd ..

# Open the file
nano admin-dashboard-v2.html
```

**Add session manager script:**

1. **Find config.js line:**
   - Press `Ctrl + W` and search for: `config.js?v=10`
   - You'll see:
     ```html
     <script src="frontend/js/config.js?v=10"></script>
     ```

2. **Add this line RIGHT AFTER it:**
   ```html
   <script src="frontend/js/admin-session-manager.js?v=11"></script>
   ```

3. **Update logout function:**
   - Press `Ctrl + W` and search for: `function logout()`
   - You'll see:
     ```javascript
     function logout() {
         if (confirm('Logout?')) window.location.href = 'admin-login.html';
     }
     ```

4. **Replace with:**
   ```javascript
   function logout() {
       if (confirm('Are you sure you want to logout?')) {
           window.SessionManager.logout('Manual logout');
       }
   }
   ```

5. **Save and exit:**
   - Press `Ctrl + X`
   - Press `Y`
   - Press `Enter`

✅ **admin-dashboard-v2.html updated!**

---

### **STEP 7: Restart Node.js Application** ⏱️ 2 minutes

**If using PM2 (most common):**

```bash
# Check current PM2 processes
pm2 list

# Restart your app (replace 'app-name' with your actual process name)
pm2 restart vigyan-backend

# OR restart all:
pm2 restart all

# Check logs to verify:
pm2 logs vigyan-backend --lines 50
```

**Look for these lines in logs:**
```
🔐 Admin Auth routes loaded
👤 Admin username: admin
✅ Admin auth routes mounted - /api/admin/auth/*
✅ Server running on port 3000
```

**If NOT using PM2:**

```bash
# Find and kill existing Node process
pkill -f "node server.js"

# Start server in background
cd backend
nohup node server.js > server.log 2>&1 &

# Check if running:
ps aux | grep node

# View logs:
tail -f server.log
```

✅ **Server restarted!**

---

### **STEP 8: Test Everything** ⏱️ 3 minutes

#### Test 1: Check if auth endpoint is working

```bash
# From your Hostinger SSH:
curl http://localhost:3000/api/admin/auth/test

# OR from your local computer:
curl https://backend-vigyanpreap.vigyanprep.com/api/admin/auth/test
```

**Expected response:**
```json
{
  "success": true,
  "message": "Admin auth routes are working!",
  "timestamp": "2026-01-26T...",
  "defaultCredentials": {
    "username": "admin",
    "password": "admin123"
  }
}
```

✅ **API is working!**

#### Test 2: Test login endpoint

```bash
curl -X POST https://backend-vigyanpreap.vigyanprep.com/api/admin/auth/login \
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

✅ **Login API working!**

#### Test 3: Test in browser

1. Open: `https://vigyanprep.com/admin-login.html`
2. Enter:
   - Username: `admin`
   - Password: `admin123`
3. Click "Sign In"
4. Should redirect to dashboard!

✅ **Login page working!**

---

## 🔐 CHANGE DEFAULT PASSWORD (IMPORTANT!)

**Step 1: Generate new password hash**

```bash
# From SSH:
curl -X POST http://localhost:3000/api/admin/auth/generate-hash \
  -H "Content-Type: application/json" \
  -d '{"password": "YourNewStrongPassword123!"}'
```

**Step 2: Copy the hash from response**

Response will show:
```json
{
  "success": true,
  "hash": "$2a$10$abc123xyz..."
}
```

**Step 3: Update .env file**

```bash
# Edit .env file
cd backend
nano .env

# Add or update these lines:
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$abc123xyz...

# Save: Ctrl + X, Y, Enter
```

**Step 4: Restart server**

```bash
pm2 restart vigyan-backend
```

**Step 5: Test new password**

```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YourNewStrongPassword123!"}'
```

✅ **Password changed!**

---

## 🐛 TROUBLESHOOTING

### Problem: "Cannot find module 'bcryptjs'"

**Solution:**
```bash
cd backend
npm install bcryptjs
pm2 restart all
```

### Problem: "Cannot GET /api/admin/auth/login"

**Solution:**
```bash
# Check if server.js has the imports:
grep -n "adminAuthRoutes" backend/server.js

# Should show 2 lines with line numbers
# If not found, add them manually
```

### Problem: Login page shows but login fails

**Check backend logs:**
```bash
pm2 logs vigyan-backend --lines 100

# Look for errors when you try to login
```

**Check if API is reachable:**
```bash
curl https://backend-vigyanpreap.vigyanprep.com/api/admin/auth/test
```

### Problem: Session timeout not working

**Verify session manager is loaded:**
```bash
# Check if file exists:
ls -la frontend/js/admin-session-manager.js

# Check if referenced in HTML:
grep "admin-session-manager" admin-dashboard-v2.html
```

### Problem: Can't connect via SSH

**Enable SSH in Hostinger:**
1. Login to Hostinger hPanel
2. Go to **VPS** → **SSH Access**
3. Click **Enable**
4. Copy SSH command and try again

---

## 📊 VERIFICATION CHECKLIST

- [ ] Connected to Hostinger via SSH
- [ ] Pulled latest code from GitHub
- [ ] Installed bcryptjs package
- [ ] Added import to server.js
- [ ] Added route registration to server.js
- [ ] Added session manager to HTML
- [ ] Updated logout function in HTML
- [ ] Restarted Node.js application
- [ ] Tested /api/admin/auth/test endpoint
- [ ] Tested /api/admin/auth/login endpoint
- [ ] Tested login page in browser
- [ ] Changed default password
- [ ] Tested new password

---

## 🎯 QUICK REFERENCE

### Default Credentials:
```
Username: admin
Password: admin123
```

### Important URLs:
```
Login Page: https://vigyanprep.com/admin-login.html
Dashboard: https://vigyanprep.com/admin-dashboard-v2.html
API Test: https://backend-vigyanpreap.vigyanprep.com/api/admin/auth/test
```

### Common PM2 Commands:
```bash
pm2 list                    # Show all processes
pm2 restart vigyan-backend  # Restart your app
pm2 logs vigyan-backend     # View logs
pm2 stop vigyan-backend     # Stop app
pm2 start vigyan-backend    # Start app
```

### File Locations:
```
Project Root: /home/vigyanprep/public_html (or ~/vigyan)
Backend: /home/vigyanprep/public_html/backend
Frontend: /home/vigyanprep/public_html/frontend
Login Page: /home/vigyanprep/public_html/admin-login.html
```

---

## 📞 STILL STUCK?

If you encounter issues:

1. **Check PM2 logs:**
   ```bash
   pm2 logs --lines 100
   ```

2. **Check server is running:**
   ```bash
   ps aux | grep node
   ```

3. **Check port 3000 is open:**
   ```bash
   netstat -tlnp | grep 3000
   ```

4. **Restart everything:**
   ```bash
   pm2 restart all
   ```

5. **Test locally first:**
   ```bash
   cd backend
   node server.js
   # Should show: ✅ Admin auth routes mounted
   ```

---

**Done!** 🎉 Your admin login system is now live on Hostinger!

**Next Steps:**
1. Login to your dashboard
2. Change the default password immediately
3. Test the 60-minute session timeout
4. Enjoy secure admin access!

---

**Last Updated:** January 26, 2026, 1:20 AM IST