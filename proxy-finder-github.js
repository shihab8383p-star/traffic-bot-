// ⚡ PROXY FINDER BOT - GITHUB INTEGRATION ⚡
// Finds proxies, tests them, and PUSHES to GitHub
// All traffic bots fetch from GitHub automatically!
// Fully automated cloud solution - NO MANUAL WORK!

const axios = require('axios');
const fs = require('fs');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║  ⚡ PROXY FINDER BOT - GITHUB AUTO-SYNC ⚡           ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// 🎯 TIER S COUNTRIES (TOP PRIORITY)
const TIER_S = ['US', 'FR', 'GB'];
const TIER_1 = ['CA', 'DE', 'AU', 'CH', 'NL'];
const TIER_2 = ['SE', 'NO', 'DK', 'FI', 'JP', 'KR', 'SG', 'AT', 'BE', 'IE', 'NZ'];

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

// 🔑 GITHUB CONFIG (will be set via environment variables)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_REPO = process.env.GITHUB_REPO || 'YOUR_USERNAME/traffic-bot';
const GITHUB_FILE_PATH = 'proxies.json';

class ProxyFinderGitHub {
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
    
    this.githubEnabled = !!GITHUB_TOKEN && GITHUB_TOKEN !== '';
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

  // 🧪 STEP 2: Test proxies in batches
  async testProxies(proxies, maxToTest = 300) {
    console.log(`\n🧪 STEP 2: Testing ${Math.min(maxToTest, proxies.length)} proxies...\n`);
    
    const shuffled = proxies.sort(() => Math.random() - 0.5);
    const sampleProxies = shuffled.slice(0, maxToTest);
    
    // Test in batches of 50 for better control
    const batchSize = 50;
    const workingProxies = [];
    
    for (let i = 0; i < sampleProxies.length; i += batchSize) {
      const batch = sampleProxies.slice(i, i + batchSize);
      console.log(`   Testing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sampleProxies.length / batchSize)}...`);
      
      const testPromises = batch.map(proxy => this.testSingleProxy(proxy));
      const results = await Promise.allSettled(testPromises);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          workingProxies.push(result.value);
          if (workingProxies.length <= 20) {
            console.log(`      ✅ ${result.value.host}:${result.value.port} - ${result.value.country} (${result.value.speed}ms)`);
          }
        }
      });
    }

    if (workingProxies.length > 20) {
      console.log(`   ... and ${workingProxies.length - 20} more working proxies`);
    }

    console.log(`\n   📊 Results: ${workingProxies.length} working / ${sampleProxies.length} tested`);
    
    this.stats.totalTested += sampleProxies.length;
    this.stats.totalWorking += workingProxies.length;
    this.stats.totalDead += (sampleProxies.length - workingProxies.length);

    return workingProxies;
  }

  // 🧪 Test single proxy
  async testSingleProxy(proxy) {
    try {
      const start = Date.now();
      
      const response = await axios.get('https://api.ipify.org?format=json', {
        proxy: {
          host: proxy.host,
          port: proxy.port,
          protocol: 'http'
        },
        timeout: 3000,
        validateStatus: () => true
      });

      const speed = Date.now() - start;

      if (response.status === 200 && speed < 5000) {
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

  // 🎯 STEP 3: Filter by Tier
  filterByTier(proxies) {
    console.log(`\n🎯 STEP 3: Filtering by TIER...\n`);
    
    const filtered = proxies.filter(p => 
      ALL_ALLOWED_COUNTRIES.includes(p.country)
    );

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
    console.log(`   🌟 Tier 1: ${tierStats.tier1} proxies (CA, DE, AU, etc.)`);
    console.log(`   ⭐ Tier 2: ${tierStats.tier2} proxies (Nordic, Asia, etc.)`);
    console.log(`   ✅ Total: ${filtered.length} HIGH-VALUE proxies`);

    return filtered;
  }

  // 📤 STEP 4: Push to GitHub
  async pushToGitHub(proxies) {
    console.log(`\n📤 STEP 4: Pushing ${proxies.length} proxies to GitHub...\n`);

    if (!this.githubEnabled) {
      console.log('   ⚠️  GitHub integration disabled (no GITHUB_TOKEN)');
      console.log('   💾 Saving to local proxies.json instead...');
      return await this.saveLocal(proxies);
    }

    try {
      // Prepare proxy data
      const proxyData = {
        lastUpdate: new Date().toISOString(),
        totalProxies: proxies.length,
        comment: `AUTO-UPDATED by Proxy Finder Bot - Fresh proxies every 2 minutes`,
        sources: PROXY_SOURCES.map(s => s.name),
        stats: this.stats,
        proxies: proxies.slice(0, 200) // Limit to top 200
      };

      // Get current file SHA (needed for update)
      const getUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
      let sha = null;
      
      try {
        const getResponse = await axios.get(getUrl, {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        sha = getResponse.data.sha;
      } catch (e) {
        // File doesn't exist yet, that's OK
      }

      // Push to GitHub
      const content = Buffer.from(JSON.stringify(proxyData, null, 2)).toString('base64');
      
      const pushUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
      const pushData = {
        message: `Update proxies - ${proxies.length} working proxies`,
        content: content,
        ...(sha && { sha: sha })
      };

      await axios.put(pushUrl, pushData, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`   ✅ PUSHED TO GITHUB!`);
      console.log(`   📊 Pushed: ${proxies.length} proxies`);
      console.log(`   🔗 URL: https://github.com/${GITHUB_REPO}/blob/main/${GITHUB_FILE_PATH}`);
      console.log(`   🌐 Raw URL: https://raw.githubusercontent.com/${GITHUB_REPO}/main/${GITHUB_FILE_PATH}`);
      console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      this.stats.totalPushed += proxies.length;

      // Also save locally as backup
      await this.saveLocal(proxies);

      return proxies.length;
    } catch (error) {
      console.log(`   ❌ GitHub push error: ${error.message}`);
      console.log(`   💾 Falling back to local save...`);
      return await this.saveLocal(proxies);
    }
  }

  // 💾 Save locally (backup)
  async saveLocal(proxies) {
    try {
      const proxyData = {
        lastUpdate: new Date().toISOString(),
        totalProxies: proxies.length,
        comment: `Local backup - ${proxies.length} working proxies`,
        stats: this.stats,
        proxies: proxies.slice(0, 200)
      };

      fs.writeFileSync('./proxies.json', JSON.stringify(proxyData, null, 2));
      console.log(`   ✅ Saved locally to proxies.json`);
      
      return proxies.length;
    } catch (error) {
      console.log(`   ❌ Save error: ${error.message}`);
      return 0;
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

      const workingProxies = await this.testProxies(fetchedProxies, 300);

      if (workingProxies.length === 0) {
        console.log('⚠️  No working proxies found. Retrying in 2 minutes...');
        return;
      }

      const filteredProxies = this.filterByTier(workingProxies);

      if (filteredProxies.length === 0) {
        console.log('⚠️  No tier proxies found. Retrying in 2 minutes...');
        return;
      }

      const totalProxies = await this.pushToGitHub(filteredProxies);

      this.stats.cyclesCompleted++;
      this.stats.lastUpdate = new Date().toISOString();

      console.log('\n✅ Cycle complete!');
      console.log(`📊 Total cycles: ${this.stats.cyclesCompleted}`);
      console.log(`💾 Proxy pool: ${totalProxies} proxies\n`);

    } catch (error) {
      console.log(`\n❌ Cycle error: ${error.message}`);
    }
  }

  // 🚀 Start
  async start() {
    console.log('🚀 Starting Proxy Finder Bot with GitHub Integration...');
    console.log('📦 Sources: GitHub repos (HProxy, Proxifly)');
    console.log('⏰ Refresh interval: 2 minutes');
    console.log('🎯 Target: Tier S (US, FR, GB) priority');
    
    if (this.githubEnabled) {
      console.log(`📤 GitHub: ${GITHUB_REPO}/${GITHUB_FILE_PATH}`);
      console.log('✅ GitHub integration ENABLED\n');
    } else {
      console.log('⚠️  GitHub integration DISABLED (no GITHUB_TOKEN)');
      console.log('💾 Will save to local proxies.json only\n');
    }

    await this.runCycle();

    setInterval(() => {
      this.runCycle();
    }, 2 * 60 * 1000);

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
}

// 🚀 START
const bot = new ProxyFinderGitHub();
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
