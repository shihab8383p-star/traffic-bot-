// 🎯 REAL-TIME BOT MONITORING DASHBOARD SERVER
// Beautiful web interface to monitor traffic bot performance

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Serve static files
app.use(express.static(__dirname));

// API endpoint to get bot stats
app.get('/api/stats', (req, res) => {
  try {
    const statsPath = path.join(__dirname, 'bot-stats.json');
    
    if (fs.existsSync(statsPath)) {
      const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
      res.json(stats);
    } else {
      res.json({
        totalVisits: 0,
        totalClicks: 0,
        totalPages: 0,
        estimatedEarnings: 0,
        proxyUsage: {},
        sessionHistory: [],
        startTime: new Date(),
        isRunning: false
      });
    }
  } catch (error) {
    console.error('Error reading stats:', error);
    res.status(500).json({ error: 'Failed to read stats' });
  }
});

// API endpoint to get proxy status
app.get('/api/proxies', (req, res) => {
  try {
    const proxiesPath = path.join(__dirname, 'proxies.json');
    
    if (fs.existsSync(proxiesPath)) {
      const proxies = JSON.parse(fs.readFileSync(proxiesPath, 'utf8'));
      res.json(proxies);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error reading proxies:', error);
    res.status(500).json({ error: 'Failed to read proxies' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════╗`);
  console.log(`║   🎯 BOT DASHBOARD SERVER STARTED!                   ║`);
  console.log(`╚════════════════════════════════════════════════════════╝`);
  console.log(`\n🌐 Dashboard URL: http://localhost:${PORT}/dashboard.html`);
  console.log(`📊 API Endpoint: http://localhost:${PORT}/api/stats`);
  console.log(`\n💡 Open your browser and visit the dashboard URL!`);
  console.log(`🔄 Stats update every 3 seconds automatically\n`);
});
