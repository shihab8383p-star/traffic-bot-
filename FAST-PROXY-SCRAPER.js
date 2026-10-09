// 🚀 FAST FREE PROXY SCRAPER - Collect from multiple sources
const https = require('https');
const http = require('http');
const fs = require('fs');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║       🚀 FAST FREE PROXY SCRAPER 🚀                    ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Free proxy sources
const sources = [
  'https://api.proxyscrape.com/v2/?request=get&protocol=http&timeout=5000&country=US&ssl=all&anonymity=all',
  'https://www.proxy-list.download/api/v1/get?type=http',
  'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
  'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
  'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt'
];

let allProxies = new Set();
let sourcesChecked = 0;

console.log(`📡 Fetching from ${sources.length} sources...\n`);

// Fetch from all sources in parallel
sources.forEach((url, index) => {
  const protocol = url.startsWith('https') ? https : http;
  
  const req = protocol.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      // Parse proxies (format: IP:PORT)
      const proxies = data.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{2,5}/g);
      
      if (proxies) {
        proxies.forEach(p => allProxies.add(p));
        console.log(`✅ Source ${index + 1}: Found ${proxies.length} proxies`);
      } else {
        console.log(`⚠️  Source ${index + 1}: No proxies found`);
      }
      
      sourcesChecked++;
      
      if (sourcesChecked === sources.length) {
        finishScraping();
      }
    });
  });
  
  req.on('error', (err) => {
    console.log(`❌ Source ${index + 1}: Failed`);
    sourcesChecked++;
    
    if (sourcesChecked === sources.length) {
      finishScraping();
    }
  });
  
  req.setTimeout(10000, () => {
    req.destroy();
    console.log(`⏱️  Source ${index + 1}: Timeout`);
    sourcesChecked++;
    
    if (sourcesChecked === sources.length) {
      finishScraping();
    }
  });
});

function finishScraping() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Total unique proxies collected: ${allProxies.size}\n`);
  
  if (allProxies.size === 0) {
    console.log('❌ No proxies collected. Try again later.\n');
    process.exit(1);
  }
  
  // Save to file
  const proxyList = Array.from(allProxies).join('\n');
  fs.writeFileSync('./free-proxies-scraped.txt', proxyList);
  
  console.log('✅ Saved to: free-proxies-scraped.txt\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🎯 NEXT STEPS:\n');
  console.log('   1. Run: FAST-TEST-AND-LOAD.bat');
  console.log('   2. It will test proxies FAST (parallel)');
  console.log('   3. Load working ones');
  console.log('   4. Restart bots\n');
}
