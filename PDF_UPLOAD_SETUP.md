# PDF Upload & Question Extraction - Setup Guide

## Overview

This system allows admins to upload PDF files containing exam questions. The system automatically extracts questions, parses mathematical equations, and saves them to the database for use in tests.

## Features

✅ **Exam Type Support**: IAT, ISI, NEST  
✅ **Math Equation Parsing**: Automatically converts mathematical notation to LaTeX  
✅ **Auto-Extraction**: AI-powered question extraction from PDFs  
✅ **Subject Support**: Physics, Mathematics, Chemistry, Biology  
✅ **Answer Key Detection**: Automatically extracts answers if present  
✅ **Database Integration**: Questions saved directly to question bank  
✅ **Upload History**: Track all PDF uploads with metadata  

---

## Installation Steps

### 1. Install Python Dependencies

```bash
cd backend
pip3 install -r requirements.txt
```

Or install manually:
```bash
pip3 install PyPDF2==3.0.1
```

### 2. Install Node.js Dependencies

```bash
npm install multer
```

This is needed for handling file uploads in Node.js backend.

### 3. Setup Database

Run the SQL migration to create necessary tables:

```bash
mysql -u your_username -p your_database < backend/migrations/add_pdf_tables.sql
```

Or manually execute the SQL file in your MySQL client.

### 4. Configure Backend Routes

Ensure the PDF route is registered in your main server file (`backend/server.js`):

```javascript
const pdfRoutes = require('./routes/pdf');
app.use('/api/pdf', pdfRoutes);
```

### 5. Create Upload Directory

Create the directory for storing uploaded PDFs:

```bash
mkdir -p backend/uploads/pdfs
```

### 6. Make Python Script Executable

```bash
chmod +x backend/pdf_processor.py
```

---

## Usage Guide

### For Admins

1. **Login to Admin Panel**
   - Navigate to admin dashboard
   - Go to "Question Bank" → "Upload PDF"

2. **Upload PDF**
   - Select Exam Type (IAT/ISI/NEST)
   - Choose Subject
   - Add Topic/Chapter (optional)
   - Add Year (optional)
   - **Enable "Auto-extract questions"** (recommended)
   - Drag & drop or click to browse PDF file
   - Add notes if needed
   - Click "Upload PDF"

3. **View Extracted Questions**
   - After successful upload, click "Yes" when prompted
   - You'll be redirected to "View/Edit" section
   - Review extracted questions
   - Edit/correct if needed

4. **Upload History**
   - Click "Upload History" button
   - View all past uploads
   - See number of questions extracted
   - Delete old uploads if needed

---

## How It Works

### Upload Flow

```
Admin uploads PDF → Backend receives file → Python processor extracts text
                                            ↓
                      Questions parsed ← Math equations converted to LaTeX
                                            ↓
                      Questions saved to database → Display in Edit/Review
```

### Question Extraction Process

1. **Text Extraction**: PDF text is extracted using PyPDF2
2. **Question Detection**: Regex patterns identify numbered questions (1., Q1, etc.)
3. **Option Parsing**: Multiple choice options are extracted (A), B), etc.)
4. **Math Detection**: Mathematical symbols and equations are identified
5. **LaTeX Conversion**: Math notation is converted to LaTeX format
6. **Answer Extraction**: Answer keys are detected if present
7. **Database Storage**: Structured questions are saved with metadata

### Mathematical Equation Support

The system automatically detects and converts:
- **Fractions**: `3/4` → `\frac{3}{4}`
- **Powers**: `x^2` → `x^{2}`
- **Greek letters**: α, β, γ → `\alpha`, `\beta`, `\gamma`
- **Square roots**: √x → `\sqrt{x}`
- **Operators**: ≤, ≥, ≠, ∞ → LaTeX equivalents

---

## API Endpoints

### Upload PDF
**POST** `/api/pdf/upload`

**Body** (multipart/form-data):
```
pdfFile: File
examType: String (IAT/ISI/NEST)
subject: String
topic: String (optional)
year: String (optional)
autoExtract: Boolean
notes: String (optional)
```

**Response**:
```json
{
  "success": true,
  "message": "PDF processed successfully",
  "totalQuestions": 25,
  "questionsExtracted": 25,
  "savedQuestionIds": [1, 2, 3, ...]
}
```

### Get Upload History
**GET** `/api/pdf/history`

