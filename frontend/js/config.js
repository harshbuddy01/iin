// ============================================
// API CONFIGURATION
// Sets the backend API URL for all API calls
// ============================================

// Set global API URL
// This is the Railway backend URL where your API is hosted
window.API_BASE_URL = 'https://iin-production.up.railway.app';

console.log('🔧 API Configuration loaded:', window.API_BASE_URL);

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_BASE_URL: window.API_BASE_URL };
}