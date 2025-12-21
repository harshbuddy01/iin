// API Configuration
const API_BASE_URL = "https://iin-production.up.railway.app";

// Test Series Configuration
const TEST_SERIES = [
  { id: 'iat', name: 'IAT SERIES', price: 199 },
  { id: 'nest', name: 'NEST SERIES', price: 199 },
  { id: 'isi', name: 'ISI SERIES', price: 199 }
];

// Export for use in other files
window.APP_CONFIG = {
  API_BASE_URL,
  TEST_SERIES
};