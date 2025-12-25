// NewsAPI Configuration
// Get your free API key from: https://newsapi.org/register
// Free tier: 100 requests/day, 1-month history

const NEWSAPI_CONFIG = {
    apiKey: 'YOUR_NEWSAPI_KEY_HERE', // Replace with your actual API key
    baseUrl: 'https://newsapi.org/v2',
    category: 'science',
    language: 'en',
    pageSize: 12 // Number of articles to fetch
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NEWSAPI_CONFIG;
}

window.NEWSAPI_CONFIG = NEWSAPI_CONFIG;