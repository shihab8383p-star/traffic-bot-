// Auto-sync stats to GitHub every minute
// This allows the Netlify dashboard to read real-time stats

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

class GitHubStatsSyncer {
  constructor() {
    this.syncInterval = 60000; // Sync every 60 seconds
    this.statsFile = './bot-stats.json';
    this.repoPath = path.dirname(__filename);
  }

  async syncStats() {
    try {
      // Check if stats file exists
      if (!fs.existsSync(this.statsFile)) {
        console.log('⏳ Waiting for bot to create stats file...');
        return;
      }

      const stats = JSON.parse(fs.readFileSync(this.statsFile, 'utf8'));
      
      console.log(`\n📊 Syncing stats to GitHub...`);
      console.log(`   Visits: ${stats.totalVisits}, Clicks: ${stats.totalClicks}, Earnings: $${(stats.estimatedEarnings + stats.estimatedCommissions).toFixed(2)}`);
      
      // Git commands to sync
      try {
        // Add the stats file
        execSync('git add bot-stats.json', { cwd: this.repoPath, stdio: 'pipe' });
        
        // Commit with timestamp
        const timestamp = new Date().toLocaleString();
        execSync(`git commit -m "Update stats: ${timestamp}"`, { cwd: this.repoPath, stdio: 'pipe' });
        
        // Push to GitHub
        execSync('git push origin main', { cwd: this.repoPath, stdio: 'pipe' });
        
        console.log(`   ✅ Stats synced successfully!`);
        
      } catch (gitError) {
        // If no changes, git commit will fail - that's okay
        if (gitError.message.includes('nothing to commit')) {
          console.log(`   ℹ️  No changes to sync`);
        } else {
          throw gitError;
        }
      }
      
    } catch (error) {
      console.error(`   ❌ Sync error: ${error.message}`);
    }
  }

  start() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║       📤 GITHUB STATS SYNCER STARTED                 ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log('🔄 Syncing stats to GitHub every 60 seconds');
    console.log('📊 Dashboard will show real-time data from GitHub\n');
    
    // Sync immediately
    this.syncStats();
    
    // Then sync every interval
    setInterval(() => {
      this.syncStats();
    }, this.syncInterval);
  }
}

// Run if called directly
if (require.main === module) {
  const syncer = new GitHubStatsSyncer();
  syncer.start();
  
  // Keep process alive
  process.on('SIGINT', () => {
    console.log('\n\n📤 GitHub syncer stopped');
    process.exit(0);
  });
}

module.exports = GitHubStatsSyncer;
