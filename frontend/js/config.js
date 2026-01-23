/**
 * Centralized Configuration File
 * Created: 2025-12-28
 * Purpose: Easy switching between Railway and Hostinger
 * 
 * IMPORTANT: On January 2, 2025, update API_BASE_URL to Hostinger URL
 */

window.APP_CONFIG = {
    // Environment detection
    ENVIRONMENT: window.location.hostname.includes('localhost') ? 'development' : 'production',

    // API Base URL - CHANGE THIS ON JAN 2 TO HOSTINGER URL
    API_BASE_URL: (() => {
        const hostname = window.location.hostname;

        // Local development
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        }

        // Production - Currently Railway (CHANGE TO HOSTINGER ON JAN 2)
        // NEW HOSTINGER URL WILL BE: 'https://api.yourdomain.com'
        return 'https://iin-production.up.railway.app';
    })(),

    // Feature flags
    FEATURES: {
        ENABLE_AUTH: false,  // Set to true when authentication is ready
        ENABLE_REAL_TIME: false,  // WebSocket updates
        ENABLE_IMAGE_UPLOAD: true,
        DEBUG_MODE: window.location.hostname.includes('localhost')
    },

    // API Endpoints
    ENDPOINTS: {
        TESTS: '/api/admin/tests',
        QUESTIONS: '/api/admin/questions',
        STUDENTS: '/api/admin/students',
        TRANSACTIONS: '/api/admin/transactions',
        RESULTS: '/api/admin/results',
        UPLOAD_IMAGE: '/api/admin/upload-image',
        AUTH: '/api/admin/auth'
    },

    // App metadata
    APP_NAME: 'Vigyan.prep Admin Portal',
    VERSION: '1.0.0',
    BUILD_DATE: '2025-12-28',

    // Logging
    log: function (message, type = 'info') {
        if (this.FEATURES.DEBUG_MODE) {
            const emoji = {
                'info': 'ℹ️',
                'success': '✅',
                'warning': '⚠️',
                'error': '❌'
            };
            console.log(`${emoji[type]} [${this.APP_NAME}] ${message}`);
        }
    }
};

// Set global API_BASE_URL for backward compatibility
window.API_BASE_URL = window.APP_CONFIG.API_BASE_URL;

// Log initialization
console.log('🚀 App Configuration Loaded');
console.log('📍 Environment:', window.APP_CONFIG.ENVIRONMENT);
console.log('🌐 API URL:', window.APP_CONFIG.API_BASE_URL);
console.log('🔧 Debug Mode:', window.APP_CONFIG.FEATURES.DEBUG_MODE);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.APP_CONFIG;
}
