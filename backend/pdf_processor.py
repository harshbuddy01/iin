#!/usr/bin/env python3
"""
PDF Question Extractor with Math Formula Support
Extracts questions from PDF files and converts them to structured format
"""

import PyPDF2
import re
import json
import sys
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PDFQuestionExtractor:
    """Extract questions from PDF files with math formula support"""
    
    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        self.questions = []
        
    def extract_text_from_pdf(self):
        """Extract all text from PDF"""
        try:
            with open(self.pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                return text
        except Exception as e:
            logger.error(f"Error reading PDF: {e}")
            return None
    
    def detect_math_formulas(self, text):
        """Detect and preserve mathematical formulas in LaTeX format"""
        # Common math patterns
        patterns = {
            'equations': r'([a-zA-Z]?\s*[=<>≤≥≠]\s*[\w\s\+\-\*/\^√∫∑πθαβγδε]+)',
            'fractions': r'(\d+/\d+)',
            'powers': r'([a-zA-Z]\^?\d+)',
            'symbols': r'([∫∑∏√±×÷≤≥≠≈∞πθαβγδελμσφψω])',
            'subscripts': r'([a-zA-Z]_\d+)',
        }
        
        math_expressions = []
        for pattern_name, pattern in patterns.items():
            matches = re.finditer(pattern, text)
            for match in matches:
                math_expressions.append({
                    'type': pattern_name,
                    'text': match.group(0),
                    'position': match.span()
                })
        
        return math_expressions
    
    def convert_to_latex(self, text):
        """Convert mathematical expressions to LaTeX format"""
        # Replace common symbols with LaTeX equivalents
        latex_replacements = {
            '√': r'\sqrt{}',
            '∫': r'\int',
            '∑': r'\sum',
            '∏': r'\prod',
            '≤': r'\leq',
            '≥': r'\geq',
            '≠': r'\neq',
            '≈': r'\approx',
            '±': r'\pm',
            '×': r'\times',
            '÷': r'\div',
            'π': r'\pi',
            'θ': r'\theta',
            'α': r'\alpha',
            'β': r'\beta',
            'γ': r'\gamma',
            'δ': r'\delta',
            'ε': r'\epsilon',
            'λ': r'\lambda',
            'μ': r'\mu',
            'σ': r'\sigma',
            'φ': r'\phi',
            'ψ': r'\psi',
            'ω': r'\omega',
        }
        
        for symbol, latex in latex_replacements.items():
            text = text.replace(symbol, latex)
        
        # Convert fractions
        text = re.sub(r'(\d+)/(\d+)', r'\\frac{\1}{\2}', text)
        
        # Convert powers
        text = re.sub(r'([a-zA-Z])(\^?)(\d+)', r'\1^{\3}', text)
        
        # Convert subscripts
        text = re.sub(r'([a-zA-Z])_(\d+)', r'\1_{\2}', text)
        
        return text
    
    def parse_questions(self, text):
        """Parse questions from extracted text"""
        # Split by common question markers
        question_patterns = [
            r'Q\.?\s*\d+[\.:)]',  # Q.1, Q1:, Q1)
            r'Question\s*\d+[\.:)]',
            r'\d+[\.:)]\s*(?=[A-Z])',  # 1. Question, 1) Question
            r'\n\d+\s*[\.:)]',
        ]
        
        # Combine patterns
        combined_pattern = '|'.join(question_patterns)
        
        # Split text by question markers
        raw_questions = re.split(combined_pattern, text, flags=re.MULTILINE)
        
        questions = []
        for i, q_text in enumerate(raw_questions):
            if not q_text.strip():
                continue
                
            # Extract question number
            q_number = i
            
            # Split into question text and options
            parts = re.split(r'\n\s*[A-D][\.:)]\s*', q_text, flags=re.IGNORECASE)
            
            if len(parts) > 0:
                question_text = parts[0].strip()
                
                # Extract options (A, B, C, D)
                options = []
                option_pattern = r'[A-D][\.:)]\s*([^\n]+)'
                option_matches = re.finditer(option_pattern, q_text, re.IGNORECASE)
                
                for match in option_matches:
                    options.append(match.group(1).strip())
                
                # If we have 4 options, consider it a valid MCQ
                if len(options) >= 4:
                    # Convert math to LaTeX
                    question_text = self.convert_to_latex(question_text)
                    options = [self.convert_to_latex(opt) for opt in options]
                    
                    questions.append({
                        'questionNumber': q_number + 1,
                        'questionText': question_text,
                        'options': options[:4],  # Take first 4 options
                        'correctAnswer': 0,  # Default to option A, can be updated
                        'explanation': '',
                        'difficulty': 'medium',
                        'hasFormula': self.has_mathematical_content(question_text)
                    })
        
        return questions
    
    def has_mathematical_content(self, text):
        """Check if text contains mathematical content"""
        math_indicators = [
            r'\\[a-zA-Z]+',  # LaTeX commands
            r'\d+/\d+',       # Fractions
            r'[=<>≤≥]',       # Math operators
            r'[∫∑∏√±×÷]',    # Math symbols
            r'[πθαβγδε]',     # Greek letters
        ]
        
        for pattern in math_indicators:
            if re.search(pattern, text):
                return True
        return False
    
    def extract_answer_key(self, text):
        """Try to extract answer keys from the PDF"""
        # Look for answer key section
        answer_patterns = [
            r'Answer\s*Key[:\s]+([A-D\s,\d]+)',
            r'Answers?[:\s]+([A-D\s,\d]+)',
            r'Correct\s*Answers?[:\s]+([A-D\s,\d]+)',
        ]
        
        answers = {}
        for pattern in answer_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                answer_text = match.group(1)
                # Parse answers like "1-A, 2-B, 3-C"
                answer_pairs = re.findall(r'(\d+)[:\-\s]*([A-D])', answer_text, re.IGNORECASE)
                for q_num, answer in answer_pairs:
                    answers[int(q_num)] = answer.upper()
        
        return answers
    
    def process(self):
        """Main processing function"""
        logger.info(f"Processing PDF: {self.pdf_path}")
        
        # Extract text
        text = self.extract_text_from_pdf()
        if not text:
            return {'success': False, 'error': 'Could not extract text from PDF'}
        
        # Parse questions
        questions = self.parse_questions(text)
        
        # Extract answer keys if available
        answer_keys = self.extract_answer_key(text)
        
        # Update questions with answer keys
        for question in questions:
            q_num = question['questionNumber']
            if q_num in answer_keys:
                answer_letter = answer_keys[q_num]
                # Convert A, B, C, D to 0, 1, 2, 3
                question['correctAnswer'] = ord(answer_letter) - ord('A')
        
        logger.info(f"Extracted {len(questions)} questions")
        
        return {
            'success': True,
            'questionCount': len(questions),
            'questions': questions,
            'hasAnswerKey': len(answer_keys) > 0
        }

def main():
    """Main entry point for command line usage"""
    if len(sys.argv) < 2:
        print(json.dumps({
            'success': False,
            'error': 'No PDF file path provided'
        }))
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    
    if not Path(pdf_path).exists():
        print(json.dumps({
            'success': False,
            'error': f'PDF file not found: {pdf_path}'
        }))
        sys.exit(1)
    
    try:
        extractor = PDFQuestionExtractor(pdf_path)
        result = extractor.process()
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)

if __name__ == '__main__':
    main()
