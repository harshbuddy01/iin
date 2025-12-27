/**
 * View Questions Page - Complete Implementation
 */

function initViewQuestions() {
    console.log('Initializing View Questions page...');
    
    const container = document.getElementById('view-questions-page');
    if (!container) return;
    
    container.innerHTML = `
        <div class="page-header" style="margin-bottom: 24px;">
            <h2>View & Edit Questions</h2>
            <p>Manage your question bank</p>
        </div>
        
        <div class="table-header">
            <div class="filter-bar">
                <select id="subjectFilter" class="filter-select">
                    <option value="">All Subjects</option>
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                </select>
                
                <select id="difficultyFilter" class="filter-select">
                    <option value="">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
                
                <input type="text" id="searchQuestions" class="search-input" placeholder="Search questions...">
            </div>
            
            <button class="export-btn" onclick="exportQuestions()">
                <i class="fas fa-download"></i> Export
            </button>
        </div>
        
        <div id="questionsTableContainer"></div>
    `;
    
    loadQuestions();
    
    // Event listeners
    document.getElementById('subjectFilter')?.addEventListener('change', loadQuestions);
    document.getElementById('difficultyFilter')?.addEventListener('change', loadQuestions);
    document.getElementById('searchQuestions')?.addEventListener('input', loadQuestions);
    
    console.log('✅ View Questions page initialized');
}

function loadQuestions() {
    const container = document.getElementById('questionsTableContainer');
    if (!container) return;
    
    // Get filters
    const subjectFilter = document.getElementById('subjectFilter')?.value || '';
    const difficultyFilter = document.getElementById('difficultyFilter')?.value || '';
    const searchText = document.getElementById('searchQuestions')?.value.toLowerCase() || '';
    
    // Get questions from localStorage
    let questions = JSON.parse(localStorage.getItem('questions') || '[]');
    
    // Add demo data if empty
    if (questions.length === 0) {
        questions = [
            { id: 1, subject: 'Physics', topic: 'Mechanics', difficulty: 'Easy', marks: 1, questionText: 'What is the SI unit of force?', correctAnswer: 'A' },
            { id: 2, subject: 'Mathematics', topic: 'Calculus', difficulty: 'Medium', marks: 3, questionText: 'Find derivative of x²', correctAnswer: 'B' },
            { id: 3, subject: 'Chemistry', topic: 'Atomic Structure', difficulty: 'Easy', marks: 1, questionText: 'Atomic number of Carbon?', correctAnswer: 'A' }
        ];
    }
    
    // Apply filters
    let filteredQuestions = questions.filter(q => {
        const matchesSubject = !subjectFilter || q.subject === subjectFilter;
        const matchesDifficulty = !difficultyFilter || q.difficulty === difficultyFilter;
        const matchesSearch = !searchText || q.questionText.toLowerCase().includes(searchText) || q.topic.toLowerCase().includes(searchText);
        return matchesSubject && matchesDifficulty && matchesSearch;
    });
    
    if (filteredQuestions.length === 0) {
        container.innerHTML = '<div class="coming-soon">No questions found. Add some questions first!</div>';
        return;
    }
    
    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Subject</th>
                    <th>Topic</th>
                    <th>Difficulty</th>
                    <th>Marks</th>
                    <th>Question</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${filteredQuestions.map(q => `
                    <tr>
                        <td>#${q.id}</td>
                        <td><span class="badge badge-${q.subject.toLowerCase()}">${q.subject}</span></td>
                        <td>${q.topic}</td>
                        <td><span class="difficulty-${q.difficulty.toLowerCase()}">${q.difficulty}</span></td>
                        <td>${q.marks}</td>
                        <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${q.questionText}</td>
                        <td>
                            <button class="action-btn" onclick="viewQuestion(${q.id})" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn" onclick="editQuestion(${q.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn danger" onclick="deleteQuestion(${q.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function viewQuestion(id) {
    const questions = JSON.parse(localStorage.getItem('questions') || '[]');
    const question = questions.find(q => q.id == id);
    if (!question) return;
    
    alert(`Question: ${question.questionText}\n\nSubject: ${question.subject}\nTopic: ${question.topic}\nDifficulty: ${question.difficulty}\nMarks: ${question.marks}`);
}

function editQuestion(id) {
    alert('Edit functionality coming soon!');
}

function deleteQuestion(id) {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    let questions = JSON.parse(localStorage.getItem('questions') || '[]');
    questions = questions.filter(q => q.id != id);
    localStorage.setItem('questions', JSON.stringify(questions));
    
    if (typeof AdminUtils !== 'undefined') {
        AdminUtils.showToast('Question deleted successfully!', 'success');
    }
    
    loadQuestions();
}

function exportQuestions() {
    const questions = JSON.parse(localStorage.getItem('questions') || '[]');
    if (typeof AdminUtils !== 'undefined') {
        AdminUtils.exportToCSV(questions, 'questions.csv');
    }
}

if (document.getElementById('view-questions-page')) {
    initViewQuestions();
}