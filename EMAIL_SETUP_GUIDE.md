# 📧 Email Setup Guide for IIN Platform - Brevo Edition

## Migration Notice
The IIN Platform has migrated from Gmail to **Brevo (formerly Sendinblue)** for improved email deliverability and professional email services.

---

## 🚀 Why Brevo?

✅ **Professional Email Service** - Designed for transactional emails  
✅ **Higher Limits** - 300 emails/day on free tier (vs Gmail's ~500 with restrictions)  
✅ **Better Deliverability** - Dedicated infrastructure for inbox placement  
✅ **Email Analytics** - Track opens, clicks, and delivery rates  
✅ **No Gmail Hassles** - No app passwords or 2FA complications  
✅ **Scalable** - Easy upgrade path for growing needs  

---

## 🎯 Email Features

### 1. Roll Number Distribution
- **Automatic Email** when users register
- **Beautiful HTML template** with roll number
- **Instructions** for platform access
- **Professional branding**

### 2. Feedback Notifications
- **Admin notifications** for new feedback
- **User confirmations** after feedback submission
- **Star ratings visualization**
- **Detailed feedback summary**

---

## 📝 Step-by-Step Setup

### Step 1: Create Brevo Account

1. **Visit Brevo:** https://www.brevo.com/
2. **Sign Up** for a free account
3. **Verify your email address**
4. **Complete the onboarding** questionnaire

### Step 2: Get SMTP Credentials

1. **Login to Brevo Dashboard**
2. **Navigate to:** Settings → SMTP & API
3. **Click on SMTP tab**
4. **Copy your credentials:**
   - SMTP Server: `smtp-relay.brevo.com`
   - Port: `587`
   - Login: Your Brevo SMTP login (e.g., `9ec09d001@smtp-brevo.com`)

### Step 3: Generate API Key

1. **In SMTP & API settings**
2. **Click:** "Generate a new SMTP key" or "Create a new API key"
3. **Name it:** "IIN Platform Production"
4. **Copy the key** - It looks like:
   ```
   xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxx
   ```
5. **Save it securely** - You won't see it again!

### Step 4: Configure Environment Variables

#### For Local Development:

Create a `.env` file in your project root:

```bash
# Brevo Email Configuration
BREVO_SMTP_USER=9ec09d001@smtp-brevo.com
BREVO_API_KEY=xkeysib-your-api-key-here
BREVO_SENDER_EMAIL=9ec09d001@smtp-brevo.com

# Platform Settings
ADMIN_EMAIL=your-admin-email@gmail.com
SUPPORT_EMAIL=support@iin.edu
PLATFORM_URL=https://iin-theta.vercel.app
ADMIN_PANEL_URL=https://iin-theta.vercel.app

# MongoDB
MONGODB_URI=your-mongodb-connection-string
```

#### For Railway Production:

1. **Login to Railway:** https://railway.app/
2. **Select your project:** `iin-production`
3. **Go to Variables tab**
4. **Add these variables:**

```bash
BREVO_SMTP_USER=9ec09d001@smtp-brevo.com
BREVO_API_KEY=xkeysib-your-api-key-here
BREVO_SENDER_EMAIL=9ec09d001@smtp-brevo.com
ADMIN_EMAIL=your-admin@email.com
SUPPORT_EMAIL=support@iin.edu
PLATFORM_URL=https://iin-theta.vercel.app
ADMIN_PANEL_URL=https://iin-theta.vercel.app
```

5. **Save** - Railway will auto-deploy

---

## 🧪 Testing Email Functionality

### Test 1: Roll Number Email

Add this test code to your registration endpoint:

```javascript
import { sendRollNumberEmail } from './backend/config/email.js';

// After successful registration
const result = await sendRollNumberEmail(
  'test@example.com',    // User email
  'IIN2025001',          // Generated roll number
  'John Doe',            // User name
  'IIN IAT 2025'         // Test name
);

if (result.success) {
  console.log('✅ Email sent:', result.messageId);
} else {
  console.error('❌ Email failed:', result.error);
}
```

### Test 2: Feedback Email

```javascript
import { sendFeedbackEmail } from './backend/config/email.js';

const feedbackData = {
  email: 'student@example.com',
  rollNumber: 'IIN2025001',
  testId: 'iat',
  ratings: {
    login: 5,
    interface: 4,
    quality: 5,
    server: 4
  },
  comment: 'Great platform!',
  feedbackId: '12345'
};

const result = await sendFeedbackEmail(feedbackData);
```

### Test 3: User Confirmation

```javascript
import { sendUserConfirmation } from './backend/config/email.js';

const result = await sendUserConfirmation('user@example.com');
```

---

## 🔧 Troubleshooting

### Problem: "Authentication failed"

**Solutions:**
1. ✅ Verify `BREVO_API_KEY` is correct (no extra spaces)
2. ✅ Check `BREVO_SMTP_USER` matches your Brevo login
3. ✅ Ensure API key is active in Brevo dashboard
4. ✅ Regenerate API key if needed

### Problem: "Connection timeout"

**Solutions:**
1. ✅ Check port is `587` (not 465 or 25)
2. ✅ Verify firewall isn't blocking SMTP
3. ✅ Ensure server has internet access
4. ✅ Try with `secure: false` in config

### Problem: "Emails going to spam"

**Solutions:**
1. ✅ **Verify your domain** in Brevo settings
2. ✅ **Add SPF record** to your DNS
3. ✅ **Configure DKIM** in Brevo
4. ✅ **Warm up your sender reputation** gradually

### Problem: "Rate limit exceeded"

**Solutions:**
1. ✅ Free tier: 300 emails/day limit
2. ✅ Wait 24 hours for reset
3. ✅ Upgrade to paid plan for more capacity
4. ✅ Implement email queuing for bulk sends

---

## 📊 Email Templates Overview

### Roll Number Email
- 🎨 **Modern gradient design**
- 📱 **Mobile responsive**
- 🔢 **Large, clear roll number display**
- ✅ **Important instructions list**
- 🔗 **Direct login button**
- 📧 **Support contact info**

### Feedback Admin Email
- 📝 **User details summary**
- ⭐ **Star ratings visualization**
- 💬 **Full comment display**
- 🔗 **Link to admin panel**
- 📊 **Professional layout**

### User Confirmation Email
- ✅ **Thank you message**
- 🎨 **Clean, minimal design**
- 📱 **Mobile friendly**
- 🏢 **Professional branding**

---

## 📈 Monitoring Email Delivery

### In Brevo Dashboard:

1. **Navigate to:** Statistics → Email
2. **View metrics:**
   - ✉️ Emails sent
   - ✅ Delivery rate
   - 📖 Open rate
   - 🖱️ Click rate
   - ⚠️ Bounce rate
   - 🚫 Spam reports

### In Server Logs:

```bash
# Success messages
✅ Brevo SMTP server is ready to send emails
✅ Roll number email sent to: user@example.com | Message ID: <xxx>
✅ Feedback email sent to admin | Message ID: <xxx>

# Error messages
❌ Brevo SMTP connection failed: [error details]
❌ Roll number email failed: [error message]
```

---

## 🎓 Best Practices

### Email Sending:
1. ✅ **Always handle errors gracefully**
2. ✅ **Log all email activities**
3. ✅ **Provide fallback messaging** if email fails
4. ✅ **Test emails before production**
5. ✅ **Monitor delivery rates**

### Security:
1. 🔒 **Never commit API keys** to Git
2. 🔒 **Use environment variables**
3. 🔒 **Rotate API keys** periodically
4. 🔒 **Limit API key permissions**
5. 🔒 **Use different keys** for dev/prod

### Performance:
1. ⚡ **Implement async email sending**
2. ⚡ **Use email queues** for bulk operations
3. ⚡ **Cache templates** where possible
4. ⚡ **Monitor send rates**
5. ⚡ **Optimize email size**

---

## 🆙 Upgrading Brevo Plan

When you need more capacity:

### Free Plan:
- ✉️ 300 emails/day
- ✅ SMTP relay
- ✅ Basic templates

### Starter Plan (~$25/month):
- ✉️ 20,000 emails/month
- ✅ No daily limit
- ✅ Advanced statistics
- ✅ Remove Brevo logo

### Business Plan (~$65/month):
- ✉️ 100,000 emails/month
- ✅ Dedicated IP
- ✅ Priority support
- ✅ Advanced automation

---

## 📚 Additional Resources

- 📖 [Brevo Documentation](https://developers.brevo.com/)
- 📖 [Nodemailer Guide](https://nodemailer.com/about/)
- 📖 [SMTP Best Practices](https://www.brevo.com/blog/smtp-best-practices/)
- 📖 [Email Deliverability Tips](https://www.brevo.com/blog/improve-email-deliverability/)

---

## 🆘 Getting Help

### Platform Issues:
- 📧 Email: support@iin.edu
- 💬 Create an issue on GitHub

### Brevo Support:
- 🌐 Help Center: https://help.brevo.com/
- 💬 Live Chat: Available in dashboard
- 📧 Email: support@brevo.com

---

## ✅ Migration Checklist

- [ ] Brevo account created and verified
- [ ] SMTP credentials obtained
- [ ] API key generated and saved
- [ ] Environment variables updated locally
- [ ] Railway environment variables configured
- [ ] Code updated with new email config
- [ ] Test roll number email sent successfully
- [ ] Test feedback email sent successfully
- [ ] Test user confirmation sent successfully
- [ ] Production deployment completed
- [ ] Email monitoring set up
- [ ] Old Gmail credentials removed
- [ ] Documentation updated

---

**Last Updated:** December 25, 2025  
**Status:** ✅ Migrated to Brevo  
**Email Service:** Brevo (Sendinblue)  
**Daily Limit:** 300 emails (Free Tier)  
