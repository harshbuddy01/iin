# 📅 Calendar-Based Exam System - Admin Panel Guide

## 🎯 What We Built

A complete **calendar-based exam scheduling system** where admin can:
- 📅 Select exam date from calendar
- 📤 Upload questions via PDF, manual entry, or images
- 🧮 Support LaTeX mathematical formulas
- 🖼️ Add questions with diagrams/graphs
- ✏️ Edit/Delete questions
- 👁️ Preview how students will see questions
- 🗓️ Schedule multiple tests for different dates

---

## 🚀 How to Use

### **Step 1: Access Admin Panel**
```
https://your-vercel-url.vercel.app/admin-exam-scheduler.html
```

### **Step 2: Create New Test**

1. **📅 Select Exam Date**
   - Click on the calendar field
   - Choose date (e.g., December 28, 2025)
   
2. **⏰ Set Start Time**
   - Default: 10:00 AM
   - Can be changed to any time
   
3. **⏱️ Set Duration**
   - Default: 180 minutes (3 hours)
   - For IAT/NEST: 180 minutes
   - For ISI: Will be different (coming soon)
   
4. **📝 Select Test Type**
   - **IAT**: All 4 sections count (Physics + Chemistry + Maths + Biology)
   - **NEST**: Best 3 out of 4 sections count
   - **ISI**: Coming soon
   
5. **📚 Enter Test Name**
   - Example: "IAT January 2026"
   - Example: "NEST December 28, 2025"
   
6. **📄 Description (Optional)**
   - Add any notes about the test
   
7. **✅ Click "Create Test Schedule"**

---

### **Step 3: Add Questions (3 Methods)**

After creating test, you'll see "Add Questions" section.

#### **Method 1: 📄 Upload PDF**
1. Click "Upload PDF" card
2. Select section tab (Physics/Chemistry/Maths/Biology)
3. Click on upload area
4. Choose your PDF file
5. Questions will be automatically extracted

**PDF Format Required:**
```
Question 1: What is the speed of light?
A) 3 × 10^8 m/s
B) 3 × 10^6 m/s
C) 3 × 10^5 m/s
D) 3 × 10^7 m/s
Correct Answer: A

Question 2: What is Newton's second law?
A) F = ma
B) E = mc^2
C) P = mv
D) W = Fd
Correct Answer: A
```

#### **Method 2: ✍️ Manual Entry (With LaTeX Math)**

1. Click "Manual Entry" card (default)
2. Select section tab
3. Fill in the form:

**Question Number:** 1

**Question Text:** (LaTeX supported)
```
What is \(x^2 + 2x + 1\)?
For power: \(2^{10}\)
For fraction: \(\frac{1}{2}\)
For square root: \(\sqrt{16}\)
```

**Question Image:** (Optional)
- Click to upload diagram/graph
- For physics diagrams, chemistry structures, etc.

**Options:**
- Option A: 512
- Option B: 1024
- Option C: 256
- Option D: 2048

**Correct Answer:** B

4. Click "💾 Save Question"
5. Question number auto-increments for next question!

#### **Method 3: 🖼️ Upload Image**

1. Click "Upload Image" card
2. Upload full question as image
3. Best for complex diagrams with options

---

### **Step 4: View & Manage Questions**

**View Questions:**
1. Click "👁️ View All Questions" button
2. Modal opens showing all questions
3. Filtered by current section
4. Math formulas render beautifully

**Edit Question:**
1. Click "✏️ Edit" button
2. Modify question text, options, etc.
3. Save changes

**Delete Question:**
1. Click "🗑️ Delete" button
2. Confirm deletion
3. Question removed

---

## 📊 Section-Wise Organization

### **Physics Section (30 Questions)**
- Question 1 to 30
- Topics: Mechanics, Electricity, Optics, etc.

### **Chemistry Section (30 Questions)**
- Question 31 to 60
- Topics: Organic, Inorganic, Physical Chemistry

### **Maths Section (30 Questions)**
- Question 61 to 90
- Topics: Calculus, Algebra, Trigonometry

### **Biology Section (30 Questions)**
- Question 91 to 120
- Topics: Botany, Zoology, Ecology

---

## 🎓 Test Types Explained

### **IAT (Indian Aptitude Test)**
```
Total Sections: 4 (Physics, Chemistry, Maths, Biology)
All sections counted: YES
Duration: 3 hours
Total Questions: 120 (30 per section)
Marking: +4 for correct, -1 for wrong

Final Score = Physics + Chemistry + Maths + Biology
```

### **NEST (Best 3 out of 4)**
```
Total Sections: 4 (Physics, Chemistry, Maths, Biology)
Student attempts: ALL 4 sections
Counted: BEST 3 sections only
Duration: 3 hours
Total Questions: 120 (30 per section)

Example:
Physics: 80/120 ✅ (counted)
Chemistry: 60/120 ❌ (lowest - NOT counted)
Maths: 90/120 ✅ (counted)
Biology: 75/120 ✅ (counted)

Final Score = 80 + 90 + 75 = 245/360
```

---

## 🧮 LaTeX Math Support

### **Inline Math:**
Use `\( ... \)` for inline formulas

**Examples:**
```
\(x^2\) → x²
\(2^{10}\) → 2¹⁰
\(\frac{1}{2}\) → ½
\(\sqrt{16}\) → √16
\(\alpha + \beta\) → α + β
```

