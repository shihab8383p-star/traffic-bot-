// Test Webshare Proxies
const puppeteer = require('puppeteer');
const fs = require('fs');

async function testProxy(proxy) {
  const proxyUrl = `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`;
  
  console.log(`\n🧪 Testing: ${proxy.host}:${proxy.port} (${proxy.country})`);
  
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        `--proxy-server=${proxyUrl}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    const page = await browser.newPage();
    
    // Set a shorter timeout
    const startTime = Date.now();
    await page.goto('https://micro-works-platform-1.onrender.com', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    const loadTime = Date.now() - startTime;
    
    await browser.close();
    
    console.log(`   ✅ SUCCESS - ${loadTime}ms`);
    return { success: true, loadTime, proxy };
    
  } catch (error) {
    console.log(`   ❌ FAILED - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testAllProxies() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║       🧪 TESTING WEBSHARE PROXIES 🧪                 ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  const data = JSON.parse(fs.readFileSync('./proxies.json', 'utf8'));
  const proxies = data.proxies;
  
  console.log(`\n📊 Testing ${proxies.length} proxies...\n`);
  
  const workingProxies = [];
  
  for (const proxy of proxies) {
    const result = await testProxy(proxy);
    if (result.success) {
      workingProxies.push(result.proxy);
    }
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                  📊 TEST RESULTS 📊                    ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`\n✅ Working Proxies: ${workingProxies.length}/${proxies.length}`);
  console.log(`❌ Failed Proxies: ${proxies.length - workingProxies.length}/${proxies.length}`);
  
  if (workingProxies.length > 0) {
    console.log('\n🎉 Working Proxies:');
    workingProxies.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.host}:${p.port} (${p.country})`);
    });
    
    console.log('\n✅ Your proxies are READY!');
    console.log('🚀 Run your bot now: npm run bot');
  } else {
    console.log('\n❌ No working proxies found.');
    console.log('⚠️  Please check your Webshare credentials.');
  }
}

testAllProxies().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
