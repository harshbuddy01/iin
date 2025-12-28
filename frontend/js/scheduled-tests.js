/**
 * UNIFIED TEST SCHEDULING SYSTEM
 * - Shows all scheduled tests from database
 * - Can reschedule or postpone tests
 * - Status management (scheduled/completed/postponed)
 */

const API_BASE_URL = window.CONFIG?.API_URL || 'https://iin-production.up.railway.app';
let scheduledTests = [];

function initScheduledTests() {
    console.log('🕒 Initializing Unified Scheduled Tests System...');
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
                    <i class="fas fa-calendar-check" style="color: #6366f1;"></i> Scheduled Tests
                </h1>
                <p style="color: #64748b; margin-top: 8px;">View, reschedule, and manage test schedules</p>
            </div>
            <div style="display: flex; gap: 12px;">
                <button class="btn-secondary" onclick="window.location.href='admin-create-test.html'">
                    <i class="fas fa-plus"></i> Create New Test
                </button>
                <button class="btn-primary" onclick="loadScheduledTests()">
                    <i class="fas fa-sync"></i> Refresh
                </button>
            </div>
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
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="postponed">Postponed</option>
            </select>
            <input type="text" id="testSearch" placeholder="Search tests..." 
                   style="flex: 1; min-width: 200px; padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px;">
        </div>
        
        <div id="testsListContainer">
            <div style="text-align: center; padding: 40px; color: #94a3b8;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px;"></i>
                <p style="margin-top: 12px;">Loading tests from database...</p>
            </div>
        </div>
    `;
    
    document.getElementById('typeFilter')?.addEventListener('change', applyFilters);
    document.getElementById('statusFilter')?.addEventListener('change', applyFilters);
    document.getElementById('testSearch')?.addEventListener('input', applyFilters);
}

// 🔥 Load all scheduled tests from database
async function loadScheduledTests() {
    try {
        console.log('📡 Fetching scheduled tests from database...');
        
        const response = await fetch(`${API_BASE_URL}/api/admin/tests`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Received tests from database:', data);
        
        // Transform backend data to frontend format
        scheduledTests = (data.tests || []).map(test => ({
            id: test.id,
            name: test.test_name,
            type: extractTestType(test.test_id || test.test_name),
            sections: test.sections || 'Physics,Chemistry,Mathematics',
            date: test.exam_date,
            time: formatTime(test.exam_time),
            duration: test.duration || 180,
            totalMarks: test.total_marks || 100,
            status: test.status || 'scheduled',
            test_id: test.test_id,
            description: test.description || '',
            created_at: test.created_at
        }));
        
        console.log(`📋 Loaded ${scheduledTests.length} scheduled tests`);
        displayScheduledTests(scheduledTests);
        
    } catch (error) {
        console.error('❌ Error loading tests:', error);
        document.getElementById('testsListContainer').innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #ef4444;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 16px;"></i>
                <p style="font-size: 18px; font-weight: 600;">Failed to load tests</p>
                <p style="font-size: 14px; margin-top: 8px; color: #64748b;">${error.message}</p>
                <button onclick="loadScheduledTests()" class="btn-primary" style="margin-top: 16px;">
                    <i class="fas fa-sync"></i> Retry
                </button>
            </div>
        `;
    }
}

// Helper: Extract test type from test_id or name
function extractTestType(text) {
    const upper = (text || '').toUpperCase();
    if (upper.includes('IAT') || upper === 'IAT') return 'IAT';
    if (upper.includes('NEST') || upper === 'NEST') return 'NEST';
    if (upper.includes('ISI') || upper === 'ISI') return 'ISI';
    return 'NEST';
}

