// Proxy Manager - Rotates through proxies with AUTO-TESTING and REMOVAL
// Tests proxies and removes dead ones automatically

const fs = require('fs');
const https = require('https');
const http = require('http');
const axios = require('axios');

class ProxyManager {
  constructor() {
    this.proxies = [];
    this.deadProxies = []; // Track dead proxies
    this.currentIndex = 0;
    this.loadProxies();
  }
  
  // Get random working proxy with SMART TIER PRIORITY
  getRandomProxy() {
    if (this.proxies.length === 0) {
      console.log('⚠️ No proxies available!');
      return null;
    }
    
    // 🔥 TIER PRIORITY SYSTEM (Weekly rotation ready!)
    
    // 🥇 TIER S (TOP PRIORITY) - 70% usage - US, France, UK
    const tierS = ['US', 'FR', 'GB'];
    
    // 🥈 TIER 1 (HIGH VALUE) - 20% usage - Canada, Germany, Australia, Switzerland, Netherlands
    const tier1 = ['CA', 'DE', 'AU', 'CH', 'NL'];
    
    // 🥉 TIER 2 (RISING STARS) - 10% usage - Will be high-value next!
    // Nordic countries (SE, NO, DK, FI), East Asia (JP, KR, SG), Others (AT, BE, IE, NZ)
    const tier2 = ['SE', 'NO', 'DK', 'FI', 'JP', 'KR', 'SG', 'AT', 'BE', 'IE', 'NZ'];
    
    // Filter proxies by tier
    const tierSProxies = this.proxies.filter(p => tierS.includes(p.country));
    const tier1Proxies = this.proxies.filter(p => tier1.includes(p.country));
    const tier2Proxies = this.proxies.filter(p => tier2.includes(p.country));
    
    // Smart selection based on probability
    const rand = Math.random();
    let proxy;
    
    if (rand < 0.70 && tierSProxies.length > 0) {
      // 70% chance: Use TIER S (US, FR, GB) - HIGHEST PRIORITY!
      proxy = tierSProxies[Math.floor(Math.random() * tierSProxies.length)];
      console.log(`💎 TIER S proxy: ${proxy.country} (${proxy.location || 'Top CPM'})`);
    } else if (rand < 0.90 && tier1Proxies.length > 0) {
      // 20% chance: Use TIER 1 (CA, DE, AU, CH, NL)
      proxy = tier1Proxies[Math.floor(Math.random() * tier1Proxies.length)];
      console.log(`🌟 TIER 1 proxy: ${proxy.country} (${proxy.location || 'High CPM'})`);
    } else if (tier2Proxies.length > 0) {
      // 10% chance: Use TIER 2 (Rising stars - future high-value!)
      proxy = tier2Proxies[Math.floor(Math.random() * tier2Proxies.length)];
      console.log(`⭐ TIER 2 proxy: ${proxy.country} (${proxy.location || 'Rising Star'})`);
    } else {
      // Fallback: Use any available proxy
      proxy = this.proxies[this.currentIndex % this.proxies.length];
      this.currentIndex++;
      console.log(`🌍 Using proxy: ${proxy.country}`);
    }
    
    return proxy;
  }
  
  // Mark proxy as failed (bot will call this)
  markProxyAsFailed(proxy) {
    if (!proxy || !proxy.host) return;
    
    console.log(`❌ Dead proxy detected: ${proxy.host}:${proxy.port}`);
    
    // Remove immediately
    this.proxies = this.proxies.filter(p => 
      !(p.host === proxy.host && p.port === proxy.port)
    );
    
    this.deadProxies.push(proxy);
    
    console.log(`⚡ ${this.proxies.length} proxies remaining`);
    
    // Save updated list (async, don't wait)
    setImmediate(() => this.saveProxies());
  }
  
