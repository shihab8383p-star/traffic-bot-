// 🧪 PROXY TESTER - Test all your proxies
const http = require('http');
const https = require('https');
const fs = require('fs');

class ProxyTester {
  constructor() {
    this.validProxies = [];
    this.testUrl = 'https://micro-works-platform-1.onrender.com';
  }

  // Parse Webshare format: host:port:username:password
  parseWebshareProxy(line) {
    const parts = line.trim().split(':');
    if (parts.length === 4) {
      return {
        host: parts[0],
        port: parseInt(parts[1]),
        username: parts[2],
        password: parts[3],
        country: 'Webshare',
        location: 'Premium'
      };
    }
    return null;
  }

  // Parse free proxy format: host:port
  parseFreeProxy(line) {
    const parts = line.trim().split(':');
    if (parts.length === 2) {
      const port = parseInt(parts[1]);
      if (port > 0 && port < 65536) {
        return {
          host: parts[0],
          port: port,
          username: '',
          password: '',
          country: 'Unknown',
          location: 'Free'
        };
      }
    }
    return null;
  }

  // Test a single proxy
  testProxy(proxy, timeout = 15000) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const options = {
        host: proxy.host,
        port: proxy.port,
        method: 'CONNECT',
        path: 'micro-works-platform-1.onrender.com:443',
        timeout: timeout
      };

      // Add auth if available
      if (proxy.username && proxy.password) {
        const auth = Buffer.from(`${proxy.username}:${proxy.password}`).toString('base64');
        options.headers = {
          'Proxy-Authorization': `Basic ${auth}`
        };
      }

      const req = http.request(options);

      req.on('connect', (res, socket) => {
        const responseTime = Date.now() - startTime;
        socket.end();
        
        resolve({ 
          success: true, 
          responseTime,
          proxy: proxy
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ success: false, error: 'timeout' });
      });

      req.on('error', (error) => {
        resolve({ success: false, error: error.message });
      });

      req.end();
    });
  }

  // Test all proxies in batches
  async testAllProxies(proxies, batchSize = 10) {
    console.log(`\n🧪 Testing ${proxies.length} proxies (batch size: ${batchSize})...\n`);
    
    const validProxies = [];
    const failedProxies = [];
    let tested = 0;

    for (let i = 0; i < proxies.length; i += batchSize) {
      const batch = proxies.slice(i, i + batchSize);
      
      const results = await Promise.all(
        batch.map(proxy => this.testProxy(proxy))
      );

      results.forEach((result, idx) => {
        tested++;
        const proxy = batch[idx];
        
        if (result.success) {
          validProxies.push(result.proxy);
          console.log(`   ✅ ${tested}/${proxies.length} - ${proxy.host}:${proxy.port} (${proxy.location}) - ${result.responseTime}ms`);
        } else {
          failedProxies.push({ proxy, error: result.error });
          process.stdout.write(`\r   ⏳ Testing: ${tested}/${proxies.length}`);
        }
      });

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n\n✅ Found ${validProxies.length} working proxies!`);
    console.log(`❌ Failed: ${failedProxies.length} proxies\n`);
    
    return { validProxies, failedProxies };
  }

  // Save proxies to file
  saveProxies(proxies, filename = './proxies.json') {
    const data = {
      lastUpdate: new Date().toISOString(),
      totalProxies: proxies.length,
      proxies: proxies
    };

    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`💾 Saved ${proxies.length} proxies to ${filename}`);
  }

  // Load proxies from text file
  loadFromFile(filename) {
    try {
      const content = fs.readFileSync(filename, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      const proxies = [];
      
      for (const line of lines) {
        // Try Webshare format first (4 parts)
        let proxy = this.parseWebshareProxy(line);
        if (proxy) {
          proxies.push(proxy);
          continue;
        }
        
        // Try free proxy format (2 parts)
        proxy = this.parseFreeProxy(line);
        if (proxy) {
          proxies.push(proxy);
        }
      }
      
      console.log(`📂 Loaded ${proxies.length} proxies from ${filename}`);
      return proxies;
      
    } catch (error) {
      console.error(`❌ Error loading file: ${error.message}`);
      return [];
    }
  }

  // Run the full process
  async run(inputFile = null, proxiesList = null) {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║              🧪 PROXY TESTER & VALIDATOR 🧪           ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    let proxies = [];
    
    if (proxiesList) {
      // Parse from provided list
      console.log('📋 Parsing provided proxy list...\n');
      for (const line of proxiesList) {
        let proxy = this.parseWebshareProxy(line);
        if (!proxy) {
          proxy = this.parseFreeProxy(line);
        }
        if (proxy) {
          proxies.push(proxy);
        }
      }
      console.log(`✅ Parsed ${proxies.length} proxies\n`);
    } else if (inputFile) {
      proxies = this.loadFromFile(inputFile);
    } else {
      console.log('❌ No proxies provided\n');
      return;
    }

    if (proxies.length === 0) {
      console.log('❌ No valid proxies found\n');
      return;
    }

    // Separate premium and free proxies
    const premiumProxies = proxies.filter(p => p.username && p.password);
    const freeProxies = proxies.filter(p => !p.username && !p.password);

    console.log(`📊 Proxy breakdown:`);
    console.log(`   🌟 Premium (Webshare): ${premiumProxies.length}`);
    console.log(`   🆓 Free proxies: ${freeProxies.length}\n`);

    // Test premium proxies first (more reliable)
    let allValidProxies = [];
    
    if (premiumProxies.length > 0) {
      console.log('🌟 Testing Premium Webshare proxies...\n');
      const premiumResults = await this.testAllProxies(premiumProxies, 5);
      allValidProxies.push(...premiumResults.validProxies);
    }

    if (freeProxies.length > 0) {
      console.log('\n🆓 Testing Free proxies...\n');
      const freeResults = await this.testAllProxies(freeProxies, 20);
      allValidProxies.push(...freeResults.validProxies);
    }

    if (allValidProxies.length === 0) {
      console.log('\n❌ No working proxies found. Try again later.\n');
      return;
    }

    // Save to file
    this.saveProxies(allValidProxies);

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                   ✅ COMPLETE! ✅                      ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`\n🎉 Found ${allValidProxies.length} working proxies!`);
    console.log(`   🌟 Premium: ${allValidProxies.filter(p => p.username).length}`);
    console.log(`   🆓 Free: ${allValidProxies.filter(p => !p.username).length}`);
    console.log(`\n📁 Saved to: proxies.json`);
    console.log(`\n💡 Run your bot now: npm run bot\n`);
  }
}

// Run if called directly
if (require.main === module) {
  const tester = new ProxyTester();
  
  // Check if proxy file provided as argument
  const inputFile = process.argv[2];
  
  if (inputFile) {
    tester.run(inputFile).catch(error => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
  } else {
    console.log('Usage: node test-my-proxies.js <proxy-file.txt>');
    console.log('\nOr provide proxies directly in code.');
  }
}

module.exports = ProxyTester;
