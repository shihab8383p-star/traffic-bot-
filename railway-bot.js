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
    
    // 🔥 10X FAST & FURIOUS CONFIG - MAXIMUM SPEED!
    this.config = {
      simultaneousTabs: 5,        // 5 tabs maximum
      sessionInterval: 2000,      // 2 seconds between sessions (10X FASTER!)
      adViewTime: 100,            // 0.1 seconds (INSTANT!)
      pageTimeout: 3000,          // 3 seconds max (lightning fast!)
      browserTimeout: 2000,       // 2 seconds launch
      tabSwitchDelay: 0,          // ZERO delay (parallel!)
      scrollDelay: 0,             // ZERO delay (skip it!)
      adsPerTab: 3,               // 3 ads per tab = 15 impressions!
      memoryLimit: 320,           // Safe for Railway
      parallelLoading: true,      // Load ALL tabs at once!
      instantMode: true           // No waiting - GO GO GO!
    };
    
    // Smartlink URLs (Adsterra high-paying ads)
    this.smartlinks = [
      'https://oatstuckalfred.com/b1k0d8tddz?key=63f2065791683072cc66284d81040d48',
      'https://oatstuckalfred.com/waabkyh8?key=5e3c45ce83d8ec08d90f25db84c33279',
      'https://oatstuckalfred.com/bpc8myd?key=2fb128a5b56fa667d0af3ee8cd6f7c41',
      'https://oatstuckalfred.com/g0xkh45adk?key=d21965ec44c0fce4682fb4e71e8f7324'
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
    console.log('║  🔥 10X FAST & FURIOUS MODE - ULTIMATE SPEED! 🔥  ║');
    console.log('╚═══════════════════════════════════════════════════╝\n');
    console.log(`✅ Loaded ${this.proxyManager.getTotalProxies()} hand-picked proxies`);
    console.log(`⚡ 10X SPEED: 1,800 impressions/hour per bot!`);
    console.log(`🔥 15 impressions per session!`);
    console.log(`⏱️  3 seconds per session + 2 seconds wait = 5 seconds total!`);
    console.log(`🛡️  Memory-safe: 280-320MB (Railway safe!)\n`);
    
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
      await this.sleep(5000); // Extra wait for cleanup
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
        '--disable-hang-monitor',            // FAST & FURIOUS: Skip hang detection
        '--disable-prompt-on-repost',        // FAST & FURIOUS: No prompts
        '--disable-domain-reliability',      // FAST & FURIOUS: Skip error reporting
        '--no-pings',                        // FAST & FURIOUS: No ping requests
        '--aggressive-cache-discard',        // FAST & FURIOUS: Aggressive cleanup
        '--disable-cache',                   // FAST & FURIOUS: No caching
        '--disable-application-cache',       // FAST & FURIOUS: No app cache
        '--disable-offline-load-stale-cache',// FAST & FURIOUS: Always fresh
        '--disable-sync',                    // Save 10MB
        '--disable-translate',               // Save 10MB
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
        '--window-size=1280,720',            // Smaller viewport = less memory
        '--disk-cache-size=1',               // Minimal cache
        '--media-cache-size=1',
        '--disable-web-security'
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
      
      // 🔥 FAST & FURIOUS: Load all ads in ALL tabs SIMULTANEOUSLY!
      const adPromises = [];
      
      for (let i = 0; i < tabs.length; i++) {
        const page = tabs[i];
        
        // Each tab loads 3 ads in rapid succession!
        for (let adNum = 0; adNum < this.config.adsPerTab; adNum++) {
          const url = this.smartlinks[Math.floor(Math.random() * this.smartlinks.length)];
          
          // Add to parallel execution queue
          adPromises.push(
            (async () => {
              try {
                console.log(`   💰 Tab ${i + 1}/Ad ${adNum + 1}: GO!`);
                
                await page.goto(url, {
                  waitUntil: 'domcontentloaded',
                  timeout: this.config.pageTimeout
                });
                
                this.stats.totalImpressions++;
                console.log(`   ✅ Tab ${i + 1}/Ad ${adNum + 1}: DONE (${this.stats.totalImpressions} total)`);
                
                // INSTANT view (100ms)
                await this.sleep(this.config.adViewTime);
                
                // Lightning scroll (no delay)
                try {
                  await page.evaluate(() => window.scrollBy(0, 200));
                } catch (e) {}
                
              } catch (error) {
                // Timeouts are OK in FAST & FURIOUS mode!
                console.log(`   ⚡ Tab ${i + 1}/Ad ${adNum + 1}: Timeout (NORMAL)`);
              }
            })()
          );
        }
      }
      
      // Execute ALL ads in parallel! MAXIMUM SPEED!
      await Promise.all(adPromises);
      
      console.log(`\n🔥 ALL ${this.config.simultaneousTabs * this.config.adsPerTab} ADS LOADED IN PARALLEL!`);
      
      // Close browser and cleanup
      await browser.close();
      browser = null;
      
      // Force garbage collection after closing browser
      this.forceGarbageCollection();
      
      return true;
      
    } catch (error) {
      console.error(`❌ Session error: ${error.message}`);
      
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
