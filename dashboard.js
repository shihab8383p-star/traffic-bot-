// 📊 Real-Time Traffic Dashboard
// Monitor your bot performance in real-time

const fs = require('fs');

class Dashboard {
  constructor() {
    this.statsFile = 'traffic-bot/stats.json';
  }
  
  clearScreen() {
    console.clear();
  }
  
  loadStats() {
    try {
      if (fs.existsSync(this.statsFile)) {
        const data = fs.readFileSync(this.statsFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      // Ignore
    }
    return null;
  }
  
  formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
      return `${days}d ${remainingHours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else {
      return `${mins}m`;
    }
  }
  
  displayDashboard() {
    this.clearScreen();
    
    const statsData = this.loadStats();
    
    if (!statsData) {
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║        📊 TRAFFIC BOT DASHBOARD - WAITING...         ║');
      console.log('╚════════════════════════════════════════════════════════╝\n');
      console.log('   ⏳ Waiting for bot to start...');
      console.log('   💡 Run: node auto-clicker-bot.js\n');
      return;
    }
    
    const { stats, runtime, lastUpdate, config } = statsData;
    const timeSinceUpdate = Math.floor((Date.now() - new Date(lastUpdate)) / 1000);
    
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║          📊 TRAFFIC BOT DASHBOARD - LIVE              ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    // Status indicator
    const isActive = timeSinceUpdate < 120; // Active if updated within 2 minutes
    const statusEmoji = isActive ? '🟢' : '🔴';
    const statusText = isActive ? 'ACTIVE' : 'STOPPED';
    
    console.log(`   ${statusEmoji} Status: ${statusText}`);
    console.log(`   🕐 Last Update: ${timeSinceUpdate}s ago`);
    console.log(`   ⏱️  Runtime: ${this.formatTime(runtime)}\n`);
    
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   📈 TRAFFIC STATISTICS');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const pagesPerHour = runtime > 0 ? Math.floor(stats.totalPages / (runtime / 60)) : 0;
    const clickRate = stats.totalPages > 0 ? ((stats.totalClicks / stats.totalPages) * 100).toFixed(1) : 0;
    
    console.log(`   📄 Page Views: ${stats.totalPages.toLocaleString()}`);
    console.log(`   🖱️  Ad Clicks: ${stats.totalClicks.toLocaleString()} (${clickRate}% CTR)`);
    console.log(`   📊 Pages/Hour: ${pagesPerHour.toLocaleString()}`);
    console.log(`   🌍 Proxies Used: ${Object.keys(stats.proxyUsage || {}).length}\n`);
    
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   💰 EARNINGS REPORT');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const earnings = stats.estimatedEarnings || 0;
    const runtimeHours = runtime / 60;
    
    console.log(`   💵 Total Earned: $${earnings.toFixed(2)}`);
    
    if (runtimeHours > 0) {
      const hourlyRate = earnings / runtimeHours;
      const dailyProjection = hourlyRate * 24;
      const weeklyProjection = dailyProjection * 7;
      const monthlyProjection = dailyProjection * 30;
      
      console.log(`   ⚡ Hourly Rate: $${hourlyRate.toFixed(2)}/hr`);
      console.log(`   📅 Daily Projection: $${dailyProjection.toFixed(2)}/day`);
      console.log(`   📊 Weekly Projection: $${weeklyProjection.toFixed(2)}/week`);
      console.log(`   📆 Monthly Projection: $${monthlyProjection.toFixed(2)}/month\n`);
    }
    
    // Configuration info
    if (config) {
      console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('   ⚙️  CONFIGURATION');
      console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log(`   📱 Tabs/Session: ${config.simultaneousTabs}`);
      console.log(`   📄 Pages/Tab: 2-4`);
      console.log(`   💰 Ad Click Rate: ${(config.clickProbability * 100)}%`);
      console.log(`   ⏱️  Stay Time: ${config.minStayTime}-${config.maxStayTime}s\n`);
    }
    
    // Top proxies
    if (stats.proxyUsage && Object.keys(stats.proxyUsage).length > 0) {
      console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('   🏆 TOP PERFORMING PROXIES');
      console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      const sorted = Object.entries(stats.proxyUsage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      
      sorted.forEach(([host, count], i) => {
        const bar = '█'.repeat(Math.min(count, 20));
        console.log(`   ${i + 1}. ${host}: ${count} sessions ${bar}`);
      });
      console.log('');
    }
    
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   💡 Press Ctrl+C to exit dashboard');
    console.log('   🔄 Auto-refreshing every 10 seconds...\n');
  }
  
  start() {
    console.log('📊 Starting dashboard...\n');
    
    // Initial display
    this.displayDashboard();
    
    // Auto-refresh every 10 seconds
    setInterval(() => {
      this.displayDashboard();
    }, 10000);
    
    // Handle exit
    process.on('SIGINT', () => {
      console.log('\n\n👋 Dashboard closed!\n');
      process.exit(0);
    });
  }
}

// Run dashboard
if (require.main === module) {
  const dashboard = new Dashboard();
  dashboard.start();
}

module.exports = Dashboard;
