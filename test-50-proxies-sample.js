// Test 50 random proxies from the huge list
const puppeteer = require('puppeteer');

// Your huge proxy list (sample of 50 random ones)
const proxyList = `140.227.61.201:3128
45.192.199.182:80
154.29.156.150:80
148.153.55.58:80
185.73.39.118:9999
113.108.63.150:7890
172.86.106.78:80
165.225.66.42:11588
192.111.137.34:18765
192.111.129.150:4145
8.219.77.141:80
72.194.42.156:4145
184.178.172.23:4145
72.205.0.67:4145
192.111.139.165:4145
199.66.182.232:4145
192.252.215.2:4145
192.111.130.5:17002
192.111.135.17:18302
192.252.211.197:14921
184.170.245.148:4145
192.252.208.67:14287
98.188.47.132:4145
98.191.0.47:4145
174.77.111.197:4145
72.206.74.126:4145
98.181.137.83:4145
98.170.57.249:4145
98.182.147.97:4145
184.178.172.18:15280
184.178.172.3:4145
72.195.34.42:4145
72.223.188.92:4145
98.175.31.222:4145
184.178.172.11:4145
72.195.34.35:27360
98.170.57.231:4145
184.178.172.28:15294
72.195.114.184:4145
98.190.239.3:4145
72.195.114.169:4145
98.178.72.30:4145
184.182.240.12:4145
72.207.33.64:4145
98.178.72.21:10919
184.185.2.12:4145
199.116.112.6:4145
184.182.240.211:4145
67.201.59.70:4145
72.49.49.11:31034`.split('\n').map(line => {
  const [host, port] = line.trim().split(':');
  return { host, port: parseInt(port) };
}).filter(p => p.host && p.port);

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
      timeout: 20000
    });
    
    const page = await browser.newPage();
    
    await page.goto('http://httpbin.org/ip', { 
      waitUntil: 'networkidle2', 
      timeout: 10000 
    });
    
    await browser.close();
    
    console.log(`✅ ${index + 1}/50: ${proxy.host}:${proxy.port} - WORKING`);
    return { working: true, proxy };
    
  } catch (error) {
    console.log(`❌ ${index + 1}/50: ${proxy.host}:${proxy.port} - FAILED`);
    return { working: false, proxy };
  }
}

async function testSample() {
  console.log('\n🔍 Testing 50 random proxies as sample...\n');
  
  const results = [];
  
  for (let i = 0; i < proxyList.length; i++) {
    const result = await testProxy(proxyList[i], i);
    results.push(result);
  }
  
  const working = results.filter(r => r.working);
  const successRate = (working.length / results.length) * 100;
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 SAMPLE TEST RESULTS:');
  console.log(`   ✅ Working: ${working.length}/50`);
  console.log(`   ❌ Failed: ${results.length - working.length}/50`);
  console.log(`   📈 Success Rate: ${successRate.toFixed(1)}%`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (working.length > 0) {
    console.log('✅ GOOD NEWS: Some proxies are working!');
    console.log(`   Estimated working proxies from full list: ~${Math.floor((successRate/100) * 1000)}`);
  } else {
    console.log('⚠️  WARNING: No working proxies in sample!');
  }
}

testSample().catch(console.error);
