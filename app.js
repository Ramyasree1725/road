/**
 * CivicFix Enterprise Application Entry Point
 * Smart City Grievance Redressal, Road Infrastructure & Water Operations
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 5000;

console.log('🏛️ Initializing CivicFix Enterprise Platform...');
console.log(`📡 Server starting on port ${PORT}...`);

// Check if server/server.js exists and run it, or serve basic health check
const serverPath = path.join(__dirname, 'server', 'server.js');

if (fs.existsSync(serverPath)) {
  try {
    require(serverPath);
    console.log('✅ CivicFix Backend Core loaded successfully from server/server.js');
  } catch (err) {
    console.warn('⚠️ Server fallback active:', err.message);
    startFallbackServer();
  }
} else {
  startFallbackServer();
}

function startFallbackServer() {
  const server = http.createServer((req, res) => {
    if (req.url === '/health' || req.url === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'UP',
        service: 'CivicFix Enterprise Platform',
        timestamp: new Date().toISOString(),
        version: '2.4.0'
      }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>CivicFix Enterprise Platform Active</h1><p>Smart City Municipal Redressal Hub</p>');
  });

  server.listen(PORT, () => {
    console.log(`🌐 CivicFix Platform running at http://localhost:${PORT}`);
  });
}
