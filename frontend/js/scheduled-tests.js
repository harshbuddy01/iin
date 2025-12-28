// Scheduled Tests Page - Unified System with Database Integration
const API_BASE_URL = 'https://iin-production.up.railway.app/api';

let allTests = [];
let filteredTests = [];

// Load tests from database on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadScheduledTests();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Filter listeners
    const typeFilter = document.getElementById('type-filter');
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-tests');
    const createButton = document.querySelector('.create-test-btn');

    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    
    // Redirect to create test page
    if (createButton) {
        createButton.addEventListener('click', () => {
            window.location.href = 'admin-create-test.html';
        });
    }
}

// Load scheduled tests from database
async function loadScheduledTests() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/admin/tests/scheduled`);
        
        if (!response.ok) {
            throw new Error(`Failed to load tests: ${response.statusText}`);
        }
        
        const data = await response.json();
        allTests = data.tests || [];
        filteredTests = [...allTests];
        
        displayTests(filteredTests);
        showLoading(false);
    } catch (error) {
        console.error('Error loading tests:', error);
        showError('Failed to load scheduled tests. Please try again.');
        showLoading(false);
    }
}

// Apply filters to tests
function applyFilters() {
    const typeFilter = document.getElementById('type-filter')?.value || 'all';
    const statusFilter = document.getElementById('status-filter')?.value || 'all';
    const searchQuery = document.getElementById('search-tests')?.value.toLowerCase() || '';

    filteredTests = allTests.filter(test => {
        // Type filter
        if (typeFilter !== 'all' && test.type !== typeFilter) return false;
        
        // Status filter
        if (statusFilter !== 'all' && test.status !== statusFilter) return false;
        
        // Search filter
        if (searchQuery && !test.name.toLowerCase().includes(searchQuery) && 
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
            <div class="no-tests">
                <i class="fas fa-calendar-times"></i>
                <p>No scheduled tests found</p>
                <button class="btn-primary" onclick="window.location.href='admin-create-test.html'">
                    <i class="fas fa-plus"></i> Create New Test
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = tests.map(test => createTestCard(test)).join('');
}

// Create test card HTML
function createTestCard(test) {
    const testDate = new Date(test.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isToday = testDate.toDateString() === today.toDateString();
    const isPast = testDate < today && test.status !== 'completed';
    
    const statusBadge = getStatusBadge(test.status, isToday, isPast);
    const formattedDate = formatDate(testDate);
    const formattedTime = test.time || 'Not set';

    return `
        <div class="test-card ${test.status}" data-test-id="${test.id}">
            <div class="test-header">
                <div class="test-info">
                    <h3>${test.name}</h3>
                    <span class="test-type ${test.type}">${test.type.toUpperCase()}</span>
                    ${statusBadge}
                </div>
                <div class="test-actions">
                    <button class="btn-icon" onclick="viewTest(${test.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="rescheduleTest(${test.id})" title="Reschedule">
                        <i class="fas fa-calendar-alt"></i>
                    </button>
                    ${test.status !== 'completed' ? `
                        <button class="btn-icon success" onclick="markAsCompleted(${test.id})" title="Mark as Completed">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    <button class="btn-icon danger" onclick="deleteTest(${test.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="test-details">
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>${formattedDate}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${formattedTime}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-book"></i>
                    <span>${test.subjects}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-question-circle"></i>
                    <span>${test.total_questions} Questions</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-trophy"></i>
                    <span>${test.total_marks} Marks</span>
                </div>
            </div>
        </div>
    `;
}

// Get status badge HTML
function getStatusBadge(status, isToday, isPast) {
    if (isToday && status === 'scheduled') {
        return '<span class="status-badge today">TODAY</span>';
    }
    if (isPast && status === 'scheduled') {
        return '<span class="status-badge overdue">OVERDUE</span>';
    }
    return `<span class="status-badge ${status}">${status.toUpperCase()}</span>`;
}

// Format date for display
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// View test details
function viewTest(testId) {
    // Redirect to test details page or show modal
    window.location.href = `admin-test-details.html?id=${testId}`;
}

// Reschedule test
async function rescheduleTest(testId) {
    const test = allTests.find(t => t.id === testId);
    if (!test) return;

    const modal = createRescheduleModal(test);
    document.body.appendChild(modal);
}

// Create reschedule modal
function createRescheduleModal(test) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Reschedule Test</h2>
                <button class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="reschedule-form">
                    <div class="form-group">
                        <label>Test Name</label>
                        <input type="text" value="${test.name}" disabled>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>New Date *</label>
                            <input type="date" id="reschedule-date" value="${test.date}" required>
                        </div>
                        <div class="form-group">
                            <label>New Time *</label>
                            <input type="time" id="reschedule-time" value="${test.time}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="reschedule-status">
                            <option value="scheduled" ${test.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                            <option value="postponed" ${test.status === 'postponed' ? 'selected' : ''}>Postponed</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="btn-primary" onclick="saveReschedule(${test.id})">Update Schedule</button>
            </div>
        </div>
    `;
    return modal;
}

// Save rescheduled test
async function saveReschedule(testId) {
    const date = document.getElementById('reschedule-date').value;
    const time = document.getElementById('reschedule-time').value;
    const status = document.getElementById('reschedule-status').value;

    if (!date || !time) {
        showError('Please fill in all required fields');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/admin/tests/${testId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date,
                time,
                status
            })
        });

        if (!response.ok) {
            throw new Error('Failed to reschedule test');
        }

        showSuccess('Test rescheduled successfully!');
        document.querySelector('.modal').remove();
        await loadScheduledTests();
    } catch (error) {
        console.error('Error rescheduling test:', error);
        showError('Failed to reschedule test. Please try again.');
    }
}

// Mark test as completed
async function markAsCompleted(testId) {
    if (!confirm('Mark this test as completed?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/tests/${testId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'completed'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to mark test as completed');
        }

        showSuccess('Test marked as completed!');
        await loadScheduledTests();
    } catch (error) {
        console.error('Error marking test as completed:', error);
        showError('Failed to update test status. Please try again.');
    }
}

// Delete test
async function deleteTest(testId) {
    if (!confirm('Are you sure you want to delete this test? This action cannot be undone.')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/tests/${testId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete test');
        }

        showSuccess('Test deleted successfully!');
        await loadScheduledTests();
    } catch (error) {
        console.error('Error deleting test:', error);
        showError('Failed to delete test. Please try again.');
    }
}

// Show loading state
function showLoading(show) {
    const container = document.getElementById('tests-container');
    if (!container) return;

    if (show) {
        container.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading tests...</p>
            </div>
        `;
    }
}

// Show error message
function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// Show success message
function showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}