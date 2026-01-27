// Modern Create Test Module - Rebuilt 2026-01-27
window.initCreateTest = function () {
    console.log('🔵 Initializing Modern Create Test page...');

    if (!window.AdminAPI) {
        console.error('❌ AdminAPI service not found');
        return;
    }

    const container = document.getElementById('create-test-page');
    if (!container) return;

    // Render Modern UI
    container.innerHTML = `
        <div class="page-header-modern">
            <div>
                <h1 class="page-title-modern">Create New Test</h1>
                <div class="page-subtitle">Configure test details, subjects, and schedule.</div>
            </div>
            <div>
                <button type="button" class="btn-modern btn-secondary-modern" onclick="resetCreateTestForm()">
                    <i class="fas fa-redo"></i> Reset
                </button>
            </div>
        </div>

        <form id="createTestForm" class="modern-card">
            
            <!-- Section 1: Basic Details -->
            <div class="form-section">
                <div class="form-section-title"><i class="fas fa-info-circle"></i> Test Information</div>
                <div class="form-grid">
                    <div class="form-group-modern">
                        <label class="form-label-modern">Test Name *</label>
                        <input type="text" id="testName" class="form-input-modern" placeholder="e.g. NEST Full Mock Test 01" required>
                    </div>
                </div>
            </div>

            <!-- Section 2: Configuration & Selection -->
            <div class="form-section">
                <div class="form-section-title"><i class="fas fa-sliders-h"></i> Configuration</div>
                <div class="form-grid">
                    <div class="form-group-modern">
                        <label class="form-label-modern">Exam Type *</label>
                        <select id="examType" class="form-input-modern" required>
                            <option value="">Select Exam Type</option>
                            <option value="IAT">IAT (IISER Aptitude Test)</option>
                            <option value="ISI">ISI (Indian Statistical Institute)</option>
                            <option value="NEST">NEST (National Entrance Screening Test)</option>
                        </select>
                    </div>
                    <div class="form-group-modern">
                        <label class="form-label-modern">Duration (Minutes) *</label>
                        <input type="number" id="testDuration" class="form-input-modern" value="180" min="30" max="300" required>
                    </div>
                    <div class="form-group-modern">
                        <label class="form-label-modern">Total Marks *</label>
                        <input type="number" id="totalMarks" class="form-input-modern" value="100" min="10" max="500" required>
                    </div>
                </div>
            </div>

            <!-- Section 3: Subject Selection -->
            <div class="form-section">
                <div class="form-section-title"><i class="fas fa-layer-group"></i> Subjects Included *</div>
                <div class="selection-grid">
                    <div class="selection-card" onclick="toggleSelection(this)">
                        <input type="checkbox" name="sections" value="Physics" checked style="display:none;">
                        <span class="selection-content">
                            <div class="selection-icon"><i class="fas fa-atom"></i></div>
                            <div class="selection-info">
                                <div class="selection-title">Physics</div>
                                <div class="selection-subtitle">Required</div>
                            </div>
                            <div class="check-circle"><i class="fas fa-check"></i></div>
                        </span>
                    </div>

                    <div class="selection-card" onclick="toggleSelection(this)">
                        <input type="checkbox" name="sections" value="Chemistry" checked style="display:none;">
                        <span class="selection-content">
                            <div class="selection-icon"><i class="fas fa-flask"></i></div>
                            <div class="selection-info">
                                <div class="selection-title">Chemistry</div>
                                <div class="selection-subtitle">Required</div>
                            </div>
                            <div class="check-circle"><i class="fas fa-check"></i></div>
                        </span>
                    </div>

                    <div class="selection-card" onclick="toggleSelection(this)">
                        <input type="checkbox" name="sections" value="Mathematics" checked style="display:none;">
                        <span class="selection-content">
                            <div class="selection-icon"><i class="fas fa-square-root-alt"></i></div>
                            <div class="selection-info">
                                <div class="selection-title">Mathematics</div>
                                <div class="selection-subtitle">Required</div>
                            </div>
                            <div class="check-circle"><i class="fas fa-check"></i></div>
                        </span>
                    </div>

                    <div class="selection-card" onclick="toggleSelection(this)">
                        <input type="checkbox" name="sections" value="Biology" checked style="display:none;">
                        <span class="selection-content">
                            <div class="selection-icon"><i class="fas fa-dna"></i></div>
                            <div class="selection-info">
                                <div class="selection-title">Biology</div>
                                <div class="selection-subtitle">Required</div>
                            </div>
                            <div class="check-circle"><i class="fas fa-check"></i></div>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Section 4: Schedule -->
            <div class="form-section">
                <div class="form-section-title"><i class="fas fa-clock"></i> Schedule</div>
                <div class="form-grid">
                    <div class="form-group-modern">
                        <label class="form-label-modern">Test Date *</label>
                        <input type="date" id="testDate" class="form-input-modern" required>
                    </div>
                    <div class="form-group-modern">
                        <label class="form-label-modern">Start Time *</label>
                        <input type="time" id="testTime" class="form-input-modern" value="10:00" required>
                    </div>
                </div>
            </div>

             <!-- Section 5: Description -->
             <div class="form-section">
                <div class="form-group-modern">
                    <label class="form-label-modern">Description / Instructions</label>
                    <textarea id="testDescription" class="form-input-modern" rows="3" placeholder="Enter test instructions..."></textarea>
                </div>
            </div>

            <!-- Actions -->
            <div class="form-section" style="display: flex; justify-content: flex-end; padding: 24px;">
                <button type="submit" class="btn-modern btn-primary-modern" id="submitTestBtn">
                    <i class="fas fa-rocket"></i> Create & Schedule Test
                </button>
            </div>
        </form>
    `;

    // Initialize state
    setupModernInteractions();

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('testDate');
    if (dateInput) dateInput.setAttribute('min', today);
};

