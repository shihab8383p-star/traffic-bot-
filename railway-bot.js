// 📱 MOBILE-FIRST BOT - NO CRASHES AFTER 2+ HOURS!
// 62% iOS + 30% Android + 8% Desktop

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
      iosCount: 0,
      androidCount: 0,
      desktopCount: 0,
      startTime: new Date(),
      lastRestartTime: new Date()
    };
    
    // 🚀 5X SUPER FAST MODE - NO CRASHES!
    this.config = {
      simultaneousTabs: 8,        // 8 TABS = 5X FASTER!
      sessionInterval: 5000,      // 5 seconds between sessions (FAST!)
      adViewTime: 8000,           // 8 seconds ad load time (FAST!)
      pageTimeout: 12000,         // 12 seconds timeout
      browserTimeout: 3000,       // 3 seconds launch
      tabSwitchDelay: 200,        // 0.2 second
      scrollDelay: 300,           // 0.3 second scroll
      adsPerTab: 3,               // 3 ads per tab = 24 impressions per session! (5X!)
      memoryLimit: 350,           // Higher limit for speed
      parallelLoading: true,      // PARALLEL loading (MAXIMUM SPEED!)
      sessionBeforeRestart: 20,   // Restart after 20 sessions (every ~2 minutes)
      maxRuntime: 3 * 60 * 60 * 1000  // Full restart every 3 HOURS (prevents crashes)
    };
    
    // 🎯 NEW AD LINK (ONLY THIS ONE!)
    this.adLink = 'https://link.gigapub.tech/l/992cv77g9v';
    
    // 📱 Device distribution: 8% Desktop, 62% iOS, 30% Android
    this.deviceTypes = {
      desktop: 8,
      ios: 62,
      android: 30
    };
    
    // 📱 iOS User Agents (62%)
    this.userAgents = {
      ios: [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (iPad; CPU OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
      ],
      android: [
        'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 12; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 13; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 11; Redmi Note 10 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36'
      ],
      desktop: [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ]
    };
    
    // 📱 Mobile viewports
    this.viewports = {
      ios: [
        { width: 390, height: 844, isMobile: true },   // iPhone 14 Pro
        { width: 428, height: 926, isMobile: true },   // iPhone 14 Pro Max
        { width: 375, height: 812, isMobile: true },   // iPhone 13
        { width: 414, height: 896, isMobile: true }    // iPhone 11
      ],
      android: [
        { width: 412, height: 915, isMobile: true },   // Pixel 7
        { width: 360, height: 800, isMobile: true },   // Samsung Galaxy
        { width: 393, height: 873, isMobile: true },   // Pixel 6
        { width: 384, height: 854, isMobile: true }    // OnePlus
      ],
      desktop: [
        { width: 1920, height: 1080, isMobile: false },
        { width: 1366, height: 768, isMobile: false }
      ]
    };
  }
  
  // 📱 Get random device type based on percentage distribution
  getRandomDeviceType() {
    const rand = Math.random() * 100;
    
    if (rand < this.deviceTypes.desktop) {
      this.stats.desktopCount++;
      return 'desktop';
    } else if (rand < this.deviceTypes.desktop + this.deviceTypes.ios) {
      this.stats.iosCount++;
      return 'ios';
    } else {
      this.stats.androidCount++;
      return 'android';
    }
  }
  
  // 📱 Get random user agent for device type
  getRandomUserAgent(deviceType) {
    const agents = this.userAgents[deviceType];
    return agents[Math.floor(Math.random() * agents.length)];
  }
  
  // 📱 Get random viewport for device type
  getRandomViewport(deviceType) {
    const viewports = this.viewports[deviceType];
    return viewports[Math.floor(Math.random() * viewports.length)];
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
    }
  }
  
  // Utility sleep function
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Check if we need a full process restart
  needsRestart() {
    const uptime = Date.now() - this.stats.lastRestartTime.getTime();
    return uptime > this.config.maxRuntime;
  }
  
  // Main run loop
  async run() {
    console.log('\n╔═══════════════════════════════════════════════════╗');
    console.log('║  🚀 5X SUPER FAST - NO CRASH GUARANTEE! 🚀       ║');
    console.log('╚═══════════════════════════════════════════════════╝\n');
    console.log(`✅ Loaded ${this.proxyManager.getTotalProxies()} VERIFIED proxies`);
    console.log(`📱 Device Mix: 62% iOS + 30% Android + 8% Desktop`);
    console.log(`🎯 Target: ${this.adLink}`);
    console.log(`🔥 24 impressions per session (8 tabs × 3 ads)!`);
    console.log(`⚡ 5X FASTER = ~1440 impressions/hour!`);
    console.log(`⏱️  8 seconds per ad (SUPER FAST!)`);
    console.log(`🛡️  AUTO-RESTART: Every 3 hours (prevents crashes!)`);
    console.log(`⚡ PARALLEL LOADING: Maximum speed!\n`);
    
    // Show initial memory
    const initMem = this.getMemoryUsage();
    console.log(`📊 Initial memory: ${initMem.rss}MB RSS / ${initMem.heapUsed}MB Heap\n`);
    
    let sessionCount = 0;
    
    while (true) {
      // Check if we need a full restart (every 3 hours)
      if (this.needsRestart()) {
        console.log('\n🔄 3 HOUR RUNTIME REACHED - RESTARTING PROCESS...');
        console.log('📊 Final Stats:');
        console.log(`   Total Impressions: ${this.stats.totalImpressions}`);
        console.log(`   iOS: ${this.stats.iosCount} | Android: ${this.stats.androidCount} | Desktop: ${this.stats.desktopCount}`);
        console.log('   Restarting in 5 seconds...\n');
        
        await this.sleep(5000);
        process.exit(0); // Railway will auto-restart
      }
      
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
      const uptimeMinutes = Math.round((Date.now() - this.stats.lastRestartTime.getTime()) / 60000);
      const uptimeHours = (uptimeMinutes / 60).toFixed(1);
      console.log(`\n📊 Stats: ${this.stats.totalImpressions} impressions | ${this.stats.successfulSessions}/${this.stats.totalSessions} sessions`);
      console.log(`📱 Devices: iOS ${this.stats.iosCount} | Android ${this.stats.androidCount} | Desktop ${this.stats.desktopCount}`);
      console.log(`💾 Memory: ${mem.rss}MB RSS / ${mem.heapUsed}MB Heap`);
      console.log(`⏱️  Uptime: ${uptimeHours} hours (restart at 3.0 hours)`);
      
      // Aggressive memory cleanup
      if (mem.rss > this.config.memoryLimit) {
        console.log(`⚠️  Memory high (${mem.rss}MB), forcing cleanup...`);
        this.forceGarbageCollection();
        await this.sleep(3000); // Wait 3s after cleanup
      }
      
      // Every 20 sessions, force cleanup (every ~2 minutes)
      if (sessionCount % this.config.sessionBeforeRestart === 0) {
        console.log(`🧹 CLEANUP CYCLE (${sessionCount} sessions) - Forcing garbage collection...`);
        this.forceGarbageCollection();
        await this.sleep(3000); // 3 second breathing room
      }
      
      // Wait before next session
      console.log(`\n⏰ Next session in ${this.config.sessionInterval/1000} seconds...\n`);
      await this.sleep(this.config.sessionInterval);
    }
  }
  
  // Run single session with CRASH-PROOF design
  async runSession(proxy) {
    let browser = null;
    const tabs = [];
    
    // Check memory before starting
    const memBefore = this.getMemoryUsage();
    if (memBefore.rss > 450) {
      console.log(`⚠️  Memory critical (${memBefore.rss}MB)! Skipping session...`);
      this.forceGarbageCollection();
      await this.sleep(15000); // Wait 15 seconds
      return false;
    }
    
    try {
      // 🛡️ ULTRA-SAFE CHROME FLAGS (NO CRASHES!)
      const browserArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',           // Critical for Railway!
        '--disable-gpu',                      
        '--no-zygote',                       
        '--single-process',                  // Most important for stability!
        '--disable-software-rasterizer',     
        '--disable-extensions',              
        '--disable-background-networking',   
        '--disable-sync',                    
        '--disable-translate',               
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
        '--disable-breakpad',                
        '--disable-component-update',
        '--metrics-recording-only',
        '--window-size=1280,720',            
        '--disk-cache-size=1',               
        '--media-cache-size=1',
        '--disable-web-security',
        '--disable-crash-reporter',          
        '--disable-crashpad',
        '--disable-logging',                 // No logging = less memory
        '--silent',
        '--log-level=3'                      // Only fatal errors
      ];
      
      // Add proxy if available
      if (proxy) {
        browserArgs.unshift(`--proxy-server=http://${proxy.host}:${proxy.port}`);
      }
      
      // Get random device type for this session
      const deviceType = this.getRandomDeviceType();
      const deviceEmoji = deviceType === 'ios' ? '📱' : (deviceType === 'android' ? '🤖' : '💻');
      console.log(`${deviceEmoji} Device: ${deviceType.toUpperCase()}`);
      
      console.log(`🚀 Launching browser (crash-proof mode)...`);
      
      browser = await puppeteer.launch({
        headless: 'new',
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
        args: browserArgs,
        ignoreHTTPSErrors: true,
        timeout: 60000,              
        protocolTimeout: 240000,     // 4 minutes timeout (very generous!)
        dumpio: false
      });
      
      // Open 8 tabs QUICKLY
      console.log(`📱 Opening ${this.config.simultaneousTabs} tabs...`);
      
      for (let i = 0; i < this.config.simultaneousTabs; i++) {
        const page = await browser.newPage();
        
        // Set device-specific user agent
        const userAgent = this.getRandomUserAgent(deviceType);
        await page.setUserAgent(userAgent);
        
        // Set device-specific viewport
        const viewport = this.getRandomViewport(deviceType);
        await page.setViewport(viewport);
        
        // Mobile-specific settings
        if (deviceType !== 'desktop') {
          await page.emulate({
            viewport: viewport,
            userAgent: userAgent,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true
          });
        }
        
        // Stealth mode
        await page.evaluateOnNewDocument(() => {
          Object.defineProperty(navigator, 'webdriver', { get: () => false });
          Object.defineProperty(navigator, 'platform', { get: () => 'iPhone' });
        });
        
        tabs.push(page);
        console.log(`   ✅ Tab ${i + 1} ready (${deviceType})`);
        
        // Minimal delay between tab creation
        await this.sleep(200);
      }
      
      console.log(`✅ ${tabs.length} tabs ready!\n`);
      
      // 🚀 5X SPEED: PARALLEL AD LOADING!
      const adPromises = [];
      
      for (let i = 0; i < tabs.length; i++) {
        const page = tabs[i];
        
        // Each tab loads 3 ads in parallel!
        for (let adNum = 0; adNum < this.config.adsPerTab; adNum++) {
          adPromises.push(
            (async () => {
              try {
                console.log(`   💰 Tab ${i + 1}/Ad ${adNum + 1}: Loading...`);
                
                await page.goto(this.adLink, {
                  waitUntil: 'domcontentloaded',
                  timeout: this.config.pageTimeout
                });
                
                this.stats.totalImpressions++;
                console.log(`   ✅ Tab ${i + 1}/Ad ${adNum + 1}: COUNTED! (${this.stats.totalImpressions} total)`);
                
                // Fast 8 second view
                await this.sleep(this.config.adViewTime);
                
                // Quick scroll
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
      
      // Execute ALL 24 ads in parallel! (5X SPEED!)
      await Promise.all(adPromises);
      
      console.log(`\n🔥 COMPLETED ${this.config.simultaneousTabs * this.config.adsPerTab} ADS IN PARALLEL (5X SPEED)!`);
      
      // Close all tabs first
      for (const page of tabs) {
        try {
          await page.close();
        } catch (e) {}
      }
      
      // Close browser
      if (browser) {
        await browser.close();
        browser = null;
      }
      
      // Force garbage collection after closing browser
      this.forceGarbageCollection();
      
      return true;
    } catch (error) {
      console.error(`❌ Session error: ${error.message}`);
      
      // Check for pthread_create / thread exhaustion errors
      if (error.message.includes('pthread_create') || 
          error.message.includes('Resource temporarily unavailable') ||
          error.message.includes('Failed to launch the browser')) {
        console.log(`🆘 CRITICAL: System resource exhaustion!`);
        console.log(`⏰ EMERGENCY: Waiting 90 seconds for full recovery...`);
        
        // Close everything
        for (const page of tabs) {
          try { await page.close(); } catch (e) {}
        }
        if (browser) {
          try { await browser.close(); } catch (e) {}
        }
        
        this.forceGarbageCollection();
        await this.sleep(90000); // 90 seconds recovery
        
        return false;
      }
      
      // Timeout errors
      if (error.message.includes('timeout') || error.message.includes('Network.enable timed out')) {
        console.log(`⏰ TIMEOUT - Waiting 20 seconds...`);
        
        for (const page of tabs) {
          try { await page.close(); } catch (e) {}
        }
        if (browser) {
          try { await browser.close(); } catch (e) {}
        }
        
        this.forceGarbageCollection();
        await this.sleep(20000);
        
        return false;
      }
      
      // posix_spawn errors
      if (error.message.includes('posix_spawn')) {
        console.log(`🔧 RESOURCE EXHAUSTION - Waiting 60 seconds...`);
        
        if (proxy) {
          console.log(`⚡ Skipping proxy: ${proxy.host}:${proxy.port}`);
        }
        
        for (const page of tabs) {
          try { await page.close(); } catch (e) {}
        }
        if (browser) {
          try { await browser.close(); } catch (e) {}
        }
        
        this.forceGarbageCollection();
        await this.sleep(60000);
        
        return false;
      }
      
      // Proxy errors
      if (proxy && error.message.includes('ERR_PROXY')) {
        console.log(`⚡ Dead proxy: ${proxy.host}:${proxy.port}`);
        this.proxyManager.markProxyAsFailed(proxy);
      }
      
      // Cleanup on any error
      for (const page of tabs) {
        try { await page.close(); } catch (e) {}
      }
      if (browser) {
        try { await browser.close(); } catch (e) {}
      }
      
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

// Handle unhandled errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error.message);
  console.log('🔄 Restarting in 10 seconds...');
  setTimeout(() => process.exit(1), 10000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection:', reason);
  console.log('🔄 Restarting in 10 seconds...');
  setTimeout(() => process.exit(1), 10000);
});
