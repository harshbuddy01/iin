// Past Tests Module
(function() {
    'use strict';

    window.initPastTests = function() {
        console.log('📋 Initializing Past Tests...');
        
        const pastTestsHTML = `
            <div class="page-header">
                <h1><i class="fas fa-history"></i> Past Tests</h1>
                <button class="btn-primary" onclick="exportPastTestsReport()">
                    <i class="fas fa-download"></i> Export Report
                </button>
            </div>

            <div class="stats-row" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: white; padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6;">
                    <div style="font-size: 32px; font-weight: 700; color: #1e293b;"><span id="totalPastTests">0</span></div>
                    <div style="color: #64748b; margin-top: 4px;">Total Tests</div>
                </div>
                <div style="background: white; padding: 20px; border-radius: 12px; border-left: 4px solid #10b981;">
                    <div style="font-size: 32px; font-weight: 700; color: #1e293b;"><span id="totalParticipants">0</span></div>
                    <div style="color: #64748b; margin-top: 4px;">Total Participants</div>
                </div>
                <div style="background: white; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
                    <div style="font-size: 32px; font-weight: 700; color: #1e293b;"><span id="avgScore">0</span>%</div>
                    <div style="color: #64748b; margin-top: 4px;">Average Score</div>
                </div>
            </div>

            <div class="filter-bar" style="background: white; padding: 16px; border-radius: 12px; margin-bottom: 20px; display: flex; gap: 12px; flex-wrap: wrap;">
                <select id="filterYear" onchange="filterPastTests()" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
                    <option value="all">All Years</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                </select>
                <select id="filterMonth" onchange="filterPastTests()" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
                    <option value="all">All Months</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                <select id="filterSubject" onchange="filterPastTests()" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
                    <option value="all">All Subjects</option>
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                </select>
                <input type="text" id="searchPastTests" onkeyup="filterPastTests()" placeholder="Search tests..." style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; flex: 1; min-width: 200px;">
            </div>

            <div id="pastTestsContainer"></div>

            <!-- Test Results Modal -->
            <div id="testResultsModal" class="modal" style="display: none;">
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h2>Test Results & Analytics</h2>
                        <button onclick="closeTestResultsModal()" class="close-btn">&times;</button>
                    </div>
                    <div id="testResultsContent" style="padding: 20px;"></div>
                    <div class="modal-actions">
                        <button onclick="downloadTestResults()" class="btn-primary"><i class="fas fa-download"></i> Download</button>
                        <button onclick="closeTestResultsModal()" class="btn-secondary">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('past-tests-page').innerHTML = pastTestsHTML;
        loadPastTests();
    };

    let pastTests = [];
    let currentTestId = null;

    function loadPastTests() {
        // Load from localStorage or generate sample data
        const stored = localStorage.getItem('pastTests');
        if (stored) {
            pastTests = JSON.parse(stored);
        } else {
            // Generate sample past tests
            pastTests = generateSamplePastTests();
            localStorage.setItem('pastTests', JSON.stringify(pastTests));
        }
        updateStats();
        renderPastTests();
    }

    function generateSamplePastTests() {
        const samples = [
            { name: 'JAM Physics Mock Test 1', subject: 'Physics', examType: 'JAM', date: '2025-12-15', participants: 45, avgScore: 67.5, maxScore: 95, minScore: 32 },
            { name: 'GATE Mathematics Test', subject: 'Mathematics', examType: 'GATE', date: '2025-12-10', participants: 38, avgScore: 72.3, maxScore: 98, minScore: 41 },
            { name: 'Chemistry Practice Test 2', subject: 'Chemistry', examType: 'Practice', date: '2025-12-05', participants: 52, avgScore: 64.8, maxScore: 89, minScore: 28 },
        ];
        
        return samples.map((test, idx) => ({
            id: Date.now() + idx,
            ...test,
            totalMarks: 100,
            duration: 180
        }));
    }

    function updateStats() {
        const totalTests = pastTests.length;
        const totalParticipants = pastTests.reduce((sum, test) => sum + test.participants, 0);
        const avgScore = totalTests > 0 ? (pastTests.reduce((sum, test) => sum + test.avgScore, 0) / totalTests).toFixed(1) : 0;
        
        document.getElementById('totalPastTests').textContent = totalTests;
        document.getElementById('totalParticipants').textContent = totalParticipants;
        document.getElementById('avgScore').textContent = avgScore;
    }

    function renderPastTests() {
        const container = document.getElementById('pastTestsContainer');
        if (!container) return;

        if (pastTests.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 12px;">
                    <i class="fas fa-inbox" style="font-size: 64px; color: #cbd5e1; margin-bottom: 16px;"></i>
                    <h3 style="color: #64748b; margin-bottom: 8px;">No Past Tests</h3>
                    <p style="color: #94a3b8;">Completed tests will appear here</p>
                </div>
            `;
            return;
        }

        const sortedTests = pastTests.sort((a, b) => new Date(b.date) - new Date(a.date));

        const html = sortedTests.map(test => {
            const colors = {
                'JAM': { bg: '#dbeafe', text: '#1e40af' },
                'GATE': { bg: '#d1fae5', text: '#065f46' },
                'Practice': { bg: '#fed7aa', text: '#92400e' }
            };
            const color = colors[test.examType] || colors.Practice;

            return `
                <div class="test-card" style="background: white; padding: 24px; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); cursor: pointer; transition: all 0.3s; border-left: 4px solid ${color.text};" 
                     onclick="viewTestResults(${test.id})">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                                <h3 style="margin: 0; font-size: 18px; font-weight: 600;">${test.name}</h3>
                                <span style="background: ${color.bg}; color: ${color.text}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                                    ${test.examType}
                                </span>
                            </div>
                            <div style="display: flex; gap: 24px; color: #64748b; font-size: 14px; margin-bottom: 16px;">
                                <div><i class="fas fa-calendar"></i> ${new Date(test.date).toLocaleDateString('en-IN')}</div>
                                <div><i class="fas fa-book"></i> ${test.subject}</div>
                                <div><i class="fas fa-users"></i> ${test.participants} students</div>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                                <div style="background: #f8fafc; padding: 12px; border-radius: 8px;">
                                    <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Average Score</div>
                                    <div style="font-size: 20px; font-weight: 700; color: #3b82f6;">${test.avgScore}%</div>
                                </div>
                                <div style="background: #f8fafc; padding: 12px; border-radius: 8px;">
                                    <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Highest Score</div>
                                    <div style="font-size: 20px; font-weight: 700; color: #10b981;">${test.maxScore}%</div>
                                </div>
                                <div style="background: #f8fafc; padding: 12px; border-radius: 8px;">
                                    <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Lowest Score</div>
                                    <div style="font-size: 20px; font-weight: 700; color: #f59e0b;">${test.minScore}%</div>
                                </div>
                            </div>
                        </div>
                        <button onclick="event.stopPropagation(); archiveTest(${test.id})" class="action-btn" title="Archive">
                            <i class="fas fa-archive"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    window.filterPastTests = function() {
        // Filter implementation
        renderPastTests();
    };

    window.viewTestResults = function(testId) {
        currentTestId = testId;
        const test = pastTests.find(t => t.id === testId);
        if (!test) return;
        
        const content = `
            <div style="line-height: 1.8;">
                <h3 style="margin-bottom: 24px;">${test.name}</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 24px;">
                    <div>
                        <p><strong>Subject:</strong> ${test.subject}</p>
                        <p><strong>Exam Type:</strong> ${test.examType}</p>
                        <p><strong>Date:</strong> ${new Date(test.date).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                        <p><strong>Participants:</strong> ${test.participants}</p>
                        <p><strong>Total Marks:</strong> ${test.totalMarks}</p>
                        <p><strong>Duration:</strong> ${test.duration} minutes</p>
                    </div>
                </div>
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px;">
                    <h4 style="margin-bottom: 16px;">Score Distribution</h4>
                    <div style="display: flex; gap: 16px;">
                        <div style="flex: 1; text-align: center; padding: 16px; background: white; border-radius: 8px;">
                            <div style="font-size: 28px; font-weight: 700; color: #3b82f6;">${test.avgScore}%</div>
                            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Average</div>
                        </div>
                        <div style="flex: 1; text-align: center; padding: 16px; background: white; border-radius: 8px;">
                            <div style="font-size: 28px; font-weight: 700; color: #10b981;">${test.maxScore}%</div>
                            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Highest</div>
                        </div>
                        <div style="flex: 1; text-align: center; padding: 16px; background: white; border-radius: 8px;">
                            <div style="font-size: 28px; font-weight: 700; color: #f59e0b;">${test.minScore}%</div>
                            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Lowest</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('testResultsContent').innerHTML = content;
        document.getElementById('testResultsModal').style.display = 'flex';
    };

    window.closeTestResultsModal = function() {
        document.getElementById('testResultsModal').style.display = 'none';
        currentTestId = null;
    };

    window.downloadTestResults = function() {
        alert('Downloading test results... (Feature coming soon)');
    };

    window.exportPastTestsReport = function() {
        alert('Exporting full report... (Feature coming soon)');
    };

    window.archiveTest = function(testId) {
        if (!confirm('Archive this test?')) return;
        alert('Test archived successfully!');
    };

})();
