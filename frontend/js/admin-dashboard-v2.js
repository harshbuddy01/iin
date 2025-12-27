/**
 * IIN ADMIN DASHBOARD V2 - Complete JavaScript
 * Fully Integrated with Authentication & API
 */

// ============================================
// CHECK AUTHENTICATION ON LOAD
// ============================================

window.addEventListener('load', function() {
    // Require authentication
    if (!window.adminAuth.requireAuth()) {
        return;
    }
    
    // Update admin profile info
    updateAdminProfile();
    
    // Initialize everything
    initializeDashboard();
});

function updateAdminProfile() {
    const adminData = window.adminAuth.getAdminData();
    if (adminData) {
        const adminNameEl = document.querySelector('.admin-name');
        const adminRoleEl = document.querySelector('.admin-role');
        
        if (adminNameEl) adminNameEl.textContent = adminData.name;
        if (adminRoleEl) adminRoleEl.textContent = adminData.role;
    }
}

// ============================================
// MAIN INITIALIZATION
// ============================================

function initializeDashboard() {
    console.log('🎯 IIN Admin Dashboard V2 Initialized');
    
    // Initialize navigation
    initNavigation();
    
    // Initialize chart
    initPerformanceChart();
    
    // Load dashboard data
    loadDashboardData();
    
    // Set up auto-refresh (every 60 seconds)
    setInterval(() => {
        loadDashboardData();
    }, 60000);
}

// ============================================
// NAVIGATION SYSTEM
// ============================================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentAreas = document.querySelectorAll('.content-area');
    const pageTitle = document.querySelector('.page-title');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active to clicked
            link.classList.add('active');
            
            // Hide all content areas
            contentAreas.forEach(area => area.style.display = 'none');
            
            // Show selected page
            const page = link.getAttribute('data-page');
            const targetPage = document.getElementById(page + '-page');
            
            if (targetPage) {
                targetPage.style.display = 'block';
                
                // Update page title
                const linkText = link.querySelector('span').textContent;
                pageTitle.textContent = linkText;
                
                // Load page-specific data
                loadPageData(page);
            }
        });
    });
}

// ============================================
// PAGE DATA LOADING
// ============================================

async function loadPageData(page) {
    switch(page) {
        case 'dashboard':
            await loadDashboardData();
            break;
        case 'all-students':
            await loadAllStudents();
            break;
        case 'view-questions':
            await loadAllQuestions();
            break;
        case 'transactions':
            await loadTransactions();
            break;
        case 'view-results':
            await loadResults();
            break;
        default:
            console.log('Page:', page);
    }
}

// ============================================
// DASHBOARD DATA
// ============================================

async function loadDashboardData() {
    try {
        // Load all dashboard components
        await Promise.all([
            loadDashboardStats(),
            loadUpcomingTests(),
            loadRecentActivity(),
            updatePerformanceChart()
        ]);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        AdminUtils.showToast('Failed to load dashboard data', 'error');
    }
}

