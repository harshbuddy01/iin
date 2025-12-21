// User Panel - Navbar Dropdown Component
// This file handles the user panel UI and functionality

// Initialize user panel on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeUserPanel();
});

function initializeUserPanel() {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  // Check if user is logged in
  if (window.AUTH.isLoggedIn()) {
    showUserPanel(navLinks);
  } else {
    showLoginButton(navLinks);
  }
}

// Show login button (when not logged in)
function showLoginButton(navLinks) {
  // Remove user panel if exists
  const existingPanel = navLinks.querySelector('.user-panel-container');
  if (existingPanel) {
    existingPanel.remove();
  }

  // Check if login button already exists
  if (navLinks.querySelector('.btn-login')) return;

  // Add login button
  const loginBtn = document.createElement('a');
  loginBtn.href = 'signinpage.html';
  loginBtn.className = 'btn-login';
  loginBtn.textContent = 'Login';
  navLinks.appendChild(loginBtn);
}

// Show user panel (when logged in)
function showUserPanel(navLinks) {
  // Remove login button if exists
  const loginBtn = navLinks.querySelector('.btn-login');
  if (loginBtn) {
    loginBtn.remove();
  }

  // Check if user panel already exists
  if (navLinks.querySelector('.user-panel-container')) return;

  const user = window.AUTH.getCurrentUser();
  const allTests = window.APP_CONFIG.TEST_SERIES;

  // Create user panel container
  const panelContainer = document.createElement('div');
  panelContainer.className = 'user-panel-container';

  // Create user icon
  const userIcon = document.createElement('div');
  userIcon.className = 'user-icon';
  userIcon.innerHTML = '<i class="fas fa-user"></i>';
  userIcon.onclick = toggleDropdown;

  // Create dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'user-dropdown';
  dropdown.id = 'userDropdown';

  // User info section
  const userInfo = document.createElement('div');
  userInfo.className = 'user-info';
  userInfo.innerHTML = `
    <div class="user-email"><i class="fas fa-envelope" style="margin-right: 8px; color: rgba(255,255,255,0.5);"></i>${user.email}</div>
    <div class="user-roll-label">Roll Number</div>
    <div class="user-roll">${user.rollNumber}</div>
  `;

  // Purchased tests section
  const purchasedSection = document.createElement('div');
  purchasedSection.className = 'purchased-tests';
  
  let testsHTML = '<div class="purchased-tests-title">Your Tests</div>';
  
  allTests.forEach(test => {
    const owned = user.purchasedTests.includes(test.id);
    testsHTML += `
      <div class="test-item ${owned ? 'owned' : 'not-owned'}">
        <i class="fas ${owned ? 'fa-check-circle' : 'fa-circle'}"></i>
        <span>${test.name}</span>
      </div>
    `;
  });
  
  purchasedSection.innerHTML = testsHTML;

  // Logout button
  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'logout-btn';
  logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
  logoutBtn.onclick = handleLogout;

  // Assemble dropdown
  dropdown.appendChild(userInfo);
  dropdown.appendChild(purchasedSection);
  dropdown.appendChild(logoutBtn);

  // Assemble panel
  panelContainer.appendChild(userIcon);
  panelContainer.appendChild(dropdown);

  // Add to navbar
  navLinks.appendChild(panelContainer);

  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    const panel = document.querySelector('.user-panel-container');
    if (panel && !panel.contains(event.target)) {
      closeDropdown();
    }
  });
}

// Toggle dropdown visibility
function toggleDropdown() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
}

// Close dropdown
function closeDropdown() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    dropdown.classList.remove('active');
  }
}

// Handle logout
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    window.AUTH.logoutUser();
  }
}

// Refresh user panel (call this after purchase)
function refreshUserPanel() {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  // Remove existing panel
  const existingPanel = navLinks.querySelector('.user-panel-container');
  if (existingPanel) {
    existingPanel.remove();
  }

  // Reinitialize
  if (window.AUTH.isLoggedIn()) {
    showUserPanel(navLinks);
  }
}

// Export for global access
window.USER_PANEL = {
  refresh: refreshUserPanel,
  toggleDropdown,
  closeDropdown
};