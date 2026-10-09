// Quick test for all proxies in proxies.json
const puppeteer = require('puppeteer');
const fs = require('fs');

async function testProxy(proxy, index) {
  const proxyUrl = `http://${proxy.host}:${proxy.port}`;
  
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        `--proxy-server=${proxyUrl}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      timeout: 30000
    });
    
    const page = await browser.newPage();
    
    // Authenticate if credentials provided
    if (proxy.username && proxy.password) {
      await page.authenticate({
        username: proxy.username,
        password: proxy.password
      });
    }
    
    // Test with a simple GET request
    await page.goto('https://httpbin.org/ip', { 
      waitUntil: 'networkidle2', 
      timeout: 15000 
    });
    
    const content = await page.content();
    await browser.close();
    
    console.log(`✅ Proxy ${index + 1}/${14}: ${proxy.host}:${proxy.port} - WORKING`);
    return true;
    
  } catch (error) {
    console.log(`❌ Proxy ${index + 1}/${14}: ${proxy.host}:${proxy.port} - FAILED (${error.message})`);
    return false;
  }
}

async function testAllProxies() {
  console.log('\n🔍 Testing all proxies from proxies.json...\n');
  
  const data = JSON.parse(fs.readFileSync('./proxies.json', 'utf8'));
  const proxies = data.proxies;
  
  console.log(`📊 Total proxies to test: ${proxies.length}\n`);
  
  let workingCount = 0;
  let failedCount = 0;
  
  // Test all proxies
  for (let i = 0; i < proxies.length; i++) {
    const result = await testProxy(proxies[i], i);
    if (result) {
      workingCount++;
    } else {
      failedCount++;
    }
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 PROXY TEST RESULTS:');
  console.log(`   ✅ Working: ${workingCount}/${proxies.length}`);
  console.log(`   ❌ Failed: ${failedCount}/${proxies.length}`);
  console.log(`   📈 Success Rate: ${((workingCount / proxies.length) * 100).toFixed(1)}%`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (workingCount === 0) {
    console.log('⚠️  WARNING: No working proxies found!');
    console.log('   Bot will NOT be able to run properly without working proxies.\n');
  } else {
    console.log(`✅ You can start the bot now with ${workingCount} working proxies!\n`);
  }
}

testAllProxies().catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
