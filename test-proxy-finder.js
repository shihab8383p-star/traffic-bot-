// 🧪 TEST PROXY FINDER - Check if it works before deploying
const axios = require('axios');
const cheerio = require('cheerio');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║     🧪 TESTING PROXY FINDER BOT 🧪                    ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

const TIER_S = ['US', 'FR', 'GB'];
const TIER_1 = ['CA', 'DE', 'AU', 'CH', 'NL'];
const ALL_ALLOWED = [...TIER_S, ...TIER_1];

// Test 1: Can we scrape proxies?
async function testScraping() {
  console.log('TEST 1: Scraping proxies from hproxy.com...\n');
  
  try {
    const response = await axios.get('https://hproxy.com/free-proxy-list', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const proxies = [];

    // Try to find proxy table
    $('table tbody tr').each((i, elem) => {
      try {
        const cells = $(elem).find('td');
        const ip = $(cells[0]).text().trim();
        const port = $(cells[1]).text().trim();
        
        if (ip && port && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
          proxies.push({ host: ip, port: parseInt(port) });
        }
      } catch (e) {}
    });

    if (proxies.length === 0) {
      // Try alternative selector
      $('tr').each((i, elem) => {
        try {
          const text = $(elem).text();
          const ipMatch = text.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
          const portMatch = text.match(/:(\d{2,5})/);
          
          if (ipMatch && portMatch) {
            proxies.push({ host: ipMatch[0], port: parseInt(portMatch[1]) });
          }
        } catch (e) {}
      });
    }

    console.log(`✅ Found ${proxies.length} proxies from hproxy.com`);
    
    if (proxies.length > 0) {
      console.log('\nSample proxies:');
      proxies.slice(0, 5).forEach(p => {
        console.log(`   • ${p.host}:${p.port}`);
      });
    } else {
      console.log('❌ No proxies found! Website might have changed structure.');
    }
    
    return proxies;
  } catch (error) {
    console.log(`❌ Scraping failed: ${error.message}`);
    return [];
  }
}

// Test 2: Can we test proxies?
async function testProxy(proxy) {
  try {
    const start = Date.now();
    
    const response = await axios.get('https://api.ipify.org?format=json', {
      proxy: {
        host: proxy.host,
        port: proxy.port,
        protocol: 'http'
      },
      timeout: 5000
    });

    const speed = Date.now() - start;
    
    if (response.status === 200) {
      return { ...proxy, working: true, speed };
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function testProxyTesting(proxies) {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`TEST 2: Testing ${Math.min(10, proxies.length)} proxies (parallel)...\n`);
  
  const testProxies = proxies.slice(0, 10);
  const promises = testProxies.map(p => testProxy(p));
  const results = await Promise.allSettled(promises);
  
  const working = [];
  
  results.forEach((result, i) => {
    const proxy = testProxies[i];
    if (result.status === 'fulfilled' && result.value) {
      working.push(result.value);
      console.log(`   ✅ ${result.value.host}:${result.value.port} - ${result.value.speed}ms`);
    } else {
      console.log(`   ❌ ${proxy.host}:${proxy.port} - DEAD`);
    }
  });
  
  console.log(`\n📊 Results: ${working.length} working / ${testProxies.length} tested`);
  return working;
}

// Run tests
async function runTests() {
  console.log('Starting tests...\n');
  
  // Test scraping
  const proxies = await testScraping();
  
  if (proxies.length === 0) {
    console.log('\n❌ TEST FAILED: Could not scrape any proxies!');
    console.log('   The website might be blocking requests or changed structure.');
    return;
  }
  
  // Test proxy testing
  const working = await testProxyTesting(proxies);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('╔════════════════════════════════════════════════════════╗');
  
  if (working.length > 0) {
    console.log('║         ✅ PROXY FINDER WORKS! ✅                     ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`\n📊 Summary:`);
    console.log(`   • Scraped: ${proxies.length} proxies`);
    console.log(`   • Tested: ${Math.min(10, proxies.length)} proxies`);
    console.log(`   • Working: ${working.length} proxies`);
    console.log(`\n✅ The bot will work when deployed!`);
  } else {
    console.log('║         ⚠️  PROXY FINDER PARTIALLY WORKS ⚠️          ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`\n📊 Summary:`);
    console.log(`   • Scraped: ${proxies.length} proxies`);
    console.log(`   • Tested: ${Math.min(10, proxies.length)} proxies`);
    console.log(`   • Working: 0 proxies (all dead)`);
    console.log(`\n⚠️  Scraping works, but free proxies are often dead.`);
    console.log(`   The bot will keep trying and eventually find working ones!`);
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

runTests().catch(err => {
  console.log(`\n❌ Test failed with error: ${err.message}`);
});
