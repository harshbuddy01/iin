// ============================================
// API CONFIGURATION
// Loads API URL from Vercel environment variable
// ============================================

// Get API URL from Vercel environment variable
// In Vercel, environment variables are injected at build time
const getApiUrl = () => {
  // Check if running in Vercel (environment variable will be replaced at build time)
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // For static HTML deployment, check meta tag
  const metaTag = document.querySelector('meta[name="api-url"]');
  if (metaTag) {
    return metaTag.getAttribute('content');
  }
  
  // Default fallback to Railway
  return 'https://iin-production.up.railway.app';
};

// Set global API URL
window.API_BASE_URL = getApiUrl();

console.log('🔧 API Configuration loaded:', window.API_BASE_URL);

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_BASE_URL: window.API_BASE_URL };
}