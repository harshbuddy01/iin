/**
 * Results Viewer - FULLY FUNCTIONAL
 */

const mockResults = [
    { id: 1, test: 'NEST Mock 1', testDate: '2025-12-20', student: 'Rahul Sharma', email: 'rahul@example.com', score: 85, total: 100, rank: 12, percentile: 92.5, timeTaken: 165 },
    { id: 2, test: 'NEST Mock 1', testDate: '2025-12-20', student: 'Priya Patel', email: 'priya@example.com', score: 92, total: 100, rank: 5, percentile: 98.2, timeTaken: 170 },
    { id: 3, test: 'IAT Mock 2', testDate: '2025-12-22', student: 'Amit Kumar', email: 'amit@example.com', score: 78, total: 100, rank: 25, percentile: 85.3, timeTaken: 180 },
    { id: 4, test: 'NEST Mock 1', testDate: '2025-12-20', student: 'Neha Singh', email: 'neha@example.com', score: 88, total: 100, rank: 9, percentile: 94.1, timeTaken: 168 },
    { id: 5, test: 'ISI Mock 1', testDate: '2025-12-23', student: 'Vikram Reddy', email: 'vikram@example.com', score: 95, total: 100, rank: 2, percentile: 99.5, timeTaken: 175 },
    { id: 6, test: 'IAT Mock 2', testDate: '2025-12-22', student: 'Priya Patel', email: 'priya@example.com', score: 82, total: 100, rank: 18, percentile: 89.7, timeTaken: 177 }
];

let resultsData = [];

function initResults() {
    resultsData = [...mockResults];
    renderResultsTable();
    
    document.getElementById('exportResults')?.addEventListener('click', () => {
        AdminUtils.exportToCSV(resultsData.map(r => ({
            'ID': r.id,
            'Test': r.test,
            'Test Date': r.testDate,
            'Student': r.student,
            'Email': r.email,
            'Score': r.score,
            'Total': r.total,
            'Percentage': ((r.score / r.total) * 100).toFixed(1),
            'Rank': r.rank,
            'Percentile': r.percentile,
            'Time Taken (min)': r.timeTaken
        })), 'test-results.csv');
    });
}

function renderResultsTable() {
    const tbody = document.getElementById('resultsTableBody');
    if (!tbody) return;
    
    if (resultsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #64748b;"><i class="fas fa-chart-bar" style="font-size: 48px; opacity: 0.3; margin-bottom: 16px;"></i><br>No results found</td></tr>';
        return;
    }
    
    tbody.innerHTML = resultsData.map(r => {
        const percentage = ((r.score / r.total) * 100).toFixed(1);
        const barColor = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444';
        return `
            <tr>
                <td><strong>#${r.id}</strong></td>
                <td><strong>${r.test}</strong><br><small style="color: #64748b;">${AdminUtils.formatDate(r.testDate, 'short')}</small></td>
                <td><strong>${r.student}</strong><br><small style="color: #64748b;">${r.email}</small></td>
                <td><strong style="font-size: 16px; color: #0f172a;">${r.score}/${r.total}</strong></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="flex: 1; background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${percentage}%; background: ${barColor}; height: 100%; transition: width 0.3s;"></div>
                        </div>
                        <span style="font-weight: 600; color: #1e293b; min-width: 50px;">${percentage}%</span>
                    </div>
                </td>
                <td><span class="rank-badge">Rank ${r.rank}</span></td>
                <td><span style="font-weight: 600; color: #6366f1;">${r.percentile}%</span></td>
                <td>
                    <button class="action-btn" onclick="viewResultDetails(${r.id})" title="View Details"><i class="fas fa-eye"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewResultDetails(id) {
    const result = resultsData.find(r => r.id === id);
    if (!result) return;
    
    const percentage = ((result.score / result.total) * 100).toFixed(1);
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : 'F';
    const gradeColor = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444';
    
    const modal = document.createElement('div');
    modal.className = 'confirm-modal-overlay';
    modal.innerHTML = `
        <div class="confirm-modal" style="max-width: 600px;">
            <div class="confirm-modal-header" style="text-align: left; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px;">
                <h3 style="font-size: 20px; color: #0f172a; margin: 0;"><i class="fas fa-chart-line"></i> Test Result Details</h3>
            </div>
            <div class="confirm-modal-body" style="text-align: left; padding: 24px 0;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; border-radius: 12px; color: white; margin-bottom: 24px;">
                    <h2 style="margin: 0 0 8px 0; font-size: 24px;">${result.test}</h2>
                    <p style="margin: 0; opacity: 0.9;">${result.student} • ${AdminUtils.formatDate(result.testDate)}</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
                        <p style="color: #64748b; font-size: 12px; margin-bottom: 8px;">SCORE</p>
                        <p style="font-size: 32px; font-weight: 700; color: #0f172a; margin: 0;">${result.score}<span style="font-size: 18px; color: #64748b;">/${result.total}</span></p>
                    </div>
                    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
                        <p style="color: #64748b; font-size: 12px; margin-bottom: 8px;">PERCENTAGE</p>
                        <p style="font-size: 32px; font-weight: 700; color: ${gradeColor}; margin: 0;">${percentage}%</p>
                    </div>
                    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
                        <p style="color: #64748b; font-size: 12px; margin-bottom: 8px;">RANK</p>
                        <p style="font-size: 32px; font-weight: 700; color: #6366f1; margin: 0;">${result.rank}</p>
                    </div>
                    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
                        <p style="color: #64748b; font-size: 12px; margin-bottom: 8px;">PERCENTILE</p>
                        <p style="font-size: 32px; font-weight: 700; color: #6366f1; margin: 0;">${result.percentile}%</p>
                    </div>
                </div>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px;">
                    <div style="margin-bottom: 12px;">
                        <p style="color: #64748b; font-size: 12px; margin-bottom: 4px;">GRADE</p>
                        <p style="font-weight: 700; font-size: 24px; margin: 0;" style="color: ${gradeColor};">${grade}</p>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <p style="color: #64748b; font-size: 12px; margin-bottom: 4px;">TIME TAKEN</p>
                        <p style="color: #0f172a; font-weight: 600;">${result.timeTaken} minutes</p>
                    </div>
                    <div>
                        <p style="color: #64748b; font-size: 12px; margin-bottom: 4px;">STUDENT EMAIL</p>
                        <p style="color: #0f172a;">${result.email}</p>
                    </div>
                </div>
            </div>
            <div class="confirm-modal-footer">
                <button class="btn-secondary" onclick="window.print()"><i class="fas fa-print"></i> Print Report</button>
                <button class="btn-primary" onclick="this.closest('.confirm-modal-overlay').remove()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

if (document.getElementById('resultsTableBody')) {
    initResults();
}