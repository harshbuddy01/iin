/**
 * Admin Dashboard Main - Complete with ALL modules
 */

let performanceChart = null;

// Initialize dashboard
async function initDashboard() {
    console.log('🔵 Initializing dashboard...');
    
    try {
        setupNavigation();
        await loadDashboardData();
        console.log('✅ Dashboard initialized successfully');
    } catch (error) {
        console.error('❌ Dashboard initialization error:', error);
        loadDashboardFallbackData();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminAuth');
        localStorage.removeItem('adminAuth');
        window.location.href = 'admin-login.html';
    }
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.content-area');
    const pageTitle = document.querySelector('.page-title');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            pages.forEach(p => p.style.display = 'none');
            
            const pageName = link.dataset.page;
            const targetPage = document.getElementById(`${pageName}-page`);
            
            if (targetPage) {
                targetPage.style.display = 'block';
                const linkText = link.querySelector('span')?.textContent || 'Admin Panel';
                if (pageTitle) pageTitle.textContent = linkText;
                
                // CRITICAL: Call the correct initialization function
                setTimeout(() => loadPageData(pageName), 50);
            }
        });
    });
}

// Load page-specific data
function loadPageData(pageName) {
    console.log(`📄 Loading page: ${pageName}`);
    
    try {
        switch(pageName) {
            case 'dashboard':
                loadDashboardData();
                break;
                
            // Test Management
            case 'test-calendar':
                if (typeof initTestCalendar === 'function') {
                    initTestCalendar();
                } else {
                    console.warn('⚠️ initTestCalendar not found');
                }
                break;
                
            case 'scheduled-tests':
                if (typeof initScheduledTests === 'function') {
                    initScheduledTests();
                } else {
                    console.warn('⚠️ initScheduledTests not found');
                }
                break;
                
            case 'past-tests':
                if (typeof initPastTests === 'function') {
                    initPastTests();
                } else {
                    console.warn('⚠️ initPastTests not found');
                }
                break;
                
            case 'create-test':
                if (typeof initCreateTest === 'function') {
                    initCreateTest();
                } else {
                    console.warn('⚠️ initCreateTest not found');
                }
                break;
                
            // Question Bank
            case 'add-questions':
                if (typeof initAddQuestions === 'function') {
                    initAddQuestions();
                } else {
                    console.warn('⚠️ initAddQuestions not found');
                }
                break;
                
            case 'view-questions':
                if (typeof initViewQuestions === 'function') {
                    initViewQuestions();
                } else {
                    console.warn('⚠️ initViewQuestions not found');
                }
                break;
                
            case 'upload-pdf':
                if (typeof initUploadPDF === 'function') {
                    initUploadPDF();
                } else {
                    console.warn('⚠️ initUploadPDF not found');
                }
                break;
                
            case 'upload-image':
                if (typeof initImageUploadPage === 'function') {
                    initImageUploadPage();
                } else {
                    console.warn('⚠️ initImageUploadPage not found');
                }
                break;
                
            // Students
            case 'all-students':
                if (typeof initStudents === 'function') {
                    initStudents();
                } else {
                    console.warn('⚠️ initStudents not found');
                }
                break;
                
            case 'add-student':
                if (typeof initAddStudent === 'function') {
                    initAddStudent();
                } else {
                    console.warn('⚠️ initAddStudent not found');
                }
                break;
                
            case 'performance':
                console.log('ℹ️ Performance analytics - Coming soon');
                break;
                
            // Financial
            case 'transactions':
                if (typeof initTransactions === 'function') {
                    initTransactions();
                } else {
                    console.warn('⚠️ initTransactions not found');
                }
                break;
                
            // Results
            case 'view-results':
                if (typeof initResults === 'function') {
                    initResults();
                } else {
                    console.warn('⚠️ initResults not found');
                }
                break;
                
            default:
                console.log(`ℹ️ No initialization needed for ${pageName}`);
        }
    } catch (error) {
        console.error(`❌ Error loading ${pageName}:`, error);
        if (window.AdminUtils) {
            window.AdminUtils.showToast(`Error loading ${pageName}. Please refresh the page.`, 'error');
        }
    }
}

// Load dashboard data
async function loadDashboardData() {
    console.log('🔵 Loading dashboard data...');
    loadDashboardFallbackData();
}

function updateDashboardStats(stats) {
    try {
        const statCards = {
            tests: { value: stats.activeTests || 24, trend: stats.testsTrend || 12 },
            students: { value: stats.totalStudents || 1250, trend: stats.studentsTrend || 8 },
            exams: { value: stats.todayExams || 3 },
            revenue: { value: stats.monthlyRevenue || 240000, trend: stats.revenueTrend || 15 }
        };
        
        const testsValue = document.querySelector('.stat-card.blue .stat-value');
        const studentsValue = document.querySelector('.stat-card.green .stat-value');
        const examsValue = document.querySelector('.stat-card.orange .stat-value');
        const revenueValue = document.querySelector('.stat-card.purple .stat-value');
        
        if (testsValue) testsValue.textContent = statCards.tests.value;
        if (studentsValue) studentsValue.textContent = statCards.students.value.toLocaleString();
        if (examsValue) examsValue.textContent = statCards.exams.value;
        if (revenueValue) revenueValue.textContent = `₹${(statCards.revenue.value / 100000).toFixed(1)}L`;
        
        console.log('✅ Dashboard stats updated');
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

function updatePerformanceChart(data) {
    try {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;
        
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded yet');
            setTimeout(() => updatePerformanceChart(data), 500);
            return;
        }
        
        if (performanceChart) {
            performanceChart.destroy();
        }
        
        performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Average Score',
                    data: data.scores || [65, 72, 68, 75, 78, 82, 85],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        padding: 12,
                        borderRadius: 8,
                        callbacks: {
                            label: (context) => `Score: ${context.parsed.y}%`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { 
                            callback: value => value + '%',
                            color: '#64748b'
                        },
                        grid: {
                            color: '#f1f5f9'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#64748b'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
        console.log('✅ Performance chart rendered');
    } catch (error) {
        console.error('Error updating performance chart:', error);
    }
}

function loadDashboardFallbackData() {
    console.log('📋 Loading demo dashboard data...');
    
    updateDashboardStats({
        activeTests: 24,
        testsTrend: 12,
        totalStudents: 1250,
        studentsTrend: 8,
        todayExams: 3,
        monthlyRevenue: 240000,
        revenueTrend: 15
    });
    
    updatePerformanceChart({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        scores: [65, 72, 68, 75, 78, 82, 85]
    });
    
    console.log('✅ Demo data loaded successfully');
}

// Initialize on page load
console.log('🔵 Dashboard script loaded');

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initDashboard, 100);
    });
} else {
    setTimeout(initDashboard, 100);
}