// Toggle Selection Card State
window.toggleSelection = function (card) {
    const checkbox = card.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
        card.classList.add('selected');
    } else {
        card.classList.remove('selected');
    }
}

// Setup Event Listeners
function setupModernInteractions() {
    // Initial selection state
    document.querySelectorAll('.selection-card').forEach(card => {
        const checkbox = card.querySelector('input');
        if (checkbox.checked) card.classList.add('selected');
    });

    // Form Submit
    const form = document.getElementById('createTestForm');
    if (form) {
        form.addEventListener('submit', handleModernCreateTest);
    }
}

// Reset Form
window.resetCreateTestForm = function () {
    const form = document.getElementById('createTestForm');
    if (form) {
        form.reset();
        // Reset selections
        document.querySelectorAll('.selection-card').forEach(card => {
            const checkbox = card.querySelector('input');
            checkbox.checked = true;
            card.classList.add('selected');
        });
    }
}

// Handle Submission
async function handleModernCreateTest(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitTestBtn');
    const originalBtnText = submitBtn.innerHTML;

    // 1. Validate Selections
    const selectedSections = Array.from(
        document.querySelectorAll('input[name="sections"]:checked')
    ).map(cb => cb.value);

    if (selectedSections.length === 0) {
        if (window.AdminUtils) window.AdminUtils.showToast('Please select at least one subject.', 'error');
        else alert('Please select at least one subject.');
        return;
    }

    // 2. Prepare Data
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    const testName = document.getElementById('testName').value;
    const rawExamType = document.getElementById('examType').value;
    const testDate = document.getElementById('testDate').value;
    const testTime = document.getElementById('testTime').value;
    const testDescription = document.getElementById('testDescription').value;
    const durationMinutes = parseInt(document.getElementById('testDuration').value);
    const totalMarks = parseInt(document.getElementById('totalMarks').value);

    // 🔥 CRITICAL FIX: Backend Compatibility
    // Backend strictly accepts: 'iat' or 'nest' (lowercase).
    // Some UIs might send Uppercase, we force conversion here.
    const examType = rawExamType.toLowerCase().trim();

    if (!['iat', 'nest', 'isi'].includes(examType)) {
        if (window.AdminUtils) window.AdminUtils.showToast(`Invalid exam type: ${rawExamType}. Only IAT, NEST, and ISI supported.`, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }

    const testData = {
        test_name: testName,
        test_type: examType,
        test_id: `TEST-${examType.toUpperCase()}-${Date.now()}`,
        exam_date: testDate,
        start_time: testTime + ':00',
        duration_minutes: durationMinutes,
        total_marks: totalMarks,
        subjects: selectedSections.join(', '),
        description: testDescription || `${examType.toUpperCase()} Mock Test`,
        total_questions: 0,
        status: 'scheduled'
    };

    console.log('📤 Sending Payload:', testData);

    try {
        const response = await window.AdminAPI.createTest(testData);
        console.log('✅ Response:', response);

        if (window.AdminUtils) {
            window.AdminUtils.showToast(`Test Created Successfully! ID: ${testData.test_id}`, 'success');
        } else {
            alert('Test Created Successfully!');
        }

        window.resetCreateTestForm();

        // Redirect to calendar or scheduled tests after delay
        setTimeout(() => {
            const scheduledTestsLink = document.querySelector('[data-page="scheduled-tests"]');
            if (scheduledTestsLink) scheduledTestsLink.click();
        }, 1500);

    } catch (error) {
        console.error('❌ Creation Error:', error);
        if (window.AdminUtils) {
            window.AdminUtils.showToast(`Error: ${error.message}`, 'error');
        } else {
            alert(`Error: ${error.message}`);
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}