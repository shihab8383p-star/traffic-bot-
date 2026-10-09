// 🔥 SIMPLE PROXY TESTER - Shows working/dead proxies
const fs = require('fs');
const https = require('https');
const http = require('http');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║          🔍 TESTING YOUR PROXIES 🔍                    ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Load proxies
let proxyData;
try {
  const data = fs.readFileSync('./proxies.json', 'utf8');
  proxyData = JSON.parse(data);
} catch (error) {
  console.log('❌ ERROR: Could not load proxies.json');
  process.exit(1);
}

console.log(`📊 Testing ${proxyData.proxies.length} proxies...\n`);

const workingProxies = [];
const deadProxies = [];
let tested = 0;

// Test each proxy
async function testProxy(proxy) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(false);
    }, 5000); // 5 second timeout

    try {
      const options = {
        hostname: proxy.host,
        port: proxy.port,
        method: 'GET',
        path: 'http://www.google.com',
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        clearTimeout(timeout);
        if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      req.on('error', () => {
        clearTimeout(timeout);
        resolve(false);
      });

      req.on('timeout', () => {
        clearTimeout(timeout);
        req.destroy();
        resolve(false);
      });

      req.end();
    } catch (error) {
      clearTimeout(timeout);
      resolve(false);
    }
  });
}

// Test all proxies sequentially
(async () => {
  for (const proxy of proxyData.proxies) {
    tested++;
    process.stdout.write(`\r[${tested}/${proxyData.proxies.length}] Testing ${proxy.host}:${proxy.port}...`);
    
    const isWorking = await testProxy(proxy);
    
    if (isWorking) {
      workingProxies.push(proxy);
      console.log(` ✅ WORKING`);
    } else {
      deadProxies.push(proxy);
      console.log(` ❌ DEAD`);
    }
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 SUMMARY:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`✅ Working proxies: ${workingProxies.length}`);
  console.log(`❌ Dead proxies: ${deadProxies.length}`);
  console.log(`📊 Total tested: ${proxyData.proxies.length}\n`);

  if (workingProxies.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ WORKING PROXIES:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    workingProxies.forEach((p, i) => {
      console.log(`${i + 1}. ${p.host}:${p.port} [${p.country}]`);
    });
    console.log('');
  }

  if (deadProxies.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('❌ DEAD PROXIES (Remove these):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    deadProxies.forEach((p, i) => {
      console.log(`${i + 1}. ${p.host}:${p.port} [${p.country}]`);
    });
    console.log('');
  }

  // Auto-save working proxies
  if (workingProxies.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💾 AUTO-CLEANUP:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Save working proxies to a separate file
    const workingProxyData = {
      lastUpdate: new Date().toISOString(),
      totalProxies: workingProxies.length,
      comment: `TESTED - ${workingProxies.length} working proxies (${deadProxies.length} removed)`,
      proxies: workingProxies
    };
    
    fs.writeFileSync('./proxies-working.json', JSON.stringify(workingProxyData, null, 2));
    console.log('✅ Working proxies saved to: proxies-working.json');
    console.log('');
    console.log('To use only working proxies:');
    console.log('1. Backup current: copy proxies.json proxies-old.json');
    console.log('2. Replace: copy proxies-working.json proxies.json');
    console.log('3. Restart bots');
    console.log('');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
})();
