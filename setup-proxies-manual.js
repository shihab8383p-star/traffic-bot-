// Manual Proxy Setup - Paste your Webshare credentials directly

const fs = require('fs');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║         🌐 MANUAL PROXY SETUP (EASY MODE)             ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

console.log('I will ask you simple questions. Just copy-paste from Webshare!\n');

// Get proxy details from Webshare dashboard
console.log('Go to: https://proxy.webshare.io/proxy/list\n');
console.log('You will see your proxy details like:\n');
console.log('┌─────────────────────────────────────────────┐');
console.log('│ Proxy Address: p.webshare.io                │');
console.log('│ Ports: 80, 8080                             │');
console.log('│ Username: xxxxxxx-rotate                    │');
console.log('│ Password: xxxxxxxxxx                        │');
console.log('│ Countries: 10 proxies                       │');
console.log('└─────────────────────────────────────────────┘\n');

// Create proxies array
const proxies = [];
const proxyCount = 10; // Webshare free gives 10 proxies

console.log('📋 ENTER YOUR WEBSHARE DETAILS:\n');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  // Get common details (same for all 10 proxies)
  const host = await question('Proxy Host (e.g., p.webshare.io): ');
  const port = await question('Port (usually 80 or 8080): ');
  const username = await question('Username (e.g., xxxxxxx-rotate): ');
  const password = await question('Password: ');
  
  console.log('\n✅ Got it! Creating 10 proxy entries...\n');
  
  // Webshare rotating proxies use same credentials but rotate IPs
  for (let i = 0; i < proxyCount; i++) {
    proxies.push({
      host: host.trim() || 'p.webshare.io',
      port: parseInt(port.trim()) || 80,
      username: username.trim(),
      password: password.trim(),
      country: 'US'
    });
    console.log(`✅ Proxy ${i + 1} configured`);
  }
  
  // Save to file
  const config = {
    proxies: proxies,
    rotateEvery: 3,
    comment: "Webshare rotating proxies - same credentials, different IPs per request"
  };
  
  fs.writeFileSync('./traffic-bot/proxies.json', JSON.stringify(config, null, 2));
  
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║           ✅ PROXIES CONFIGURED!                      ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  console.log(`📊 Summary:`);
  console.log(`   Total proxies: ${proxies.length}`);
  console.log(`   Host: ${host || 'p.webshare.io'}`);
  console.log(`   Port: ${port || 80}`);
  console.log(`   Username: ${username.substring(0, 10)}...`);
  console.log(`   Saved to: traffic-bot/proxies.json\n`);
  
  console.log('🧪 Next Steps:');
  console.log('   1. Test proxies: node test-proxies.js');
  console.log('   2. Start bot: npm start\n');
  
  rl.close();
  process.exit(0);
}

setup().catch(error => {
  console.error('Error:', error.message);
  rl.close();
  process.exit(1);
});
