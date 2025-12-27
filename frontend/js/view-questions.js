/**
 * View/Edit Questions Handler - FULLY FUNCTIONAL
 */

let questionsData = [];
let currentFilter = { subject: 'all', difficulty: 'all', search: '' };

const mockQuestionsData = [
    { id: 1, subject: 'Physics', topic: 'Mechanics', difficulty: 'Easy', marks: 1, question: 'What is the SI unit of force?', type: 'MCQ', options: ['Newton', 'Joule', 'Watt', 'Pascal'], answer: 'Newton' },
    { id: 2, subject: 'Physics', topic: 'Thermodynamics', difficulty: 'Medium', marks: 3, question: 'State the first law of thermodynamics', type: 'Descriptive', answer: 'Energy cannot be created or destroyed' },
    { id: 3, subject: 'Physics', topic: 'Quantum Mechanics', difficulty: 'Hard', marks: 5, question: 'Explain the photoelectric effect', type: 'Descriptive', answer: 'Emission of electrons when light strikes a surface' },
    { id: 4, subject: 'Mathematics', topic: 'Calculus', difficulty: 'Easy', marks: 1, question: 'What is the derivative of x²?', type: 'MCQ', options: ['2x', 'x', 'x²', '2'], answer: '2x' },
    { id: 5, subject: 'Mathematics', topic: 'Algebra', difficulty: 'Medium', marks: 3, question: 'Solve: 2x + 5 = 15', type: 'Numerical', answer: '5' },
    { id: 6, subject: 'Mathematics', topic: 'Geometry', difficulty: 'Hard', marks: 5, question: 'Prove Pythagorean theorem', type: 'Descriptive', answer: 'a² + b² = c²' },
    { id: 7, subject: 'Chemistry', topic: 'Atomic Structure', difficulty: 'Easy', marks: 1, question: 'What is the atomic number of Carbon?', type: 'MCQ', options: ['6', '12', '8', '14'], answer: '6' },
    { id: 8, subject: 'Chemistry', topic: 'Chemical Bonding', difficulty: 'Medium', marks: 3, question: 'Explain ionic bonding', type: 'Descriptive', answer: 'Transfer of electrons between atoms' },
    { id: 9, subject: 'Chemistry', topic: 'Organic Chemistry', difficulty: 'Hard', marks: 5, question: 'Describe SN1 and SN2 reactions', type: 'Descriptive', answer: 'Nucleophilic substitution mechanisms' }
];

function initViewQuestions() {
    questionsData = [...mockQuestionsData];
    renderQuestionsTable();
    
    document.getElementById('subjectFilter')?.addEventListener('change', (e) => {
        currentFilter.subject = e.target.value;
        renderQuestionsTable();
    });
    
    document.getElementById('difficultyFilter')?.addEventListener('change', (e) => {
        currentFilter.difficulty = e.target.value;
        renderQuestionsTable();
    });
    
    document.getElementById('searchQuestions')?.addEventListener('input', (e) => {
        currentFilter.search = e.target.value.toLowerCase();
        renderQuestionsTable();
    });
}

