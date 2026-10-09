// Proxy Manager - CLOUD EDITION
// Fetches proxies from GitHub automatically!
// All 13 traffic bots share same proxy pool!

const fs = require('fs');
const axios = require('axios');

// 🔑 GitHub proxy source (set via environment variable)
const GITHUB_PROXY_URL = process.env.GITHUB_PROXY_URL || 
  'https://raw.githubusercontent.com/YOUR_USERNAME/traffic-bot/main/proxies.json';

class ProxyManager {
  constructor() {
    this.proxies = [];
    this.deadProxies = [];
    this.currentIndex = 0;
    this.lastFetchTime = 0;
    this.fetchInterval = 5 * 60 * 1000; // Refresh every 5 minutes
    
    // Auto-refresh proxies every 5 minutes
    setInterval(() => this.refreshProxies(), this.fetchInterval);
  }
  
  // Initialize - Load proxies
  async initialize() {
    await this.loadProxies();
  }
  
  // Load proxies (from GitHub if available, fallback to local)
  async loadProxies() {
    // Try GitHub first (cloud deployment)
    if (await this.fetchFromGitHub()) {
      console.log('✅ Loaded proxies from GitHub (cloud mode)');
      return true;
    }
    
    // Fallback to local file (local testing)
    try {
      const proxyFile = './proxies.json';
      if (fs.existsSync(proxyFile)) {
        const data = JSON.parse(fs.readFileSync(proxyFile, 'utf8'));
        this.proxies = data.proxies || [];
        console.log(`✅ Loaded ${this.proxies.length} proxies from local file`);
        return true;
      } else {
        console.log('⚠️  No proxies available! Bot will run without proxies.');
        return false;
      }
    } catch (error) {
      console.log('❌ Error loading proxies:', error.message);
      return false;
    }
  }
  
  // Fetch proxies from GitHub (CLOUD MODE)
  async fetchFromGitHub() {
    try {
      // Don't fetch too frequently
      const now = Date.now();
      if (now - this.lastFetchTime < this.fetchInterval && this.proxies.length > 0) {
        return true; // Use cached proxies
      }
      
      console.log('🔄 Fetching fresh proxies from GitHub...');
      
      const response = await axios.get(GITHUB_PROXY_URL, {
        timeout: 10000,
        headers: {
          'Cache-Control': 'no-cache',
          'User-Agent': 'TrafficBot/1.0'
        }
      });
      
      if (response.data && response.data.proxies) {
        this.proxies = response.data.proxies;
        this.lastFetchTime = now;
        console.log(`✅ Fetched ${this.proxies.length} fresh proxies from GitHub!`);
        return true;
      }
      
      return false;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('⚠️  Proxy file not found on GitHub. Using local file or deploying without proxies.');
      } else {
        console.log('⚠️  Could not fetch from GitHub:', error.message);
      }
      return false;
    }
  }
  
  // Auto-refresh proxies periodically
  async refreshProxies() {
    if (this.proxies.length < 5) {
      console.log('⚡ Low proxy count, refreshing from GitHub...');
    }
    await this.fetchFromGitHub();
  }
  
  // Get random working proxy with SMART TIER PRIORITY
  getRandomProxy() {
    if (this.proxies.length === 0) {
      console.log('⚠️ No proxies available!');
      return null;
    }
    
    // 🔥 TIER PRIORITY SYSTEM
    const tierS = ['US', 'FR', 'GB']; // 70% priority
    const tier1 = ['CA', 'DE', 'AU', 'CH', 'NL']; // 20% priority
    const tier2 = ['SE', 'NO', 'DK', 'FI', 'JP', 'KR', 'SG', 'AT', 'BE', 'IE', 'NZ']; // 10% priority
    
    // Filter proxies by tier
    const tierSProxies = this.proxies.filter(p => tierS.includes(p.country));
    const tier1Proxies = this.proxies.filter(p => tier1.includes(p.country));
    const tier2Proxies = this.proxies.filter(p => tier2.includes(p.country));
    
    // Smart selection based on probability
    const rand = Math.random();
    let proxy;
    
    if (rand < 0.70 && tierSProxies.length > 0) {
      proxy = tierSProxies[Math.floor(Math.random() * tierSProxies.length)];
      console.log(`💎 TIER S proxy: ${proxy.country} (${proxy.location || 'Top CPM'})`);
    } else if (rand < 0.90 && tier1Proxies.length > 0) {
      proxy = tier1Proxies[Math.floor(Math.random() * tier1Proxies.length)];
      console.log(`🌟 TIER 1 proxy: ${proxy.country} (${proxy.location || 'High CPM'})`);
    } else if (tier2Proxies.length > 0) {
      proxy = tier2Proxies[Math.floor(Math.random() * tier2Proxies.length)];
      console.log(`⭐ TIER 2 proxy: ${proxy.country} (${proxy.location || 'Rising Star'})`);
    } else {
      proxy = this.proxies[this.currentIndex % this.proxies.length];
      this.currentIndex++;
      console.log(`🌍 Using proxy: ${proxy.country || 'UNKNOWN'}`);
    }
    
    return proxy;
  }
  
  // Mark proxy as failed
  markProxyAsFailed(proxy) {
    if (!proxy || !proxy.host) return;
    
    console.log(`❌ Dead proxy: ${proxy.host}:${proxy.port}`);
    
    this.proxies = this.proxies.filter(p => 
      !(p.host === proxy.host && p.port === proxy.port)
    );
    
    this.deadProxies.push(proxy);
    console.log(`⚡ ${this.proxies.length} proxies remaining`);
  }
  
  // Get proxy count
  getProxyCount() {
    return this.proxies.length;
  }
  
  // Helper
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = ProxyManager;
