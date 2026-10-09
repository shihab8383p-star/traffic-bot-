// Test New Proxies
const axios = require('axios');

const newProxies = [
  { host: '31.59.20.176', port: '6754', username: 'nodqwomo', password: 'hhke35er3rsq' },
  { host: '45.38.107.97', port: '6014', username: 'nodqwomo', password: 'hhke35er3rsq' },
  { host: '64.137.96.74', port: '6641', username: 'nodqwomo', password: 'hhke35er3rsq' },
  { host: '198.23.243.226', port: '6361', username: 'nodqwomo', password: 'hhke35er3rsq' },
  { host: '38.154.185.97', port: '6370', username: 'nodqwomo', password: 'hhke35er3rsq' },
  { host: '84.247.60.125', port: '6095', username: 'nodqwomo', password: 'hhke35er3rsq' },
  { host: '142.111.67.146', port: '5611', username: 'nodqwomo', password: 'hhke35er3rsq' },
  { host: '191.96.254.138', port: '6185', username: 'nodqwomo', password: 'hhke35er3rsq' },
  { host: '31.58.9.4', port: '6077', username: 'nodqwomo', password: 'hhke35er3rsq' },
  { host: '198.46.161.42', port: '5092', username: 'nodqwomo', password: 'hhke35er3rsq' }
];

async function testProxy(proxy) {
  const proxyUrl = `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`;
  
  try {
    const response = await axios.get('http://ip-api.com/json/', {
      proxy: false,
      httpsAgent: new (require('https-proxy-agent').HttpsProxyAgent)(proxyUrl),
      httpAgent: new (require('http-proxy-agent').HttpProxyAgent)(proxyUrl),
      timeout: 15000
    });
    
    return {
      proxy: `${proxy.host}:${proxy.port}`,
      working: true,
      country: response.data.country || 'Unknown',
      city: response.data.city || 'Unknown',
      ip: response.data.query
    };
  } catch (error) {
    return {
      proxy: `${proxy.host}:${proxy.port}`,
      working: false,
      error: error.message
    };
  }
}

async function testAllProxies() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║              🧪 TESTING NEW PROXIES                       ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  console.log(`Testing ${newProxies.length} new proxies...\n`);
  console.log('Please wait, this may take 1-2 minutes...\n');
  
  const results = [];
  
  for (let i = 0; i < newProxies.length; i++) {
    const proxy = newProxies[i];
    process.stdout.write(`[${i + 1}/${newProxies.length}] Testing ${proxy.host}:${proxy.port}... `);
    
    const result = await testProxy(proxy);
    results.push(result);
    
    if (result.working) {
      console.log(`✅ WORKING - ${result.country} (${result.city}) - IP: ${result.ip}`);
    } else {
      console.log(`❌ FAILED - ${result.error}`);
    }
  }
  
  console.log('\n' + '─'.repeat(60));
  console.log('SUMMARY:');
  console.log('─'.repeat(60));
  
  const working = results.filter(r => r.working);
  const failed = results.filter(r => !r.working);
  
  console.log(`\n✅ Working Proxies: ${working.length}/${newProxies.length}`);
  console.log(`❌ Failed Proxies: ${failed.length}/${newProxies.length}`);
  
  if (working.length > 0) {
    console.log('\n🌍 Working Proxy Locations:');
    working.forEach(p => {
      console.log(`   • ${p.country} (${p.city}) - ${p.proxy}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n⚠️  Failed Proxies:');
    failed.forEach(p => {
      console.log(`   • ${p.proxy} - ${p.error}`);
    });
  }
  
  console.log('\n' + '═'.repeat(60));
  
  if (working.length > 0) {
    console.log('✅ Some proxies are working! Ready to add them to bot.');
  } else {
    console.log('❌ No working proxies found. Please check credentials.');
  }
  
  console.log('═'.repeat(60) + '\n');
  
  return { working, failed };
}

testAllProxies().catch(error => {
  console.error('\n❌ Test failed:', error.message);
  process.exit(1);
});