async function loadDashboardStats() {
    try {
        const response = await window.adminAPI.getDashboardStats();
        
        if (response.success) {
            const data = response.data;
            
            // Update stat cards
            updateStatCard('.stat-card.blue .stat-value', data.activeTests);
            updateStatCard('.stat-card.green .stat-value', data.studentsEnrolled.toLocaleString());
            updateStatCard('.stat-card.orange .stat-value', data.todaysExams);
            updateStatCard('.stat-card.purple .stat-value', AdminUtils.formatCurrency(data.monthlyRevenue));
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function updateStatCard(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = value;
    }
}

async function loadUpcomingTests() {
    try {
        const response = await window.adminAPI.getUpcomingTests();
        
        if (response.success && response.data) {
            renderUpcomingTests(response.data);
        }
    } catch (error) {
        console.error('Error loading upcoming tests:', error);
    }
}

function renderUpcomingTests(tests) {
    const container = document.querySelector('.test-list');
    if (!container) return;
    
    if (!tests || tests.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #64748b; padding: 40px;">No upcoming tests scheduled</p>';
        return;
    }
    
    container.innerHTML = tests.map(test => {
        const date = new Date(test.date);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        
        return `
            <div class="test-item">
                <div class="test-date">
                    <div class="date-day">${day}</div>
                    <div class="date-month">${month}</div>
                </div>
                <div class="test-details">
                    <h4>${test.name}</h4>
                    <p><i class="fas fa-clock"></i> ${test.startTime} - ${test.endTime}</p>
                    <p><i class="fas fa-users"></i> ${test.registeredStudents} students registered</p>
                </div>
                <div class="test-actions">
                    <button class="action-btn" onclick="editTest(${test.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="viewTest(${test.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn danger" onclick="deleteTest(${test.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

async function loadRecentActivity() {
    try {
        const response = await window.adminAPI.getRecentActivity();
        
        if (response.success && response.data) {
            renderRecentActivity(response.data);
        }
    } catch (error) {
        console.error('Error loading recent activity:', error);
    }
}

function renderRecentActivity(activities) {
    const container = document.querySelector('.activity-list');
    if (!container) return;
    
    if (!activities || activities.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #64748b; padding: 40px;">No recent activity</p>';
        return;
    }
    
    container.innerHTML = activities.map(activity => {
        const timeAgo = AdminUtils.timeAgo(activity.timestamp);
        
        return `
            <div class="activity-item">
                <div class="activity-icon ${activity.color}">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.message}</p>
                    <span class="time">${timeAgo}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// PERFORMANCE CHART
// ============================================

let performanceChartInstance = null;

async function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    // Get data from API
    const response = await window.adminAPI.getPerformanceTrend();
    
    if (response.success && response.data) {
        if (performanceChartInstance) {
            performanceChartInstance.destroy();
        }
        
        performanceChartInstance = new Chart(ctx, {
            type: 'line',
            data: response.data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 13,
                                weight: '600',
                                family: 'Inter'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        titleColor: '#fff',
                        bodyColor: '#cbd5e1',
                        padding: 12,
                        borderColor: '#6366f1',
                        borderWidth: 1,
                        displayColors: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: { size: 12, family: 'Inter' },
                            color: '#64748b'
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { size: 12, family: 'Inter' },
                            color: '#64748b'
                        }
                    }
                }
            }
        });
    }
}

async function updatePerformanceChart() {
    if (performanceChartInstance) {
        const response = await window.adminAPI.getPerformanceTrend();
        if (response.success && response.data) {
            performanceChartInstance.data = response.data;
            performanceChartInstance.update();
        }
    }
}

// Time period buttons
document.addEventListener('DOMContentLoaded', function() {
    const timeBtns = document.querySelectorAll('.time-btn');
    timeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            timeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updatePerformanceChart();
        });
    });
});

// ============================================
// TEST MANAGEMENT FUNCTIONS
// ============================================

function editTest(testId) {
    AdminUtils.showToast('Opening test editor...', 'success');
    // TODO: Navigate to edit test page or show modal
    console.log('Edit test:', testId);
}

function viewTest(testId) {
    AdminUtils.showToast('Opening test details...', 'success');
    // TODO: Navigate to test details page
    console.log('View test:', testId);
}

async function deleteTest(testId) {
    AdminUtils.showConfirmModal(
        'Are you sure you want to delete this test? This action cannot be undone.',
        async () => {
            try {
                const response = await window.adminAPI.deleteTest(testId);
                if (response.success) {
                    AdminUtils.showToast('Test deleted successfully', 'success');
                    await loadUpcomingTests();
                } else {
                    AdminUtils.showToast('Failed to delete test', 'error');
                }
            } catch (error) {
                console.error('Error deleting test:', error);
                AdminUtils.showToast('Error deleting test', 'error');
            }
        }
    );
}

// ============================================
// STUDENT MANAGEMENT
// ============================================

