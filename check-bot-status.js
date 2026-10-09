// Quick script to check bot status and stats

const fs = require('fs');
const { execSync } = require('child_process');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║           🔍 BOT STATUS CHECKER                       ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Check if Node.js process is running
console.log('1️⃣  Checking if bot is running...');
try {
  const processes = execSync('tasklist /FI "IMAGENAME eq node.exe" /FO CSV', { encoding: 'utf8' });
  const nodeProcesses = processes.split('\n').filter(line => line.includes('node.exe'));
  
  if (nodeProcesses.length > 1) {
    console.log(`   ✅ Bot is RUNNING (${nodeProcesses.length - 1} Node processes found)`);
  } else {
    console.log('   ❌ Bot is NOT running');
    console.log('   💡 Start it with: npm run bot\n');
    process.exit(0);
  }
} catch (error) {
  console.log('   ⚠️  Could not check process status');
}

// Check stats file
console.log('\n2️⃣  Checking bot statistics...');
try {
  if (fs.existsSync('./bot-stats.json')) {
    const stats = JSON.parse(fs.readFileSync('./bot-stats.json', 'utf8'));
    const runtime = Math.floor((new Date() - new Date(stats.stats.startTime)) / 1000 / 60);
    const runtimeHours = Math.floor(runtime / 60);
    const runtimeMins = runtime % 60;
    
    console.log('   ✅ Stats file found!\n');
    console.log('   📊 CURRENT STATISTICS:');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   ⏱️  Runtime: ${runtimeHours}h ${runtimeMins}m`);
    console.log(`   📄 Total Pages: ${stats.stats.totalPages || 0}`);
    console.log(`   🖱️  Total Clicks: ${stats.stats.totalClicks || 0}`);
    console.log(`   🎯 Job Clicks: ${stats.stats.totalJobClicks || 0}`);
    console.log(`   💰 Ad Clicks: ${(stats.stats.totalClicks || 0) - (stats.stats.totalJobClicks || 0)}`);
    console.log(`   ✅ Sessions Completed: ${stats.stats.sessionsCompleted || 0}`);
    console.log(`   ❌ Sessions Failed: ${stats.stats.sessionsFailed || 0}`);
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   📱 Mobile Visits: ${stats.stats.mobileVisits || 0}`);
    console.log(`   💻 Desktop Visits: ${stats.stats.desktopVisits || 0}`);
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   💵 Estimated Earnings: $${(stats.stats.estimatedEarnings || 0).toFixed(2)}`);
    console.log(`   💰 Commission Earnings: $${(stats.stats.estimatedCommissions || 0).toFixed(2)}`);
    console.log(`   🔥 TOTAL: $${((stats.stats.estimatedEarnings || 0) + (stats.stats.estimatedCommissions || 0)).toFixed(2)}`);
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (stats.stats.lastSession) {
      console.log(`\n   🕐 Last Session: ${new Date(stats.stats.lastSession.timestamp).toLocaleString()}`);
      console.log(`   🌍 Last Proxy: ${stats.stats.lastSession.proxy}`);
    }
    
    const timeSinceUpdate = Math.floor((new Date() - new Date(stats.lastUpdate)) / 1000);
    if (timeSinceUpdate < 300) {
      console.log(`\n   ✅ Bot is ACTIVELY working (last update ${timeSinceUpdate}s ago)`);
    } else {
      console.log(`\n   ⚠️  Bot may be idle (last update ${Math.floor(timeSinceUpdate/60)} minutes ago)`);
    }
    
  } else {
    console.log('   ⚠️  No stats file found yet (bot just started?)');
  }
} catch (error) {
  console.log('   ❌ Error reading stats:', error.message);
}

// Check proxy file
console.log('\n3️⃣  Checking proxies...');
try {
  if (fs.existsSync('./proxies.json')) {
    const proxies = JSON.parse(fs.readFileSync('./proxies.json', 'utf8'));
    console.log(`   ✅ ${proxies.proxies.length} proxies configured`);
  } else {
    console.log('   ⚠️  No proxy file found');
  }
} catch (error) {
  console.log('   ❌ Error reading proxies');
}

console.log('\n✅ Status check complete!\n');
console.log('💡 Tips:');
console.log('   • Run this script anytime: node check-bot-status.js');
console.log('   • View live output: Check the terminal where bot is running');
console.log('   • Stop bot: Press Ctrl+C in the bot terminal\n');
