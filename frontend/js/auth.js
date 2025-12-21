document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName') || "Student";
    
    // Finds the button regardless of the class name used on the page
    const authButton = document.querySelector('.login-btn') || 
                       document.querySelector('.btn-login') || 
                       document.getElementById('loginBtn');

    if (isLoggedIn === 'true' && authButton) {
        // Replaces the Login button with the User Name and a Logout button
        authButton.outerHTML = `
            <div class="user-auth-panel">
                <span class="user-greeting-text">${userName}</span>
                <button onclick="triggerLogout()" class="logout-btn-universal">Logout</button>
            </div>
        `;
    }
});

function triggerLogout() {
    localStorage.clear(); // Removes all "Passes"
    window.location.href = 'index.html'; 
}