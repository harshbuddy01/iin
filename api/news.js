// Vercel Serverless Function to fetch NewsAPI data
// This bypasses CORS restrictions by making requests server-side

module.exports = async (req, res) => {
    // Enable CORS for your domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { category = 'science', language = 'en', pageSize = 50, page = 1 } = req.query;
        
        const API_KEY = 'ae81963351934c928bade0ee18de9c25';
        const url = `https://newsapi.org/v2/top-headlines?category=${category}&language=${language}&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
            res.status(200).json(data);
        } else {
            res.status(response.status).json(data);
        }
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: 'Failed to fetch news',
            error: error.message 
        });
    }
};