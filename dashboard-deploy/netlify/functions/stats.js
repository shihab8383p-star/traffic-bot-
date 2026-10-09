const https = require('https');

// Fetch stats from GitHub raw file
function fetchFromGitHub(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // GitHub raw file URL (you'll need to update this with your repo)
    // Format: https://raw.githubusercontent.com/USERNAME/REPO/main/traffic-bot/bot-stats.json
    const githubUrl = process.env.GITHUB_STATS_URL || 
                     'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/traffic-bot/bot-stats.json';
    
    // Try to fetch from GitHub
    try {
      const stats = await fetchFromGitHub(githubUrl);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(stats)
      };
    } catch (fetchError) {
      // If GitHub fetch fails, return default stats
      const defaultStats = {
        totalVisits: 0,
        totalClicks: 0,
        totalPages: 0,
        totalJobClicks: 0,
        mobileVisits: 0,
        desktopVisits: 0,
        iphoneVisits: 0,
        androidVisits: 0,
        ipadVisits: 0,
        windowsVisits: 0,
        macVisits: 0,
        linuxVisits: 0,
        returnVisitors: 0,
        estimatedEarnings: 0,
        estimatedCommissions: 0,
        startTime: new Date().toISOString(),
        proxyUsage: {},
        isRunning: true,
        todayClickRate: "10.475",
        sessionsCompleted: 0,
        sessionsFailed: 0,
        lastSession: null,
        lastUpdated: new Date().toISOString(),
        note: "Waiting for first stats sync from bot..."
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(defaultStats)
      };
    }
    
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
