/**
 * Transactions Module - REAL DATA ONLY + PRICE MANAGEMENT
 * Updated: 2026-01-31 - Added secure price management UI
 */

let allTransactions = [];
let allTestSeries = []; // 🆕 Store test series data

function initTransactions() {
    console.log('📋 Initializing Transactions page...');
    renderTransactionsPage();
    loadTestSeries(); // 🆕 Load test series first
    loadTransactions();
}

function renderTransactionsPage() {
    const container = document.getElementById('transactions-page');
    if (!container) return;
    
    container.innerHTML = `
        <!-- 🔒 PRICE MANAGEMENT SECTION -->
        <div class="page-header">
            <h1><i class="fas fa-tag"></i> Price Management</h1>
            <p style="color: #64748b; margin-top: 8px;">🔒 Securely update test series prices - changes apply instantly to live checkout</p>
        </div>
        
        <div class="form-section" style="margin-bottom: 40px;">
            <h2><i class="fas fa-dollar-sign"></i> Update Test Series Pricing</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div class="form-group">
                    <label>Select Test Series</label>
                    <select id="priceTestSelect" style="width: 100%; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px;">
                        <option value="">Loading test series...</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Current Price</label>
                    <div id="currentPriceDisplay" style="padding: 12px 16px; background: #f1f5f9; border-radius: 8px; font-size: 18px; font-weight: 700; color: #10b981;">
                        Select a test series
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label>New Price (₹)</label>
                <input type="number" id="newPriceInput" 
                       placeholder="Enter new price (e.g., 199)" 
                       min="1" 
                       max="99999" 
                       step="1"
                       style="width: 100%; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px;">
                <small style="color: #64748b; margin-top: 4px; display: block;">🔒 Price must be between ₹1 and ₹99,999 (whole numbers only)</small>
            </div>
            
            <div style="display: flex; gap: 12px; align-items: center;">
                <button class="btn-success" onclick="updateTestPrice()">
                    <i class="fas fa-save"></i> Update Price
                </button>
                <button class="btn-secondary" onclick="viewPriceHistory()">
                    <i class="fas fa-history"></i> View Price History
                </button>
                <div id="priceUpdateStatus" style="flex: 1; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; display: none;"></div>
            </div>
        </div>
        
        <!-- TRANSACTIONS TABLE SECTION -->
        <div class="page-header" style="margin-top: 60px;">
            <h1><i class="fas fa-receipt"></i> Payment Transactions</h1>
            <p style="color: #64748b; margin-top: 8px;">View all payment transactions and revenue data</p>
        </div>
        
        <div style="display: flex; gap: 16px; margin-bottom: 24px; align-items: center;">
            <select id="statusFilter" style="padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px;">
                <option value="all">All Status</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
            </select>
            <input type="text" id="transactionSearch" placeholder="Search transactions..." 
                   style="flex: 1; padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px;">
            <button class="btn-primary" onclick="loadTransactions()">
                <i class="fas fa-sync"></i> Refresh
            </button>
        </div>
        
        <div class="card" style="overflow-x: auto;">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>TRANSACTION ID</th>
                        <th>STUDENT NAME</th>
                        <th>AMOUNT</th>
                        <th>PAYMENT METHOD</th>
                        <th>DATE</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody id="transactionsTableBody">
                    <tr><td colspan="7" style="text-align: center; padding: 40px; color: #94a3b8;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 24px;"></i><br>
                        Loading transactions from database...
                    </td></tr>
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('transactionSearch').addEventListener('input', applyFilters);
    
    // 🆕 Add event listener for test selection
    document.getElementById('priceTestSelect').addEventListener('change', onTestSelect);
}

// 🆕 LOAD TEST SERIES FROM BACKEND
async function loadTestSeries() {
    try {
        console.log('🔄 Fetching test series from backend...');
        
        // 🔒 SECURITY: Admin authentication required
        const response = await fetch(`${window.API_BASE_URL}/api/admin/test-series`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}` // Admin JWT
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to load test series');
        }
        
        allTestSeries = data.testSeries || [];
        console.log(`✅ Loaded ${allTestSeries.length} test series from database`);
        
        // Populate dropdown
        const dropdown = document.getElementById('priceTestSelect');
        if (dropdown) {
            if (allTestSeries.length === 0) {
                dropdown.innerHTML = '<option value="">No test series found</option>';
            } else {
                dropdown.innerHTML = '<option value="">-- Select a test series --</option>' +
                    allTestSeries.map(test => 
                        `<option value="${test.testId}">${test.name} (Current: ₹${test.price})</option>`
                    ).join('');
            }
        }
    } catch (error) {
        console.error('❌ Failed to load test series:', error);
        const dropdown = document.getElementById('priceTestSelect');
        if (dropdown) {
            dropdown.innerHTML = '<option value="">Error loading test series</option>';
        }
        showPriceStatus(`❌ Error: ${error.message}`, 'error');
    }
}

