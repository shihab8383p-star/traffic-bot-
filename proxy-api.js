// 🌐 PROXY API SERVER - Central Proxy Storage
// All traffic bots fetch proxies from here
// Proxy finder updates this every 2 minutes

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 🔒 Simple API key for security (optional)
// Default key works out of the box - change in Railway environment variables for production
const API_KEY = process.env.API_KEY || 'super-secret-key-123';

// 💾 In-memory proxy storage
let proxyPool = {
  proxies: [],
  lastUpdate: new Date().toISOString(),
  totalProxies: 0,
  updateCount: 0
};

// Middleware
app.use(express.json({ limit: '10mb' }));

// CORS - Allow all traffic bots to access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

// 📊 Root endpoint - API info
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Proxy API Server',
    endpoints: {
      getProxies: 'GET /proxies',
      updateProxies: 'POST /proxies',
      stats: 'GET /stats'
    },
    currentProxies: proxyPool.totalProxies,
    lastUpdate: proxyPool.lastUpdate
  });
});

// ✅ GET /proxies - Traffic bots fetch proxies
app.get('/proxies', (req, res) => {
  console.log(`📥 Proxy fetch request from ${req.ip}`);
  
  if (proxyPool.proxies.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No proxies available yet',
      proxies: []
    });
  }
  
  res.json({
    success: true,
    proxies: proxyPool.proxies,
    totalProxies: proxyPool.totalProxies,
    lastUpdate: proxyPool.lastUpdate
  });
  
  console.log(`✅ Sent ${proxyPool.totalProxies} proxies`);
});

// 📤 POST /proxies - Proxy finder updates proxies
app.post('/proxies', (req, res) => {
  // Simple API key check (optional)
  const apiKey = req.headers['x-api-key'];
  if (API_KEY && apiKey !== API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
  }
  
  const { proxies } = req.body;
  
  if (!proxies || !Array.isArray(proxies)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid proxy data'
    });
  }
  
  // Update proxy pool
  proxyPool = {
    proxies: proxies,
    lastUpdate: new Date().toISOString(),
    totalProxies: proxies.length,
    updateCount: proxyPool.updateCount + 1
  };
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📤 Proxy update #${proxyPool.updateCount}`);
  console.log(`✅ Received ${proxies.length} working proxies`);
  console.log(`⏰ Updated at: ${proxyPool.lastUpdate}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  res.json({
    success: true,
    message: 'Proxies updated successfully',
    totalProxies: proxyPool.totalProxies,
    updateCount: proxyPool.updateCount
  });
});

// 📊 GET /stats - API statistics
app.get('/stats', (req, res) => {
  const uptime = process.uptime();
  
  res.json({
    status: 'online',
    uptime: `${Math.floor(uptime / 60)} minutes`,
    totalProxies: proxyPool.totalProxies,
    lastUpdate: proxyPool.lastUpdate,
    updateCount: proxyPool.updateCount,
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start server
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║         🌐 PROXY API SERVER STARTED 🌐               ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📊 Endpoints:`);
  console.log(`   GET  /proxies - Fetch proxy list`);
  console.log(`   POST /proxies - Update proxy list`);
  console.log(`   GET  /stats   - API statistics`);
  console.log(`\n💡 Waiting for proxy updates...\n`);
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});
