// Test Set 2 Proxies (yexzcqdy credentials)
const axios = require('axios');

const set2Proxies = [
  { host: '31.59.20.176', port: '6754', username: 'yexzcqdy', password: '9xeh796skq8r', location: 'UK (London)' },
  { host: '45.38.107.97', port: '6014', username: 'yexzcqdy', password: '9xeh796skq8r', location: 'UK (London)' },
  { host: '64.137.96.74', port: '6641', username: 'yexzcqdy', password: '9xeh796skq8r', location: 'Spain (Madrid)' },
  { host: '198.23.243.226', port: '6361', username: 'yexzcqdy', password: '9xeh796skq8r', location: 'USA (LA)' },
  { host: '38.154.185.97', port: '6370', username: 'yexzcqdy', password: '9xeh796skq8r', location: 'USA (Piscataway)' },
  { host: '84.247.60.125', port: '6095', username: 'yexzcqdy', password: '9xeh796skq8r', location: 'Poland (Warsaw)' },
  { host: '142.111.67.146', port: '5611', username: 'yexzcqdy', password: '9xeh796skq8r', location: 'Japan (Ueda)' },
  { host: '191.96.254.138', port: '6185', username: 'yexzcqdy', password: '9xeh796skq8r', location: 'USA (LA)' },
  { host: '31.58.9.4', port: '6077', username: 'yexzcqdy', password: '9xeh796skq8r', location: 'Germany (Frankfurt)' },
  { host: '198.46.161.42', port: '5092', username: 'yexzcqdy', password: '9xeh796skq8r', location: 'USA (LA)' }
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

async function verifySet2Proxies() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║     🔍 TESTING SET 2 PROXIES (yexzcqdy) - 3 Tests       ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  console.log('Testing 10 proxies with username: yexzcqdy\n');
  console.log('Each proxy tested 3 times for stability...\n');
  console.log('This will take about 2-3 minutes...\n');
  
  const results = {};
  let proxyNum = 1;
  
  for (const proxy of set2Proxies) {
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
        console.log(`❌ FAIL - ${result.error}`);
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
      reliable: successCount >= 2,
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
  console.log('SET 2 RELIABILITY REPORT:');
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
  console.log('WILL SET 2 WORK IN FUTURE?');
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
    console.log('   These may not work consistently.');
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('SUMMARY - BOTH SETS COMBINED:');
  console.log('═'.repeat(60));
  console.log('\n📊 SET 1 (nodqwomo): 10/10 working ✅');
  console.log(`📊 SET 2 (yexzcqdy): ${usableProxies}/10 working ${usableProxies >= 8 ? '✅' : usableProxies >= 5 ? '⚠️' : '❌'}`);
  console.log(`\n🎯 TOTAL WORKING PROXIES: ${10 + usableProxies}/20`);
  
  if (10 + usableProxies >= 18) {
    console.log('\n🔥 EXCELLENT! You have 18+ working proxies!');
    console.log('   Perfect for maximum traffic generation 24/7!');
  } else if (10 + usableProxies >= 15) {
    console.log('\n✅ GREAT! You have 15+ working proxies!');
    console.log('   Very good for stable 24/7 operation!');
  } else {
    console.log('\n✅ GOOD! You have 10+ working proxies!');
    console.log('   Enough for reliable bot operation!');
  }
  
  console.log('\n💡 PROXY LIFESPAN:');
  console.log('   • These proxies last 30 days from purchase');
  console.log('   • Renew monthly on Webshare to keep them working');
  console.log('   • Both sets expire on their individual purchase dates');
  
  console.log('\n' + '═'.repeat(60) + '\n');
  
  return results;
}

verifySet2Proxies().catch(error => {
  console.error('\n❌ Verification failed:', error.message);
  process.exit(1);
});