// 🆕 HANDLE TEST SELECTION
function onTestSelect() {
    const testId = document.getElementById('priceTestSelect').value;
    const display = document.getElementById('currentPriceDisplay');
    const input = document.getElementById('newPriceInput');
    
    if (!testId) {
        display.textContent = 'Select a test series';
        display.style.color = '#64748b';
        input.value = '';
        return;
    }
    
    const test = allTestSeries.find(t => t.testId === testId);
    if (test) {
        display.textContent = `₹${test.price.toLocaleString()}`;
        display.style.color = '#10b981';
        input.value = ''; // Clear input when switching tests
        input.placeholder = `Current price: ₹${test.price}`;
    }
}

// 🔒 UPDATE TEST PRICE (ADMIN ONLY)
async function updateTestPrice() {
    const testId = document.getElementById('priceTestSelect').value;
    const newPriceInput = document.getElementById('newPriceInput');
    const newPrice = parseInt(newPriceInput.value);
    
    // Validation
    if (!testId) {
        showPriceStatus('❌ Please select a test series', 'error');
        return;
    }
    
    if (!newPriceInput.value || isNaN(newPrice)) {
        showPriceStatus('❌ Please enter a valid price', 'error');
        return;
    }
    
    if (newPrice < 1 || newPrice > 99999) {
        showPriceStatus('❌ Price must be between ₹1 and ₹99,999', 'error');
        return;
    }
    
    if (!Number.isInteger(newPrice)) {
        showPriceStatus('❌ Price must be a whole number (no decimals)', 'error');
        return;
    }
    
    const test = allTestSeries.find(t => t.testId === testId);
    if (test && test.price === newPrice) {
        showPriceStatus(`❌ Price is already set to ₹${newPrice}`, 'error');
        return;
    }
    
    // Confirm action
    const testName = test ? test.name : testId;
    const oldPrice = test ? test.price : 'unknown';
    
    if (!confirm(`🔒 SECURITY CHECK\n\nUpdate price for "${testName}"?\n\nOld Price: ₹${oldPrice}\nNew Price: ₹${newPrice}\n\nThis change will apply IMMEDIATELY to live checkout.`)) {
        return;
    }
    
    showPriceStatus('⏳ Updating price...', 'loading');
    
    try {
        console.log(`💰 Updating price for ${testId}: ₹${newPrice}`);
        
        // 🔒 SECURITY: Admin authentication required
        const response = await fetch(`${window.API_BASE_URL}/api/admin/test-series/${testId}/price`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}` // Admin JWT
            },
            body: JSON.stringify({ price: newPrice })
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to update price');
        }
        
        console.log('✅ Price updated successfully:', data);
        
        // Update local cache
        const testIndex = allTestSeries.findIndex(t => t.testId === testId);
        if (testIndex !== -1) {
            allTestSeries[testIndex].price = newPrice;
        }
        
        // Update UI
        document.getElementById('currentPriceDisplay').textContent = `₹${newPrice.toLocaleString()}`;
        newPriceInput.value = '';
        newPriceInput.placeholder = `Current price: ₹${newPrice}`;
        
        // Refresh dropdown
        const dropdown = document.getElementById('priceTestSelect');
        const selectedValue = dropdown.value;
        dropdown.innerHTML = '<option value="">-- Select a test series --</option>' +
            allTestSeries.map(t => 
                `<option value="${t.testId}" ${t.testId === selectedValue ? 'selected' : ''}>${t.name} (Current: ₹${t.price})</option>`
            ).join('');
        
        showPriceStatus(`✅ Price updated to ₹${newPrice}! Changes are now live.`, 'success');
        
    } catch (error) {
        console.error('❌ Failed to update price:', error);
        showPriceStatus(`❌ Error: ${error.message}`, 'error');
    }
}

// 📄 VIEW PRICE HISTORY
async function viewPriceHistory() {
    const testId = document.getElementById('priceTestSelect').value;
    
    if (!testId) {
        alert('❌ Please select a test series first');
        return;
    }
    
    try {
        console.log(`📄 Fetching price history for ${testId}...`);
        
        // 🔒 SECURITY: Admin authentication required
        const response = await fetch(`${window.API_BASE_URL}/api/admin/test-series/${testId}/price-history`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}` // Admin JWT
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to load price history');
        }
        
        const history = data.history || [];
        console.log(`✅ Loaded ${history.length} price changes`);
        
        if (history.length === 0) {
            alert('📄 No price history found for this test series');
            return;
        }
        
        // Format history as a readable message
        const historyText = history.map((h, i) => 
            `${i + 1}. ${new Date(h.changedAt).toLocaleString()}\n` +
            `   ₹${h.oldPrice} → ₹${h.newPrice}\n` +
            `   By: ${h.changedBy}\n` +
            `   IP: ${h.ipAddress}`
        ).join('\n\n');
        
        alert(`📄 PRICE HISTORY\n\nTest: ${testId.toUpperCase()}\n\n${historyText}`);
        
    } catch (error) {
        console.error('❌ Failed to load price history:', error);
        alert(`❌ Error loading price history: ${error.message}`);
    }
}

