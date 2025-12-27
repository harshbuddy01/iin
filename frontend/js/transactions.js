/**
 * Transactions Page - Complete Implementation
 */

function initTransactions() {
    console.log('Initializing Transactions page...');
    
    const container = document.getElementById('transactions-page');
    if (!container) return;
    
    container.innerHTML = `
        <div class="page-header" style="margin-bottom: 24px;">
            <h2>Transactions</h2>
            <p>View all payment transactions</p>
        </div>
        
        <div class="table-header">
            <div class="filter-bar">
                <select id="statusFilter" class="filter-select">
                    <option value="">All Status</option>
                    <option value="Success">Success</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                </select>
                
                <input type="text" id="searchTransactions" class="search-input" placeholder="Search transactions...">
            </div>
            
            <button class="export-btn" onclick="exportTransactions()">
                <i class="fas fa-download"></i> Export
            </button>
        </div>
        
        <div id="transactionsTableContainer"></div>
    `;
    
    loadTransactions();
    document.getElementById('statusFilter')?.addEventListener('change', loadTransactions);
    document.getElementById('searchTransactions')?.addEventListener('input', loadTransactions);
    
    console.log('✅ Transactions page initialized');
}

function loadTransactions() {
    const container = document.getElementById('transactionsTableContainer');
    if (!container) return;
    
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const searchText = document.getElementById('searchTransactions')?.value.toLowerCase() || '';
    
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    if (transactions.length === 0) {
        transactions = [
            { id: 'TXN001', studentName: 'Rahul Sharma', amount: 2999, status: 'Success', method: 'UPI', date: '2025-12-25' },
            { id: 'TXN002', studentName: 'Priya Patel', amount: 1999, status: 'Success', method: 'Card', date: '2025-12-26' },
            { id: 'TXN003', studentName: 'Amit Kumar', amount: 2999, status: 'Pending', method: 'NetBanking', date: '2025-12-27' }
        ];
    }
    
    let filteredTransactions = transactions.filter(t => {
        const matchesStatus = !statusFilter || t.status === statusFilter;
        const matchesSearch = !searchText || t.studentName.toLowerCase().includes(searchText) || t.id.toLowerCase().includes(searchText);
        return matchesStatus && matchesSearch;
    });
    
    if (filteredTransactions.length === 0) {
        container.innerHTML = '<div class="coming-soon">No transactions found.</div>';
        return;
    }
    
    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Transaction ID</th>
                    <th>Student Name</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${filteredTransactions.map(t => `
                    <tr>
                        <td><strong>${t.id}</strong></td>
                        <td>${t.studentName}</td>
                        <td><strong>₹${t.amount.toLocaleString()}</strong></td>
                        <td><span class="payment-method">${t.method}</span></td>
                        <td>${t.date}</td>
                        <td><span class="status-${t.status.toLowerCase()}">${t.status}</span></td>
                        <td>
                            <button class="action-btn" onclick="viewTransaction('${t.id}')" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function viewTransaction(id) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const txn = transactions.find(t => t.id === id);
    if (txn) {
        alert(`Transaction: ${txn.id}\nStudent: ${txn.studentName}\nAmount: ₹${txn.amount}\nStatus: ${txn.status}\nMethod: ${txn.method}\nDate: ${txn.date}`);
    }
}

function exportTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    if (typeof AdminUtils !== 'undefined') {
        AdminUtils.exportToCSV(transactions, 'transactions.csv');
    }
}

if (document.getElementById('transactions-page')) {
    initTransactions();
}