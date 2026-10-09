// ⚡ ULTRA FAST PROXY TESTER - Tests 50 proxies at once
const fs = require('fs');
const http = require('http');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║       ⚡ ULTRA FAST PROXY TESTER ⚡                    ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Read proxies from scraped file
let proxies = [];
try {
  const data = fs.readFileSync('./free-proxies-scraped.txt', 'utf8');
  proxies = data.split('\n').filter(line => line.trim() && line.includes(':'));
} catch (error) {
  console.log('❌ ERROR: free-proxies-scraped.txt not found!');
  console.log('   Run FAST-PROXY-SCRAPER.js first!\n');
  process.exit(1);
}

console.log(`⚡ Testing ${proxies.length} proxies in PARALLEL...\n`);
console.log('⏱️  Timeout: 3 seconds per proxy (FAST)\n');

const workingProxies = [];
const CONCURRENT = 50; // Test 50 at once for speed
const TIMEOUT = 3000; // 3 second timeout
let tested = 0;

// Test proxy function
function testProxy(proxyString) {
  return new Promise((resolve) => {
    const [host, port] = proxyString.split(':');
    const timeout = setTimeout(() => {
      resolve({ proxy: proxyString, working: false });
    }, TIMEOUT);

    try {
      const req = http.request({
        hostname: host,
        port: parseInt(port),
        method: 'GET',
        path: 'http://www.google.com',
        timeout: TIMEOUT
      }, (res) => {
        clearTimeout(timeout);
        const working = res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302;
        resolve({ proxy: proxyString, working });
      });

      req.on('error', () => {
        clearTimeout(timeout);
        resolve({ proxy: proxyString, working: false });
      });

      req.on('timeout', () => {
        clearTimeout(timeout);
        req.destroy();
        resolve({ proxy: proxyString, working: false });
      });

      req.end();
    } catch (error) {
      clearTimeout(timeout);
      resolve({ proxy: proxyString, working: false });
    }
  });
}

// Test in batches for speed
async function testInBatches() {
  const startTime = Date.now();
  
  for (let i = 0; i < proxies.length; i += CONCURRENT) {
    const batch = proxies.slice(i, i + CONCURRENT);
    const promises = batch.map(p => testProxy(p));
    
    const results = await Promise.all(promises);
    
    results.forEach(result => {
      tested++;
      if (result.working) {
        workingProxies.push(result.proxy);
        process.stdout.write(`\r[${tested}/${proxies.length}] ✅ Found: ${workingProxies.length} working   `);
      } else {
        process.stdout.write(`\r[${tested}/${proxies.length}] Testing... (${workingProxies.length} working)   `);
      }
    });
  }
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RESULTS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`✅ Working: ${workingProxies.length}`);
  console.log(`❌ Dead: ${proxies.length - workingProxies.length}`);
  console.log(`⏱️  Time: ${elapsed} seconds`);
  console.log(`⚡ Speed: ${(proxies.length / elapsed).toFixed(1)} proxies/sec\n`);
  
  if (workingProxies.length > 0) {
    // Filter for US proxies (best revenue)
    const usProxies = workingProxies.filter(p => {
      const ip = p.split(':')[0];
      return ip.startsWith('107.') || ip.startsWith('192.') || 
             ip.startsWith('162.') || ip.startsWith('139.') || 
             ip.startsWith('165.') || ip.startsWith('54.') ||
             ip.startsWith('3.') || ip.startsWith('44.') ||
             ip.startsWith('152.') || ip.startsWith('184.') ||
             ip.startsWith('199.') || ip.startsWith('23.') ||
             ip.startsWith('72.') || ip.startsWith('98.') ||
             ip.startsWith('67.') || ip.startsWith('68.') ||
             ip.startsWith('104.');
    });
    
    console.log(`🇺🇸 US proxies: ${usProxies.length} (HIGH tier)`);
    console.log(`🌐 Other: ${workingProxies.length - usProxies.length}\n`);
    
    // Save US proxies to file
    if (usProxies.length > 0) {
      fs.writeFileSync('./new-proxies.txt', usProxies.join('\n'));
      console.log('✅ Saved US proxies to: new-proxies.txt\n');
    } else {
      // Save all working if no US found
      fs.writeFileSync('./new-proxies.txt', workingProxies.join('\n'));
      console.log('✅ Saved all working proxies to: new-proxies.txt\n');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎯 READY TO LOAD!\n');
    console.log('   Next: Run REPLACE-PROXIES.bat to activate them!\n');
  } else {
    console.log('❌ No working proxies found.\n');
    console.log('   Try running FAST-PROXY-SCRAPER.js again.\n');
  }
}

testInBatches();
