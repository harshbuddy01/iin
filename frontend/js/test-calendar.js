/**
 * Test Calendar Module - FIXED EXAM TYPES (IAT, NEST, ISI)
 */

let currentDate = new Date();
let calendarEvents = [];

function initTestCalendar() {
    console.log('📅 Initializing Test Calendar...');
    renderCalendarPage();
    loadCalendarEvents();
    renderCalendar();
}

function renderCalendarPage() {
    const container = document.getElementById('test-calendar-page');
    if (!container) return;
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <div>
                <h1 style="font-size: 28px; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-calendar-alt" style="color: #6366f1;"></i> Test Calendar
                </h1>
                <p style="color: #64748b; margin-top: 8px;">Schedule and manage test dates</p>
            </div>
            <button class="btn-primary" onclick="openScheduleModal()">
                <i class="fas fa-plus"></i> Schedule Test
            </button>
        </div>
        
        <div class="card" style="padding: 0; overflow: hidden;">
            <div style="background: #f8fafc; padding: 16px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <button class="btn-secondary" onclick="changeMonth(-1)">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h2 id="calendarMonth" style="margin: 0; font-size: 20px; font-weight: 600;"></h2>
                <button class="btn-secondary" onclick="changeMonth(1)">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            
            <div id="calendarGrid" style="padding: 20px;"></div>
        </div>
        
        <div style="margin-top: 24px; display: flex; gap: 16px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 16px; height: 16px; background: #dbeafe; border-radius: 4px;"></div>
                <span style="color: #64748b; font-size: 14px;">IAT Test</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 16px; height: 16px; background: #d1fae5; border-radius: 4px;"></div>
                <span style="color: #64748b; font-size: 14px;">NEST Test</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 16px; height: 16px; background: #fed7aa; border-radius: 4px;"></div>
                <span style="color: #64748b; font-size: 14px;">ISI Test</span>
            </div>
        </div>
    `;
}

function loadCalendarEvents() {
    const stored = localStorage.getItem('calendarEvents');
    calendarEvents = stored ? JSON.parse(stored) : [];
    console.log(`✅ Loaded ${calendarEvents.length} calendar events`);
}

function saveCalendarEvents() {
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    document.getElementById('calendarMonth').textContent = 
        currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let html = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;">';
    
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        html += `<div style="text-align: center; font-weight: 600; color: #64748b; padding: 8px; font-size: 13px;">${day}</div>`;
    });
    
    for (let i = 0; i < firstDay; i++) {
        html += '<div></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = calendarEvents.filter(e => e.date === dateStr);
        const isToday = dateStr === new Date().toISOString().split('T')[0];
        
        html += `
            <div style="
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 8px;
                min-height: 80px;
                background: white;
                ${isToday ? 'border: 2px solid #6366f1; background: #f0f1ff;' : ''}
                cursor: pointer;
            " onclick="viewDayEvents('${dateStr}')">
                <div style="font-weight: ${isToday ? '700' : '600'}; color: ${isToday ? '#6366f1' : '#1e293b'}; margin-bottom: 4px;">${day}</div>
                ${dayEvents.map(e => `
                    <div style="
                        font-size: 11px;
                        padding: 4px 6px;
                        background: ${e.type === 'IAT' ? '#dbeafe' : e.type === 'NEST' ? '#d1fae5' : '#fed7aa'};
                        color: ${e.type === 'IAT' ? '#1e40af' : e.type === 'NEST' ? '#065f46' : '#92400e'};
                        border-radius: 4px;
                        margin-bottom: 2px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    ">${e.name}</div>
                `).join('')}
            </div>
        `;
    }
    
    html += '</div>';
    document.getElementById('calendarGrid').innerHTML = html;
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}

function openScheduleModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px;">
            <div class="modal-header">
                <h2>Schedule New Test</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <form id="scheduleForm" onsubmit="handleScheduleTest(event)" style="padding: 24px;">
                <div class="form-group">
                    <label>Test Name *</label>
                    <input type="text" name="name" required placeholder="Enter test name">
                </div>
                <div class="form-group">
                    <label>Exam Type *</label>
                    <select name="type" required>
                        <option value="">Select Type</option>
                        <option value="IAT">IAT (Indian Institute of Science)</option>
                        <option value="NEST">NEST (National Entrance Screening Test)</option>
                        <option value="ISI">ISI (Indian Statistical Institute)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Test Date *</label>
                    <input type="date" name="date" required>
                </div>
                <div class="form-group">
                    <label>Duration (minutes)</label>
                    <input type="number" name="duration" value="180" min="30" max="300">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">
                        Cancel
                    </button>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save"></i> Schedule
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function handleScheduleTest(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const newEvent = {
        id: Date.now(),
        name: formData.get('name'),
        type: formData.get('type'),
        date: formData.get('date'),
        duration: parseInt(formData.get('duration'))
    };
    
    calendarEvents.push(newEvent);
    saveCalendarEvents();
    renderCalendar();
    
    event.target.closest('.modal').remove();
    if (window.AdminUtils) window.AdminUtils.showToast('Test scheduled successfully', 'success');
}

function viewDayEvents(dateStr) {
    const dayEvents = calendarEvents.filter(e => e.date === dateStr);
    
    if (dayEvents.length === 0) {
        alert('No tests scheduled for this day.');
        return;
    }
    
    const eventsList = dayEvents.map(e => 
        `${e.name} (${e.type}) - ${e.duration} minutes`
    ).join('\n');
    
    alert(`Tests on ${dateStr}:\n\n${eventsList}`);
}

window.initTestCalendar = initTestCalendar;
window.changeMonth = changeMonth;
window.openScheduleModal = openScheduleModal;
window.handleScheduleTest = handleScheduleTest;
window.viewDayEvents = viewDayEvents;