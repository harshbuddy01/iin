const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { spawn } = require('child_process');
const pool = require('../config/database');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/pdfs');
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'pdf-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// Process PDF with Python script
function processPDFWithPython(pdfPath) {
    return new Promise((resolve, reject) => {
        const pythonScript = path.join(__dirname, '../pdf_processor.py');
        const python = spawn('python3', [pythonScript, pdfPath]);
        
        let output = '';
        let errorOutput = '';
        
        python.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        python.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        python.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python script failed: ${errorOutput}`));
            } else {
                try {
                    const result = JSON.parse(output);
                    resolve(result);
                } catch (e) {
                    reject(new Error(`Failed to parse Python output: ${e.message}`));
                }
            }
        });
    });
}

// Save questions to database
async function saveQuestionsToDatabase(questions, metadata) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const savedQuestions = [];
        
        for (const question of questions) {
            const [result] = await connection.execute(
                `INSERT INTO questions 
                (question_text, option_a, option_b, option_c, option_d, 
                 correct_answer, explanation, difficulty, exam_type, subject, 
                 topic, year, has_formula, source) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    question.questionText,
                    question.options[0] || '',
                    question.options[1] || '',
                    question.options[2] || '',
                    question.options[3] || '',
                    question.correctAnswer,
                    question.explanation || '',
                    question.difficulty || 'medium',
                    metadata.examType,
                    metadata.subject,
                    metadata.topic || null,
                    metadata.year || null,
                    question.hasFormula ? 1 : 0,
                    'PDF Upload'
                ]
            );
            
            savedQuestions.push({
                id: result.insertId,
                questionNumber: question.questionNumber
            });
        }
        
        await connection.commit();
        return savedQuestions;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// Main upload route
router.post('/upload', upload.single('pdfFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No PDF file uploaded'
            });
        }
        
        const { examType, subject, topic, year, autoExtract, notes } = req.body;
        
        // Validate required fields
        if (!examType || !subject) {
            // Clean up uploaded file
            await fs.unlink(req.file.path);
            return res.status(400).json({
                success: false,
                error: 'Exam type and subject are required'
            });
        }
        
        const pdfPath = req.file.path;
        let extractedQuestions = [];
        
        // If auto-extract is enabled, process the PDF
        if (autoExtract === 'true') {
            try {
                console.log('Processing PDF with Python...');
                const result = await processPDFWithPython(pdfPath);
                
                if (result.success && result.questions) {
                    extractedQuestions = result.questions;
                    console.log(`Extracted ${extractedQuestions.length} questions`);
                    
                    // Save questions to database
                    const metadata = {
                        examType,
                        subject,
                        topic,
                        year
                    };
                    
                    const savedQuestions = await saveQuestionsToDatabase(
                        extractedQuestions,
                        metadata
                    );
                    
                    console.log(`Saved ${savedQuestions.length} questions to database`);
                } else {
                    console.error('PDF processing failed:', result.error);
                }
            } catch (pythonError) {
                console.error('Error processing PDF:', pythonError);
                // Continue even if extraction fails
            }
        }
        
        // Save upload record
        const [uploadResult] = await pool.execute(
            `INSERT INTO pdf_uploads 
            (filename, original_name, file_path, file_size, exam_type, subject, 
             topic, year, notes, questions_extracted, upload_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
                req.file.filename,
                req.file.originalname,
                pdfPath,
                req.file.size,
                examType,
                subject,
                topic || null,
                year || null,
                notes || null,
                extractedQuestions.length
            ]
        );
        
        res.json({
            success: true,
            message: 'PDF uploaded successfully',
            uploadId: uploadResult.insertId,
            fileName: req.file.originalname,
            questionsExtracted: extractedQuestions.length,
            autoExtracted: autoExtract === 'true'
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        
        // Clean up file if it exists
        if (req.file && req.file.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to upload PDF'
        });
    }
});

// Get upload history
router.get('/history', async (req, res) => {
    try {
        const [uploads] = await pool.execute(
            `SELECT id, original_name, exam_type, subject, topic, year, 
                    file_size, questions_extracted, upload_date 
            FROM pdf_uploads 
            ORDER BY upload_date DESC 
            LIMIT 50`
        );
        
        res.json({
            success: true,
            uploads
        });
    } catch (error) {
        console.error('Error fetching upload history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch upload history'
        });
    }
});

// Delete upload record
router.delete('/delete/:uploadId', async (req, res) => {
    try {
        const { uploadId } = req.params;
        
        // Get file path before deleting record
        const [uploads] = await pool.execute(
            'SELECT file_path FROM pdf_uploads WHERE id = ?',
            [uploadId]
        );
        
        if (uploads.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Upload not found'
            });
        }
        
        const filePath = uploads[0].file_path;
        
        // Delete from database
        await pool.execute('DELETE FROM pdf_uploads WHERE id = ?', [uploadId]);
        
        // Try to delete file
        try {
            await fs.unlink(filePath);
        } catch (fileError) {
            console.error('Error deleting file:', fileError);
            // Continue even if file deletion fails
        }
        
        res.json({
            success: true,
            message: 'Upload deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting upload:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete upload'
        });
    }
});

module.exports = router;
