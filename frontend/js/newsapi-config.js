// GNews API Configuration
// Free tier: 100 requests/day, instant activation, no CORS issues
// Documentation: https://gnews.io/docs/v4

const GNEWS_CONFIG = {
    apiKey: 'b3a2c0d6e4f8a9b1c2d3e4f5a6b7c8d9', // GNews API key (placeholder - get real one from gnews.io)
    baseUrl: 'https://gnews.io/api/v4',
    
    // Search parameters
    topic: 'science', // Topics: world, nation, business, technology, entertainment, sports, science, health
    language: 'en',    // Language code
    max: 10,           // Max articles per request (1-10 for free tier)
    expand: 'content'  // Get full content (optional)
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GNEWS_CONFIG;
}

window.GNEWS_CONFIG = GNEWS_CONFIG;