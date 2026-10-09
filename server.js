// 🌍 CLOUD-READY DASHBOARD SERVER WITH AUTHENTICATION
// Access your bot dashboard from anywhere!

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// Password protection (change this to your own password!)
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'micro2024';

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Simple session storage (in-memory)
const sessions = new Map();

// Generate session token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Authentication middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Refresh session
  sessions.set(token, Date.now());
  next();
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  
  if (password === DASHBOARD_PASSWORD) {
    const token = generateToken();
    sessions.set(token, Date.now());
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, error: 'Invalid password' });
  }
});

// API endpoint to get bot stats
app.get('/api/stats', requireAuth, (req, res) => {
  try {
    const statsPath = path.join(__dirname, 'bot-stats.json');
    
    if (fs.existsSync(statsPath)) {
      const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
      res.json(stats);
    } else {
      res.json({
        totalVisits: 0,
        totalClicks: 0,
        totalJobClicks: 0,
        totalPages: 0,
        estimatedEarnings: 0,
        estimatedCommissions: 0,
        proxyUsage: {},
        sessionHistory: [],
        startTime: new Date(),
        isRunning: false,
        sessionsCompleted: 0,
        sessionsFailed: 0,
        mobileVisits: 0,
        desktopVisits: 0,
        iphoneVisits: 0,
        androidVisits: 0,
        ipadVisits: 0,
        windowsVisits: 0,
        macVisits: 0,
        linuxVisits: 0,
        returnVisitors: 0,
        todayClickRate: '0.0000'
      });
    }
  } catch (error) {
    console.error('Error reading stats:', error);
    res.status(500).json({ error: 'Failed to read stats' });
  }
});

// API endpoint to get proxy status
app.get('/api/proxies', requireAuth, (req, res) => {
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Clean up old sessions every hour
setInterval(() => {
  const oneHour = 60 * 60 * 1000;
  const now = Date.now();
  
  for (const [token, timestamp] of sessions.entries()) {
    if (now - timestamp > oneHour) {
      sessions.delete(token);
    }
  }
}, 60 * 60 * 1000);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n╔════════════════════════════════════════════════════════╗`);
  console.log(`║   🌍 CLOUD DASHBOARD SERVER STARTED!                 ║`);
  console.log(`╚════════════════════════════════════════════════════════╝`);
  console.log(`\n🌐 Local URL: http://localhost:${PORT}/login.html`);
  console.log(`🌍 Cloud URL: https://your-app.onrender.com/login.html`);
  console.log(`\n🔒 Dashboard Password: ${DASHBOARD_PASSWORD}`);
  console.log(`💡 Change password with DASHBOARD_PASSWORD env variable`);
  console.log(`\n📊 API Endpoint: /api/stats`);
  console.log(`🔄 Stats update automatically every 3 seconds\n`);
});
