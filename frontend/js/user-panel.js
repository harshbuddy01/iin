// Immediately check on script load (before DOMContentLoaded)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUserPanel);
} else {
  // DOM already loaded
  initUserPanel();
}

// Also run on window load as backup
window.addEventListener('load', initUserPanel);

function initUserPanel() {
  if (window.refreshUserDashboard) {
    window.refreshUserDashboard();
  }
}

window.refreshUserDashboard = async function () {
  const email = localStorage.getItem("userEmail");
  
  // Log for debugging
  console.log('🔍 Checking localStorage for userEmail:', email);
  
  if (!email) {
    console.log('❌ No email found in localStorage');
    return;
  }

  try {
    const base = window.API_BASE_URL || "https://iin-production.up.railway.app";
    console.log('📡 Fetching user status from:', `${base}/api/user-status?email=${email}`);
    
    const res = await axios.get(`${base}/api/user-status?email=${email}`);
    const data = res.data;
    
    console.log('✅ User data received:', data);

    // Replace login button with profile icon + dropdown
    const navPlaceholder = document.getElementById("navLoginPlaceholder");
    if (!navPlaceholder) {
      console.log('❌ navLoginPlaceholder not found');
      return;
    }
    
    console.log('🎨 Rendering user panel...');

    navPlaceholder.innerHTML = `
      <div class="relative">
        <button id="profileButton" class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg focus:outline-none hover:scale-110 transition-transform">
          <span class="text-white font-bold text-sm">${(data.email[0] || "S").toUpperCase()}</span>
        </button>
        <div id="profileDropdown" class="hidden absolute right-0 mt-3 w-72 bg-[#020617] border border-white/10 rounded-2xl shadow-2xl p-4 z-50">
          <div class="mb-4">
            <p class="text-xs text-gray-400 uppercase font-bold">Signed in as</p>
            <p class="text-sm text-white font-semibold truncate">${data.email}</p>
            <p class="text-[11px] text-blue-400 mt-1 font-semibold">Roll No: ${data.rollNumber}</p>
          </div>
          <div class="border-t border-white/10 pt-3 mb-3">
            <p class="text-[11px] text-gray-400 uppercase font-bold mb-2">Purchased Tests</p>
            ${data.tests.map(t => `
              <div class="flex items-center justify-between text-xs mb-2">
                <span class="${
                  t === "iat" ? "text-green-400" : 
                  t === "nest" ? "text-purple-400" : 
                  t === "isi" ? "text-pink-400" : 
                  "text-blue-400"
                } font-semibold">
                  <i class="fas fa-check-circle mr-1"></i> ${t.toUpperCase()} Series
                </span>
              </div>
            `).join("")}
          </div>
          <button id="logoutBtn" class="w-full py-2 rounded-xl bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition">
            <i class="fas fa-sign-out-alt mr-2"></i> Logout
          </button>
        </div>
      </div>
    `;

    // Toggle dropdown
    const btn = document.getElementById("profileButton");
    const dropdown = document.getElementById("profileDropdown");
    if (btn && dropdown) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("hidden");
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.classList.add('hidden');
        }
      });
    }

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        console.log('🚺 Logging out...');
        localStorage.clear();
        window.location.href = "index.html";
      });
    }
    
    console.log('✅ User panel rendered successfully');
  } catch (e) {
    console.error('❌ User panel error:', e);
    
    // CRITICAL FIX: If user not found in database (404), clear localStorage and force logout
    if (e.response && e.response.status === 404) {
      console.log('⚠️ User not found in database. Deleted by admin. Forcing logout...');
      
      // Clear all localStorage
      localStorage.clear();
      
      // Show alert to user
      alert('⚠️ Your account has been removed from the system.\n\nPlease contact support if you believe this is an error.');
      
      // Redirect to home page
      window.location.href = "index.html";
    }
  }
};

// Export for global access
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { refreshUserDashboard: window.refreshUserDashboard };
}