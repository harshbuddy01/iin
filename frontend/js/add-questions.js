/**
 * Add Questions Page - Complete Implementation
 */

function initAddQuestions() {
    console.log('Initializing Add Questions page...');
    
    const container = document.getElementById('add-questions-page');
    if (!container) return;
    
    container.innerHTML = `
        <div class="page-header">
            <h2>Add New Question</h2>
            <p>Add questions to your question bank</p>
        </div>
        
        <div class="form-container" style="max-width: 900px; margin: 0 auto;">
            <form id="addQuestionForm" style="background: white; padding: 32px; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                
                <!-- Question Details -->
                <div class="form-section">
                    <h3 style="margin-bottom: 20px; color: #0f172a;"><i class="fas fa-info-circle"></i> Question Details</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div class="form-group">
                            <label for="subject">Subject *</label>
                            <select id="subject" required class="form-input">
                                <option value="">Select Subject</option>
                                <option value="Physics">Physics</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Biology">Biology</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="topic">Topic *</label>
                            <input type="text" id="topic" required class="form-input" placeholder="e.g., Mechanics, Algebra">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div class="form-group">
                            <label for="difficulty">Difficulty *</label>
                            <select id="difficulty" required class="form-input">
                                <option value="Easy">Easy</option>
                                <option value="Medium" selected>Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="marks">Marks *</label>
                            <input type="number" id="marks" required class="form-input" value="1" min="1" max="10">
                        </div>
                        
                        <div class="form-group">
                            <label for="questionType">Question Type *</label>
                            <select id="questionType" required class="form-input">
                                <option value="MCQ" selected>Multiple Choice</option>
                                <option value="Numerical">Numerical</option>
                                <option value="True/False">True/False</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Question Text -->
                <div class="form-section" style="margin-top: 24px;">
                    <h3 style="margin-bottom: 20px; color: #0f172a;"><i class="fas fa-question-circle"></i> Question Text</h3>
                    
                    <div class="form-group">
                        <label for="questionText">Question *</label>
                        <textarea id="questionText" required class="form-input" rows="4" placeholder="Enter your question here..."></textarea>
                        <small style="color: #64748b;">Tip: You can use LaTeX for mathematical expressions (e.g., $$x^2 + y^2 = z^2$$)</small>
                    </div>
                </div>
                
                <!-- Options (MCQ) -->
                <div class="form-section" id="mcqOptions" style="margin-top: 24px;">
                    <h3 style="margin-bottom: 20px; color: #0f172a;"><i class="fas fa-list"></i> Answer Options</h3>
                    
                    <div style="display: grid; gap: 16px;">
                        <div class="form-group">
                            <label for="option1">Option A *</label>
                            <input type="text" id="option1" required class="form-input" placeholder="Option A">
                        </div>
                        
                        <div class="form-group">
                            <label for="option2">Option B *</label>
                            <input type="text" id="option2" required class="form-input" placeholder="Option B">
                        </div>
                        
                        <div class="form-group">
                            <label for="option3">Option C *</label>
                            <input type="text" id="option3" required class="form-input" placeholder="Option C">
                        </div>
                        
                        <div class="form-group">
                            <label for="option4">Option D *</label>
                            <input type="text" id="option4" required class="form-input" placeholder="Option D">
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-top: 20px;">
                        <label for="correctAnswer">Correct Answer *</label>
                        <select id="correctAnswer" required class="form-input">
                            <option value="">Select correct answer</option>
                            <option value="A">Option A</option>
                            <option value="B">Option B</option>
                            <option value="C">Option C</option>
                            <option value="D">Option D</option>
                        </select>
                    </div>
                </div>
                
                <!-- Explanation -->
                <div class="form-section" style="margin-top: 24px;">
                    <h3 style="margin-bottom: 20px; color: #0f172a;"><i class="fas fa-lightbulb"></i> Explanation (Optional)</h3>
                    
                    <div class="form-group">
                        <label for="explanation">Explanation</label>
                        <textarea id="explanation" class="form-input" rows="3" placeholder="Provide an explanation for the answer..."></textarea>
                    </div>
                </div>
                
                <!-- Submit Button -->
                <div style="margin-top: 32px; display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" id="resetBtn" class="btn-secondary">
                        <i class="fas fa-redo"></i> Reset Form
                    </button>
                    <button type="submit" id="submitQuestionBtn" class="btn-primary">
                        <i class="fas fa-plus"></i> Add Question
                    </button>
                </div>
            </form>
        </div>
        
        <style>
            .form-group { margin-bottom: 16px; }
            .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #334155; font-size: 14px; }
            .form-input { width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; transition: all 0.3s; }
            .form-input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
            .form-section { border-bottom: 1px solid #e2e8f0; padding-bottom: 24px; }
            .form-section:last-child { border-bottom: none; }
            .btn-primary { padding: 12px 24px; background: #6366f1; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
            .btn-primary:hover { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4); }
            .btn-secondary { padding: 12px 24px; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
            .btn-secondary:hover { background: #e2e8f0; }
            .page-header { margin-bottom: 32px; }
            .page-header h2 { font-size: 28px; color: #0f172a; margin-bottom: 8px; }
            .page-header p { color: #64748b; font-size: 16px; }
        </style>
    `;
    
    // Initialize form handlers
    const form = document.getElementById('addQuestionForm');
    const resetBtn = document.getElementById('resetBtn');
    const questionTypeSelect = document.getElementById('questionType');
    
    // Handle question type change
    questionTypeSelect?.addEventListener('change', (e) => {
        const mcqOptions = document.getElementById('mcqOptions');
        if (e.target.value === 'MCQ') {
            mcqOptions.style.display = 'block';
        } else {
            mcqOptions.style.display = 'none';
        }
    });
    
    // Handle reset
    resetBtn?.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the form?')) {
            form.reset();
        }
    });
    
    // Handle form submit
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            subject: document.getElementById('subject').value,
            topic: document.getElementById('topic').value,
            difficulty: document.getElementById('difficulty').value,
            marks: parseInt(document.getElementById('marks').value),
            questionType: document.getElementById('questionType').value,
            questionText: document.getElementById('questionText').value,
            option1: document.getElementById('option1')?.value,
            option2: document.getElementById('option2')?.value,
            option3: document.getElementById('option3')?.value,
            option4: document.getElementById('option4')?.value,
            correctAnswer: document.getElementById('correctAnswer')?.value,
            explanation: document.getElementById('explanation')?.value,
            id: Date.now() // Temporary ID
        };
        
        const submitBtn = document.getElementById('submitQuestionBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="spinner"></div> Adding Question...';
        
        try {
            // Try to save to backend
            if (typeof AdminAPI !== 'undefined') {
                await AdminAPI.addQuestion(formData);
            }
            
            // Also save to localStorage as backup
            const questions = JSON.parse(localStorage.getItem('questions') || '[]');
            questions.push(formData);
            localStorage.setItem('questions', JSON.stringify(questions));
            
            if (typeof AdminUtils !== 'undefined') {
                AdminUtils.showToast('Question added successfully!', 'success');
            } else {
                alert('Question added successfully!');
            }
            
            form.reset();
        } catch (error) {
            console.error('Error adding question:', error);
            if (typeof AdminUtils !== 'undefined') {
                AdminUtils.showToast('Failed to add question', 'error');
            } else {
                alert('Failed to add question');
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Question';
        }
    });
    
    console.log('✅ Add Questions page initialized');
}

// Auto-initialize if container exists
if (document.getElementById('add-questions-page')) {
    initAddQuestions();
}