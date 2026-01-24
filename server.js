import http from 'http';

const PORT = process.env.PORT || 3000;

console.log('Starting Dependency-Free Root Server (Fallback)...');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Dependency-Free Server (server.js) is RUNNING');
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Native Server running on port ${PORT}`);
});
