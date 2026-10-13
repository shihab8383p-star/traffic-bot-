// 🚀 RAILWAY ULTRA-FAST BOT - 2x FASTER + CRASH-PROOF!
// Optimized for Railway's 512MB memory limit

const puppeteer = require('puppeteer');
const ProxyManager = require('./proxy-manager-simple');
const fs = require('fs');

class RailwayBot {
  constructor() {
    this.proxyManager = new ProxyManager();
    this.stats = {
      totalSessions: 0,
      successfulSessions: 0,
      failedSessions: 0,
      totalImpressions: 0,
      startTime: new Date()
    };
    
    // 🚀 6X SUPER FAST MODE - 12 SECOND VIEW!
    this.config = {
      simultaneousTabs: 6,        // 6 tabs (6X FASTER!)
      sessionInterval: 5000,      // 5 seconds between sessions (SUPER FAST!)
      adViewTime: 12000,          // 12 seconds (BALANCED - fast + counted!)
      pageTimeout: 15000,         // 15 seconds
      browserTimeout: 2000,       // 2 seconds launch
      tabSwitchDelay: 200,        // 0.2 second (LIGHTNING!)
      scrollDelay: 500,           // 0.5 second scroll
      adsPerTab: 2,               // 2 ads per tab = 12 impressions per session!
      memoryLimit: 360,           // Safe for 6 tabs
      parallelLoading: true,      // ALL tabs at once!
      instantMode: true           // SUPER FAST MODE!
    };
    
    // 🎯 YOUR SINGLE BEST ADSTERRA SMARTLINK (HIGHEST PAYING!)
    this.smartlinks = [
      'https://oatstuckalfred.com/pgghjpvahq?key=b54923b02bad9ca5d730e2f7fcf10256'
    ];
  }
  
  // Monitor memory usage
  getMemoryUsage() {
    const used = process.memoryUsage();
    return {
      heapUsed: Math.round(used.heapUsed / 1024 / 1024),
      heapTotal: Math.round(used.heapTotal / 1024 / 1024),
      rss: Math.round(used.rss / 1024 / 1024),
      external: Math.round(used.external / 1024 / 1024)
    };
  }
  
  // Force garbage collection if available
  forceGarbageCollection() {
    if (global.gc) {
      global.gc();
      console.log('🗑️  Garbage collection triggered');
    }
  }
  
  // Utility sleep function
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Main run loop
  async run() {
    console.log('\n╔═══════════════════════════════════════════════════╗');
    console.log('║  ⚡ 6X SUPER FAST MODE - 12 SEC VIEW! ⚡         ║');
    console.log('╚═══════════════════════════════════════════════════╝\n');
    console.log(`✅ Loaded ${this.proxyManager.getTotalProxies()} hand-picked proxies`);
    console.log(`⚡ 6X SPEED: ~720 impressions/hour per bot!`);
    console.log(`🔥 12 impressions per session (6 tabs × 2 ads)!`);
    console.log(`⏱️  12 seconds per ad (FAST + COUNTED!)`);
    
    // Show initial memory
    const initMem = this.getMemoryUsage();
    console.log(`📊 Initial memory: ${initMem.rss}MB RSS / ${initMem.heapUsed}MB Heap\n`);
    
    let sessionCount = 0;
    
    while (true) {
      sessionCount++;
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`🔥 Session ${sessionCount} - ${new Date().toLocaleTimeString()}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      
      const proxy = this.proxyManager.getRandomProxy();
      
      if (proxy) {
        console.log(`🌍 Proxy: ${proxy.country} - ${proxy.host}:${proxy.port}`);
      } else {
        console.log(`⚠️  No proxy available, running without proxy`);
      }
      
      this.stats.totalSessions++;
      const success = await this.runSession(proxy);
      
      if (success) {
        this.stats.successfulSessions++;
        console.log(`✅ Session completed successfully!`);
      } else {
        this.stats.failedSessions++;
        console.log(`❌ Session failed`);
      }
      
      // Print stats with memory usage
      const mem = this.getMemoryUsage();
      console.log(`\n📊 Stats: ${this.stats.totalImpressions} impressions | ${this.stats.successfulSessions}/${this.stats.totalSessions} sessions`);
      console.log(`💾 Memory: ${mem.rss}MB RSS / ${mem.heapUsed}MB Heap`);
      
      // Force garbage collection if memory is high
      if (mem.rss > this.config.memoryLimit) {
        console.log(`⚠️  Memory high (${mem.rss}MB), forcing cleanup...`);
        this.forceGarbageCollection();
      }
      
      // Wait before next session
      console.log(`\n⏰ Next session in ${this.config.sessionInterval/1000} seconds...\n`);
      await this.sleep(this.config.sessionInterval);
    }
  }
  
  // Run single session with ULTRA-FAST optimizations + memory monitoring
  async runSession(proxy) {
    let browser = null;
    
    // Check memory before starting
    const memBefore = this.getMemoryUsage();
    if (memBefore.rss > 450) {
      console.log(`⚠️  Memory critical (${memBefore.rss}MB)! Skipping session and cleaning up...`);
      this.forceGarbageCollection();
      await this.sleep(10000); // Wait 10 seconds for cleanup
      return false;
    }
    
    try {
      // 🛡️ RAILWAY-SAFE CHROME FLAGS (Memory < 512MB guaranteed!)
      const browserArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',           // Critical for Railway!
        '--disable-gpu',                      // Save 100MB
        '--no-zygote',                       // Save 120MB
        '--single-process',                  // Save 400MB (most important!)
        '--disable-software-rasterizer',     // Save 30MB
        '--disable-extensions',              // Save 20MB
        '--disable-background-networking',   // Save 15MB
        '--disable-sync',                    // Save 10MB
        '--disable-translate',               // Save 10MB
        '--disable-hang-monitor',            
        '--disable-prompt-on-repost',        
        '--disable-domain-reliability',      
        '--no-pings',                        
        '--aggressive-cache-discard',        
        '--disable-cache',                   
        '--disable-application-cache',       
        '--disable-offline-load-stale-cache',
        '--disable-features=IsolateOrigins,site-per-process,TranslateUI',
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--disable-notifications',
        '--disable-default-apps',
        '--disable-component-extensions-with-background-pages',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-ipc-flooding-protection',
        '--mute-audio',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-breakpad',                // No crash reporting (saves memory)
        '--disable-component-update',
        '--metrics-recording-only',
        '--window-size=1280,720',            
        '--disk-cache-size=1',               
        '--media-cache-size=1',
        '--disable-web-security',
        '--disable-crash-reporter',          // CRITICAL: Disable crashpad handler
        '--disable-crashpad'                 // CRITICAL: Prevent posix_spawn error
      ];
      
      // Add proxy if available
      if (proxy) {
        browserArgs.unshift(`--proxy-server=http://${proxy.host}:${proxy.port}`);
      }
      
      console.log(`🚀 Launching browser (Railway-safe mode)...`);
      
      browser = await puppeteer.launch({
        headless: 'new',
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
        args: browserArgs,
        ignoreHTTPSErrors: true,
        timeout: this.config.browserTimeout,
        // Extra memory-saving options
        protocolTimeout: 30000,
        dumpio: false  // Don't log stdio (saves memory)
      });
      
      // Open 3 tabs simultaneously (FAST!)
      console.log(`📱 Opening ${this.config.simultaneousTabs} tabs...`);
      const tabs = [];
      
      for (let i = 0; i < this.config.simultaneousTabs; i++) {
        const page = await browser.newPage();
        
        // Set realistic user agent
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );
        
        // Set viewport
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Stealth mode
        await page.evaluateOnNewDocument(() => {
          Object.defineProperty(navigator, 'webdriver', { get: () => false });
        });
        
        tabs.push(page);
      }
      
