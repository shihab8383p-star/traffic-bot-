// Main Orchestrator - Runs all traffic bots 24/7
// Targets Tier 1 countries (USA, UK, Canada, Australia) for maximum revenue

const RedditBot = require('./reddit-bot');
const TwitterBot = require('./twitter-bot');
const PinterestBot = require('./pinterest-bot');
const fs = require('fs');

class TrafficBotOrchestrator {
  constructor() {
    this.config = this.loadConfig();
    this.bots = {
      reddit: new RedditBot(this.config),
      twitter: new TwitterBot(this.config),
      pinterest: new PinterestBot(this.config)
    };
    
    // Schedule configuration (in hours)
    this.schedules = {
      reddit: 6,      // Run Reddit bot every 6 hours
      twitter: 4,     // Run Twitter bot every 4 hours  
      pinterest: 12   // Run Pinterest bot every 12 hours
    };
    
    this.isRunning = false;
    this.stats = {
      totalRuns: 0,
      successfulPosts: 0,
      failedPosts: 0,
      startTime: new Date(),
      estimatedClicks: 0
    };
  }
  
  // Load configuration
  loadConfig() {
    try {
      const configPath = './traffic-bot/config.json';
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log('✅ Configuration loaded successfully!');
        return config;
      } else {
        console.error('❌ Configuration file not found! Please create config.json');
        console.log('\n📝 Run: node setup-config.js to create your configuration\n');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Failed to load configuration:', error.message);
      process.exit(1);
    }
  }
  
  // Start the 24/7 bot system
  async start() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║    🚀 AI Traffic Bot System - Starting...            ║');
    console.log('║    Targeting Tier 1 Countries: USA, UK, CA, AU       ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    console.log('📊 Configuration:');
    console.log(`   Website: ${this.config.websiteUrl}`);
    console.log(`   Reddit: ${this.config.reddit.username ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`   Twitter: ${this.config.twitter.bearerToken ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`   Pinterest: ${this.config.pinterest.accessToken ? '✅ Configured' : '❌ Not configured'}`);
    console.log('');
    
    this.isRunning = true;
    
    // Start bot schedulers
    this.scheduleBot('reddit', this.schedules.reddit);
    this.scheduleBot('twitter', this.schedules.twitter);
    this.scheduleBot('pinterest', this.schedules.pinterest);
    
    // Display stats every hour
    setInterval(() => this.displayStats(), 60 * 60 * 1000);
    
    // Keep process running
    console.log('✅ Bot system is running 24/7!');
    console.log('💡 Press Ctrl+C to stop\n');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());
  }
  
  // Schedule individual bot
  scheduleBot(botName, intervalHours) {
    const bot = this.bots[botName];
    
    // Run immediately on start
    this.runBot(botName, bot);
    
    // Then run on schedule
    setInterval(async () => {
      await this.runBot(botName, bot);
    }, intervalHours * 60 * 60 * 1000);
  }
  
  // Run a specific bot
  async runBot(botName, bot) {
    try {
      console.log(`\n⚡ Running ${botName.toUpperCase()} Bot...`);
      console.log(`   Time: ${new Date().toLocaleString()}`);
      console.log(`   Next run in: ${this.schedules[botName]} hours\n`);
      
      await bot.run();
      
      this.stats.totalRuns++;
      this.stats.successfulPosts++;
      this.stats.estimatedClicks += this.estimateClicks(botName);
      
      console.log(`✅ ${botName.toUpperCase()} Bot completed successfully!\n`);
    } catch (error) {
      console.error(`❌ ${botName.toUpperCase()} Bot failed:`, error.message);
      this.stats.failedPosts++;
    }
    
    this.saveStats();
  }
  
  // Estimate clicks based on platform (rough estimates)
  estimateClicks(botName) {
    const estimates = {
      reddit: 50,      // Reddit posts typically get 50+ clicks
      twitter: 20,     // Tweets get 20+ clicks
      pinterest: 100   // Pinterest pins get 100+ clicks (very high engagement)
    };
    
    return estimates[botName] || 0;
  }
  
  // Display statistics
  displayStats() {
    const runtime = Math.floor((new Date() - this.stats.startTime) / 1000 / 60 / 60);
    const clicksPerHour = runtime > 0 ? Math.floor(this.stats.estimatedClicks / runtime) : 0;
    
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║           📊 TRAFFIC BOT STATISTICS                   ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`   Runtime: ${runtime} hours`);
    console.log(`   Total bot runs: ${this.stats.totalRuns}`);
    console.log(`   Successful posts: ${this.stats.successfulPosts}`);
    console.log(`   Failed posts: ${this.stats.failedPosts}`);
    console.log(`   Estimated clicks: ${this.stats.estimatedClicks}`);
    console.log(`   Clicks per hour: ${clicksPerHour}`);
    console.log('');
    
    // Revenue estimate (assuming $2-5 CPM for Tier 1 Monetag)
    const estimatedRevenue = (this.stats.estimatedClicks / 1000) * 3.5;
    console.log(`   💰 Estimated Revenue: $${estimatedRevenue.toFixed(2)}`);
    console.log(`   💵 Projected Monthly: $${(estimatedRevenue * 30).toFixed(2)}`);
    console.log('');
  }
  
  // Save statistics to file
  saveStats() {
    try {
      const statsFile = './traffic-bot/stats.json';
      fs.writeFileSync(statsFile, JSON.stringify(this.stats, null, 2));
    } catch (error) {
      console.error('Failed to save stats:', error.message);
    }
  }
  
  // Stop the bot system
  stop() {
    console.log('\n\n🛑 Stopping Traffic Bot System...');
    this.displayStats();
    this.isRunning = false;
    console.log('✅ Bots stopped successfully!');
    process.exit(0);
  }
}

// Start the system
if (require.main === module) {
  const orchestrator = new TrafficBotOrchestrator();
  orchestrator.start();
}

module.exports = TrafficBotOrchestrator;
