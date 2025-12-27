/**
 * Scheduled Tests Module - FIXED EXAM TYPES (IAT, NEST, ISI)
 */

let scheduledTests = [];

function initScheduledTests() {
    console.log('🕒 Initializing Scheduled Tests...');
    renderScheduledTestsPage();
    loadScheduledTests();
}

function renderScheduledTestsPage() {
    const container = document.getElementById('scheduled-tests-page');
    if (!container) return;
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <div>
                <h1 style="font-size: 28px; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-clock" style="color: #6366f1;"></i> Scheduled Tests
                </h1>
                <p style="color: #64748b; margin-top: 8px;">Manage upcoming test schedules</p>
            </div>
            <button class="btn-primary" onclick="openNewTestModal()">
                <i class="fas fa-plus"></i> Schedule New Test
            </button>
        </div>
        
        <div style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;">
            <select id="typeFilter" style="padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px;">
                <option value="all">All Types</option>
                <option value="IAT">IAT</option>
                <option value="NEST">NEST</option>
                <option value="ISI">ISI</option>
            </select>
            <select id="statusFilter" style="padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px;">
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="today">Today</option>
            </select>
            <input type="text" id="testSearch" placeholder="Search tests..." 
                   style="flex: 1; min-width: 200px; padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px;">
        </div>
        
        <div id="testsListContainer"></div>
    `;
    
    document.getElementById('typeFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('testSearch').addEventListener('input', applyFilters);
}

function loadScheduledTests() {
    const stored = localStorage.getItem('scheduledTests');
    scheduledTests = stored ? JSON.parse(stored) : [
        {
            id: 1,
            name: 'IAT Physics Mock Test 1',
            type: 'IAT',
            subject: 'Physics',
            date: '2025-12-28',
            time: '10:00 AM',
            duration: 180,
            totalQuestions: 50,
            totalMarks: 100,
            status: 'upcoming'
        },
        {
            id: 2,
            name: 'NEST Mathematics Mock Test',
            type: 'NEST',
            subject: 'Mathematics',
            date: '2025-12-29',
            time: '2:00 PM',
            duration: 120,
            totalQuestions: 40,
            totalMarks: 80,
            status: 'upcoming'
        },
        {
            id: 3,
            name: 'ISI Statistics Practice Test',
            type: 'ISI',
            subject: 'Statistics',
            date: '2025-12-30',
            time: '11:00 AM',
            duration: 150,
            totalQuestions: 45,
            totalMarks: 90,
            status: 'upcoming'
        }
    ];
    
    saveScheduledTests();
    displayScheduledTests(scheduledTests);
}

function saveScheduledTests() {
    localStorage.setItem('scheduledTests', JSON.stringify(scheduledTests));
}

function applyFilters() {
    const type = document.getElementById('typeFilter').value;
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('testSearch').value.toLowerCase();
    
    let filtered = scheduledTests;
    
    if (type !== 'all') {
        filtered = filtered.filter(t => t.type === type);
    }
    if (status === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(t => t.date === today);
    }
    if (search) {
        filtered = filtered.filter(t => 
            t.name.toLowerCase().includes(search) ||
            t.subject.toLowerCase().includes(search)
        );
    }
    
    displayScheduledTests(filtered);
}

function displayScheduledTests(tests) {
    const container = document.getElementById('testsListContainer');
    if (!container) return;
    
    if (tests.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: 60px 20px; color: #94a3b8;">
                <i class="fas fa-clock" style="font-size: 48px; margin-bottom: 16px;"></i>
                <p style="font-size: 18px;">No scheduled tests found</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tests.map(test => {
        const isToday = test.date === new Date().toISOString().split('T')[0];
        return `
            <div class="card" style="margin-bottom: 16px; padding: 20px; ${isToday ? 'border-left: 4px solid #f59e0b; background: #fffbeb;' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">${test.name}</h3>
                            <span class="badge badge-${test.type.toLowerCase()}">${test.type}</span>
                            ${isToday ? '<span class="badge" style="background: #fed7aa; color: #92400e;">TODAY</span>' : ''}
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-top: 16px; color: #64748b; font-size: 14px;">
                            <div>
                                <i class="fas fa-calendar"></i> <strong>${test.date}</strong>
                            </div>
                            <div>
                                <i class="fas fa-clock"></i> ${test.time} (${test.duration} min)
                            </div>
                            <div>
                                <i class="fas fa-book"></i> ${test.subject}
                            </div>
                            <div>
                                <i class="fas fa-question-circle"></i> ${test.totalQuestions} Questions
                            </div>
                            <div>
                                <i class="fas fa-trophy"></i> ${test.totalMarks} Marks
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 8px;">
                        <button class="action-btn" onclick="viewTestDetails(${test.id})" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" onclick="editScheduledTest(${test.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn danger" onclick="deleteScheduledTest(${test.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openNewTestModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="width: 600px; max-width: 90vw;">
            <div class="modal-header">
                <h2>Schedule New Test</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <form id="newTestForm" onsubmit="handleNewTest(event)" style="padding: 24px;">
                <div class="form-group">
                    <label>Test Name *</label>
                    <input type="text" name="name" required placeholder="Enter test name">
                </div>
                <div class="form-group">
                    <label>Exam Type *</label>
                    <select name="type" required>
                        <option value="">Select Type</option>
                        <option value="IAT">IAT</option>
                        <option value="NEST">NEST</option>
                        <option value="ISI">ISI</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Subject *</label>
                    <input type="text" name="subject" required placeholder="Physics, Mathematics, etc.">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label>Date *</label>
                        <input type="date" name="date" required>
                    </div>
                    <div class="form-group">
                        <label>Time *</label>
                        <input type="time" name="time" required>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label>Duration (min) *</label>
                        <input type="number" name="duration" required min="30" max="300" value="180">
                    </div>
                    <div class="form-group">
                        <label>Questions *</label>
                        <input type="number" name="totalQuestions" required min="1" value="50">
                    </div>
                    <div class="form-group">
                        <label>Total Marks *</label>
                        <input type="number" name="totalMarks" required min="1" value="100">
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">
                        Cancel
                    </button>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save"></i> Schedule Test
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function handleNewTest(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const newTest = {
        id: Date.now(),
        name: formData.get('name'),
        type: formData.get('type'),
        subject: formData.get('subject'),
        date: formData.get('date'),
        time: new Date(`2000-01-01 ${formData.get('time')}`).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true}),
        duration: parseInt(formData.get('duration')),
        totalQuestions: parseInt(formData.get('totalQuestions')),
        totalMarks: parseInt(formData.get('totalMarks')),
        status: 'upcoming'
    };
    
    scheduledTests.unshift(newTest);
    saveScheduledTests();
    displayScheduledTests(scheduledTests);
    
    event.target.closest('.modal').remove();
    if (window.AdminUtils) window.AdminUtils.showToast('Test scheduled successfully', 'success');
}

function viewTestDetails(id) {
    const test = scheduledTests.find(t => t.id === id);
    if (!test) return;
    
    alert(`Test Details:\n\nName: ${test.name}\nType: ${test.type}\nSubject: ${test.subject}\nDate: ${test.date}\nTime: ${test.time}\nDuration: ${test.duration} minutes\nQuestions: ${test.totalQuestions}\nTotal Marks: ${test.totalMarks}`);
}

function editScheduledTest(id) {
    alert('Edit functionality coming soon!');
}

function deleteScheduledTest(id) {
    if (!confirm('Delete this scheduled test?')) return;
    
    scheduledTests = scheduledTests.filter(t => t.id !== id);
    saveScheduledTests();
    applyFilters();
    
    if (window.AdminUtils) window.AdminUtils.showToast('Test deleted successfully', 'success');
}

window.initScheduledTests = initScheduledTests;
window.openNewTestModal = openNewTestModal;
window.handleNewTest = handleNewTest;
window.viewTestDetails = viewTestDetails;
window.editScheduledTest = editScheduledTest;
window.deleteScheduledTest = deleteScheduledTest;