// Helper: Format time from HH:MM:SS to 12-hour format
function formatTime(timeStr) {
    if (!timeStr) return '10:00 AM';
    try {
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch (e) {
        return timeStr;
    }
}

function applyFilters() {
    const type = document.getElementById('typeFilter')?.value || 'all';
    const status = document.getElementById('statusFilter')?.value || 'all';
    const search = document.getElementById('testSearch')?.value.toLowerCase() || '';
    
    let filtered = scheduledTests;
    
    if (type !== 'all') {
        filtered = filtered.filter(t => t.type === type);
    }
    if (status !== 'all') {
        filtered = filtered.filter(t => t.status === status);
    }
    if (search) {
        filtered = filtered.filter(t => 
            t.name.toLowerCase().includes(search) ||
            t.sections.toLowerCase().includes(search)
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
                <i class="fas fa-calendar" style="font-size: 48px; margin-bottom: 16px;"></i>
                <p style="font-size: 18px; font-weight: 600;">No scheduled tests found</p>
                <p style="font-size: 14px; margin-top: 8px;">Create a new test to get started</p>
                <button onclick="window.location.href='admin-create-test.html'" class="btn-primary" style="margin-top: 16px;">
                    <i class="fas fa-plus"></i> Create Test
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tests.map(test => {
        const isToday = test.date === new Date().toISOString().split('T')[0];
        const isPast = new Date(test.date) < new Date().setHours(0,0,0,0);
        
        // Status badge colors
        const statusColors = {
            scheduled: 'background: #dbeafe; color: #1e40af;',
            completed: 'background: #d1fae5; color: #065f46;',
            postponed: 'background: #fef3c7; color: #92400e;'
        };
        
        return `
            <div class="card" style="margin-bottom: 16px; padding: 20px; ${
                isToday ? 'border-left: 4px solid #f59e0b; background: #fffbeb;' : 
                test.status === 'postponed' ? 'border-left: 4px solid #f59e0b; background: #fffef0;' :
                test.status === 'completed' ? 'border-left: 4px solid #10b981; background: #f0fdf4;' : ''
            }">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px; flex-wrap: wrap;">
                            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">${test.name}</h3>
                            <span class="badge" style="background: ${test.type === 'IAT' ? '#dbeafe' : test.type === 'NEST' ? '#e9d5ff' : '#fce7f3'}; color: ${test.type === 'IAT' ? '#1e40af' : test.type === 'NEST' ? '#6b21a8' : '#be185d'};">${test.type}</span>
                            <span class="badge" style="${statusColors[test.status] || statusColors.scheduled}">
                                ${test.status.toUpperCase()}
                            </span>
                            ${isToday ? '<span class="badge" style="background: #fed7aa; color: #92400e;">📅 TODAY</span>' : ''}
                            ${isPast && test.status === 'scheduled' ? '<span class="badge" style="background: #fee2e2; color: #991b1b;">⚠️ OVERDUE</span>' : ''}
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px; color: #64748b; font-size: 14px;">
                            <div>
                                <i class="fas fa-calendar"></i> <strong>${new Date(test.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</strong>
                            </div>
                            <div>
                                <i class="fas fa-clock"></i> ${test.time} (${test.duration} min)
                            </div>
                            <div>
                                <i class="fas fa-book"></i> ${test.sections}
                            </div>
                            <div>
                                <i class="fas fa-trophy"></i> ${test.totalMarks} Marks
                            </div>
                        </div>
                        
                        ${test.description ? `
                            <p style="margin-top: 12px; color: #64748b; font-size: 14px; font-style: italic;">
                                <i class="fas fa-info-circle"></i> ${test.description}
                            </p>
                        ` : ''}
                    </div>
                    
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="action-btn" onclick="viewTestDetails(${test.id})" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${test.status !== 'completed' ? `
                            <button class="action-btn" onclick="rescheduleTest(${test.id})" title="Reschedule" style="background: #fbbf24; color: white;">
                                <i class="fas fa-calendar-alt"></i>
                            </button>
                            <button class="action-btn" onclick="markAsCompleted(${test.id})" title="Mark as Completed" style="background: #10b981; color: white;">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                        <button class="action-btn danger" onclick="deleteTest(${test.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function viewTestDetails(id) {
    const test = scheduledTests.find(t => t.id === id);
    if (!test) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px; max-width: 90vw;">
            <div class="modal-header">
                <h2><i class="fas fa-info-circle"></i> Test Details</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div style="padding: 24px; line-height: 1.8;">
                <p><strong>Test Name:</strong> ${test.name}</p>
                <p><strong>Type:</strong> ${test.type}</p>
                <p><strong>Sections:</strong> ${test.sections}</p>
                <p><strong>Date:</strong> ${new Date(test.date).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
                <p><strong>Time:</strong> ${test.time}</p>
                <p><strong>Duration:</strong> ${test.duration} minutes</p>
                <p><strong>Total Marks:</strong> ${test.totalMarks}</p>
                <p><strong>Status:</strong> <span style="text-transform: uppercase; font-weight: 600;">${test.status}</span></p>
                ${test.description ? `<p><strong>Description:</strong> ${test.description}</p>` : ''}
                <p style="font-size: 12px; color: #64748b; margin-top: 16px;"><strong>Test ID:</strong> ${test.test_id}</p>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// 🔥 NEW: Reschedule test
function rescheduleTest(id) {
    const test = scheduledTests.find(t => t.id === id);
    if (!test) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px; max-width: 90vw;">
            <div class="modal-header">
                <h2><i class="fas fa-calendar-alt"></i> Reschedule Test</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <form id="rescheduleForm" style="padding: 24px;">
                <p style="margin-bottom: 20px; color: #64748b;">Rescheduling: <strong>${test.name}</strong></p>
                
                <div class="form-group">
                    <label>New Date *</label>
                    <input type="date" name="date" required value="${test.date}" min="${new Date().toISOString().split('T')[0]}">
                </div>
                
                <div class="form-group">
                    <label>New Time *</label>
                    <input type="time" name="time" required value="${test.time.split(' ')[0]}">
                </div>
                
                <div class="form-group">
                    <label>Status *</label>
                    <select name="status" required>
                        <option value="scheduled" ${test.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                        <option value="postponed" ${test.status === 'postponed' ? 'selected' : ''}>Postponed</option>
                    </select>
                </div>
                
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save"></i> Update Schedule
                    </button>
                </div>
            </form>
        </div>
    `;
    
    modal.querySelector('#rescheduleForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleReschedule(id, formData);
        modal.remove();
    });
    
    document.body.appendChild(modal);
}

async function handleReschedule(id, formData) {
    try {
        console.log('📅 Rescheduling test:', id);
        
        // TODO: Implement backend UPDATE endpoint
        // For now, show success message
        if (window.AdminUtils) {
            window.AdminUtils.showToast('✅ Reschedule API will be implemented in backend!', 'info');
        } else {
            alert('Reschedule functionality will be implemented in backend soon!');
        }
        
        // Reload tests
        await loadScheduledTests();
        
    } catch (error) {
        console.error('❌ Error rescheduling test:', error);
        if (window.AdminUtils) {
            window.AdminUtils.showToast('Failed to reschedule test', 'error');
        }
    }
}

async function markAsCompleted(id) {
    if (!confirm('Mark this test as completed?')) return;
    
    try {
        console.log('✅ Marking test as completed:', id);
        
        // TODO: Implement backend UPDATE endpoint
        alert('Mark as Completed API will be implemented in backend soon!');
        
        await loadScheduledTests();
        
    } catch (error) {
        console.error('❌ Error updating test status:', error);
        if (window.AdminUtils) {
            window.AdminUtils.showToast('Failed to update test status', 'error');
        }
    }
}

async function deleteTest(id) {
    if (!confirm('⚠️ Delete this test? This action cannot be undone.')) return;
    
    try {
        console.log('🗑️ Deleting test:', id);
        
        // TODO: Implement backend DELETE endpoint
        alert('Delete API will be implemented in backend soon!');
        
        await loadScheduledTests();
        
    } catch (error) {
        console.error('❌ Error deleting test:', error);
        if (window.AdminUtils) {
            window.AdminUtils.showToast('Failed to delete test', 'error');
        }
    }
}

window.initScheduledTests = initScheduledTests;
window.viewTestDetails = viewTestDetails;
window.rescheduleTest = rescheduleTest;
window.markAsCompleted = markAsCompleted;
window.deleteTest = deleteTest;
