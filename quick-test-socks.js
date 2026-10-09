// Quick SOCKS proxy test
const puppeteer = require('puppeteer');
const fs = require('fs');

async function testProxy(proxy, index) {
  const proxyUrl = `socks5://${proxy.host}:${proxy.port}`;
  
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        `--proxy-server=${proxyUrl}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      timeout: 20000
    });
    
    const page = await browser.newPage();
    
    // Test connection
    await page.goto('https://httpbin.org/ip', { 
      waitUntil: 'networkidle2', 
      timeout: 10000 
    });
    
    await browser.close();
    
    console.log(`✅ Proxy ${index + 1}/10: ${proxy.host}:${proxy.port} - WORKING`);
    return true;
    
  } catch (error) {
    console.log(`❌ Proxy ${index + 1}/10: ${proxy.host}:${proxy.port} - FAILED`);
    return false;
  }
}

async function quickTest() {
  console.log('\n🔍 Testing first 10 SOCKS proxies...\n');
  
  const data = JSON.parse(fs.readFileSync('./proxies.json', 'utf8'));
  const proxies = data.proxies.slice(0, 10); // Test first 10
  
  let workingCount = 0;
  
  for (let i = 0; i < proxies.length; i++) {
    const result = await testProxy(proxies[i], i);
    if (result) workingCount++;
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 QUICK TEST RESULTS: ${workingCount}/10 working`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (workingCount > 0) {
    console.log(`✅ Ready to start bot with ${data.proxies.length} total proxies!\n`);
  } else {
    console.log('⚠️  No working proxies found in sample. Trying full list...\n');
  }
}

quickTest().catch(console.error);
