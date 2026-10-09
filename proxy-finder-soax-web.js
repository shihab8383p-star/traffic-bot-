// 🔥 PROXY FINDER & SOAX CHECKER
// 1. Fetches proxies from GitHub repos
// 2. Tests them using SOAX proxy checker website
// 3. Saves only VERIFIED working proxies!

const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║  🔥 PROXY FINDER - SOAX WEB CHECKER 🔥               ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// 🔑 Configuration
const SOAX_CHECKER_URL = 'https://soax.com/tools/proxy-checker';
const OUTPUT_FILE = './verified-proxies-soax.json';
const PROXY_API_URL = process.env.PROXY_API_URL || 'http://localhost:3000';
const API_KEY = process.env.API_KEY || 'your-secret-key-123';

// 🎯 TIER COUNTRIES
const TIER_S = ['US', 'FR', 'GB'];
const TIER_1 = ['CA', 'DE', 'AU', 'CH', 'NL', 'ES', 'IT'];
const TIER_2 = ['SE', 'NO', 'DK', 'FI', 'JP', 'KR', 'SG', 'AT', 'BE', 'IE', 'NZ', 'PL', 'PT', 'CZ', 'GR'];
const ALL_ALLOWED_COUNTRIES = [...TIER_S, ...TIER_1, ...TIER_2];

// 📦 GITHUB PROXY SOURCES
const PROXY_SOURCES = [
  {
    name: 'HProxy (HTTP)',
    url: 'https://raw.githubusercontent.com/hproxy-com/free-proxy-list/main/http.txt'
  },
  {
    name: 'HProxy (HTTPS)',
    url: 'https://raw.githubusercontent.com/hproxy-com/free-proxy-list/main/https.txt'
  },
  {
    name: 'HProxy (All)',
    url: 'https://raw.githubusercontent.com/hproxy-com/free-proxy-list/main/all.txt'
  },
  {
    name: 'Proxifly (HTTP)',
    url: 'https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt'
  },
  {
    name: 'Proxifly (HTTPS)',
    url: 'https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/https/data.txt'
  }
];

class ProxyFinderSOAXWeb {
  constructor() {
    this.browser = null;
    this.stats = {
      totalFetched: 0,
      totalTested: 0,
      totalVerified: 0,
      totalFailed: 0
    };
  }

  // 🔍 STEP 1: Fetch proxies from GitHub repos
  async fetchProxiesFromGitHub() {
    console.log('🔍 STEP 1: Fetching proxies from GitHub repos...\n');
    
    const allProxies = [];
    
    for (const source of PROXY_SOURCES) {
      try {
        console.log(`   📦 Fetching from ${source.name}...`);
        
        const response = await axios.get(source.url, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        const lines = response.data.split('\n');
        let count = 0;

        lines.forEach(line => {
          line = line.trim();
          line = line.replace(/^https?:\/\//, '');
          
          if (line && line.includes(':')) {
            const parts = line.split(':');
            const host = parts[0];
            const port = parts[1];
            
            if (host && port && this.isValidIP(host)) {
              allProxies.push(`${host}:${port}`);
              count++;
            }
          }
        });

        console.log(`      ✅ Found ${count} proxies`);
        
      } catch (error) {
        console.log(`      ❌ Failed: ${error.message}`);
      }
    }

    const uniqueProxies = [...new Set(allProxies)];
    
    console.log(`\n   📊 Total unique proxies: ${uniqueProxies.length}`);
    this.stats.totalFetched = uniqueProxies.length;

    return uniqueProxies;
  }

  // 🌐 STEP 2: Test proxies using SOAX website checker (ULTRA FAST!)
  async testProxiesWithSOAXWeb(proxies, maxToTest = 700) {
    console.log(`\n🌐 STEP 2: Testing proxies with SOAX Web Checker (ULTRA FAST!)...\n`);
    console.log(`   🔗 Using: ${SOAX_CHECKER_URL}`);
    console.log(`   ⚡ Testing ${Math.min(maxToTest, proxies.length)} proxies\n`);
    console.log(`   🚀 Strategy: Multiple batches in parallel for MAXIMUM SPEED!\n`);
    
    const shuffled = proxies.sort(() => Math.random() - 0.5);
    const sampleProxies = shuffled.slice(0, maxToTest);
    
    // Launch browser
    console.log('   🌐 Launching browser...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security'
      ]
    });

    const verifiedProxies = [];
    
    // 🔥 ULTRA FAST: Test 100 proxies per batch, run 5 batches in parallel!
    const batchSize = 100;
    const parallelBatches = 5;
    
    const allBatches = [];
    for (let i = 0; i < sampleProxies.length; i += batchSize) {
      allBatches.push(sampleProxies.slice(i, i + batchSize));
    }
    
    console.log(`   📊 Total batches: ${allBatches.length} (${batchSize} proxies each)`);
    console.log(`   ⚡ Running ${parallelBatches} batches in parallel!\n`);
    
    // Process batches in parallel groups
    for (let i = 0; i < allBatches.length; i += parallelBatches) {
      const parallelGroup = allBatches.slice(i, i + parallelBatches);
      
      console.log(`\n   🔥 Processing ${parallelGroup.length} batches in parallel (Batches ${i + 1}-${i + parallelGroup.length})...`);
      
      const promises = parallelGroup.map((batch, index) => 
        this.testBatchOnSOAX(batch, i + index + 1)
      );
      
      const results = await Promise.all(promises);
      results.forEach(batchResults => {
        verifiedProxies.push(...batchResults);
      });
      
      console.log(`      ✅ Total verified so far: ${verifiedProxies.length}`);
    }

    await this.browser.close();

    console.log(`\n   🔥 ULTRA FAST Results: ${verifiedProxies.length} verified / ${sampleProxies.length} tested`);
    
    this.stats.totalTested = sampleProxies.length;
    this.stats.totalVerified = verifiedProxies.length;
    this.stats.totalFailed = sampleProxies.length - verifiedProxies.length;

    return verifiedProxies;
  }