  // Save updated proxy list to file
  saveProxies() {
    try {
      const proxyFile = './proxies.json';
      const data = {
        lastUpdate: new Date().toISOString(),
        totalProxies: this.proxies.length,
        comment: "AUTO-FILTERED - Dead proxies removed automatically!",
        deadProxiesRemoved: this.deadProxies.length,
        proxies: this.proxies
      };
      
      fs.writeFileSync(proxyFile, JSON.stringify(data, null, 2));
      console.log(`💾 Updated proxies.json (${this.proxies.length} working proxies)`);
    } catch (error) {
      console.log('⚠️ Could not save proxy list:', error.message);
    }
  }
  
  // Load proxies from config file
  loadProxies() {
    try {
      // Try multiple possible locations
      const possiblePaths = [
        './traffic-bot/proxies.json',
        './proxies.json',
        __dirname + '/proxies.json',
        'C:/Users/Shihab/Documents/Rockstar Games/Social Club/microjob-platform/traffic-bot/proxies.json'
      ];
      
      let proxyFile = null;
      for (const path of possiblePaths) {
        if (fs.existsSync(path)) {
          proxyFile = path;
          break;
        }
      }
      
      if (proxyFile) {
        const data = JSON.parse(fs.readFileSync(proxyFile, 'utf8'));
        this.proxies = data.proxies.filter(p => 
          p.username !== 'YOUR_USERNAME_1' && 
          p.host && 
          p.port
        );
        
        if (this.proxies.length > 0) {
          console.log(`✅ Loaded ${this.proxies.length} proxies from ${proxyFile}`);
        } else {
          console.log('⚠️ No valid proxies configured. Running without proxy.');
        }
      } else {
        console.log('⚠️ proxies.json not found in any location. Running without proxy.');
        console.log('   Tried locations:', possiblePaths);
      }
    } catch (error) {
      console.error('❌ Failed to load proxies:', error.message);
    }
  }
  
  // Get next proxy in rotation with TIER 1 PRIORITY
  getNextProxy() {
    if (this.proxies.length === 0) {
      return null;
    }
    
    // Use the enhanced getRandomProxy which has Tier 1 priority
    return this.getRandomProxy();
  }
  
  // Get random proxy (REMOVED DUPLICATE - using the main one above)
  // getRandomProxy() method is defined above with Tier 1 priority
  
  // Convert proxy to axios config format
  getAxiosProxyConfig(proxy) {
    if (!proxy) return null;
    
    return {
      host: proxy.host,
      port: proxy.port,
      auth: {
        username: proxy.username,
        password: proxy.password
      },
      protocol: 'http'
    };
  }
  
  // Convert proxy to URL format
  getProxyUrl(proxy) {
    if (!proxy) return null;
    
    return `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`;
  }
  
  // Test if a proxy is working
  async testProxy(proxy) {
    try {
      const axios = require('axios');
      const proxyConfig = this.getAxiosProxyConfig(proxy);
      
      console.log(`🧪 Testing proxy: ${proxy.host}...`);
      
      const response = await axios.get('https://api.ipify.org?format=json', {
        proxy: proxyConfig,
        timeout: 10000
      });
      
      console.log(`✅ Proxy working! IP: ${response.data.ip}`);
      return true;
    } catch (error) {
      console.log(`❌ Proxy failed: ${error.message}`);
      return false;
    }
  }
  
  // Test all proxies
  async testAllProxies() {
    console.log('\n🧪 Testing all proxies...\n');
    
    const results = [];
    
    for (let i = 0; i < this.proxies.length; i++) {
      const proxy = this.proxies[i];
      const working = await this.testProxy(proxy);
      
      results.push({
        index: i + 1,
        proxy: `${proxy.host}:${proxy.port}`,
        working: working
      });
      
      // Wait 2 seconds between tests
      await this.sleep(2000);
    }
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║       PROXY TEST RESULTS              ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    results.forEach(r => {
      const status = r.working ? '✅ Working' : '❌ Failed';
      console.log(`Proxy ${r.index}: ${r.proxy} - ${status}`);
    });
    
    const workingCount = results.filter(r => r.working).length;
    console.log(`\n✅ ${workingCount}/${results.length} proxies are working!\n`);
    
    return results;
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = ProxyManager;