function renderQuestionsTable() {
    const tbody = document.getElementById('questionsTableBody');
    if (!tbody) return;
    
    let filtered = questionsData.filter(q => {
        const matchSubject = currentFilter.subject === 'all' || q.subject === currentFilter.subject;
        const matchDifficulty = currentFilter.difficulty === 'all' || q.difficulty === currentFilter.difficulty;
        const matchSearch = !currentFilter.search || 
            q.question.toLowerCase().includes(currentFilter.search) || 
            q.topic.toLowerCase().includes(currentFilter.search) ||
            q.subject.toLowerCase().includes(currentFilter.search);
        return matchSubject && matchDifficulty && matchSearch;
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #64748b;"><i class="fas fa-inbox" style="font-size: 48px; opacity: 0.3; margin-bottom: 16px;"></i><br>No questions found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(q => `
        <tr>
            <td><strong>#${q.id}</strong></td>
            <td><span class="badge badge-${q.subject.toLowerCase()}">${q.subject}</span></td>
            <td>${q.topic}</td>
            <td><span class="difficulty-${q.difficulty.toLowerCase()}">${q.difficulty}</span></td>
            <td><strong>${q.marks}</strong></td>
            <td style="max-width: 350px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${q.question}">${q.question}</td>
            <td>
                <button class="action-btn" onclick="editQuestion(${q.id})" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn" onclick="viewQuestion(${q.id})" title="View Details"><i class="fas fa-eye"></i></button>
                <button class="action-btn danger" onclick="deleteQuestion(${q.id})" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function viewQuestion(id) {
    const question = questionsData.find(q => q.id === id);
    if (!question) return;
    
    const optionsHTML = question.options ? `
        <div style="margin-top: 16px;">
            <strong>Options:</strong>
            <ol style="margin-top: 8px; padding-left: 24px;">
                ${question.options.map(opt => `<li style="margin-bottom: 4px;">${opt}</li>`).join('')}
            </ol>
            <p style="margin-top: 12px; color: #10b981; font-weight: 600;"><i class="fas fa-check-circle"></i> Correct Answer: ${question.answer}</p>
        </div>
    ` : `<p style="margin-top: 12px; color: #10b981;"><strong>Answer:</strong> ${question.answer}</p>`;
    
    const modal = document.createElement('div');
    modal.className = 'confirm-modal-overlay';
    modal.innerHTML = `
        <div class="confirm-modal" style="max-width: 600px;">
            <div class="confirm-modal-header" style="text-align: left; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px;">
                <h3 style="font-size: 20px; color: #0f172a; margin: 0;">Question Details</h3>
            </div>
            <div class="confirm-modal-body" style="text-align: left; padding: 24px 0;">
                <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                    <span class="badge badge-${question.subject.toLowerCase()}">${question.subject}</span>
                    <span class="difficulty-${question.difficulty.toLowerCase()}" style="padding: 4px 12px; background: #f1f5f9; border-radius: 12px;">${question.difficulty}</span>
                    <span style="padding: 4px 12px; background: #f1f5f9; border-radius: 12px; font-weight: 600;">${question.marks} marks</span>
                    <span style="padding: 4px 12px; background: #e0e7ff; color: #4338ca; border-radius: 12px; font-weight: 600;">${question.type}</span>
                </div>
                <p style="color: #64748b; margin-bottom: 12px;"><strong>Topic:</strong> ${question.topic}</p>
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #6366f1;">
                    <p style="font-size: 16px; line-height: 1.6; color: #0f172a;">${question.question}</p>
                </div>
                ${optionsHTML}
            </div>
            <div class="confirm-modal-footer">
                <button class="btn-primary" onclick="this.closest('.confirm-modal-overlay').remove()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function editQuestion(id) {
    const question = questionsData.find(q => q.id === id);
    if (!question) return;
    
    AdminUtils.showEditModal(
        'Edit Question',
        [
            { key: 'subject', label: 'Subject', type: 'select', options: ['Physics', 'Mathematics', 'Chemistry'] },
            { key: 'topic', label: 'Topic', type: 'text' },
            { key: 'difficulty', label: 'Difficulty', type: 'select', options: ['Easy', 'Medium', 'Hard'] },
            { key: 'marks', label: 'Marks', type: 'number' },
            { key: 'question', label: 'Question', type: 'textarea' }
        ],
        question,
        (updatedData) => {
            Object.assign(question, updatedData);
            renderQuestionsTable();
            AdminUtils.showToast('Question updated successfully!', 'success');
        }
    );
}

function deleteQuestion(id) {
    AdminUtils.showConfirmModal(
        'Are you sure you want to delete this question? This action cannot be undone.',
        () => {
            questionsData = questionsData.filter(q => q.id !== id);
            renderQuestionsTable();
            AdminUtils.showToast('Question deleted successfully!', 'success');
        }
    );
}

if (document.getElementById('questionsTableBody')) {
    initViewQuestions();
}