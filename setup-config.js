// Interactive Configuration Setup Script
// Helps users set up their API keys easily

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║    🤖 AI Traffic Bot - Configuration Setup           ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  console.log('This wizard will help you configure your traffic bots.\n');
  console.log('⚠️  You can skip any platform by pressing Enter (leave empty)\n');
  
  const config = {
    websiteUrl: '',
    reddit: {},
    twitter: {},
    pinterest: {}
  };
  
  // Website URL
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 WEBSITE CONFIGURATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  config.websiteUrl = await question('Enter your website URL (e.g., https://cinestream-cs.netlify.app): ');
  if (!config.websiteUrl) {
    config.websiteUrl = 'https://cinestream-cs.netlify.app';
  }
  
  // Reddit Configuration
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔴 REDDIT CONFIGURATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📖 How to get Reddit API credentials:');
  console.log('1. Go to: https://www.reddit.com/prefs/apps');
  console.log('2. Click "Create App" or "Create Another App"');
  console.log('3. Select "script" as app type');
  console.log('4. Set redirect URI to: http://localhost:8080');
  console.log('5. Copy the Client ID (under app name) and Secret\n');
  
  const useReddit = await question('Do you want to configure Reddit? (y/n): ');
  
  if (useReddit.toLowerCase() === 'y') {
    config.reddit.clientId = await question('Reddit Client ID: ');
    config.reddit.clientSecret = await question('Reddit Client Secret: ');
    config.reddit.username = await question('Reddit Username: ');
    config.reddit.password = await question('Reddit Password: ');
    console.log('✅ Reddit configured!');
  } else {
    console.log('⏭️  Skipping Reddit...');
  }
  
  // Twitter Configuration
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🐦 TWITTER/X CONFIGURATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📖 How to get Twitter API credentials:');
  console.log('1. Go to: https://developer.twitter.com/en/portal/dashboard');
  console.log('2. Create a new Project and App');
  console.log('3. Go to App Settings → Keys and Tokens');
  console.log('4. Generate Bearer Token and Access Tokens');
  console.log('5. Save all credentials\n');
  
  const useTwitter = await question('Do you want to configure Twitter? (y/n): ');
  
  if (useTwitter.toLowerCase() === 'y') {
    config.twitter.bearerToken = await question('Twitter Bearer Token: ');
    config.twitter.apiKey = await question('Twitter API Key: ');
    config.twitter.apiSecret = await question('Twitter API Secret: ');
    config.twitter.accessToken = await question('Twitter Access Token: ');
    config.twitter.accessTokenSecret = await question('Twitter Access Token Secret: ');
    config.twitter.userId = await question('Twitter User ID (numeric): ');
    console.log('✅ Twitter configured!');
  } else {
    console.log('⏭️  Skipping Twitter...');
  }
  
  // Pinterest Configuration
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📍 PINTEREST CONFIGURATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📖 How to get Pinterest API credentials:');
  console.log('1. Go to: https://developers.pinterest.com/apps/');
  console.log('2. Create a new app');
  console.log('3. Go to OAuth settings');
  console.log('4. Generate Access Token with read/write permissions');
  console.log('5. Copy the Access Token\n');
  
  const usePinterest = await question('Do you want to configure Pinterest? (y/n): ');
  
  if (usePinterest.toLowerCase() === 'y') {
    config.pinterest.accessToken = await question('Pinterest Access Token: ');
    config.pinterest.appId = await question('Pinterest App ID: ');
    config.pinterest.appSecret = await question('Pinterest App Secret: ');
    console.log('✅ Pinterest configured!');
  } else {
    console.log('⏭️  Skipping Pinterest...');
  }
  
  // Save configuration
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💾 SAVING CONFIGURATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const configPath = './traffic-bot/config.json';
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  console.log('✅ Configuration saved to: config.json\n');
  
  // Summary
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║              ✅ SETUP COMPLETE!                       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  console.log('📊 Configuration Summary:');
  console.log(`   Website: ${config.websiteUrl}`);
  console.log(`   Reddit: ${config.reddit.username ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   Twitter: ${config.twitter.bearerToken ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   Pinterest: ${config.pinterest.accessToken ? '✅ Configured' : '❌ Not configured'}`);
  console.log('');
  
  console.log('🚀 Next Steps:');
  console.log('   1. Install dependencies: npm install');
  console.log('   2. Start the bot: node traffic-bot/index.js');
  console.log('   3. Or deploy to cloud: node traffic-bot/deploy.js\n');
  
  rl.close();
}

// Run setup
setup().catch(console.error);
