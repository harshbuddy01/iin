# 📧 Email Setup Guide for IIN Platform

## Problem Found
The feedback form was saving data to MongoDB but **NOT sending email notifications**.

## Solution Implemented
1. ✅ Created `backend/config/email.js` with nodemailer configuration
2. ✅ Updated `backend/server.js` to send emails on feedback submission
3. ✅ Added beautiful HTML email templates

---

## 🚀 How to Enable Email Sending

### Step 1: Get Gmail App Password

You **CANNOT** use your regular Gmail password. You need an **App-Specific Password**.

#### Instructions:

1. **Go to Google Account Settings:**
   - Visit: https://myaccount.google.com/
   - Or search "Google Account" in Google

2. **Enable 2-Step Verification:**
   - Click **Security** (left sidebar)
   - Scroll to **2-Step Verification**
   - Click **Get Started** and follow instructions
   - You'll receive a code on your phone

3. **Generate App Password:**
   - After enabling 2FA, go back to **Security**
   - Scroll to **2-Step Verification** section
   - Click **App passwords** (at the bottom)
   - If you don't see it, search "App passwords" in the search bar
   
4. **Create the Password:**
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter: **IIN Platform**
   - Click **Generate**
   
5. **Copy the 16-character password:**
   - It will look like: `abcd efgh ijkl mnop`
   - **Save this password** - you won't see it again!

---

### Step 2: Update Railway Environment Variables

Since your backend is on Railway:

1. **Login to Railway:**
   - Go to: https://railway.app/
   - Find your `iin-production` project

2. **Add Environment Variables:**
   - Click on your service
   - Go to **Variables** tab
   - Add these 3 variables:

```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop  # Your 16-char app password (no spaces)
ADMIN_EMAIL=admin@iin.edu  # Where feedback emails go
```

3. **Deploy:**
   - Railway will automatically redeploy
   - Wait 2-3 minutes

---

### Step 3: Test It!

1. **Visit:** https://iin-theta.vercel.app/future.html

2. **Fill Feedback Form:**
   - Email: test@example.com
   - Roll Number: TEST-001
   - Select Test: IAT
   - Rate all categories (click stars)
   - Add comment
   - Click **Upload Feedback Data**

3. **Check Email:**
   - Admin email should receive notification
   - User email should receive confirmation

---

## 📧 Email Features

### Admin Notification Email:
- ✅ Beautiful HTML design
- ✅ User information (email, roll number, test)
- ✅ All 4 ratings with star visualization
- ✅ Full comment text
- ✅ Link to view in admin panel

### User Confirmation Email:
- ✅ Thank you message
- ✅ Confirmation that feedback was received
- ✅ Clean, professional design

---

## 🔧 Troubleshooting

### Problem: "Email sending failed"

**Solution 1: Check App Password**
- Make sure you copied the entire 16-character password
- Remove any spaces: `abcd efgh ijkl mnop` → `abcdefghijklmnop`
- Case doesn't matter

**Solution 2: Enable 2-Factor Authentication**
- App passwords only work with 2FA enabled
- Follow Step 1 instructions above

**Solution 3: Check Railway Variables**
- Variables must be EXACTLY:
  - `EMAIL_USER` (not email_user or EMAIL-USER)
  - `EMAIL_PASSWORD` (not EMAIL_PASS or PASSWORD)
  - `ADMIN_EMAIL` (not ADMIN_MAIL)

**Solution 4: Less Secure Apps (Old Method - NOT RECOMMENDED)**
- Google removed this option
- You MUST use App Passwords now

---

## 🌐 Alternative Email Providers

If you don't want to use Gmail:

### Using Outlook/Hotmail:
```javascript
service: 'hotmail',
auth: {
  user: 'your-email@outlook.com',
  pass: 'your-outlook-password'
}
```

### Using Custom SMTP:
```javascript
host: 'smtp.your-domain.com',
port: 587,
secure: false, // true for 465, false for other ports
auth: {
  user: 'your-email@yourdomain.com',
  pass: 'your-password'
}
```

### Using SendGrid:
```javascript
host: 'smtp.sendgrid.net',
port: 587,
auth: {
  user: 'apikey',
  pass: 'YOUR_SENDGRID_API_KEY'
}
```

---

## 📊 Email Flow Diagram

```
User Submits Feedback
        ↓
    Save to MongoDB ✅
        ↓
    ┌───────────────────┐
    │                   │
    ↓                   ↓
Admin Email       User Email
(Notification)   (Confirmation)
```

---

## 🎯 Testing Checklist

- [ ] 2-Factor Auth enabled on Gmail
- [ ] App Password generated
- [ ] Railway variables added
- [ ] Backend redeployed
- [ ] Test feedback submitted
- [ ] Admin email received
- [ ] User confirmation received
- [ ] Feedback shows in admin panel

---

## 💡 Pro Tips

1. **Use a dedicated email** for the platform (not your personal email)
2. **Set up email forwarding** so notifications go to your main inbox
3. **Check spam folder** if emails don't arrive
4. **Test with your own email first** before going live

---

## 🆘 Still Not Working?

Check Railway logs:
1. Go to Railway dashboard
2. Click your service
3. Click **Logs** tab
4. Look for:
   - ✅ "Feedback email sent"
   - ❌ "Email sending failed"

If you see errors, they'll tell you what's wrong!

---

## 📚 Code Files Modified

1. ✅ `backend/config/email.js` - Email configuration
2. ✅ `backend/server.js` - Integrated email sending
3. ✅ `.env.example` - Environment variable template
4. ✅ `EMAIL_SETUP_GUIDE.md` - This guide

---

**Last Updated:** December 24, 2025  
**Status:** ✅ Ready to deploy with email support
