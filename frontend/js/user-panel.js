// ============================================
// ULTRA-FAST USER PANEL SYSTEM
// Two-Layer Architecture:
// 1. Direct Rendering (Immediate - <100ms)
// 2. localStorage Persistence (Future-proof)
// ============================================

// LAYER 1: Direct Rendering Function (NO API CALL)
// Called immediately after payment with backend data
window.renderUserPanelDirect = function(userData) {
  console.log('⚡ DIRECT RENDER: Instant user panel with data:', userData);
  
  const navPlaceholder = document.getElementById("navLoginPlaceholder");
  if (!navPlaceholder) {
    console.error('❌ navLoginPlaceholder not found');
    return;
  }
  
  // Extract data
  const email = userData.email || '';
  const rollNumber = userData.rollNumber || 'N/A';
  const tests = userData.tests || [];
  
  // Render profile icon + dropdown INSTANTLY
  navPlaceholder.innerHTML = `
    <div class="relative">
      <button id="profileButton" class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg focus:outline-none hover:scale-110 transition-transform">
        <span class="text-white font-bold text-sm">${(email[0] || "U").toUpperCase()}</span>
      </button>
      <div id="profileDropdown" class="hidden absolute right-0 mt-3 w-72 bg-[#020617] border border-white/10 rounded-2xl shadow-2xl p-4 z-50">
        <div class="mb-4">
          <p class="text-xs text-gray-400 uppercase font-bold">Signed in as</p>
          <p class="text-sm text-white font-semibold truncate">${email}</p>
          <p class="text-[11px] text-blue-400 mt-1 font-semibold">Roll No: ${rollNumber}</p>
        </div>
        <div class="border-t border-white/10 pt-3 mb-3">
          <p class="text-[11px] text-gray-400 uppercase font-bold mb-2">Purchased Tests</p>
          ${tests.map(t => `
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
  
  // Attach event listeners
  attachProfileEventListeners();
  
  console.log('✅ User panel rendered INSTANTLY!');
};

// LAYER 2: Persistent Rendering Function (with API call)
// Called on page load to check localStorage + verify with backend
window.refreshUserDashboard = async function () {
  const email = localStorage.getItem("userEmail");
  
  console.log('🔍 Checking localStorage for userEmail:', email);
  
  if (!email) {
    console.log('ℹ️ No email in localStorage - user not logged in');
    return;
  }

  try {
    const base = window.API_BASE_URL || "https://iin-production.up.railway.app";
    console.log('📡 Fetching user status from backend:', `${base}/api/user-status?email=${email}`);
    
    const res = await axios.get(`${base}/api/user-status?email=${email}`);
    const data = res.data;
    
    console.log('✅ User data received from backend:', data);

    // Use direct render function with backend data
    window.renderUserPanelDirect({
      email: data.email,
      rollNumber: data.rollNumber,
      tests: data.tests
    });
    
  } catch (e) {
    console.error('❌ User panel error:', e);
    
    // If user not found in database (404), clear localStorage and force logout
    if (e.response && e.response.status === 404) {
      console.log('⚠️ User not found in database. Forcing logout...');
      localStorage.clear();
      alert('⚠️ Your account has been removed.\n\nPlease contact support.');
      window.location.href = "index.html";
    }
  }
};

// Helper: Attach event listeners to profile button and logout
function attachProfileEventListeners() {
  const btn = document.getElementById("profileButton");
  const dropdown = document.getElementById("profileDropdown");
  const logoutBtn = document.getElementById("logoutBtn");
  
  if (btn && dropdown) {
    // Toggle dropdown on click
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
  
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      console.log('🚪 Logging out...');
      localStorage.clear();
      window.location.href = "index.html";
    });
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUserPanel);
} else {
  initUserPanel();
}

window.addEventListener('load', initUserPanel);

function initUserPanel() {
  if (window.refreshUserDashboard) {
    window.refreshUserDashboard();
  }
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    refreshUserDashboard: window.refreshUserDashboard,
    renderUserPanelDirect: window.renderUserPanelDirect
  };
}