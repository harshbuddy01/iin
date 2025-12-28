# 💻 Terminal Commands to Run

## 👉 Copy and paste these commands in your terminal

---

### Step 1: Install Node.js Dependencies

```bash
npm install
```

**What it does:** Installs all packages including the new `multer` package for PDF uploads.

---

### Step 2: Install Python Dependencies

```bash
pip3 install -r backend/requirements.txt
```

**If that doesn't work, try:**
```bash
pip install -r backend/requirements.txt
```

**What it does:** Installs PyPDF2 library for reading PDF files.

---

### Step 3: Create Upload Directory

**For Mac/Linux:**
```bash
mkdir -p backend/uploads/pdfs
```

**For Windows (Command Prompt):**
```cmd
mkdir backend\uploads\pdfs
```

**For Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Force -Path backend/uploads/pdfs
```

**What it does:** Creates folders where uploaded PDFs will be stored.

---

### Step 4: Make Python Script Executable (Mac/Linux only)

```bash
chmod +x backend/pdf_processor.py
```

**Windows users can skip this step.**

**What it does:** Gives permission to run the Python script.

---

### Step 5: Run Database Migration

**Option A - Using MySQL Command Line:**

Replace:
- `your_username` with your MySQL username (usually `root`)
- `your_database` with your database name (e.g., `iinedu_db`)

```bash
mysql -u your_username -p your_database < backend/migrations/add_pdf_tables.sql
```

**Example:**
```bash
mysql -u root -p iinedu_db < backend/migrations/add_pdf_tables.sql
```

It will ask for your MySQL password.

**Option B - Using phpMyAdmin or MySQL Workbench:**

1. Open phpMyAdmin or MySQL Workbench
2. Select your database
3. Go to SQL tab
4. Open file: `backend/migrations/add_pdf_tables.sql`
5. Copy all the SQL code
6. Paste and Execute

**What it does:** Creates `pdf_uploads` and updates `questions` table in your database.

---

## ✅ All Done! Now Test It

### Start Your Server:

```bash
npm start
```

You should see:
```
✅ PDF Upload: POST /api/pdf/upload
✅ PDF History: GET /api/pdf/history  
✅ PDF Delete: DELETE /api/pdf/:id
```

---

## 👀 Quick Checklist

- [ ] Run `npm install` ✅
- [ ] Run `pip3 install -r backend/requirements.txt` ✅
- [ ] Create upload directory ✅
- [ ] Make Python script executable (Mac/Linux) ✅
- [ ] Run database migration ✅
- [ ] Start server with `npm start` ✅
- [ ] Go to admin panel → Upload PDF ✅
- [ ] Test uploading a PDF file ✅

---

## 🐞 Troubleshooting

### "multer not found"
```bash
npm install multer
```

### "PyPDF2 not found"
```bash
pip3 install PyPDF2
```

### "Permission denied" (Linux/Mac)
```bash
sudo chmod -R 755 backend/uploads
```

### "python3 not found" (Windows)
```bash
python -m pip install -r backend/requirements.txt
```

Then edit `backend/routes/pdf.js` line 65:
- Change `python3` to `python`

### MySQL Connection Error
- Check your database credentials in `.env` file
- Make sure MySQL server is running

---

## 🚀 You're Ready!

After running all commands:
1. Your server will automatically restart (if deployed)
2. Go to admin panel
3. Navigate to "Question Bank" → "Upload PDF"
4. Upload your first PDF!

**All the code changes are already done by me. You just need to run these terminal commands!** 🎉
