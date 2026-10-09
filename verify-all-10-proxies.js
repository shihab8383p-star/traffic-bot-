// Verify All 10 Proxies Stability - Test Multiple Times
const axios = require('axios');

const allProxies = [
  { host: '31.59.20.176', port: '6754', username: 'nodqwomo', password: 'hhke35er3rsq', location: 'UK (London)' },
  { host: '45.38.107.97', port: '6014', username: 'nodqwomo', password: 'hhke35er3rsq', location: 'UK (London)' },
  { host: '64.137.96.74', port: '6641', username: 'nodqwomo', password: 'hhke35er3rsq', location: 'Spain (Madrid)' },
  { host: '198.23.243.226', port: '6361', username: 'nodqwomo', password: 'hhke35er3rsq', location: 'USA (LA)' },
  { host: '38.154.185.97', port: '6370', username: 'nodqwomo', password: 'hhke35er3rsq', location: 'USA (Piscataway)' },
  { host: '84.247.60.125', port: '6095', username: 'nodqwomo', password: 'hhke35er3rsq', location: 'Poland (Warsaw)' },
  { host: '142.111.67.146', port: '5611', username: 'nodqwomo', password: 'hhke35er3rsq', location: 'Japan (Ueda)' },
  { host: '191.96.254.138', port: '6185', username: 'nodqwomo', password: 'hhke35er3rsq', location: 'USA (LA)' },
  { host: '31.58.9.4', port: '6077', username: 'nodqwomo', password: 'hhke35er3rsq', location: 'Germany (Frankfurt)' },
  { host: '198.46.161.42', port: '5092', username: 'nodqwomo', password: 'hhke35er3rsq', location: 'USA (LA)' }
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

async function verifyAllProxies() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║     🔍 VERIFYING ALL 10 PROXIES STABILITY (3 Tests)      ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  console.log('Testing each proxy 3 times to verify future reliability...\n');
  console.log('This will take about 2-3 minutes...\n');
  
  const results = {};
  let proxyNum = 1;
  
  for (const proxy of allProxies) {
    console.log(`\n[${proxyNum}/10] 📍 ${proxy.host}:${proxy.port} (${proxy.location})`);
    console.log('─'.repeat(60));
    
    const tests = [];
    
    for (let i = 1; i <= 3; i++) {
      process.stdout.write(`        Test ${i}/3... `);
      const result = await testProxy(proxy);
      tests.push(result);
      
      if (result.success) {
        console.log(`✅ OK (${result.responseTime}ms)`);
      } else {
        console.log(`❌ FAIL`);
      }
      
      // Wait 1 second between tests
      if (i < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const successCount = tests.filter(t => t.success).length;
    const avgResponseTime = tests.filter(t => t.success).reduce((sum, t) => sum + t.responseTime, 0) / successCount || 0;
    
    results[`${proxy.host}:${proxy.port}`] = {
      location: proxy.location,
      successRate: `${successCount}/3`,
      avgResponseTime: Math.round(avgResponseTime),
      reliable: successCount >= 2, // At least 2/3 is acceptable
      fullyReliable: successCount === 3,
      tests: tests
    };
    
    const reliability = successCount === 3 ? '✅ EXCELLENT' : successCount === 2 ? '⚠️  GOOD' : '❌ POOR';
    console.log(`        Result: ${successCount}/3 success - ${reliability}`);
    if (successCount > 0) {
      console.log(`        Speed: ${Math.round(avgResponseTime)}ms avg`);
    }
    
    proxyNum++;
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('FINAL RELIABILITY REPORT:');
  console.log('═'.repeat(60) + '\n');
  
  const fullyReliable = Object.entries(results).filter(([_, data]) => data.fullyReliable);
  const mostlyReliable = Object.entries(results).filter(([_, data]) => data.reliable && !data.fullyReliable);
  const unreliable = Object.entries(results).filter(([_, data]) => !data.reliable);
  
  if (fullyReliable.length > 0) {
    console.log(`✅ FULLY RELIABLE (3/3 success) - ${fullyReliable.length} proxies:`);
    fullyReliable.forEach(([proxy, data]) => {
      console.log(`   • ${proxy.padEnd(25)} ${data.location.padEnd(20)} ${data.avgResponseTime}ms`);
    });
  }
  
  if (mostlyReliable.length > 0) {
    console.log(`\n⚠️  MOSTLY RELIABLE (2/3 success) - ${mostlyReliable.length} proxies:`);
    mostlyReliable.forEach(([proxy, data]) => {
      console.log(`   • ${proxy.padEnd(25)} ${data.location.padEnd(20)} ${data.successRate}`);
    });
  }
  
  if (unreliable.length > 0) {
    console.log(`\n❌ UNRELIABLE (0-1/3 success) - ${unreliable.length} proxies:`);
    unreliable.forEach(([proxy, data]) => {
      console.log(`   • ${proxy.padEnd(25)} ${data.location.padEnd(20)} ${data.successRate}`);
    });
  }
  
  const usableProxies = fullyReliable.length + mostlyReliable.length;
  
  console.log('\n' + '═'.repeat(60));
  console.log('WILL THEY WORK IN FUTURE?');
  console.log('═'.repeat(60));
  
  if (fullyReliable.length >= 8) {
    console.log('\n✅ YES! EXCELLENT - Most proxies are 100% stable!');
    console.log(`   ${fullyReliable.length}/10 proxies passed all 3 tests`);
    console.log('   These will work reliably 24/7 for the bot.');
  } else if (usableProxies >= 7) {
    console.log('\n✅ YES! GOOD - Majority of proxies are reliable!');
    console.log(`   ${usableProxies}/10 proxies are usable (2-3/3 success)`);
    console.log('   Safe to use for bot operation.');
  } else if (usableProxies >= 5) {
    console.log('\n⚠️  MAYBE - About half the proxies are reliable.');
    console.log(`   ${usableProxies}/10 proxies are usable`);
    console.log('   May have occasional connection issues.');
  } else {
    console.log('\n❌ NO - Too many unstable proxies.');
    console.log(`   Only ${usableProxies}/10 proxies are reliable`);
    console.log('   Recommend getting better quality proxies.');
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('RECOMMENDATION:');
  console.log('═'.repeat(60));
  
  if (usableProxies >= 7) {
    console.log('\n✅ ADD ALL WORKING PROXIES TO BOT');
    console.log(`   Use all ${usableProxies} reliable proxies for maximum traffic`);
    console.log('   Bot will automatically skip any that fail');
  } else {
    console.log('\n⚠️  USE ONLY FULLY RELIABLE PROXIES');
    console.log(`   Add only the ${fullyReliable.length} fully reliable proxies`);
    console.log('   Remove or replace unstable ones');
  }
  
  console.log('\n💡 PROXY LIFESPAN:');
  console.log('   • Webshare proxies typically last 30 days');
  console.log('   • You need to renew subscription monthly');
  console.log('   • If not renewed, proxies stop working after expiry');
  console.log('   • Current working proxies will stay working until expiry');
  
  console.log('\n' + '═'.repeat(60) + '\n');
  
  return results;
}

verifyAllProxies().catch(error => {
  console.error('\n❌ Verification failed:', error.message);
  process.exit(1);
});
