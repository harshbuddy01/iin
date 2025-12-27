/**
 * Results Page - Complete Implementation
 */

function initResults() {
    console.log('Initializing Results page...');
    
    const container = document.getElementById('view-results-page');
    if (!container) return;
    
    container.innerHTML = `
        <div class="page-header" style="margin-bottom: 24px;">
            <h2>Test Results</h2>
            <p>View student test results and rankings</p>
        </div>
        
        <div class="table-header">
            <div class="filter-bar">
                <select id="testFilter" class="filter-select">
                    <option value="">All Tests</option>
                    <option value="NEST Mock Test 1">NEST Mock Test 1</option>
                    <option value="IAT Mock Test 1">IAT Mock Test 1</option>
                </select>
                
                <input type="text" id="searchResults" class="search-input" placeholder="Search results...">
            </div>
            
            <button class="export-btn" onclick="exportResults()">
                <i class="fas fa-download"></i> Export
            </button>
        </div>
        
        <div id="resultsTableContainer"></div>
    `;
    
    loadResults();
    document.getElementById('testFilter')?.addEventListener('change', loadResults);
    document.getElementById('searchResults')?.addEventListener('input', loadResults);
    
    console.log('✅ Results page initialized');
}

function loadResults() {
    const container = document.getElementById('resultsTableContainer');
    if (!container) return;
    
    const testFilter = document.getElementById('testFilter')?.value || '';
    const searchText = document.getElementById('searchResults')?.value.toLowerCase() || '';
    
    let results = JSON.parse(localStorage.getItem('results') || '[]');
    
    if (results.length === 0) {
        results = [
            { id: 1, studentName: 'Rahul Sharma', testName: 'NEST Mock Test 1', score: 85, totalMarks: 100, percentage: 85, rank: 1, date: '2025-12-20' },
            { id: 2, studentName: 'Priya Patel', testName: 'NEST Mock Test 1', score: 78, totalMarks: 100, percentage: 78, rank: 2, date: '2025-12-20' },
            { id: 3, studentName: 'Amit Kumar', testName: 'IAT Mock Test 1', score: 72, totalMarks: 100, percentage: 72, rank: 3, date: '2025-12-21' }
        ];
    }
    
    let filteredResults = results.filter(r => {
        const matchesTest = !testFilter || r.testName === testFilter;
        const matchesSearch = !searchText || r.studentName.toLowerCase().includes(searchText) || r.testName.toLowerCase().includes(searchText);
        return matchesTest && matchesSearch;
    });
    
    if (filteredResults.length === 0) {
        container.innerHTML = '<div class="coming-soon">No results found.</div>';
        return;
    }
    
    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Student Name</th>
                    <th>Test Name</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${filteredResults.map(r => `
                    <tr>
                        <td><span class="rank-badge">#${r.rank}</span></td>
                        <td>${r.studentName}</td>
                        <td>${r.testName}</td>
                        <td><strong>${r.score}/${r.totalMarks}</strong></td>
                        <td><strong>${r.percentage}%</strong></td>
                        <td>${r.date}</td>
                        <td>
                            <button class="action-btn" onclick="viewResult(${r.id})" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function viewResult(id) {
    const results = JSON.parse(localStorage.getItem('results') || '[]');
    const result = results.find(r => r.id == id);
    if (result) {
        alert(`Student: ${result.studentName}\nTest: ${result.testName}\nScore: ${result.score}/${result.totalMarks}\nPercentage: ${result.percentage}%\nRank: #${result.rank}\nDate: ${result.date}`);
    }
}

function exportResults() {
    const results = JSON.parse(localStorage.getItem('results') || '[]');
    if (typeof AdminUtils !== 'undefined') {
        AdminUtils.exportToCSV(results, 'results.csv');
    }
}

if (document.getElementById('view-results-page')) {
    initResults();
}