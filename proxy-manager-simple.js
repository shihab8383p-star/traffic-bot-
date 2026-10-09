// 🚀 SIMPLE PROXY MANAGER - ULTRA FAST!
// Uses only verified working proxies from local file

const fs = require('fs');

class ProxyManager {
  constructor() {
    this.proxies = [];
    this.currentIndex = 0;
    this.loadProxies();
  }
  
  // Load proxies from local file ONLY (no API, no GitHub - SUPER FAST!)
  loadProxies() {
    try {
      const proxyFile = './proxies.json';
      if (fs.existsSync(proxyFile)) {
        const data = JSON.parse(fs.readFileSync(proxyFile, 'utf8'));
        this.proxies = data.proxies || [];
        console.log(`✅ Loaded ${this.proxies.length} verified working proxies`);
      } else {
        console.log('❌ No proxies.json found!');
      }
    } catch (error) {
      console.log('❌ Error loading proxies:', error.message);
    }
  }
  
  // Get next proxy (round-robin)
  getNextProxy() {
    if (this.proxies.length === 0) {
      return null;
    }
    
    const proxy = this.proxies[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
    return proxy;
  }
  
  // Get random proxy
  getRandomProxy() {
    if (this.proxies.length === 0) {
      return null;
    }
    return this.proxies[Math.floor(Math.random() * this.proxies.length)];
  }
  
  // Remove dead proxy
  markProxyAsFailed(proxy) {
    this.proxies = this.proxies.filter(p => 
      !(p.host === proxy.host && p.port === proxy.port)
    );
    console.log(`🗑️  Removed dead proxy: ${proxy.host}:${proxy.port}`);
    console.log(`📊 Remaining proxies: ${this.proxies.length}`);
  }
  
  // Get total proxy count
  getTotalProxies() {
    return this.proxies.length;
  }
}

module.exports = ProxyManager;