**Response**:
```json
{
  "success": true,
  "uploads": [
    {
      "id": 1,
      "file_name": "iat_physics_2024.pdf",
      "exam_type": "IAT",
      "subject": "Physics",
      "questions_extracted": 25,
      "upload_date": "2025-12-28T12:00:00.000Z"
    }
  ]
}
```

### Delete Upload
**DELETE** `/api/pdf/:id`

**Response**:
```json
{
  "success": true,
  "message": "Upload deleted"
}
```

---

## Database Schema

### `pdf_uploads` Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| file_name | VARCHAR(255) | Original filename |
| file_path | VARCHAR(512) | Server file path |
| exam_type | VARCHAR(50) | IAT/ISI/NEST |
| subject | VARCHAR(100) | Subject name |
| topic | VARCHAR(200) | Topic/chapter |
| year | VARCHAR(10) | Year |
| notes | TEXT | Admin notes |
| questions_extracted | INT | Number of questions |
| upload_date | DATETIME | Upload timestamp |

### `questions` Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| question_text | TEXT | Question content |
| subject | VARCHAR(100) | Subject |
| exam_type | VARCHAR(50) | Exam type |
| difficulty | ENUM | easy/medium/hard |
| topic | VARCHAR(200) | Topic |
| year | VARCHAR(10) | Year |
| options | JSON | Answer options |
| correct_answer | VARCHAR(10) | Correct answer |
| marks | INT | Marks allocated |
| has_math | BOOLEAN | Contains math |
| created_at | DATETIME | Creation time |
| updated_at | DATETIME | Last update |

---

## Troubleshooting

### PDF Upload Fails

**Problem**: Upload returns error  
**Solutions**:
- Check file size (max 10MB)
- Ensure PDF is not corrupted
- Verify Python is installed: `python3 --version`
- Check backend logs for errors

### Questions Not Extracted

**Problem**: 0 questions extracted from PDF  
**Solutions**:
- Ensure PDF contains readable text (not scanned images)
- Check if questions are numbered (1., 2., Q1, etc.)
- Try disabling auto-extract and upload for manual entry
- Review PDF structure - should have clear question format

### Math Equations Not Formatted

**Problem**: Math appears as plain text  
**Solutions**:
- PDF must use Unicode math symbols (∑, ∫, α, β)
- LaTeX conversion works best with standard notation
- Manual editing available in View/Edit section

### Python Script Errors

**Problem**: Python processing fails  
**Solutions**:
```bash
# Test Python script manually
python3 backend/pdf_processor.py path/to/test.pdf IAT Physics Mechanics 2024

# Check PyPDF2 installation
pip3 show PyPDF2

# Reinstall if needed
pip3 install --upgrade PyPDF2
```

### Permission Errors

**Problem**: Cannot write to uploads directory  
**Solutions**:
```bash
# Fix directory permissions
chmod 755 backend/uploads
chmod 755 backend/uploads/pdfs

# Or for development
chmod 777 backend/uploads/pdfs
```

---

## Best Practices

### For Best Extraction Results

1. **Use text-based PDFs** (not scanned images)
2. **Clear numbering** - Questions should be numbered (1., 2., etc.)
3. **Standard format** - Options labeled A, B, C, D
4. **Include answer key** - Improves automation
5. **One question per section** - Avoid merged questions
6. **Readable fonts** - Standard fonts work best

### PDF Preparation Tips

- **Convert scanned PDFs** using OCR software first
- **Remove headers/footers** that might confuse extraction
- **Check PDF structure** - copy/paste test in a text editor
- **Split large files** - Process in smaller batches (< 10MB)
- **Backup originals** - Keep original PDFs safe

---

## Security Considerations

- PDFs are stored in `backend/uploads/pdfs` (ensure .gitignore includes this)
- File size limited to 10MB
- Only PDF MIME type accepted
- Admin authentication required for upload
- SQL injection protected through parameterized queries
- File paths validated before deletion

---

## Future Enhancements

- [ ] OCR support for scanned PDFs
- [ ] Image extraction from questions
- [ ] Bulk PDF processing
- [ ] Advanced math equation parsing
- [ ] Question categorization using AI
- [ ] Duplicate question detection
- [ ] PDF preview before upload
- [ ] Export extracted questions to Excel

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review backend logs
3. Test Python script independently
4. Verify database tables exist
5. Check file permissions

---

## Version History

**v1.0.0** (2025-12-28)
- Initial release
- PDF upload with auto-extraction
- Math equation parsing
- IAT, ISI, NEST exam support
- Database integration
- Upload history tracking
