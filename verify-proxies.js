// Verify Proxy Stability - Test Multiple Times
const axios = require('axios');

const workingProxies = [
  { host: '64.137.96.74', port: '6641', username: 'nodqwomo', password: 'hhke35er3rsq', location: 'Spain (Madrid)' },
  { host: '31.58.9.4', port: '6077', username: 'nodqwomo', password: 'hhke35er3rsq', location: 'Germany (Frankfurt)' },
  { host: '198.46.161.42', port: '5092', username: 'nodqwomo', password: 'hhke35er3rsq', location: 'United States (LA)' }
];

async function testProxy(proxy) {
  const proxyUrl = `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`;
  
  try {
    const startTime = Date.now();
    const response = await axios.get('http://ip-api.com/json/', {
      proxy: false,
      httpsAgent: new (require('https-proxy-agent').HttpsProxyAgent)(proxyUrl),
      httpAgent: new (require('http-proxy-agent').HttpProxyAgent)(proxyUrl),
      timeout: 10000
    });
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      country: response.data.country || 'Unknown',
      city: response.data.city || 'Unknown',
      ip: response.data.query,
      responseTime: responseTime,
      isp: response.data.isp || 'Unknown'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function verifyProxyStability() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║        🔍 VERIFYING PROXY STABILITY (3 Tests Each)       ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  console.log('Testing each proxy 3 times to verify stability...\n');
  
  const results = {};
  
  for (const proxy of workingProxies) {
    console.log(`\n📍 Testing: ${proxy.host}:${proxy.port} (${proxy.location})`);
    console.log('─'.repeat(60));
    
    const tests = [];
    
    for (let i = 1; i <= 3; i++) {
      process.stdout.write(`  Test ${i}/3... `);
      const result = await testProxy(proxy);
      tests.push(result);
      
      if (result.success) {
        console.log(`✅ SUCCESS (${result.responseTime}ms) - ${result.country}`);
      } else {
        console.log(`❌ FAILED - ${result.error}`);
      }
      
      // Wait 2 seconds between tests
      if (i < 3) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    const successCount = tests.filter(t => t.success).length;
    const avgResponseTime = tests.filter(t => t.success).reduce((sum, t) => sum + t.responseTime, 0) / successCount || 0;
    
    results[`${proxy.host}:${proxy.port}`] = {
      location: proxy.location,
      successRate: `${successCount}/3`,
      avgResponseTime: Math.round(avgResponseTime),
      reliable: successCount === 3,
      tests: tests
    };
    
    console.log(`  📊 Success Rate: ${successCount}/3 (${Math.round(successCount/3*100)}%)`);
    if (successCount > 0) {
      console.log(`  ⚡ Avg Response Time: ${Math.round(avgResponseTime)}ms`);
    }
    if (tests[0].success) {
      console.log(`  🏢 ISP: ${tests[0].isp}`);
    }
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('RELIABILITY REPORT:');
  console.log('═'.repeat(60) + '\n');
  
  const reliable = Object.entries(results).filter(([_, data]) => data.reliable);
  const unreliable = Object.entries(results).filter(([_, data]) => !data.reliable);
  
  if (reliable.length > 0) {
    console.log('✅ RELIABLE PROXIES (3/3 success):');
    reliable.forEach(([proxy, data]) => {
      console.log(`   • ${proxy} - ${data.location} (${data.avgResponseTime}ms avg)`);
    });
  }
  
  if (unreliable.length > 0) {
    console.log('\n⚠️  UNSTABLE PROXIES (less than 3/3):');
    unreliable.forEach(([proxy, data]) => {
      console.log(`   • ${proxy} - ${data.location} (${data.successRate})`);
    });
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('RECOMMENDATION:');
  console.log('═'.repeat(60));
  
  if (reliable.length === 3) {
    console.log('\n✅ ALL 3 PROXIES ARE STABLE AND RELIABLE!');
    console.log('   These proxies will work consistently in the bot.');
    console.log('   Safe to use for 24/7 operation.');
  } else if (reliable.length > 0) {
    console.log(`\n⚠️  Only ${reliable.length}/3 proxies are fully reliable.`);
    console.log('   Recommend using only the reliable ones.');
  } else {
    console.log('\n❌ No fully reliable proxies found.');
    console.log('   These proxies may have connection issues.');
    console.log('   Recommend getting better quality proxies.');
  }
  
  console.log('\n' + '═'.repeat(60));
  
  console.log('\n💡 PROXY QUALITY TIPS:');
  console.log('   • Residential proxies = best (most reliable)');
  console.log('   • Response time under 2000ms = good');
  console.log('   • 100% success rate = reliable');
  console.log('   • Tier 1 countries = maximum Adsterra earnings');
  
  console.log('\n' + '═'.repeat(60) + '\n');
  
  return results;
}

verifyProxyStability().catch(error => {
  console.error('\n❌ Verification failed:', error.message);
  process.exit(1);
});
