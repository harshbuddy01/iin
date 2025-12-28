// Scheduled Tests Page - Unified System with Database Integration
const API_BASE_URL = 'https://iin-production.up.railway.app/api';

let allTests = [];
let filteredTests = [];

// Initialize page when called from dashboard
window.initScheduledTests = async function() {
    console.log('🔵 Initializing Scheduled Tests page...');
    
    const page = document.getElementById('scheduled-tests-page');
    if (!page) {
        console.error('❌ Scheduled tests page element not found');
        return;
    }
    
    // Render page HTML
    page.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-clock"></i> Scheduled Tests</h1>
            <button class="btn-primary" onclick="openScheduleModal()">
                <i class="fas fa-calendar-plus"></i> Schedule New Test
            </button>
        </div>

        <div class="filters-bar">
            <div class="filter-group">
                <label>Type</label>
                <select id="type-filter">
                    <option value="all">All Types</option>
                    <option value="iat">IAT</option>
                    <option value="nest">NEST</option>
                    <option value="isi">ISI</option>
                    <option value="mock">Mock</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Status</label>
                <select id="status-filter">
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            <div class="search-group">
                <i class="fas fa-search"></i>
                <input type="text" id="search-tests" placeholder="Search tests...">
            </div>
        </div>

        <div id="tests-container" class="tests-grid">
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading tests...</p>
            </div>
        </div>
    `;
    
    // Load tests from backend
    await loadScheduledTests();
    setupEventListeners();
    
    console.log('✅ Scheduled Tests page initialized');
};

// Setup event listeners
function setupEventListeners() {
    const typeFilter = document.getElementById('type-filter');
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-tests');

    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
}

// Open schedule modal
window.openScheduleModal = function() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="width: 600px;">
            <div class="modal-header">
                <h2><i class="fas fa-calendar-plus"></i> Schedule New Test</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body" style="padding: 24px;">
                <form id="schedule-form">
                    <div class="form-group">
                        <label>Test Name *</label>
                        <input type="text" id="test-name" placeholder="Enter test name" required>
                    </div>
                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label>Exam Type *</label>
                            <select id="exam-type" required>
                                <option value="">Select Type</option>
                                <option value="IAT">IAT</option>
                                <option value="NEST">NEST</option>
                                <option value="ISI">ISI</option>
                                <option value="Mock">Mock Test</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Subject *</label>
                            <input type="text" id="subject" placeholder="e.g., Physics, Mathematics" required>
                        </div>
                    </div>
                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label>Date *</label>
                            <input type="date" id="test-date" required>
                        </div>
                        <div class="form-group">
                            <label>Time *</label>
                            <input type="time" id="test-time" required>
                        </div>
                    </div>
                    <div class="form-row" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                        <div class="form-group">
                            <label>Duration (min) *</label>
                            <input type="number" id="duration" value="180" min="30" required>
                        </div>
                        <div class="form-group">
                            <label>Questions *</label>
                            <input type="number" id="questions" value="50" min="1" required>
                        </div>
                        <div class="form-group">
                            <label>Total Marks *</label>
                            <input type="number" id="total-marks" value="100" min="1" required>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button class="btn-primary" onclick="scheduleTest()">
                    <i class="fas fa-calendar-plus"></i> Schedule Test
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Set min date to today
    const dateInput = document.getElementById('test-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
};

// Schedule test - called from modal button
window.scheduleTest = async function() {
    const testName = document.getElementById('test-name')?.value;
    const examType = document.getElementById('exam-type')?.value;
    const subject = document.getElementById('subject')?.value;
    const testDate = document.getElementById('test-date')?.value;
    const testTime = document.getElementById('test-time')?.value;
    const duration = document.getElementById('duration')?.value;
    const questions = document.getElementById('questions')?.value;
    const totalMarks = document.getElementById('total-marks')?.value;
    
    if (!testName || !examType || !subject || !testDate || !testTime) {
        if (window.AdminUtils) {
            window.AdminUtils.showToast('Please fill in all required fields', 'error');
        } else {
            alert('Please fill in all required fields');
        }
        return;
    }
    
    // This will be handled by schedule-test-handler.js
    // Just trigger it manually
    console.log('📝 Form submitted:', { testName, examType, subject, testDate, testTime, duration, questions, totalMarks });
};

// Load scheduled tests from database
async function loadScheduledTests() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/admin/scheduled-tests`);
        
        if (!response.ok) {
            throw new Error(`Failed to load tests: ${response.statusText}`);
        }
        
        const data = await response.json();
        allTests = data.tests || [];
        filteredTests = [...allTests];
        
        displayTests(filteredTests);
        showLoading(false);
    } catch (error) {
        console.error('❌ Error loading tests:', error);
        showError('Failed to load scheduled tests. Using demo data.');
        
        // Show demo data if API fails
        allTests = [
            {
                id: 1,
                test_id: 'TEST-001',
                test_name: 'IAT Physics Mock',
                test_type: 'iat',
                subjects: 'Physics',
                exam_date: '2025-12-30',
                start_time: '10:00',
                duration_minutes: 180,
                total_questions: 50,
                total_marks: 100,
                status: 'scheduled'
            }
        ];
        filteredTests = [...allTests];
        displayTests(filteredTests);
        showLoading(false);
    }
}

