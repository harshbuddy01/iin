/**
 * Transactions Handler - FULLY FUNCTIONAL
 */

const mockTransactions = [
    { id: 'TXN001', student: 'Rahul Sharma', email: 'rahul@example.com', amount: 2999, date: '2025-12-20', status: 'Success', method: 'UPI', upiId: 'rahul@paytm' },
    { id: 'TXN002', student: 'Priya Patel', email: 'priya@example.com', amount: 2999, date: '2025-12-21', status: 'Success', method: 'Card', cardLast4: '4532' },
    { id: 'TXN003', student: 'Amit Kumar', email: 'amit@example.com', amount: 2999, date: '2025-12-22', status: 'Pending', method: 'UPI', upiId: 'amit@phonepe' },
    { id: 'TXN004', student: 'Neha Singh', email: 'neha@example.com', amount: 2999, date: '2025-12-23', status: 'Failed', method: 'Card', cardLast4: '8976', failReason: 'Insufficient funds' },
    { id: 'TXN005', student: 'Vikram Reddy', email: 'vikram@example.com', amount: 2999, date: '2025-12-24', status: 'Success', method: 'UPI', upiId: 'vikram@gpay' },
    { id: 'TXN006', student: 'Priya Patel', email: 'priya@example.com', amount: 1499, date: '2025-12-25', status: 'Success', method: 'Card', cardLast4: '4532' }
];

let transactionsData = [];

function initTransactions() {
    transactionsData = [...mockTransactions];
    renderTransactionsTable();
    
    document.getElementById('exportTransactions')?.addEventListener('click', () => {
        AdminUtils.exportToCSV(transactionsData.map(t => ({
            'Transaction ID': t.id,
            'Student': t.student,
            'Email': t.email,
            'Amount': t.amount,
            'Date': t.date,
            'Payment Method': t.method,
            'Status': t.status
        })), 'transactions.csv');
    });
}

function renderTransactionsTable() {
    const tbody = document.getElementById('transactionsTableBody');
    if (!tbody) return;
    
    if (transactionsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #64748b;"><i class="fas fa-receipt" style="font-size: 48px; opacity: 0.3; margin-bottom: 16px;"></i><br>No transactions found</td></tr>';
        return;
    }
    
    tbody.innerHTML = transactionsData.map(t => `
        <tr>
            <td><strong>${t.id}</strong></td>
            <td><strong>${t.student}</strong><br><small style="color: #64748b;">${t.email}</small></td>
            <td><strong>${AdminUtils.formatCurrency(t.amount)}</strong></td>
            <td>${AdminUtils.formatDate(t.date, 'short')}</td>
            <td><span class="payment-method"><i class="fas fa-${t.method === 'UPI' ? 'mobile-alt' : 'credit-card'}"></i> ${t.method}</span></td>
            <td><span class="status-badge status-${t.status.toLowerCase()}">${t.status}</span></td>
            <td>
                <button class="action-btn" onclick="viewTransactionDetails('${t.id}')" title="View Details"><i class="fas fa-eye"></i></button>
            </td>
        </tr>
    `).join('');
}

function viewTransactionDetails(id) {
    const transaction = transactionsData.find(t => t.id === id);
    if (!transaction) return;
    
    const paymentDetails = transaction.method === 'UPI' 
        ? `<p><strong>UPI ID:</strong> ${transaction.upiId}</p>`
        : `<p><strong>Card:</strong> **** **** **** ${transaction.cardLast4}</p>`;
    
    const failureInfo = transaction.status === 'Failed' 
        ? `<div style="background: #fee2e2; padding: 12px; border-radius: 8px; margin-top: 16px;"><p style="color: #991b1b; margin: 0;"><i class="fas fa-exclamation-triangle"></i> <strong>Failure Reason:</strong> ${transaction.failReason}</p></div>`
        : '';
    
    const modal = document.createElement('div');
    modal.className = 'confirm-modal-overlay';
    modal.innerHTML = `
        <div class="confirm-modal" style="max-width: 500px;">
            <div class="confirm-modal-header" style="text-align: left; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px;">
                <h3 style="font-size: 20px; color: #0f172a; margin: 0;"><i class="fas fa-receipt"></i> Transaction Details</h3>
            </div>
            <div class="confirm-modal-body" style="text-align: left; padding: 24px 0;">
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px;">
                    <div style="margin-bottom: 16px;">
                        <p style="color: #64748b; font-size: 12px; margin-bottom: 4px;">TRANSACTION ID</p>
                        <p style="font-weight: 700; font-size: 18px; color: #0f172a;">${transaction.id}</p>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <p style="color: #64748b; font-size: 12px; margin-bottom: 4px;">STUDENT</p>
                        <p style="font-weight: 600; color: #0f172a;">${transaction.student}</p>
                        <p style="color: #64748b; font-size: 14px;">${transaction.email}</p>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <p style="color: #64748b; font-size: 12px; margin-bottom: 4px;">AMOUNT</p>
                        <p style="font-weight: 700; font-size: 24px; color: #10b981;">${AdminUtils.formatCurrency(transaction.amount)}</p>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <p style="color: #64748b; font-size: 12px; margin-bottom: 4px;">DATE & TIME</p>
                        <p style="color: #0f172a;">${AdminUtils.formatDate(transaction.date)}</p>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <p style="color: #64748b; font-size: 12px; margin-bottom: 4px;">PAYMENT METHOD</p>
                        <span class="payment-method"><i class="fas fa-${transaction.method === 'UPI' ? 'mobile-alt' : 'credit-card'}"></i> ${transaction.method}</span>
                        <div style="margin-top: 8px; color: #0f172a;">${paymentDetails}</div>
                    </div>
                    <div>
                        <p style="color: #64748b; font-size: 12px; margin-bottom: 4px;">STATUS</p>
                        <span class="status-badge status-${transaction.status.toLowerCase()}">${transaction.status}</span>
                    </div>
                    ${failureInfo}
                </div>
            </div>
            <div class="confirm-modal-footer">
                <button class="btn-secondary" onclick="window.print()"><i class="fas fa-print"></i> Print Receipt</button>
                <button class="btn-primary" onclick="this.closest('.confirm-modal-overlay').remove()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

if (document.getElementById('transactionsTableBody')) {
    initTransactions();
}