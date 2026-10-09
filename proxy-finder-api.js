// ⚡ PROXY FINDER BOT - API VERSION ⚡
// Finds proxies, tests them, and POSTs to API automatically!
// Runs every 2 minutes - Fully automated!

const axios = require('axios');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║  ⚡ PROXY FINDER BOT - API INTEGRATION ⚡            ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// 🔑 Configuration
const PROXY_API_URL = process.env.PROXY_API_URL || 'http://localhost:3000';
const API_KEY = process.env.API_KEY || 'your-secret-key-123';
const REFRESH_INTERVAL = 1 * 60 * 1000; // 🔥 SUPER FAST: 1 minute instead of 2!

// 🎯 ALL TIER COUNTRIES (COMPREHENSIVE LIST!)
const TIER_S = ['US', 'FR', 'GB']; // Top 3 - Highest CPM
const TIER_1 = ['CA', 'DE', 'AU', 'CH', 'NL', 'ES', 'IT']; // High-value countries
const TIER_2 = ['SE', 'NO', 'DK', 'FI', 'JP', 'KR', 'SG', 'AT', 'BE', 'IE', 'NZ', 'PL', 'PT', 'CZ', 'GR']; // Growing markets

const ALL_ALLOWED_COUNTRIES = [...TIER_S, ...TIER_1, ...TIER_2];

// 📦 PROXY SOURCES
const PROXY_SOURCES = [
  {
    name: 'HProxy (HTTP)',
    url: 'https://raw.githubusercontent.com/hproxy-com/free-proxy-list/main/http.txt',
    type: 'http'
  },
  {
    name: 'HProxy (HTTPS)',
    url: 'https://raw.githubusercontent.com/hproxy-com/free-proxy-list/main/https.txt',
    type: 'http'
  },
  {
    name: 'HProxy (All)',
    url: 'https://raw.githubusercontent.com/hproxy-com/free-proxy-list/main/all.txt',
    type: 'http'
  },
  {
    name: 'Proxifly (HTTP)',
    url: 'https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt',
    type: 'http'
  },
  {
    name: 'Proxifly (HTTPS)',
    url: 'https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/https/data.txt',
    type: 'http'
  }
];

class ProxyFinderAPI {
  constructor() {
    this.stats = {
      totalFound: 0,
      totalTested: 0,
      totalWorking: 0,
      totalDead: 0,
      totalPushed: 0,
      cyclesCompleted: 0,
      lastUpdate: new Date().toISOString()
    };
  }

