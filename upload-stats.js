// Stats uploader - uploads stats to a simple API endpoint
// This allows Netlify dashboard to read stats from anywhere

const fs = require('fs');
const https = require('https');

class StatsUploader {
  constructor() {
    this.uploadUrl = process.env.STATS_UPLOAD_URL || null;
    this.uploadInterval = 60000; // Upload every 60 seconds
  }

  async uploadStats() {
    try {
      // Read local stats file
      if (!fs.existsSync('./bot-stats.json')) {
        console.log('No stats file found yet');
        return;
      }

      const stats = JSON.parse(fs.readFileSync('./bot-stats.json', 'utf8'));
      
      // For now, just log that we would upload
      // In production, you'd upload to a service like:
      // - Firebase Realtime Database (free)
      // - JSONbin.io (free)
      // - Your own simple API
      
      console.log(`📤 Stats ready for upload: ${stats.totalVisits} visits, ${stats.totalClicks} clicks`);
      
      // Save to a public directory that can be served
      fs.writeFileSync('./public-stats.json', JSON.stringify(stats, null, 2));
      
    } catch (error) {
      console.error('Error uploading stats:', error.message);
    }
  }

  start() {
    console.log('📤 Stats uploader started (every 60 seconds)');
    
    // Upload immediately
    this.uploadStats();
    
    // Then upload every interval
    setInterval(() => {
      this.uploadStats();
    }, this.uploadInterval);
  }
}

// Run if called directly
if (require.main === module) {
  const uploader = new StatsUploader();
  uploader.start();
  
  // Keep process alive
  process.on('SIGINT', () => {
    console.log('\n📤 Stats uploader stopped');
    process.exit(0);
  });
}

module.exports = StatsUploader;
