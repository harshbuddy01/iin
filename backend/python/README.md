# PDF to AI Quiz Generator

## Overview
This module converts PDF documents into multiple-choice quiz questions using AI (Google Gemini).

## Features
- ✅ Extract text from PDF files (supports complex layouts)
- ✅ Convert extracted text to NISER/IISER-style MCQ questions
- ✅ Generate 10-15 questions per PDF with explanations
- ✅ Support for easy/medium/hard difficulty levels
- ✅ Automatic topic classification

## Setup

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Environment Variable
Add your Google Gemini API key to your environment:
```bash
export GEMINI_API_KEY="your-api-key-here"
```

Or in Railway/Hostinger dashboard:
- Variable: `GEMINI_API_KEY`
- Value: Your API key from https://makersuite.google.com/app/apikey

## API Endpoints

### 1. Extract Text from PDF
**POST** `/api/admin/pdf-ai/extract`

**Request:**
- Content-Type: `multipart/form-data`
- Body: `pdf` (file)

**Response:**
```json
{
  "success": true,
  "text": "Extracted text from PDF...",
  "file": "path/to/uploaded.pdf",
  "pages": 10
}
```

### 2. Convert Text to Questions
**POST** `/api/admin/pdf-ai/convert-questions`

**Request:**
```json
{
  "text": "Text to convert to questions",
  "apiKey": "optional-override-key"
}
```

**Response:**
```json
{
  "success": true,
  "questions": [
    {
      "question": "What is photosynthesis?",
      "options": [
        "A) Process of making food using sunlight",
        "B) Process of respiration",
        "C) Process of cell division",
        "D) Process of protein synthesis"
      ],
      "correctAnswer": "A",
      "explanation": "Photosynthesis is the process by which plants convert light energy into chemical energy.",
      "difficulty": "easy",
      "topic": "Biology - Plant Physiology"
    }
  ],
  "count": 15
}
```

### 3. Full Pipeline (PDF → Questions)
**POST** `/api/admin/pdf-ai/full-process`

**Request:**
- Content-Type: `multipart/form-data`
- Body: `pdf` (file), `apiKey` (optional)

**Response:**
```json
{
  "success": true,
  "extractedText": "Full text from PDF...",
  "questions": [...],
  "questionCount": 15
}
```

## Error Handling

### Common Errors:

1. **Missing API Key**
```json
{
  "error": "No AI API key configured"
}
```
**Solution:** Set `GEMINI_API_KEY` environment variable

2. **Invalid PDF**
```json
{
  "error": "Failed to extract PDF text"
}
```
**Solution:** Ensure the PDF is not corrupted or password-protected

3. **AI Parsing Error**
```json
{
  "error": "Failed to parse AI response",
  "raw_response": "..."
}
```
**Solution:** Check if Gemini API key is valid and has quota

## Testing

### Test with cURL:

**1. Extract text:**
```bash
curl -X POST https://vigyan-production.up.railway.app/api/admin/pdf-ai/extract \
  -F "pdf=@sample.pdf"
```

**2. Full pipeline:**
```bash
curl -X POST https://vigyan-production.up.railway.app/api/admin/pdf-ai/full-process \
  -F "pdf=@sample.pdf" \
  -F "apiKey=your-gemini-key"
```

## File Structure

```
backend/python/
├── pdf_processor.py      # PDF text extraction
├── ai_converter.py       # AI-powered question generation
├── requirements.txt      # Python dependencies
└── README.md             # This file

backend/routes/
└── pdfAiRoutes.js        # Express API routes
```

## Architecture

```
PDF Upload → Multer (File Storage) → pdf_processor.py (Extract Text)
                                           ↓
                                      Text String
                                           ↓
                                   ai_converter.py (Gemini AI)
                                           ↓
                                    JSON Questions Array
                                           ↓
                                  Return to Frontend
```

## Limitations

- Max PDF size: 10 MB
- Max text processed: 4000 characters
- Questions per request: 10-15
- Supported formats: PDF only

## Future Enhancements

- [ ] Support for images in PDFs
- [ ] Multiple PDF batch processing
- [ ] Custom question count
- [ ] Export to JSON/CSV
- [ ] Save questions to database
- [ ] Support for other AI models (OpenAI GPT-4)

## Deployment

### Railway:
1. Ensure `nixpacks.toml` includes Python setup
2. Set `GEMINI_API_KEY` in Railway dashboard
3. Deploy and test endpoints

### Hostinger:
1. Install Python 3.11+ on server
2. Run `pip install -r requirements.txt`
3. Set environment variables in hosting panel
4. Restart Node.js server

## Troubleshooting

**Issue:** `python3: command not found`
**Fix:** Install Python 3.11+ or update `nixpacks.toml`

**Issue:** `ModuleNotFoundError: No module named 'google.generativeai'`
**Fix:** Run `pip install -r requirements.txt`

**Issue:** Upload folder permission denied
**Fix:** Ensure `uploads/` directory exists and has write permissions

## Support

For issues or questions:
- GitHub: [harshbuddy01/vigyan](https://github.com/harshbuddy01/vigyan)
- Email: harshbuddy01@gmail.com

---

**Last Updated:** January 28, 2026
**Version:** 1.0.0