### **Common Symbols:**
```
\(\times\) → ×
\(\div\) → ÷
\(\pm\) → ±
\(\leq\) → ≤
\(\geq\) → ≥
\(\neq\) → ≠
\(\approx\) → ≈
\(\infty\) → ∞
```

### **Greek Letters:**
```
\(\alpha\) → α
\(\beta\) → β
\(\gamma\) → γ
\(\theta\) → θ
\(\lambda\) → λ
\(\pi\) → π
\(\omega\) → ω
```

---

## 🗓️ Scheduled Tests Management

### **View Scheduled Tests**
Right side panel shows all scheduled tests:
- Test name
- Exam date & time
- Duration
- Test type (IAT/NEST)
- Total questions added
- Status (scheduled/active/completed)

### **Actions Available:**

1. **➕ Add Questions**
   - Opens question entry section
   - Pre-selects the test
   
2. **👁️ View Questions**
   - See all questions for this test
   - Section-wise breakdown
   
3. **🗑️ Delete Test**
   - Removes test and ALL its questions
   - Confirmation required

---

## 👨‍🎓 Student Side (How They See It)

### **Before Exam Date:**
```
❌ Test not available yet
"Your next test: December 28, 2025 at 10:00 AM"
```

### **On Exam Date at Start Time:**
```
✅ START TEST button appears!
- Students login with email + roll number
- Timer starts (3 hours)
- All 4 sections visible
- Questions with LaTeX render beautifully
- Images show properly
```

### **After Time Expires:**
```
❌ Test automatically submits
"Test ended at 1:00 PM"
```

---

## 📦 Database Structure

### **scheduled_tests Table**
```sql
test_id: "nest_20251228"
test_name: "NEST December 28, 2025"
test_type: "NEST"
exam_date: "2025-12-28"
start_time: "10:00:00"
duration_minutes: 180
status: "scheduled"
```

### **questions Table**
```sql
id: 1
test_id: "nest_20251228"
section: "Physics"
question_number: 1
question_text: "What is \\(2^{10}\\)?"
question_image_url: "https://..."
options: {"A": "512", "B": "1024", "C": "256", "D": "2048"}
correct_answer: "B"
has_latex: true
input_method: "manual"
```

---

## 🔧 Backend APIs

All APIs available at: `https://iin-production.up.railway.app/api/admin/`

### **Test Management:**
```
POST   /admin/create-test          - Create new scheduled test
GET    /admin/scheduled-tests      - Get all scheduled tests
GET    /admin/test/:testId         - Get specific test details
PUT    /admin/test/:testId/status  - Update test status
DELETE /admin/delete-test/:testId  - Delete test
```

### **Question Management:**
```
POST   /admin/add-question              - Add new question
GET    /admin/questions?testId=&section= - Get questions
PUT    /admin/update-question/:id       - Update question
DELETE /admin/delete-question/:id       - Delete question
```

### **Student Access:**
```
GET    /admin/available-tests      - Get tests available now
```

---

## ✅ Checklist for Adding New Test

- [ ] Open admin panel
- [ ] Select exam date from calendar
- [ ] Set start time (e.g., 10:00 AM)
- [ ] Set duration (180 minutes)
- [ ] Choose test type (IAT/NEST)
- [ ] Enter test name
- [ ] Click "Create Test Schedule"
- [ ] Add Physics questions (30)
- [ ] Add Chemistry questions (30)
- [ ] Add Maths questions (30)
- [ ] Add Biology questions (30)
- [ ] Preview all questions
- [ ] Verify LaTeX renders correctly
- [ ] Verify images load properly
- [ ] Test complete! ✅

---

## 🚨 Common Issues & Solutions

### **Issue: LaTeX not rendering**
**Solution:** 
- Use `\( ... \)` not `$ ... $`
- Wait 2 seconds after adding question
- Refresh page if needed

### **Issue: Image not showing**
**Solution:**
- Check image file size (max 5MB)
- Use JPG/PNG format
- Ensure stable internet connection

### **Issue: Questions not saving**
**Solution:**
- Check all required fields filled
- Verify correct answer selected
- Check browser console for errors

### **Issue: Calendar not opening**
**Solution:**
- Clear browser cache
- Try different browser
- Check if JavaScript enabled

---

## 📱 Browser Compatibility

✅ **Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

❌ **Not Supported:**
- Internet Explorer
- Opera Mini

---

## 🎉 Features Summary

✅ Calendar-based exam scheduling
✅ 3 methods to add questions (PDF/Manual/Image)
✅ LaTeX mathematical formula support
✅ Image upload for diagrams
✅ Section-wise organization
✅ Edit/Delete questions anytime
✅ Preview student view
✅ Multiple tests scheduling
✅ Auto-activation on exam day
✅ Time-based access control
✅ NEST best-3-out-of-4 logic
✅ Beautiful UI with animations
✅ Mobile responsive

---

## 📞 Support

If you need help:
1. Check this guide first
2. Check browser console for errors
3. Check Railway logs for backend errors
4. Contact developer

---

## 🔮 Coming Soon

- 📄 PDF auto-extraction with AI
- 🖼️ Bulk image upload
- 📊 Analytics dashboard
- 👥 Multiple admin users
- 🔐 Admin authentication
- 📧 Email notifications to students
- 📱 Mobile app
- 🌍 Multi-language support

---

**Built with ❤️ for IIN Assessment Portal**

**Version:** 2.0.0  
**Last Updated:** December 27, 2025  
**Developer:** AI Assistant + Harsh