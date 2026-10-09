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
    
    // 🔥 HYPER-SPEED CONFIG - 4X FASTER! 🔥
    this.config = {
      simultaneousTabs: 5,        // 5 tabs for max impressions!
      sessionInterval: 15000,     // 15 seconds between sessions (4X FASTER!)
      adViewTime: 500,            // 0.5 seconds per ad (INSTANT!)
      pageTimeout: 8000,          // 8 seconds max
      browserTimeout: 3000,       // 3 seconds launch (INSTANT!)
      tabSwitchDelay: 100,        // 0.1 seconds (LIGHTNING!)
      scrollDelay: 100,           // 0.1 seconds (INSTANT!)
      adsPerTab: 2                // 2 ads per tab = 10 impressions per session!
    };
    
    // Smartlink URLs (Adsterra high-paying ads)
    this.smartlinks = [
      'https://oatstuckalfred.com/b1k0d8tddz?key=63f2065791683072cc66284d81040d48',
      'https://oatstuckalfred.com/waabkyh8?key=5e3c45ce83d8ec08d90f25db84c33279',
      'https://oatstuckalfred.com/bpc8myd?key=2fb128a5b56fa667d0af3ee8cd6f7c41',
      'https://oatstuckalfred.com/g0xkh45adk?key=d21965ec44c0fce4682fb4e71e8f7324'
    ];
  }
  
  // Utility sleep function
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Main run loop
  async run() {
    console.log('\n╔═══════════════════════════════════════════╗');
    console.log('║   🚀 HYPER-SPEED BOT - 4X FASTER! 🚀    ║');
    console.log('╚═══════════════════════════════════════════╝\n');
    console.log(`✅ Loaded ${this.proxyManager.getTotalProxies()} proxies`);
    console.log(`⚡ HYPER-SPEED: 4X faster than normal!`);
    console.log(`🔥 10 impressions per session!`);
    console.log(`⏱️  15 seconds between sessions!`);
    console.log(`🛡️  CRASH-PROOF: Railway optimized\n`);
    
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
      
      // Print stats
      console.log(`\n📊 Stats: ${this.stats.totalImpressions} impressions | ${this.stats.successfulSessions}/${this.stats.totalSessions} sessions`);
      
      // Wait before next session (ULTRA FAST - 30 seconds!)
      console.log(`\n⏰ Next session in ${this.config.sessionInterval/1000} seconds...\n`);
      await this.sleep(this.config.sessionInterval);
    }
  }
  
  // Run single session with ULTRA-FAST optimizations
  async runSession(proxy) {
    let browser = null;
    
    try {
      // 🛡️ RAILWAY-OPTIMIZED CHROME FLAGS (prevents crash!)
      const browserArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',           // Critical for Railway!
        '--disable-gpu',                      // Save memory
        '--no-zygote',                       // Prevent resource exhaustion
        '--single-process',                  // Use single process mode
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-infobars',
        '--disable-notifications',
        '--mute-audio',
        '--no-first-run',
        '--disable-background-timer-throttling',
        '--window-size=1920,1080',
        '--disable-web-security'
      ];
      
      // Add proxy if available
      if (proxy) {
        browserArgs.unshift(`--proxy-server=http://${proxy.host}:${proxy.port}`);
      }
      
      console.log(`🚀 Launching browser (ULTRA-FAST mode)...`);
      
      browser = await puppeteer.launch({
        headless: 'new',
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
        args: browserArgs,
        ignoreHTTPSErrors: true,
        timeout: this.config.browserTimeout  // 5 seconds max!
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
      
      // Load smartlinks in each tab (HYPER-FAST - 4X SPEED!)
      for (let i = 0; i < tabs.length; i++) {
        const page = tabs[i];
        
        // Each tab loads 2 ads! (more impressions per session)
        for (let adNum = 0; adNum < this.config.adsPerTab; adNum++) {
          const url = this.smartlinks[Math.floor(Math.random() * this.smartlinks.length)];
          
          console.log(`   💰 Tab ${i + 1}/Ad ${adNum + 1}: Loading...`);
          
          try {
            await page.goto(url, {
              waitUntil: 'domcontentloaded',
              timeout: this.config.pageTimeout
            });
            
            console.log(`   ✅ Tab ${i + 1}/Ad ${adNum + 1}: Loaded`);
            this.stats.totalImpressions++;
            
            // HYPER-FAST: Just 0.5 seconds!
            await this.sleep(this.config.adViewTime);
            
            // Lightning-fast scroll
            try {
              await page.evaluate(() => window.scrollBy(0, 300));
              await this.sleep(this.config.scrollDelay);
              console.log(`   📊 Tab ${i + 1}/Ad ${adNum + 1}: ✓`);
            } catch (e) {}
            
          } catch (error) {
            console.log(`   ⚠️  Tab ${i + 1}: Timeout (normal)`);
          }
          
          // INSTANT switching!
          await this.sleep(this.config.tabSwitchDelay);
        }
      }
      
      // Close browser
      await browser.close();
      
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
        } catch (e) {}
      }
      
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
