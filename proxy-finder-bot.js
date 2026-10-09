// ⚡ SUPER FAST PROXY FINDER & FILTER BOT ⚡
// Finds, tests, and injects proxies into Bot 1 (Traffic Bots)
// Refreshes every 2 minutes - ULTRA FAST!

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║     ⚡ SUPER FAST PROXY FINDER BOT ⚡                 ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// 🎯 TIER S COUNTRIES (TOP PRIORITY)
const TIER_S = ['US', 'FR', 'GB'];
const TIER_1 = ['CA', 'DE', 'AU', 'CH', 'NL'];
const TIER_2 = ['SE', 'NO', 'DK', 'FI', 'JP', 'KR', 'SG', 'AT', 'BE', 'IE', 'NZ'];

const ALL_ALLOWED_COUNTRIES = [...TIER_S, ...TIER_1, ...TIER_2];

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

  // 🔍 STEP 1: Scrape proxies from hproxy.com
  async scrapeProxies() {
    try {
      console.log('🔍 STEP 1: Scraping proxies from hproxy.com...');
      
      const response = await axios.get('https://hproxy.com/free-proxy-list', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const proxies = [];

      // Try multiple selectors
      const possibleSelectors = [
        'table tbody tr',
        '.table tbody tr',
        '#proxy-table tbody tr',
        '.proxy-list tbody tr',
        'tr'
      ];

      for (const selector of possibleSelectors) {
        $(selector).each((i, elem) => {
          try {
            const ip = $(elem).find('td').eq(0).text().trim();
            const port = $(elem).find('td').eq(1).text().trim();
            const country = $(elem).find('td').eq(2).text().trim();

            if (ip && port && this.isValidIP(ip)) {
              proxies.push({
                host: ip,
                port: parseInt(port),
                country: this.detectCountry(ip, country),
                source: 'hproxy.com'
              });
            }
          } catch (e) {
            // Skip invalid rows
          }
        });

        if (proxies.length > 0) break;
      }

      console.log(`   ✅ Found ${proxies.length} proxies from hproxy.com`);
      this.stats.totalFound += proxies.length;

      return proxies;
    } catch (error) {
      console.log(`   ⚠️  Scraping error: ${error.message}`);
      return [];
    }
  }

  // 🧪 STEP 2: Test proxies SUPER FAST (parallel testing)
  async testProxies(proxies) {
    console.log(`\n🧪 STEP 2: Testing ${proxies.length} proxies (PARALLEL - SUPER FAST!)...`);
    
    const testPromises = proxies.map(proxy => this.testSingleProxy(proxy));
    const results = await Promise.allSettled(testPromises);

    const workingProxies = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        workingProxies.push(result.value);
        console.log(`   ✅ ${result.value.host}:${result.value.port} - ${result.value.country} (${result.value.speed}ms)`);
      } else {
        const proxy = proxies[index];
        console.log(`   ❌ ${proxy.host}:${proxy.port} - DEAD`);
      }
    });

    console.log(`\n   📊 Results: ${workingProxies.length} working / ${proxies.length} total`);
    
    this.stats.totalTested += proxies.length;
    this.stats.totalWorking += workingProxies.length;
    this.stats.totalDead += (proxies.length - workingProxies.length);

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
        timeout: 5000, // 5 second timeout (FAST!)
        validateStatus: () => true
      });

      const speed = Date.now() - start;

      if (response.status === 200 && speed < 10000) {
        return {
          ...proxy,
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

  // 🎯 STEP 3: Filter by Tier (only best countries)
  filterByTier(proxies) {
    console.log(`\n🎯 STEP 3: Filtering by TIER (Tier S > Tier 1 > Tier 2)...`);
    
    const filtered = proxies.filter(p => 
      ALL_ALLOWED_COUNTRIES.includes(p.country)
    );

    // Sort by tier priority
    filtered.sort((a, b) => {
      const tierA = TIER_S.includes(a.country) ? 0 : TIER_1.includes(a.country) ? 1 : 2;
      const tierB = TIER_S.includes(b.country) ? 0 : TIER_1.includes(b.country) ? 1 : 2;
      return tierA - tierB;
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

  // 💉 STEP 4: Inject into Bot 1 (Traffic Bots)
  async injectIntoBot1(newProxies) {
    console.log(`\n💉 STEP 4: Injecting ${newProxies.length} proxies into Bot 1 (Traffic Bots)...`);

    try {
      // Load existing proxies from Bot 1
      let existingProxies = [];
      if (fs.existsSync('./proxies.json')) {
        const data = JSON.parse(fs.readFileSync('./proxies.json', 'utf8'));
        existingProxies = data.proxies || [];
      }

      console.log(`   📂 Current proxies in Bot 1: ${existingProxies.length}`);

      // Merge: Add new, remove duplicates
      const mergedProxies = [...existingProxies];
      let addedCount = 0;
      let duplicateCount = 0;

      newProxies.forEach(newProxy => {
        const exists = mergedProxies.some(p => 
          p.host === newProxy.host && p.port === newProxy.port
        );

        if (!exists) {
          // Add tier and CPM info
          newProxy.tier = TIER_S.includes(newProxy.country) ? 'TIER S' :
                         TIER_1.includes(newProxy.country) ? 'TIER 1' : 'TIER 2';
          newProxy.cpm = '$4-8';
          newProxy.location = this.getCountryName(newProxy.country);
          
          mergedProxies.push(newProxy);
          addedCount++;
          console.log(`   ✅ Added: ${newProxy.host}:${newProxy.port} (${newProxy.country})`);
        } else {
          duplicateCount++;
        }
      });

      // Remove dead proxies (older than 1 hour)
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const cleanedProxies = mergedProxies.filter(p => {
        if (!p.testedAt) return true; // Keep old proxies for now
        return new Date(p.testedAt).getTime() > oneHourAgo;
      });

      const removedCount = mergedProxies.length - cleanedProxies.length;
      if (removedCount > 0) {
        console.log(`   🗑️  Removed ${removedCount} old/dead proxies`);
      }

      // Save to proxies.json
      const proxyData = {
        lastUpdate: new Date().toISOString(),
        totalProxies: cleanedProxies.length,
        comment: `AUTO-UPDATED by Proxy Finder Bot - ${cleanedProxies.length} working proxies`,
        stats: this.stats,
        proxies: cleanedProxies
      };

      fs.writeFileSync('./proxies.json', JSON.stringify(proxyData, null, 2));

      console.log(`\n   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`   ✅ INJECTION COMPLETE!`);
      console.log(`   📊 Added: ${addedCount} new proxies`);
      console.log(`   ⚠️  Skipped: ${duplicateCount} duplicates`);
      console.log(`   🗑️  Removed: ${removedCount} dead proxies`);
      console.log(`   💾 Total in Bot 1: ${cleanedProxies.length} proxies`);
      console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      this.stats.totalInjected += addedCount;

      return cleanedProxies.length;
    } catch (error) {
      console.log(`   ❌ Injection error: ${error.message}`);
      return 0;
    }
  }

  // 🔄 Main cycle (runs every 2 minutes)
  async runCycle() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log(`║  🔄 CYCLE ${this.stats.cyclesCompleted + 1} - Finding Fresh Proxies...           ║`);
    console.log('╚════════════════════════════════════════════════════════╝\n');

    try {
      // Step 1: Scrape
      const scrapedProxies = await this.scrapeProxies();
      
      if (scrapedProxies.length === 0) {
        console.log('⚠️  No proxies found this cycle. Will try again in 2 minutes...');
        return;
      }

      // Step 2: Test (parallel - SUPER FAST!)
      const workingProxies = await this.testProxies(scrapedProxies);

      if (workingProxies.length === 0) {
        console.log('⚠️  No working proxies found. Will try again in 2 minutes...');
        return;
      }

      // Step 3: Filter by tier
      const filteredProxies = this.filterByTier(workingProxies);

      // Step 4: Inject into Bot 1
      const totalProxies = await this.injectIntoBot1(filteredProxies);

      this.stats.cyclesCompleted++;
      this.stats.lastUpdate = new Date().toISOString();

      console.log('\n✅ Cycle complete! Bot 1 now has fresh proxies!');
      console.log(`📊 Total cycles: ${this.stats.cyclesCompleted}`);
      console.log(`💾 Bot 1 proxy pool: ${totalProxies} proxies\n`);

    } catch (error) {
      console.log(`\n❌ Cycle error: ${error.message}`);
    }
  }

  // 🚀 Start continuous operation (every 2 minutes)
  async start() {
    console.log('🚀 Starting SUPER FAST Proxy Finder Bot...');
    console.log('⏰ Refresh interval: 2 minutes');
    console.log('🎯 Target: Tier S (US, FR, GB) priority');
    console.log('💉 Auto-inject into Bot 1 (13 traffic bots)\n');

    // Run first cycle immediately
    await this.runCycle();

    // Then run every 2 minutes (120000ms)
    setInterval(() => {
      this.runCycle();
    }, 2 * 60 * 1000); // 2 minutes

    console.log('\n⚡ Bot is now running 24/7!');
    console.log('💡 Press Ctrl+C to stop (but don\'t - keep it running!)\n');
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

  // Helper: Detect country from IP
  detectCountry(ip, scrapedCountry) {
    // If country was scraped, try to match it
    if (scrapedCountry) {
      const countryMap = {
        'United States': 'US', 'USA': 'US', 'US': 'US',
        'France': 'FR', 'FR': 'FR',
        'United Kingdom': 'GB', 'UK': 'GB', 'GB': 'GB',
        'Canada': 'CA', 'CA': 'CA',
        'Germany': 'DE', 'DE': 'DE',
        'Australia': 'AU', 'AU': 'AU',
        'Switzerland': 'CH', 'CH': 'CH',
        'Netherlands': 'NL', 'NL': 'NL',
        'Sweden': 'SE', 'SE': 'SE',
        'Norway': 'NO', 'NO': 'NO',
        'Denmark': 'DK', 'DK': 'DK',
        'Finland': 'FI', 'FI': 'FI',
        'Japan': 'JP', 'JP': 'JP',
        'Korea': 'KR', 'KR': 'KR',
        'Singapore': 'SG', 'SG': 'SG'
      };

      for (const [key, code] of Object.entries(countryMap)) {
        if (scrapedCountry.includes(key)) {
          return code;
        }
      }
    }

    // Fallback: Detect from IP ranges
    const firstOctet = parseInt(ip.split('.')[0]);
    
    if ([3, 4, 5, 13, 15, 16, 18, 23, 34, 35, 38, 40, 43, 44, 45, 47, 52, 54, 56, 65, 67, 68, 72].includes(firstOctet)) {
      return 'US';
    }
    
    return 'UNKNOWN';
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
  console.log(`   - Total injected: ${bot.stats.totalInjected}`);
  console.log('\n✅ Bot stopped. Goodbye!\n');
  process.exit(0);
});