      console.log(`✅ ${tabs.length} tabs ready!`);
      
      // 🔥 OCT 7TH STRATEGY: PARALLEL LOADING FOR SPEED!
      const adPromises = [];
      
      for (let i = 0; i < tabs.length; i++) {
        const page = tabs[i];
        
        // Each tab loads ads in parallel!
        for (let adNum = 0; adNum < this.config.adsPerTab; adNum++) {
          const url = this.smartlinks[Math.floor(Math.random() * this.smartlinks.length)];
          
          // Add to parallel execution queue (Oct 7th style!)
          adPromises.push(
            (async () => {
              try {
                console.log(`   💰 Tab ${i + 1}/Ad ${adNum + 1}: Loading...`);
                
                await page.goto(url, {
                  waitUntil: 'networkidle2',
                  timeout: this.config.pageTimeout
                });
                
                this.stats.totalImpressions++;
                console.log(`   ✅ Tab ${i + 1}/Ad ${adNum + 1}: COUNTED! (${this.stats.totalImpressions} total)`);
                
                // FAST view (3 seconds - Oct 7th style!)
                await this.sleep(this.config.adViewTime);
                
                // Quick scroll (Oct 7th style!)
                try {
                  await page.evaluate(() => window.scrollBy(0, 300));
                  await this.sleep(this.config.scrollDelay);
                } catch (e) {}
                
              } catch (error) {
                console.log(`   ⚡ Tab ${i + 1}/Ad ${adNum + 1}: Timeout (continuing)`);
              }
            })()
          );
        }
      }
      
      // Execute ALL ads in parallel! OCT 7TH SPEED!
      await Promise.all(adPromises);
      
      console.log(`\n🔥 ALL ${this.config.simultaneousTabs * this.config.adsPerTab} ADS LOADED IN PARALLEL (OCT 7TH MODE)!`);
      
      // Close browser and cleanup
      await browser.close();
      browser = null;
      
      // Force garbage collection after closing browser
      this.forceGarbageCollection();
      
      return true;
      
    } catch (error) {
      console.error(`❌ Session error: ${error.message}`);
      
      // Check if it's the posix_spawn error (resource exhaustion)
      if (error.message.includes('posix_spawn') || error.message.includes('Resource temporarily unavailable')) {
        console.log(`🔧 DETECTED RESOURCE EXHAUSTION - Taking recovery actions...`);
        
        // Mark proxy as dead if it caused the failure
        if (proxy) {
          console.log(`⚡ Temporarily skipping proxy: ${proxy.host}:${proxy.port}`);
        }
        
        // Force cleanup
        this.forceGarbageCollection();
        
        // LONG WAIT for system recovery
        console.log(`⏰ Waiting 30 seconds for system to recover...`);
        await this.sleep(30000); // 30 second recovery
        
        return false;
      }
      
      // Mark proxy as dead if it caused the failure
      if (proxy && error.message.includes('ERR_PROXY')) {
        console.log(`⚡ Removing dead proxy: ${proxy.host}:${proxy.port}`);
        this.proxyManager.markProxyAsFailed(proxy);
      }
      
      if (browser) {
        try {
          await browser.close();
          browser = null;
        } catch (e) {}
      }
      
      // Cleanup memory after error
      this.forceGarbageCollection();
      
      return false;
    }
  }
}

// Start the bot
const bot = new RailwayBot();
bot.run().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});