  // 🧪 Test batch on SOAX website (FAST!)
  async testBatchOnSOAX(proxyBatch, batchNumber) {
    const page = await this.browser.newPage();
    const verifiedProxies = [];

    try {
      console.log(`      ⚡ Batch #${batchNumber}: Testing ${proxyBatch.length} proxies...`);
      
      // Set shorter timeout for speed
      page.setDefaultTimeout(15000);
      
      // Go to SOAX proxy checker
      await page.goto(SOAX_CHECKER_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      // Wait for the input field
      await page.waitForSelector('textarea, input[type="text"]', { timeout: 5000 });

      // Enter all proxies in the batch (one per line)
      const proxyText = proxyBatch.join('\n');
      await page.type('textarea, input[type="text"]', proxyText, { delay: 0 });

      // Click the check button
      const buttonClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const checkButton = buttons.find(btn => 
          btn.textContent.toLowerCase().includes('check') || 
          btn.textContent.toLowerCase().includes('test') ||
          btn.type === 'submit'
        );
        if (checkButton) {
          checkButton.click();
          return true;
        }
        return false;
      });

      if (!buttonClicked) {
        console.log(`      ⚠️  Batch #${batchNumber}: Could not find check button`);
        await page.close();
        return verifiedProxies;
      }

      // Wait for results (2 seconds + 0.5 sec per proxy)
      const waitTime = 2000 + (proxyBatch.length * 500);
      await new Promise(resolve => setTimeout(resolve, waitTime));

      // Extract results
      const results = await page.evaluate(() => {
        const proxies = [];
        
        // Try multiple selectors for results
        const selectors = [
          '.result', '.proxy-result', 'tr', '.list-item',
          '[class*="result"]', '[class*="proxy"]'
        ];
        
        let elements = [];
        for (const selector of selectors) {
          elements = document.querySelectorAll(selector);
          if (elements.length > 0) break;
        }
        
        elements.forEach(el => {
          const text = el.textContent || el.innerText || '';
          
          // Look for working/success indicators
          const isWorking = text.includes('✓') || text.includes('✔') || 
                           text.includes('success') || text.includes('working') || 
                           text.includes('active') || text.includes('online') ||
                           el.classList.contains('success') || el.classList.contains('active');
          
          if (isWorking) {
            // Extract IP:PORT
            const ipMatch = text.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d+)/);
            if (ipMatch) {
              const host = ipMatch[1];
              const port = ipMatch[2];
              
              // Extract country (2-letter code)
              const countryMatch = text.match(/\b([A-Z]{2})\b/);
              const country = countryMatch ? countryMatch[1] : 'UNKNOWN';
              
              // Extract speed
              const speedMatch = text.match(/(\d+)\s*ms/i);
              const speed = speedMatch ? parseInt(speedMatch[1]) : 0;
              
              proxies.push({ host, port: parseInt(port), country, speed });
            }
          }
        });
        
        return proxies;
      });

      // Process results
      for (const proxy of results) {
        // Only keep allowed countries
        if (ALL_ALLOWED_COUNTRIES.includes(proxy.country)) {
          verifiedProxies.push({
            host: proxy.host,
            port: proxy.port,
            username: '',
            password: '',
            country: proxy.country,
            location: this.getCountryName(proxy.country),
            tier: TIER_S.includes(proxy.country) ? 'TIER S' : 
                  TIER_1.includes(proxy.country) ? 'TIER 1' : 'TIER 2',
            cpm: '$2-5',
            working: true,
            verified: true,
            verifiedBy: 'SOAX',
            speed: proxy.speed,
            testedAt: new Date().toISOString()
          });
        }
      }

      console.log(`      ✅ Batch #${batchNumber}: Found ${verifiedProxies.length} working proxies`);

    } catch (error) {
      console.log(`      ⚠️  Batch #${batchNumber} error: ${error.message}`);
    } finally {
      await page.close();
    }

    return verifiedProxies;
  }

  // 🎯 STEP 3: Filter by Tier
  filterByTier(proxies) {
    console.log(`\n🎯 STEP 3: Filtering by TIER...\n`);
    
    const tierStats = {
      tierS: proxies.filter(p => TIER_S.includes(p.country)).length,
      tier1: proxies.filter(p => TIER_1.includes(p.country)).length,
      tier2: proxies.filter(p => TIER_2.includes(p.country)).length
    };

    console.log(`   💎 Tier S: ${tierStats.tierS} proxies (US, FR, GB)`);
    console.log(`   🌟 Tier 1: ${tierStats.tier1} proxies (CA, DE, AU, CH, NL, ES, IT)`);
    console.log(`   ⭐ Tier 2: ${tierStats.tier2} proxies (Nordic, Asia, etc.)`);
    console.log(`   ✅ Total: ${proxies.length} SOAX-VERIFIED proxies!`);

    return proxies;
  }

  // 💾 STEP 4: Save to file
  saveToFile(proxies) {
    console.log(`\n💾 STEP 4: Saving verified proxies...\n`);

    const output = {
      lastUpdate: new Date().toISOString(),
      totalProxies: proxies.length,
      verificationMethod: 'SOAX Web Checker',
      verificationURL: SOAX_CHECKER_URL,
      comment: 'VERIFIED working proxies - tested with SOAX official checker',
      proxies: proxies
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    
    console.log(`   ✅ Saved ${proxies.length} verified proxies to ${OUTPUT_FILE}`);
  }

  // 📤 STEP 5: Push to API (optional)
  async pushToAPI(proxies) {
    console.log(`\n📤 STEP 5: Pushing to API...\n`);

    try {
      const response = await axios.post(`${PROXY_API_URL}/proxies`, {
        proxies: proxies
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        timeout: 10000
      });

      if (response.data && response.data.success) {
        console.log(`   ✅ PUSHED TO API SUCCESSFULLY!`);
        console.log(`   📊 Proxies: ${proxies.length}`);
        return true;
      }
    } catch (error) {
      console.log(`   ⚠️  API not available: ${error.message}`);
      console.log(`   💡 Proxies saved to file instead!`);
    }
    return false;
  }

  // 🚀 Main function
  async run() {
    console.log('🚀 Starting SOAX Web Proxy Finder & Verifier...\n');

    try {
      // Step 1: Fetch from GitHub
      const fetchedProxies = await this.fetchProxiesFromGitHub();
      
      if (fetchedProxies.length === 0) {
        console.log('❌ No proxies fetched!');
        return;
      }

      // Step 2: Test with SOAX Web Checker (ULTRA FAST - 700 proxies!)
      const verifiedProxies = await this.testProxiesWithSOAXWeb(fetchedProxies, 700);

      if (verifiedProxies.length === 0) {
        console.log('\n❌ No working proxies found!');
        return;
      }

      // Step 3: Filter by tier
      const filteredProxies = this.filterByTier(verifiedProxies);

      // Step 4: Save to file
      this.saveToFile(filteredProxies);

      // Step 5: Try to push to API
      await this.pushToAPI(filteredProxies);

      // Summary
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║                  ✅ COMPLETE! ✅                       ║');
      console.log('╚════════════════════════════════════════════════════════╝\n');
      console.log(`📊 Final Stats:`);
      console.log(`   - Fetched: ${this.stats.totalFetched} proxies`);
      console.log(`   - Tested: ${this.stats.totalTested} proxies`);
      console.log(`   - SOAX Verified: ${this.stats.totalVerified} proxies ✅`);
      console.log(`   - Failed: ${this.stats.totalFailed} proxies ❌`);
      console.log(`   - Success Rate: ${((this.stats.totalVerified / this.stats.totalTested) * 100).toFixed(1)}%`);
      console.log(`\n💾 SOAX-verified proxies saved to: ${OUTPUT_FILE}`);
      console.log(`🔗 Verified using: ${SOAX_CHECKER_URL}`);
      console.log(`📦 Ready to use with your traffic bots!\n`);

    } catch (error) {
      console.log(`\n❌ Error: ${error.message}`);
      console.log(error.stack);
    }
  }

  // Helpers
  isValidIP(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every(part => {
      const num = parseInt(part);
      return num >= 0 && num <= 255;
    });
  }

  getCountryName(code) {
    const names = {
      'US': 'United States', 'FR': 'France', 'GB': 'United Kingdom',
      'CA': 'Canada', 'DE': 'Germany', 'AU': 'Australia',
      'CH': 'Switzerland', 'NL': 'Netherlands', 'ES': 'Spain', 'IT': 'Italy',
      'SE': 'Sweden', 'NO': 'Norway', 'DK': 'Denmark', 'FI': 'Finland',
      'JP': 'Japan', 'KR': 'South Korea', 'SG': 'Singapore',
      'AT': 'Austria', 'BE': 'Belgium', 'IE': 'Ireland', 'NZ': 'New Zealand',
      'PL': 'Poland', 'PT': 'Portugal', 'CZ': 'Czech Republic', 'GR': 'Greece'
    };
    return names[code] || 'Unknown';
  }
}

// 🚀 RUN
const finder = new ProxyFinderSOAXWeb();
finder.run().then(() => {
  console.log('✅ Done!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