// Apply filters to tests
function applyFilters() {
    const typeFilter = document.getElementById('type-filter')?.value || 'all';
    const statusFilter = document.getElementById('status-filter')?.value || 'all';
    const searchQuery = document.getElementById('search-tests')?.value.toLowerCase() || '';

    filteredTests = allTests.filter(test => {
        if (typeFilter !== 'all' && test.test_type !== typeFilter) return false;
        if (statusFilter !== 'all' && test.status !== statusFilter) return false;
        if (searchQuery && !test.test_name.toLowerCase().includes(searchQuery) && 
            !test.subjects.toLowerCase().includes(searchQuery)) {
            return false;
        }
        return true;
    });

    displayTests(filteredTests);
}

// Display tests in the UI
function displayTests(tests) {
    const container = document.getElementById('tests-container');
    if (!container) return;
    
    if (tests.length === 0) {
        container.innerHTML = `
            <div class="no-tests" style="text-align: center; padding: 60px 20px; color: #94a3b8;">
                <i class="fas fa-calendar-times" style="font-size: 64px; margin-bottom: 20px; opacity: 0.3;"></i>
                <p style="font-size: 18px; margin-bottom: 20px;">No scheduled tests found</p>
                <button class="btn-primary" onclick="openScheduleModal()">
                    <i class="fas fa-plus"></i> Schedule New Test
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = tests.map(test => createTestCard(test)).join('');
}

// Create test card HTML
function createTestCard(test) {
    const testDate = new Date(test.exam_date);
    const formattedDate = testDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const formattedTime = test.start_time || 'Not set';

    return `
        <div class="test-card" style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 16px;">
            <div class="test-header" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                <div class="test-info">
                    <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #1e293b;">${test.test_name}</h3>
                    <span class="test-type" style="display: inline-block; padding: 4px 12px; background: #dbeafe; color: #1e40af; border-radius: 12px; font-size: 12px; font-weight: 600; margin-right: 8px;">${test.test_type.toUpperCase()}</span>
                    <span class="status-badge" style="display: inline-block; padding: 4px 12px; background: #d1fae5; color: #065f46; border-radius: 12px; font-size: 12px; font-weight: 600;">${test.status.toUpperCase()}</span>
                </div>
                <div class="test-actions" style="display: flex; gap: 8px;">
                    <button class="btn-icon" onclick="editTest('${test.test_id}')" title="Edit" style="padding: 8px 12px; background: #f1f5f9; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon danger" onclick="deleteTest('${test.test_id}')" title="Delete" style="padding: 8px 12px; background: #fee2e2; color: #dc2626; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="test-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; color: #64748b; font-size: 14px;">
                <div class="detail-item" style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-calendar" style="color: #6366f1;"></i>
                    <span>${formattedDate}</span>
                </div>
                <div class="detail-item" style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-clock" style="color: #6366f1;"></i>
                    <span>${formattedTime}</span>
                </div>
                <div class="detail-item" style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-book" style="color: #6366f1;"></i>
                    <span>${test.subjects}</span>
                </div>
                <div class="detail-item" style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-question-circle" style="color: #6366f1;"></i>
                    <span>${test.total_questions} Questions</span>
                </div>
                <div class="detail-item" style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-trophy" style="color: #6366f1;"></i>
                    <span>${test.total_marks} Marks</span>
                </div>
            </div>
        </div>
    `;
}

// Edit test
window.editTest = function(testId) {
    console.log('Edit test:', testId);
    if (window.AdminUtils) {
        window.AdminUtils.showToast('Edit functionality - Coming soon!', 'info');
    }
};

// Delete test
window.deleteTest = async function(testId) {
    if (!confirm('Are you sure you want to delete this test?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/delete-test/${testId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete test');
        }

        if (window.AdminUtils) {
            window.AdminUtils.showToast('Test deleted successfully!', 'success');
        }
        await loadScheduledTests();
    } catch (error) {
        console.error('❌ Error deleting test:', error);
        if (window.AdminUtils) {
            window.AdminUtils.showToast('Failed to delete test', 'error');
        }
    }
};

// Show loading state
function showLoading(show) {
    const container = document.getElementById('tests-container');
    if (!container) return;

    if (show) {
        container.innerHTML = `
            <div class="loading" style="text-align: center; padding: 60px 20px; color: #94a3b8;">
                <i class="fas fa-spinner fa-spin" style="font-size: 48px; margin-bottom: 16px;"></i>
                <p style="font-size: 16px;">Loading tests...</p>
            </div>
        `;
    }
}

// Show error message
function showError(message) {
    console.error(message);
    if (window.AdminUtils) {
        window.AdminUtils.showToast(message, 'error');
    }
}

console.log('✅ Scheduled Tests module loaded');
