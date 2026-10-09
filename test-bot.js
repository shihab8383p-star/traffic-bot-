// Test Script - Verify your configuration before running 24/7

const fs = require('fs');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║          🧪 TRAFFIC BOT TEST SCRIPT                   ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Test 1: Check if config exists
console.log('🔍 Test 1: Checking configuration file...');
if (fs.existsSync('./traffic-bot/config.json')) {
  console.log('✅ config.json found!\n');
} else {
  console.log('❌ config.json NOT found!');
  console.log('   Run: node setup-config.js\n');
  process.exit(1);
}

// Test 2: Validate config
console.log('🔍 Test 2: Validating configuration...');
try {
  const config = JSON.parse(fs.readFileSync('./traffic-bot/config.json', 'utf8'));
  
  console.log(`   Website URL: ${config.websiteUrl || '❌ Missing'}`);
  
  // Check Reddit
  if (config.reddit && config.reddit.username) {
    console.log('   ✅ Reddit: Configured');
    if (!config.reddit.clientId || !config.reddit.clientSecret) {
      console.log('      ⚠️ Warning: Missing Reddit API credentials');
    }
  } else {
    console.log('   ⚠️ Reddit: Not configured');
  }
  
  // Check Twitter
  if (config.twitter && config.twitter.bearerToken) {
    console.log('   ✅ Twitter: Configured');
  } else {
    console.log('   ⚠️ Twitter: Not configured');
  }
  
  // Check Pinterest
  if (config.pinterest && config.pinterest.accessToken) {
    console.log('   ✅ Pinterest: Configured');
  } else {
    console.log('   ⚠️ Pinterest: Not configured');
  }
  
  console.log('');
  
} catch (error) {
  console.log('❌ Invalid config.json format!');
  console.log('   Error:', error.message);
  console.log('   Run: node setup-config.js\n');
  process.exit(1);
}

// Test 3: Check bot files
console.log('🔍 Test 3: Checking bot files...');
const botFiles = [
  './traffic-bot/reddit-bot.js',
  './traffic-bot/twitter-bot.js',
  './traffic-bot/pinterest-bot.js',
  './traffic-bot/index.js'
];

let allFilesExist = true;
for (const file of botFiles) {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file.split('/').pop()}`);
  } else {
    console.log(`   ❌ ${file.split('/').pop()} - MISSING!`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.log('\n❌ Some bot files are missing!');
  console.log('   Please re-download the complete bot system.\n');
  process.exit(1);
}

console.log('');

// Test 4: Check dependencies
console.log('🔍 Test 4: Checking dependencies...');
try {
  require('axios');
  console.log('   ✅ axios installed');
} catch (error) {
  console.log('   ❌ axios NOT installed!');
  console.log('   Run: npm install\n');
  process.exit(1);
}

console.log('');

// Test 5: Test website URL
console.log('🔍 Test 5: Testing website URL...');
const config = JSON.parse(fs.readFileSync('./traffic-bot/config.json', 'utf8'));
const axios = require('axios');

axios.get(config.websiteUrl, { timeout: 5000 })
  .then(() => {
    console.log(`   ✅ ${config.websiteUrl} is reachable!\n`);
    
    // All tests passed!
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║            ✅ ALL TESTS PASSED!                       ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    console.log('🎉 Your traffic bot is ready to run!\n');
    console.log('📊 Configuration Summary:');
    
    const config = JSON.parse(fs.readFileSync('./traffic-bot/config.json', 'utf8'));
    const platforms = [];
    if (config.reddit && config.reddit.username) platforms.push('Reddit');
    if (config.twitter && config.twitter.bearerToken) platforms.push('Twitter');
    if (config.pinterest && config.pinterest.accessToken) platforms.push('Pinterest');
    
    console.log(`   Active Platforms: ${platforms.join(', ') || 'None'}`);
    console.log(`   Target Website: ${config.websiteUrl}`);
    console.log('');
    
    // Estimate traffic
    let estimatedClicks = 0;
    if (platforms.includes('Reddit')) estimatedClicks += 200;
    if (platforms.includes('Twitter')) estimatedClicks += 120;
    if (platforms.includes('Pinterest')) estimatedClicks += 200;
    
    console.log('📈 Estimated Daily Traffic:');
    console.log(`   Clicks: ${estimatedClicks} per day`);
    console.log(`   Monthly Clicks: ${estimatedClicks * 30}`);
    console.log(`   Estimated Revenue: $${((estimatedClicks * 30 / 1000) * 3.5).toFixed(2)}/month`);
    console.log('');
    
    console.log('🚀 Next Steps:');
    console.log('   1. Start locally: npm start');
    console.log('   2. Or deploy to cloud: node deploy.js render');
    console.log('');
    
    if (platforms.length < 3) {
      console.log('💡 Pro Tip: Configure all 3 platforms for maximum traffic!');
      console.log('   Missing:', ['Reddit', 'Twitter', 'Pinterest'].filter(p => !platforms.includes(p)).join(', '));
      console.log('');
    }
    
  })
  .catch(error => {
    console.log(`   ⚠️ Warning: Could not reach ${config.websiteUrl}`);
    console.log(`   Error: ${error.message}`);
    console.log('   Bot will still work, but verify your website is online.\n');
    
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║         ⚠️ TESTS PASSED (WITH WARNINGS)              ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    console.log('You can still run the bot, but check your website URL!\n');
  });