async function loadAllStudents() {
    const container = document.getElementById('all-students-page');
    if (!container) return;
    
    AdminUtils.showLoading(container);
    
    try {
        const response = await window.adminAPI.getAllStudents();
        
        if (response.success && response.data) {
            renderStudentsTable(response.data, container);
        } else {
            AdminUtils.showError(container, 'Failed to load students');
        }
    } catch (error) {
        console.error('Error loading students:', error);
        AdminUtils.showError(container, 'Error loading students');
    }
}

function renderStudentsTable(students, container) {
    // TODO: Create full students table UI
    container.innerHTML = `
        <div class="page-header">
            <h1>All Students</h1>
            <button class="btn-primary" onclick="addNewStudent()">
                <i class="fas fa-user-plus"></i> Add Student
            </button>
        </div>
        <p class="coming-soon">Full students table coming in next update...</p>
    `;
}

function addNewStudent() {
    AdminUtils.showToast('Add student form coming soon!', 'success');
}

// ============================================
// QUESTION BANK
// ============================================

async function loadAllQuestions() {
    const container = document.getElementById('view-questions-page');
    if (!container) return;
    
    AdminUtils.showLoading(container);
    
    try {
        const response = await window.adminAPI.getAllQuestions();
        
        if (response.success && response.data) {
            renderQuestionsTable(response.data, container);
        } else {
            AdminUtils.showError(container, 'Failed to load questions');
        }
    } catch (error) {
        console.error('Error loading questions:', error);
        AdminUtils.showError(container, 'Error loading questions');
    }
}

function renderQuestionsTable(questions, container) {
    // TODO: Create full questions table UI
    container.innerHTML = `
        <div class="page-header">
            <h1>Question Bank</h1>
            <button class="btn-primary" onclick="addNewQuestion()">
                <i class="fas fa-plus"></i> Add Question
            </button>
        </div>
        <p class="coming-soon">Full questions table coming in next update...</p>
    `;
}

function addNewQuestion() {
    AdminUtils.showToast('Add question form coming soon!', 'success');
}

// ============================================
// TRANSACTIONS
// ============================================

async function loadTransactions() {
    const container = document.getElementById('transactions-page');
    if (!container) return;
    
    AdminUtils.showLoading(container);
    
    try {
        const response = await window.adminAPI.getAllTransactions();
        
        if (response.success && response.data) {
            renderTransactionsTable(response.data, container);
        } else {
            AdminUtils.showError(container, 'Failed to load transactions');
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
        AdminUtils.showError(container, 'Error loading transactions');
    }
}

function renderTransactionsTable(transactions, container) {
    // TODO: Create full transactions table UI
    container.innerHTML = `
        <div class="page-header">
            <h1>Payment Transactions</h1>
            <button class="btn-primary" onclick="exportTransactions()">
                <i class="fas fa-download"></i> Export CSV
            </button>
        </div>
        <p class="coming-soon">Full transactions table coming in next update...</p>
    `;
}

function exportTransactions() {
    AdminUtils.showToast('Exporting transactions...', 'success');
}

// ============================================
// RESULTS
// ============================================

async function loadResults() {
    const container = document.getElementById('view-results-page');
    if (!container) return;
    
    AdminUtils.showLoading(container);
    
    try {
        // Load results data
        container.innerHTML = `
            <div class="page-header">
                <h1>Test Results</h1>
                <button class="btn-primary" onclick="exportResults()">
                    <i class="fas fa-download"></i> Export Results
                </button>
            </div>
            <p class="coming-soon">Results viewer coming in next update...</p>
        `;
    } catch (error) {
        console.error('Error loading results:', error);
        AdminUtils.showError(container, 'Error loading results');
    }
}

function exportResults() {
    AdminUtils.showToast('Exporting results...', 'success');
}

// ============================================
// NOTIFICATION BELL
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            AdminUtils.showToast('Notifications panel coming soon!', 'success');
        });
    }
    
    const settingsIcon = document.querySelector('.settings-icon');
    if (settingsIcon) {
        settingsIcon.addEventListener('click', function() {
            // Navigate to settings
            document.querySelector('[data-page="settings"]').click();
        });
    }
});