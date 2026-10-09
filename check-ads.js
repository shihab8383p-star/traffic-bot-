const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function checkAds() {
  console.log('🔍 Checking for ads on your website...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('📱 Loading website...');
    await page.goto('https://micro-works-platform-1.onrender.com', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('✅ Page loaded! Waiting for ads...\n');
    await page.waitForTimeout(5000); // Wait 5 seconds for ads
    
    // Scroll to bottom to load lazy-loaded ads
    console.log('🔽 Scrolling to bottom to load ads...');
    await page.evaluate(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    });
    
    await page.waitForTimeout(5000); // Wait 5 more seconds
    
    // Check for different ad types
    console.log('\n📊 AD DETECTION RESULTS:');
    console.log('═══════════════════════════════════════\n');
    
    // Adsterra ads
    const adsterraAds = await page.$$('[class*="adsterra"], [id*="adsterra"]');
    console.log(`🎯 Adsterra ads: ${adsterraAds.length} found`);
    
    // Google Adsense
    const adsenseAds = await page.$$('ins.adsbygoogle, iframe[id*="google_ads"]');
    console.log(`🎯 Google Adsense: ${adsenseAds.length} found`);
    
    // Generic ad containers
    const genericAds = await page.$$('div[class*="ad"], div[id*="ad"]');
    console.log(`🎯 Generic ad containers: ${genericAds.length} found`);
    
    // Iframes (often used for ads)
    const iframes = await page.$$('iframe');
    console.log(`🎯 Iframes: ${iframes.length} found`);
    
    // External links (potential ads)
    const externalLinks = await page.$$('a[target="_blank"]');
    console.log(`🎯 External links: ${externalLinks.length} found`);
    
    // Footer ads
    const footerAds = await page.$$('footer a[href^="http"]');
    console.log(`🎯 Footer ads: ${footerAds.length} found`);
    
    console.log('\n═══════════════════════════════════════');
    
    // Get all clickable elements at bottom
    const bottomElements = await page.evaluate(() => {
      const pageHeight = document.body.scrollHeight;
      const bottomThreshold = pageHeight * 0.70; // Bottom 30%
      
      const allLinks = Array.from(document.querySelectorAll('a, button, iframe'));
      const bottomLinks = allLinks.filter(el => {
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        return elementTop >= bottomThreshold && rect.width > 0 && rect.height > 0;
      });
      
      return bottomLinks.map(el => ({
        tag: el.tagName,
        text: (el.textContent || el.innerText || '').substring(0, 50),
        href: el.href || el.src || '',
        classes: el.className,
        id: el.id
      }));
    });
    
    console.log(`\n🔥 ELEMENTS IN BOTTOM 30% OF PAGE: ${bottomElements.length}`);
    if (bottomElements.length > 0) {
      console.log('\nSample elements:');
      bottomElements.slice(0, 10).forEach((el, i) => {
        console.log(`\n${i + 1}. <${el.tag}>`);
        console.log(`   Text: "${el.text}"`);
        console.log(`   Href: ${el.href}`);
        console.log(`   Classes: ${el.classes}`);
        console.log(`   ID: ${el.id}`);
      });
    }
    
    console.log('\n\n✅ Check complete! Keeping browser open for 30 seconds so you can inspect...\n');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await browser.close();
  console.log('\n✅ Browser closed');
}

checkAds();
