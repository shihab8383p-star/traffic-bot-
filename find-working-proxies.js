// Test ALL proxies and save only working ones
const puppeteer = require('puppeteer');
const fs = require('fs');

async function testProxy(proxy, index, total) {
  const proxyUrl = `socks5://${proxy.host}:${proxy.port}`;
  
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        `--proxy-server=${proxyUrl}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      timeout: 15000
    });
    
    const page = await browser.newPage();
    
    // Quick test
    await page.goto('https://httpbin.org/ip', { 
      waitUntil: 'domcontentloaded', 
      timeout: 8000 
    });
    
    await browser.close();
    
    console.log(`✅ ${index + 1}/${total}: ${proxy.host}:${proxy.port} - WORKING!`);
    return true;
    
  } catch (error) {
    console.log(`❌ ${index + 1}/${total}: ${proxy.host}:${proxy.port} - Failed`);
    return false;
  }
}

async function findWorkingProxies() {
  console.log('\n🔍 Testing ALL 93 SOCKS proxies to find working ones...\n');
  
  const data = JSON.parse(fs.readFileSync('./proxies.json', 'utf8'));
  const allProxies = data.proxies;
  const workingProxies = [];
  
  console.log(`📊 Total proxies to test: ${allProxies.length}\n`);
  
  for (let i = 0; i < allProxies.length; i++) {
    const result = await testProxy(allProxies[i], i, allProxies.length);
    if (result) {
      workingProxies.push(allProxies[i]);
    }
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 FINAL RESULTS:`);
  console.log(`   ✅ Working: ${workingProxies.length}/${allProxies.length}`);
  console.log(`   ❌ Failed: ${allProxies.length - workingProxies.length}/${allProxies.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (workingProxies.length > 0) {
    // Save working proxies
    const workingData = {
      lastUpdate: new Date().toISOString(),
      totalProxies: workingProxies.length,
      comment: "Tested and verified working SOCKS proxies",
      proxies: workingProxies
    };
    
    fs.writeFileSync('./proxies.json', JSON.stringify(workingData, null, 2));
    
    console.log(`✅ Saved ${workingProxies.length} working proxies to proxies.json`);
    console.log(`🚀 Ready to start bot!\n`);
    
    // List working proxies
    console.log('🎯 Working proxies:');
    workingProxies.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.host}:${p.port} (${p.location})`);
    });
    console.log('');
    
  } else {
    console.log('⚠️  No working proxies found. Bot will need to run without proxies.\n');
  }
}

findWorkingProxies().catch(console.error);
