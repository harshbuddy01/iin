document.addEventListener('DOMContentLoaded', () => {
    checkUserSession();
});

function checkUserSession() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userEmail = localStorage.getItem("userEmail");
    const userToken = localStorage.getItem("userToken"); // Roll Number

    // Target the specific Login button or container
    // We look for the '.btn-login' we added to the HTML
    const loginBtn = document.querySelector('.btn-login');
    const navLinks = document.querySelector('.nav-links');

    if (isLoggedIn === "true" && userEmail && navLinks) {
        // 1. Remove the Login Button if it exists
        if (loginBtn) loginBtn.remove();

        // 2. Create the User Panel HTML
        const panelDiv = document.createElement('div');
        panelDiv.className = 'user-dropdown-container';
        panelDiv.innerHTML = `
            <button class="user-btn" onclick="toggleUserMenu()">
                <i class="fas fa-user-circle"></i> ${userEmail.split('@')[0]}...
            </button>
            <div class="user-dropdown-menu" id="userMenu">
                <div class="user-info">
                    <div class="user-email">${userEmail}</div>
                    <div class="user-roll">🎓 Roll: ${userToken}</div>
                </div>
                <hr>
                <a href="testfirstpage.html" class="menu-item"><i class="fas fa-book"></i> My Tests</a>
                <button onclick="logoutUser()" class="menu-item logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</button>
            </div>
        `;

        // 3. Add to Navbar
        navLinks.appendChild(panelDiv);
    }
}

// Toggle the dropdown menu
window.toggleUserMenu = function() {
    const menu = document.getElementById('userMenu');
    if (menu) menu.classList.toggle('active');
}

// Close menu if clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-dropdown-container')) {
        const menu = document.getElementById('userMenu');
        if (menu) menu.classList.remove('active');
    }
});

// Logout Logic
window.logoutUser = function() {
    // Clear all data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userToken");
    localStorage.removeItem("purchasedTests");
    
    // Refresh page to show Login button again
    window.location.reload();
}