// 💡 SHOW PRICE UPDATE STATUS
function showPriceStatus(message, type) {
    const statusEl = document.getElementById('priceUpdateStatus');
    if (!statusEl) return;
    
    statusEl.style.display = 'block';
    statusEl.textContent = message;
    
    if (type === 'success') {
        statusEl.style.background = '#d1fae5';
        statusEl.style.color = '#065f46';
        statusEl.style.border = '1px solid #10b981';
    } else if (type === 'error') {
        statusEl.style.background = '#fee2e2';
        statusEl.style.color = '#991b1b';
        statusEl.style.border = '1px solid #ef4444';
    } else if (type === 'loading') {
        statusEl.style.background = '#fef3c7';
        statusEl.style.color = '#92400e';
        statusEl.style.border = '1px solid #f59e0b';
    }
    
    // Auto-hide after 5 seconds
    if (type !== 'loading') {
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 5000);
    }
}

// TRANSACTIONS TABLE FUNCTIONS (unchanged)
async function loadTransactions() {
    try {
        console.log('🔄 Fetching transactions from backend...');
        const response = await fetch(`${window.API_BASE_URL}/api/admin/transactions`);
        const data = await response.json();
        
        allTransactions = data.transactions || [];
        console.log(`✅ Loaded ${allTransactions.length} real transactions from database`);
        displayTransactions(allTransactions);
    } catch (error) {
        console.error('❌ Failed to load transactions:', error);
        document.getElementById('transactionsTableBody').innerHTML = `
            <tr><td colspan="7" style="text-align: center; padding: 40px; color: #ef4444;">
                <i class="fas fa-exclamation-circle" style="font-size: 24px;"></i><br>
                Failed to load transactions. Check backend connection.
            </td></tr>
        `;
    }
}

function applyFilters() {
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('transactionSearch').value.toLowerCase();
    
    let filtered = allTransactions;
    
    if (status !== 'all') {
        filtered = filtered.filter(t => t.status === status);
    }
    
    if (search) {
        filtered = filtered.filter(t => 
            t.id.toLowerCase().includes(search) ||
            t.student.toLowerCase().includes(search) ||
            t.email.toLowerCase().includes(search)
        );
    }
    
    displayTransactions(filtered);
}

function displayTransactions(transactions) {
    const tbody = document.getElementById('transactionsTableBody');
    if (!tbody) return;
    
    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="7" style="text-align: center; padding: 40px; color: #94a3b8;">
                <i class="fas fa-receipt" style="font-size: 24px;"></i><br>
                No transactions found
            </td></tr>
        `;
        return;
    }
    
    tbody.innerHTML = transactions.map(txn => `
        <tr>
            <td><strong>${txn.id}</strong></td>
            <td>${txn.student}<br><small style="color: #94a3b8;">${txn.email}</small></td>
            <td><strong style="color: #10b981;">₹${txn.amount.toLocaleString()}</strong></td>
            <td>
                ${txn.method}<br>
                <small style="color: #94a3b8;">
                    ${txn.method === 'UPI' ? txn.upiId : txn.method === 'Card' ? `****${txn.cardLast4}` : 'NetBanking'}
                </small>
            </td>
            <td>${txn.date}</td>
            <td><span class="${txn.status === 'Success' ? 'status-active' : txn.status === 'Pending' ? 'badge' : 'status-inactive'}">${txn.status}</span></td>
            <td>
                <button class="action-btn" onclick="viewTransaction('${txn.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewTransaction(id) {
    const txn = allTransactions.find(t => t.id === id);
    if (!txn) return;
    
    alert(`Transaction Details:\n\nID: ${txn.id}\nStudent: ${txn.student}\nEmail: ${txn.email}\nAmount: ₹${txn.amount}\nMethod: ${txn.method}\nDate: ${txn.date}\nStatus: ${txn.status}`);
}

// Export functions
window.initTransactions = initTransactions;
window.viewTransaction = viewTransaction;
window.updateTestPrice = updateTestPrice;
window.viewPriceHistory = viewPriceHistory;
