// ⚡ SUPER FAST PROXY FINDER V2 ⚡
// Fetches proxies from GitHub repos (updated hourly!)
// Tests them and injects into traffic bots
// Refreshes every 2 minutes - ULTRA FAST!

const axios = require('axios');
const fs = require('fs');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║     ⚡ PROXY FINDER BOT V2 (GitHub Sources) ⚡       ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// 🎯 TIER S COUNTRIES (TOP PRIORITY)
const TIER_S = ['US', 'FR', 'GB'];
const TIER_1 = ['CA', 'DE', 'AU', 'CH', 'NL'];
const TIER_2 = ['SE', 'NO', 'DK', 'FI', 'JP', 'KR', 'SG', 'AT', 'BE', 'IE', 'NZ'];

const ALL_ALLOWED_COUNTRIES = [...TIER_S, ...TIER_1, ...TIER_2];

// ❌ BLOCKED COUNTRIES (Low CPM - DO NOT USE!)
const BLOCKED_COUNTRIES = ['CN', 'IN', 'BD', 'PK', 'RU', 'UA', 'ID', 'BR', 'VN', 'TH', 'PH', 'NG', 'EG', 'TR'];

// 📦 PROXY SOURCES (GitHub repos with auto-updated lists)
const PROXY_SOURCES = [
  // Source 1: HProxy - 5400+ live proxies
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
  // Source 2: Proxifly - 51000+ proxies
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

class ProxyFinderBot {
  constructor() {
    this.stats = {
      totalFound: 0,
      totalTested: 0,
      totalWorking: 0,
      totalDead: 0,
      totalInjected: 0,
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
          
          // Remove http:// or https:// prefix if present
          line = line.replace(/^https?:\/\//, '');
          
          // Parse ip:port format
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

    // Remove duplicates
    const uniqueProxies = this.removeDuplicates(allProxies);
    
    console.log(`\n   📊 Total unique proxies: ${uniqueProxies.length}`);
    this.stats.totalFound += uniqueProxies.length;

    return uniqueProxies;
  }

  // 🧪 STEP 2: Test proxies SUPER FAST (parallel testing)
  async testProxies(proxies, maxToTest = 300) {
    console.log(`\n🧪 STEP 2: Testing ${Math.min(maxToTest, proxies.length)} proxies (PARALLEL - SUPER FAST!)...\n`);
    
    // Shuffle and take sample
    const shuffled = proxies.sort(() => Math.random() - 0.5);
    const sampleProxies = shuffled.slice(0, maxToTest);
    
    const testPromises = sampleProxies.map(proxy => this.testSingleProxy(proxy));
    const results = await Promise.allSettled(testPromises);

    const workingProxies = [];
    let tested = 0;
    
    results.forEach((result, index) => {
      tested++;
      if (result.status === 'fulfilled' && result.value) {
        workingProxies.push(result.value);
        if (workingProxies.length <= 20) { // Show first 20
          console.log(`   ✅ ${result.value.host}:${result.value.port} - ${result.value.country} (${result.value.speed}ms)`);
        }
      }
    });

    if (workingProxies.length > 20) {
      console.log(`   ... and ${workingProxies.length - 20} more working proxies`);
    }

    console.log(`\n   📊 Results: ${workingProxies.length} working / ${tested} tested`);
    
    this.stats.totalTested += tested;
    this.stats.totalWorking += workingProxies.length;
    this.stats.totalDead += (tested - workingProxies.length);

    return workingProxies;
  }

  // 🧪 Test single proxy (fast timeout)
  async testSingleProxy(proxy) {
    try {
      const start = Date.now();
      
      const response = await axios.get('https://api.ipify.org?format=json', {
        proxy: {
          host: proxy.host,
          port: proxy.port,
          protocol: 'http'
        },
        timeout: 3000, // 3 second timeout (SUPER FAST!)
        validateStatus: () => true
      });

      const speed = Date.now() - start;

      if (response.status === 200 && speed < 5000) {
        // Try to detect country from IP
        const country = await this.detectCountry(proxy.host);
        
        return {
          ...proxy,
          country: country,
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

  // 🌍 Detect country from IP
  async detectCountry(ip) {
    try {
      // Use free IP geolocation API
      const response = await axios.get(`http://ip-api.com/json/${ip}?fields=countryCode`, {
        timeout: 2000
      });
      
      if (response.data && response.data.countryCode) {
        return response.data.countryCode;
      }
    } catch (error) {
      // Ignore errors
    }
    
    return 'UNKNOWN';
  }

  // 🎯 STEP 3: Filter by Tier (only best countries)
  filterByTier(proxies) {
    console.log(`\n🎯 STEP 3: Filtering by TIER (Tier S > Tier 1 > Tier 2)...\n`);
    
    // Remove blocked countries first!
    const notBlocked = proxies.filter(p => !BLOCKED_COUNTRIES.includes(p.country));
    console.log(`   🚫 Blocked ${proxies.length - notBlocked.length} low-CPM countries (CN, IN, etc.)`);
    
    // Filter by allowed countries only
    const filtered = notBlocked.filter(p => 
      ALL_ALLOWED_COUNTRIES.includes(p.country)
    );

    // Sort by tier priority
    filtered.sort((a, b) => {
      const tierA = TIER_S.includes(a.country) ? 0 : TIER_1.includes(a.country) ? 1 : 2;
      const tierB = TIER_S.includes(b.country) ? 0 : TIER_1.includes(b.country) ? 1 : 2;
      
      if (tierA !== tierB) return tierA - tierB;
      return a.speed - b.speed; // Sort by speed within same tier
    });

    const tierStats = {
      tierS: filtered.filter(p => TIER_S.includes(p.country)).length,
      tier1: filtered.filter(p => TIER_1.includes(p.country)).length,
      tier2: filtered.filter(p => TIER_2.includes(p.country)).length
    };

    console.log(`   💎 Tier S: ${tierStats.tierS} proxies (US, FR, GB)`);
    console.log(`   🌟 Tier 1: ${tierStats.tier1} proxies (CA, DE, AU, etc.)`);
    console.log(`   ⭐ Tier 2: ${tierStats.tier2} proxies (Nordic, Asia, etc.)`);
    console.log(`   ✅ Total: ${filtered.length} HIGH-VALUE proxies`);

    return filtered;
  }

  // 💾 STEP 4: Save to proxies.json (for cloud deployment)
  async saveProxies(newProxies) {
    console.log(`\n💾 STEP 4: Saving ${newProxies.length} proxies to proxies.json...\n`);

    try {
      // Load existing proxies
      let existingProxies = [];
      if (fs.existsSync('./proxies.json')) {
        const data = JSON.parse(fs.readFileSync('./proxies.json', 'utf8'));
        existingProxies = data.proxies || [];
      }

      console.log(`   📂 Current proxies: ${existingProxies.length}`);

      // Merge: Add new, keep recent ones
      const mergedProxies = [...existingProxies];
      let addedCount = 0;

      newProxies.forEach(newProxy => {
        const exists = mergedProxies.some(p => 
          p.host === newProxy.host && p.port === newProxy.port
        );

        if (!exists) {
          // Add tier and location info
          newProxy.tier = TIER_S.includes(newProxy.country) ? 'TIER S' :
                         TIER_1.includes(newProxy.country) ? 'TIER 1' : 'TIER 2';
          newProxy.cpm = '$4-8';
          newProxy.location = this.getCountryName(newProxy.country);
          
          mergedProxies.push(newProxy);
          addedCount++;
        }
      });

      // Remove old proxies (older than 2 hours)
      const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
      const cleanedProxies = mergedProxies.filter(p => {
        if (!p.testedAt) return false; // Remove proxies without test date
        return new Date(p.testedAt).getTime() > twoHoursAgo;
      });

      const removedCount = mergedProxies.length - cleanedProxies.length;

      // Limit to 200 best proxies (to avoid huge file)
      const finalProxies = cleanedProxies.slice(0, 200);

      // Save to proxies.json
      const proxyData = {
        lastUpdate: new Date().toISOString(),
        totalProxies: finalProxies.length,
        comment: `AUTO-UPDATED by Proxy Finder Bot V2 - Fresh proxies from GitHub repos`,
        sources: PROXY_SOURCES.map(s => s.name),
        stats: this.stats,
        proxies: finalProxies
      };

      fs.writeFileSync('./proxies.json', JSON.stringify(proxyData, null, 2));

      console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`   ✅ SAVE COMPLETE!`);
      console.log(`   📊 Added: ${addedCount} new proxies`);
      console.log(`   🗑️  Removed: ${removedCount} old proxies`);
      console.log(`   💾 Total saved: ${finalProxies.length} proxies`);
      console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      this.stats.totalInjected += addedCount;

      return finalProxies.length;
    } catch (error) {
      console.log(`   ❌ Save error: ${error.message}`);
      return 0;
    }
  }

  // 🔄 Main cycle (runs every 2 minutes)
  async runCycle() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log(`║  🔄 CYCLE ${this.stats.cyclesCompleted + 1} - Finding Fresh Proxies...           ║`);
    console.log('╚════════════════════════════════════════════════════════╝\n');

    try {
      // Step 1: Fetch from GitHub repos
      const fetchedProxies = await this.fetchProxies();
      
      if (fetchedProxies.length === 0) {
        console.log('⚠️  No proxies fetched. Will try again in 2 minutes...');
        return;
      }

      // Step 2: Test proxies (sample 300 random ones for better results)
      const workingProxies = await this.testProxies(fetchedProxies, 300);

      if (workingProxies.length === 0) {
        console.log('⚠️  No working proxies found. Will try again in 2 minutes...');
        return;
      }

      // Step 3: Filter by tier
      const filteredProxies = this.filterByTier(workingProxies);

      if (filteredProxies.length === 0) {
        console.log('⚠️  No tier proxies found. Will try again in 2 minutes...');
        return;
      }

      // Step 4: Save to proxies.json
      const totalProxies = await this.saveProxies(filteredProxies);

      this.stats.cyclesCompleted++;
      this.stats.lastUpdate = new Date().toISOString();

      console.log('\n✅ Cycle complete! Fresh proxies saved!');
      console.log(`📊 Total cycles: ${this.stats.cyclesCompleted}`);
      console.log(`💾 Proxy pool: ${totalProxies} proxies\n`);

    } catch (error) {
      console.log(`\n❌ Cycle error: ${error.message}`);
    }
  }

  // 🚀 Start continuous operation (every 2 minutes)
  async start() {
    console.log('🚀 Starting Proxy Finder Bot V2...');
    console.log('📦 Sources: GitHub repos (HProxy, Proxifly, iplocate)');
    console.log('⏰ Refresh interval: 2 minutes');
    console.log('🎯 Target: Tier S (US, FR, GB) priority');
    console.log('💾 Saves to proxies.json\n');

    // Run first cycle immediately
    await this.runCycle();

    // Then run every 2 minutes (120000ms)
    setInterval(() => {
      this.runCycle();
    }, 2 * 60 * 1000); // 2 minutes

    console.log('\n⚡ Bot is now running 24/7!');
    console.log('💡 Press Ctrl+C to stop (but keep it running!)\n');
  }

  // Helper: Validate IP address
  isValidIP(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every(part => {
      const num = parseInt(part);
      return num >= 0 && num <= 255;
    });
  }

  // Helper: Remove duplicates
  removeDuplicates(proxies) {
    const seen = new Set();
    return proxies.filter(proxy => {
      const key = `${proxy.host}:${proxy.port}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Helper: Get country full name
  getCountryName(code) {
    const names = {
      'US': 'United States', 'FR': 'France', 'GB': 'United Kingdom',
      'CA': 'Canada', 'DE': 'Germany', 'AU': 'Australia',
      'CH': 'Switzerland', 'NL': 'Netherlands', 'SE': 'Sweden',
      'NO': 'Norway', 'DK': 'Denmark', 'FI': 'Finland',
      'JP': 'Japan', 'KR': 'South Korea', 'SG': 'Singapore',
      'AT': 'Austria', 'BE': 'Belgium', 'IE': 'Ireland', 'NZ': 'New Zealand'
    };
    return names[code] || 'Unknown';
  }
}

// 🚀 START THE BOT!
const bot = new ProxyFinderBot();
bot.start();

// Keep process alive
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Stopping Proxy Finder Bot...');
  console.log('📊 Final Stats:');
  console.log(`   - Cycles completed: ${bot.stats.cyclesCompleted}`);
  console.log(`   - Total found: ${bot.stats.totalFound}`);
  console.log(`   - Total working: ${bot.stats.totalWorking}`);
  console.log(`   - Total saved: ${bot.stats.totalInjected}`);
  console.log('\n✅ Bot stopped. Goodbye!\n');
  process.exit(0);
});
