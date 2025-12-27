/**
 * Create Test Page - Complete Implementation
 */

function initCreateTest() {
    console.log('Initializing Create Test page...');
    
    const container = document.getElementById('create-test-page');
    if (!container) return;
    
    container.innerHTML = `
        <div class="page-header" style="margin-bottom: 24px;">
            <h2>Create New Test</h2>
            <p>Create and schedule a new test</p>
        </div>
        
        <div class="form-container" style="max-width: 800px; margin: 0 auto;">
            <form id="createTestForm" style="background: white; padding: 32px; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                
                <h3 style="margin-bottom: 20px; color: #0f172a;"><i class="fas fa-info-circle"></i> Test Details</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label for="testName">Test Name *</label>
                        <input type="text" id="testName" required class="form-input" placeholder="e.g., NEST Mock Test 1">
                    </div>
                    
                    <div class="form-group">
                        <label for="testSubject">Subject *</label>
                        <select id="testSubject" required class="form-input">
                            <option value="">Select Subject</option>
                            <option value="Physics">Physics</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Mixed">Mixed (All Subjects)</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="testDuration">Duration (minutes) *</label>
                        <input type="number" id="testDuration" required class="form-input" value="180" min="30" max="300">
                    </div>
                    
                    <div class="form-group">
                        <label for="totalMarks">Total Marks *</label>
                        <input type="number" id="totalMarks" required class="form-input" value="100" min="10" max="300">
                    </div>
                    
                    <div class="form-group">
                        <label for="testDate">Test Date *</label>
                        <input type="date" id="testDate" required class="form-input">
                    </div>
                    
                    <div class="form-group">
                        <label for="testTime">Test Time *</label>
                        <input type="time" id="testTime" required class="form-input" value="10:00">
                    </div>
                </div>
                
                <div class="form-group" style="margin-bottom: 20px;">
                    <label for="testDescription">Description</label>
                    <textarea id="testDescription" class="form-input" rows="3" placeholder="Test description or instructions..."></textarea>
                </div>
                
                <div style="margin-top: 32px; display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" onclick="document.getElementById('createTestForm').reset()" class="btn-secondary">
                        <i class="fas fa-redo"></i> Reset
                    </button>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-plus"></i> Create Test
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('testDate').setAttribute('min', today);
    
    document.getElementById('createTestForm')?.addEventListener('submit', handleCreateTest);
    console.log('✅ Create Test page initialized');
}

function handleCreateTest(e) {
    e.preventDefault();
    
    const test = {
        id: Date.now(),
        name: document.getElementById('testName').value,
        subject: document.getElementById('testSubject').value,
        duration: parseInt(document.getElementById('testDuration').value),
        totalMarks: parseInt(document.getElementById('totalMarks').value),
        date: document.getElementById('testDate').value,
        time: document.getElementById('testTime').value,
        description: document.getElementById('testDescription').value,
        status: 'Scheduled',
        createdAt: new Date().toISOString()
    };
    
    const tests = JSON.parse(localStorage.getItem('tests') || '[]');
    tests.push(test);
    localStorage.setItem('tests', JSON.stringify(tests));
    
    if (typeof AdminUtils !== 'undefined') {
        AdminUtils.showToast('Test created successfully!', 'success');
    } else {
        alert('Test created successfully!');
    }
    
    document.getElementById('createTestForm').reset();
}

if (document.getElementById('create-test-page')) {
    initCreateTest();
}