// Easy Proxy Setup Script
// Paste your Webshare proxy list and this converts it automatically

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║         🌐 WEBSHARE PROXY SETUP                       ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

console.log('📋 Instructions:');
console.log('1. Go to: https://proxy.webshare.io/');
console.log('2. Click "Proxy" → "Proxy List"');
console.log('3. Click "Download" → Select format "Username:Password@Host:Port"');
console.log('4. Copy ALL your proxy lines');
console.log('5. Paste them here (press Enter twice when done)\n');

console.log('Example format:');
console.log('username-rotate:password123@p.webshare.io:80');
console.log('username-rotate:password456@p.webshare.io:80\n');

let proxyLines = [];

console.log('Paste your proxies (press Enter twice to finish):\n');

process.stdin.on('data', (chunk) => {
  const lines = chunk.toString().split('\n');
  
  lines.forEach(line => {
    line = line.trim();
    if (line && line.includes('@') && line.includes(':')) {
      proxyLines.push(line);
    }
  });
  
  // Check if user pressed Enter twice (empty line)
  if (chunk.toString().trim() === '') {
    processProxies();
  }
});

function processProxies() {
  if (proxyLines.length === 0) {
    console.log('\n❌ No valid proxies found!\n');
    console.log('Make sure format is: username:password@host:port\n');
    process.exit(1);
  }
  
  console.log(`\n✅ Found ${proxyLines.length} proxies!\n`);
  console.log('Converting to config format...\n');
  
  const proxies = [];
  
  proxyLines.forEach((line, index) => {
    try {
      // Parse: username:password@host:port
      const [authPart, hostPart] = line.split('@');
      const [username, password] = authPart.split(':');
      const [host, port] = hostPart.split(':');
      
      proxies.push({
        host: host.trim(),
        port: parseInt(port.trim()) || 80,
        username: username.trim(),
        password: password.trim(),
        country: 'US'
      });
      
      console.log(`✅ Proxy ${index + 1}: ${username.substring(0, 10)}...@${host}`);
    } catch (error) {
      console.log(`⚠️  Proxy ${index + 1}: Failed to parse - ${line}`);
    }
  });
  
  if (proxies.length === 0) {
    console.log('\n❌ Could not parse any proxies!\n');
    process.exit(1);
  }
  
  // Save to file
  const config = {
    proxies: proxies,
    rotateEvery: 3,
    comment: "Proxy rotates every 3 posts to avoid detection"
  };
  
  fs.writeFileSync('./traffic-bot/proxies.json', JSON.stringify(config, null, 2));
  
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║           ✅ PROXIES CONFIGURED!                      ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  console.log(`📊 Summary:`);
  console.log(`   Total proxies: ${proxies.length}`);
  console.log(`   Saved to: traffic-bot/proxies.json`);
  console.log(`   Rotation: Every 3 posts\n`);
  
  console.log('🧪 Next Steps:');
  console.log('   1. Test proxies: node traffic-bot/test-proxies.js');
  console.log('   2. Start bot with proxies: npm start\n');
  
  process.exit(0);
}

// Timeout after 30 seconds
setTimeout(() => {
  if (proxyLines.length > 0) {
    processProxies();
  } else {
    console.log('\n⏱️  Timeout. No proxies entered.\n');
    process.exit(1);
  }
}, 30000);
