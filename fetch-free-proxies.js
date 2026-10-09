// 🆓 FREE PROXY FETCHER & TESTER
// Automatically fetches and tests free proxies from multiple sources

const https = require('https');
const http = require('http');
const fs = require('fs');

class FreeProxyFetcher {
  constructor() {
    this.validProxies = [];
    this.testUrl = 'https://micro-works-platform-1.onrender.com';
  }

  // Fetch free proxies from multiple sources
  async fetchProxies() {
    console.log('🔍 Fetching free proxies from multiple sources...\n');
    
    const allProxies = [];
    
    // Source 1: ProxyScrape API
    try {
      console.log('📡 Fetching from ProxyScrape...');
      const proxies1 = await this.fetchFromProxyScrape();
      allProxies.push(...proxies1);
      console.log(`   ✅ Found ${proxies1.length} proxies\n`);
    } catch (e) {
      console.log(`   ❌ Failed: ${e.message}\n`);
    }

    // Source 2: Free Proxy List
    try {
      console.log('📡 Fetching from FreeProxyList...');
      const proxies2 = await this.fetchFromFreeProxyList();
      allProxies.push(...proxies2);
      console.log(`   ✅ Found ${proxies2.length} proxies\n`);
    } catch (e) {
      console.log(`   ❌ Failed: ${e.message}\n`);
    }

    // Source 3: Geonode
    try {
      console.log('📡 Fetching from Geonode...');
      const proxies3 = await this.fetchFromGeonode();
      allProxies.push(...proxies3);
      console.log(`   ✅ Found ${proxies3.length} proxies\n`);
    } catch (e) {
      console.log(`   ❌ Failed: ${e.message}\n`);
    }

    // Remove duplicates
    const uniqueProxies = this.removeDuplicates(allProxies);
    console.log(`📊 Total unique proxies: ${uniqueProxies.length}\n`);
    
    return uniqueProxies;
  }

  // Fetch from ProxyScrape (Best free source)
  fetchFromProxyScrape() {
    return new Promise((resolve, reject) => {
      const url = 'https://api.proxyscrape.com/v2/?request=get&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all';
      
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const lines = data.trim().split('\n');
          const proxies = lines.map(line => {
            const [host, port] = line.trim().split(':');
            // Validate port is a number
            if (!host || !port || isNaN(parseInt(port))) return null;
            return { 
              host: host.trim(), 
              port: parseInt(port), 
              country: 'Unknown', 
              username: '', 
              password: '' 
            };
          }).filter(p => p !== null && p.host && p.port > 0 && p.port < 65536);
          resolve(proxies);
        });
      }).on('error', reject);
    });
  }

  // Fetch from Free Proxy List
  fetchFromFreeProxyList() {
    return new Promise((resolve, reject) => {
      const url = 'https://www.proxyscan.io/api/proxy?format=txt&type=http,https';
      
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const lines = data.trim().split('\n');
          const proxies = lines.map(line => {
            const [host, port] = line.trim().split(':');
            // Validate port is a number
            if (!host || !port || isNaN(parseInt(port))) return null;
            return { 
              host: host.trim(), 
              port: parseInt(port), 
              country: 'Unknown', 
              username: '', 
              password: '' 
            };
          }).filter(p => p !== null && p.host && p.port > 0 && p.port < 65536);
          resolve(proxies);
        });
      }).on('error', reject);
    });
  }

  // Fetch from Geonode
  fetchFromGeonode() {
    return new Promise((resolve, reject) => {
      const url = 'https://proxylist.geonode.com/api/proxy-list?limit=500&page=1&sort_by=lastChecked&sort_type=desc&protocols=http%2Chttps';
      
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const proxies = json.data.map(p => {
              const port = parseInt(p.port);
              // Validate port
              if (isNaN(port) || port <= 0 || port >= 65536) return null;
              return {
                host: p.ip,
                port: port,
                country: p.country || 'Unknown',
                username: '',
                password: ''
              };
            }).filter(p => p !== null);
            resolve(proxies);
          } catch (e) {
            resolve([]);
          }
        });
      }).on('error', reject);
    });
  }

  // Remove duplicate proxies
  removeDuplicates(proxies) {
    const seen = new Set();
    return proxies.filter(proxy => {
      const key = `${proxy.host}:${proxy.port}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Test a single proxy
  testProxy(proxy, timeout = 10000) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const options = {
        host: proxy.host,
        port: proxy.port,
        method: 'GET',
        path: this.testUrl,
        timeout: timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      };

      const req = http.request(options, (res) => {
        const responseTime = Date.now() - startTime;
        
        if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
          resolve({ 
            success: true, 
            responseTime,
            proxy: { ...proxy, location: proxy.country }
          });
        } else {
          resolve({ success: false });
        }
        
        // Drain response
        res.on('data', () => {});
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ success: false });
      });

      req.on('error', () => {
        resolve({ success: false });
      });

      req.end();
    });
  }

  // Test all proxies in batches
  async testAllProxies(proxies, batchSize = 20) {
    console.log(`🧪 Testing ${proxies.length} proxies (batch size: ${batchSize})...\n`);
    
    const validProxies = [];
    let tested = 0;

    for (let i = 0; i < proxies.length; i += batchSize) {
      const batch = proxies.slice(i, i + batchSize);
      
      const results = await Promise.all(
        batch.map(proxy => this.testProxy(proxy))
      );

      results.forEach((result, idx) => {
        tested++;
        if (result.success) {
          validProxies.push(result.proxy);
          console.log(`   ✅ ${tested}/${proxies.length} - ${result.proxy.host}:${result.proxy.port} (${result.responseTime}ms)`);
        } else {
          process.stdout.write(`\r   ⏳ Testing: ${tested}/${proxies.length}`);
        }
      });

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n\n✅ Found ${validProxies.length} working proxies!\n`);
    return validProxies;
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

  // Run the full process
  async run() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║         🆓 FREE PROXY FETCHER & TESTER 🆓            ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // Step 1: Fetch proxies
    const proxies = await this.fetchProxies();

    if (proxies.length === 0) {
      console.log('❌ No proxies found. Try again later.\n');
      return;
    }

    // Step 2: Test proxies
    const validProxies = await this.testAllProxies(proxies);

    if (validProxies.length === 0) {
      console.log('❌ No working proxies found. Try again later.\n');
      return;
    }

    // Step 3: Save to file
    this.saveProxies(validProxies);

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                   ✅ COMPLETE! ✅                      ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`\n🎉 Found ${validProxies.length} working FREE proxies!`);
    console.log(`📁 Saved to: proxies.json`);
    console.log(`\n💡 Run your bot now: npm run bot\n`);
  }
}

// Run if called directly
if (require.main === module) {
  const fetcher = new FreeProxyFetcher();
  fetcher.run().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

module.exports = FreeProxyFetcher;