  // 🔍 STEP 1: Fetch proxies from GitHub repos
  async fetchProxies() {
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
              allProxies.push({
                host: host.trim(),
                port: parseInt(port.trim()),
                source: source.name,
                type: source.type
              });
              count++;
            }
          }
        });

        console.log(`      ✅ Found ${count} proxies`);
        
      } catch (error) {
        console.log(`      ❌ Failed: ${error.message}`);
      }
    }

    const uniqueProxies = this.removeDuplicates(allProxies);
    
    console.log(`\n   📊 Total unique proxies: ${uniqueProxies.length}`);
    this.stats.totalFound += uniqueProxies.length;

    return uniqueProxies;
  }

  // 🧪 STEP 2: Test proxies in batches (ULTRA FAST!)
  async testProxies(proxies, maxToTest = 200) {
    console.log(`\n⚡ STEP 2: FAST Testing ${Math.min(maxToTest, proxies.length)} proxies...\n`);
    
    const shuffled = proxies.sort(() => Math.random() - 0.5);
    const sampleProxies = shuffled.slice(0, maxToTest);
    
    const batchSize = 50; // 🔥 Smaller batches for free proxies (mostly dead)
    const workingProxies = [];
    
    for (let i = 0; i < sampleProxies.length; i += batchSize) {
      const batch = sampleProxies.slice(i, i + batchSize);
      console.log(`   ⚡ Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sampleProxies.length / batchSize)} (${batch.length} proxies) - TESTING...`);
      
      const testPromises = batch.map(proxy => this.testSingleProxy(proxy));
      const results = await Promise.allSettled(testPromises);

      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          workingProxies.push(result.value);
        }
      });
      
      console.log(`      ✅ ${workingProxies.length} working found so far...`);
    }

    console.log(`\n   🔥 Results: ${workingProxies.length} working / ${sampleProxies.length} tested!`);
    
    this.stats.totalTested += sampleProxies.length;
    this.stats.totalWorking += workingProxies.length;
    this.stats.totalDead += (sampleProxies.length - workingProxies.length);

    return workingProxies;
  }

  // 🧪 Test single proxy (LIGHTNING FAST - 1.5 second timeout!)
  async testSingleProxy(proxy) {
    try {
      const start = Date.now();
      
      const response = await axios.get('https://api.ipify.org?format=json', {
        proxy: {
          host: proxy.host,
          port: proxy.port,
          protocol: 'http'
        },
        timeout: 1500, // 🔥 LIGHTNING FAST: 1.5 seconds!
        validateStatus: () => true
      });

      const speed = Date.now() - start;

      if (response.status === 200 && speed < 2500) {
        const country = await this.detectCountryFast(proxy.host);
        
        return {
          host: proxy.host,
          port: proxy.port,
          username: '',
          password: '',
          country: country,
          location: this.getCountryName(country),
          tier: TIER_S.includes(country) ? 'TIER S' : TIER_1.includes(country) ? 'TIER 1' : 'TIER 2',
          cpm: '$2-5',
          working: true,
          speed: speed,
          testedAt: new Date().toISOString()
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }
  
  // 🌍 Detect country FAST (1 second timeout)
  async detectCountryFast(ip) {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}?fields=countryCode`, {
        timeout: 1000 // 🔥 SUPER FAST: 1 second!
      });
      
      if (response.data && response.data.countryCode) {
        return response.data.countryCode;
      }
    } catch (error) {
      // Ignore - return unknown
    }
    
    return 'UNKNOWN';
  }

  // 🌍 Detect country
  async detectCountry(ip) {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}?fields=countryCode`, {
        timeout: 2000
      });
      
      if (response.data && response.data.countryCode) {
        return response.data.countryCode;
      }
    } catch (error) {
      // Ignore
    }
    
    return 'UNKNOWN';
  }

  // 🎯 STEP 3: Filter by Tier (ACCEPT ALL TIERS!)
  filterByTier(proxies) {
    console.log(`\n🎯 STEP 3: Filtering by TIER (ALL TIERS INCLUDED!)...\n`);
    
    // Accept ALL tiers - Tier S, Tier 1, AND Tier 2!
    const filtered = proxies.filter(p => 
      ALL_ALLOWED_COUNTRIES.includes(p.country)
    );

    // Sort by tier priority (Tier S first, then Tier 1, then Tier 2)
    filtered.sort((a, b) => {
      const tierA = TIER_S.includes(a.country) ? 0 : TIER_1.includes(a.country) ? 1 : 2;
      const tierB = TIER_S.includes(b.country) ? 0 : TIER_1.includes(b.country) ? 1 : 2;
      
      if (tierA !== tierB) return tierA - tierB;
      return a.speed - b.speed;
    });

    const tierStats = {
      tierS: filtered.filter(p => TIER_S.includes(p.country)).length,
      tier1: filtered.filter(p => TIER_1.includes(p.country)).length,
      tier2: filtered.filter(p => TIER_2.includes(p.country)).length
    };

    console.log(`   💎 Tier S: ${tierStats.tierS} proxies (US, FR, GB)`);
    console.log(`   🌟 Tier 1: ${tierStats.tier1} proxies (CA, DE, AU, CH, NL)`);
    console.log(`   ⭐ Tier 2: ${tierStats.tier2} proxies (Nordic, Asia, etc.)`);
    console.log(`   ✅ Total: ${filtered.length} HIGH-VALUE proxies (ALL TIERS!)`);
    console.log(`\n   🔥 ALL TIERS ACCEPTED - Maximum proxy pool!`);

    return filtered;
  }

  // 📤 STEP 4: Push to API
  async pushToAPI(proxies) {
    console.log(`\n📤 STEP 4: Pushing ${proxies.length} proxies to API...\n`);

    try {
      const apiUrl = `${PROXY_API_URL}/proxies`;
      
      console.log(`   🔗 API URL: ${apiUrl}`);
      
      const response = await axios.post(apiUrl, {
        proxies: proxies
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        timeout: 10000
      });

      if (response.data && response.data.success) {
        console.log(`\n   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`   ✅ PUSHED TO API SUCCESSFULLY!`);
        console.log(`   📊 Proxies: ${proxies.length}`);
        console.log(`   🔄 Update #${response.data.updateCount}`);
        console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        this.stats.totalPushed += proxies.length;
        return true;
      } else {
        console.log(`   ❌ API response error: ${JSON.stringify(response.data)}`);
        return false;
      }
    } catch (error) {
      console.log(`   ❌ Push to API failed: ${error.message}`);
      if (error.response) {
        console.log(`   ❌ Response: ${error.response.status} ${error.response.statusText}`);
      }
      return false;
    }
  }

  // 🔄 Main cycle
  async runCycle() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log(`║  🔄 CYCLE ${this.stats.cyclesCompleted + 1} - Finding Fresh Proxies...           ║`);
    console.log('╚════════════════════════════════════════════════════════╝\n');

    try {
      const fetchedProxies = await this.fetchProxies();
      
      if (fetchedProxies.length === 0) {
        console.log('⚠️  No proxies fetched. Retrying in 2 minutes...');
        return;
      }

      const workingProxies = await this.testProxies(fetchedProxies, 200); // 🔥 Test 200 for faster results with free proxies

      if (workingProxies.length === 0) {
        console.log('⚠️  No working proxies found. Retrying in 2 minutes...');
        return;
      }

      const filteredProxies = this.filterByTier(workingProxies);

      if (filteredProxies.length === 0) {
        console.log('⚠️  No tier proxies found. Retrying in 2 minutes...');
        return;
      }

      const pushed = await this.pushToAPI(filteredProxies);

      if (pushed) {
        this.stats.cyclesCompleted++;
        this.stats.lastUpdate = new Date().toISOString();

        console.log('\n✅ Cycle complete! API updated with fresh proxies!');
        console.log(`📊 Total cycles: ${this.stats.cyclesCompleted}`);
        console.log(`💾 Total pushed: ${this.stats.totalPushed} proxies\n`);
      } else {
        console.log('\n❌ Cycle failed: Could not push to API');
      }

    } catch (error) {
      console.log(`\n❌ Cycle error: ${error.message}`);
    }
  }

  // 🚀 Start
  async start() {
    console.log('🚀 Starting Proxy Finder Bot with API Integration...');
    console.log('📦 Sources: GitHub repos (HProxy, Proxifly)');
    console.log('⏰ Refresh interval: 1 MINUTE (SUPER FAST!)');
    console.log('🎯 Target: ALL TIERS (25 countries)');
    console.log('⚡ Speed: LIGHTNING MODE (1000 proxies/cycle)');
    console.log(`📤 API URL: ${PROXY_API_URL}\n`);

    // Test API connection
    try {
      console.log('🔌 Testing API connection...');
      const response = await axios.get(`${PROXY_API_URL}/health`, { timeout: 5000 });
      console.log('✅ API is reachable!\n');
    } catch (error) {
      console.log(`⚠️  API not reachable: ${error.message}`);
      console.log('⚠️  Will keep trying...\n');
    }

    // Run first cycle immediately
    await this.runCycle();

    // Then run every 2 minutes
    setInterval(() => {
      this.runCycle();
    }, REFRESH_INTERVAL);

    console.log('\n⚡ Bot is now running 24/7!');
    console.log('💡 Press Ctrl+C to stop\n');
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

  removeDuplicates(proxies) {
    const seen = new Set();
    return proxies.filter(proxy => {
      const key = `${proxy.host}:${proxy.port}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  getCountryName(code) {
    const names = {
      // Tier S
      'US': 'United States', 'FR': 'France', 'GB': 'United Kingdom',
      // Tier 1
      'CA': 'Canada', 'DE': 'Germany', 'AU': 'Australia',
      'CH': 'Switzerland', 'NL': 'Netherlands', 'ES': 'Spain', 'IT': 'Italy',
      // Tier 2
      'SE': 'Sweden', 'NO': 'Norway', 'DK': 'Denmark', 'FI': 'Finland',
      'JP': 'Japan', 'KR': 'South Korea', 'SG': 'Singapore',
      'AT': 'Austria', 'BE': 'Belgium', 'IE': 'Ireland', 'NZ': 'New Zealand',
      'PL': 'Poland', 'PT': 'Portugal', 'CZ': 'Czech Republic', 'GR': 'Greece'
    };
    return names[code] || 'Unknown';
  }
}

// 🚀 START
const bot = new ProxyFinderAPI();
bot.start();

process.on('SIGINT', () => {
  console.log('\n\n⏹️  Stopping...');
  console.log('📊 Final Stats:');
  console.log(`   - Cycles: ${bot.stats.cyclesCompleted}`);
  console.log(`   - Found: ${bot.stats.totalFound}`);
  console.log(`   - Working: ${bot.stats.totalWorking}`);
  console.log(`   - Pushed: ${bot.stats.totalPushed}`);
  console.log('\n✅ Goodbye!\n');
  process.exit(0);
});
