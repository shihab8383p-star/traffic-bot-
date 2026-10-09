// 🔥 GOD-LEVEL AUTO-TRAFFIC GENERATOR V3.0 (ULTIMATE EDITION)
// AI-powered behavior, advanced evasion, maximum earnings

const puppeteer = require('puppeteer');
const ProxyManager = require('./proxy-manager-simple');
const fs = require('fs');

class AutoClickerBot {
  constructor() {
    this.proxyManager = new ProxyManager();
    this.websiteUrl = 'https://micro-works-platform-1.onrender.com';
    this.createdAccounts = []; // Store created accounts
    this.loadAccounts(); // Load previously created accounts
    this.stats = {
      accountsCreated: 0,
      accountsLoggedIn: 0,
      successfulLogins: 0,
      failedLogins: 0,
      totalVisits: 0,
      totalClicks: 0,
      totalJobClicks: 0,
      totalPages: 0,
      totalTypingEvents: 0,
      totalScrolls: 0,
      videosWatched: 0,
      jobsCompleted: 0,
      mobileVisits: 0,
      desktopVisits: 0,
      androidVisits: 0,
      iphoneVisits: 0,
      ipadVisits: 0,
      windowsVisits: 0,
      macVisits: 0,
      linuxVisits: 0,
      returnVisitors: 0,
      estimatedEarnings: 0,
      estimatedCommissions: 0,
      startTime: new Date(),
      proxyUsage: {},
      sessionHistory: [],
      isRunning: true,
      lastSession: null,
      sessionsCompleted: 0,
      sessionsFailed: 0,
      averageClickRate: 0,
      todayClickRate: 0
    };
    
    // Load previous stats if exists
    this.loadStats();
    
    // 🔥💰 MAXIMUM PROFIT MODE - AGGRESSIVE CLICKING!
    // INCREASED CLICK RATES: 60-80% (MUCH MORE CLICKS!)
    const todayClickRates = this.getDailyClickRates();
    
    this.config = {
      simultaneousTabs: 8, // 🔥 8 TABS at once for ULTRA SPEED!
      pagesPerSession: 10, // 🔥 10 pages per session (MORE IMPRESSIONS!)
      clickProbability: 0.0, // 🚫 NO CLICKS - Impressions only!
      jobClickProbability: 0.0, // 🚫 NO CLICKS - Impressions only!
      todayClickRateDisplay: '0.00', // Display as 0% (impressions only)
      minStayTime: 2, // ⚡ ULTRA FAST: 2 seconds minimum
      maxStayTime: 4, // ⚡ ULTRA FAST: 4 seconds maximum
      enableReferrers: true,
      enableSearchEngines: true,
      enableMouseMovements: false, // DISABLED for speed
      enableKeyboardEvents: false, // DISABLED for speed
      enableScrollVariations: true,
      enableSessionCookies: true,
      enableMobileSimulation: 0.97,
      enableReturnVisitors: 0.25,
      enableFormFilling: false, // DISABLED for speed
      enableVideoWatching: false, // DISABLED for speed
      enableRightClicks: false, // DISABLED for speed
      enableCopyPaste: false, // DISABLED for speed
      enableZoomActions: false, // DISABLED for speed
      enableTabSwitching: false, // DISABLED for speed
      aggressiveMode: true,
      stealthMode: true,
      humanBehaviorAI: false // DISABLED for speed - MAXIMUM SPEED MODE!
    };
    
    // Log mode
    console.log(`\n⚡📊 ULTRA FAST IMPRESSION MODE - NO CLICKS! 📊⚡`);
    console.log(`   🚫 Clicks: DISABLED (Impressions only)`);
    console.log(`   ⚡ Speed: ULTRA FAST (2-4 sec per page)`);
    console.log(`   📊 Mode: MAXIMUM IMPRESSIONS\n`);
    
    // 🎯 Enhanced referrer sources (20+ sources!)
    this.referrers = [
      'https://www.google.com/search?q=online+work+from+home+jobs',
      'https://www.google.com/search?q=make+money+online+fast',
      'https://www.google.com/search?q=micro+jobs+online+legit',
      'https://www.google.com/search?q=best+online+earning+sites',
      'https://www.bing.com/search?q=earn+money+online+without+investment',
      'https://www.bing.com/search?q=work+from+home+2026',
      'https://www.facebook.com/groups/workfromhome',
      'https://www.facebook.com/marketplace',
      'https://twitter.com/search?q=online+jobs',
      'https://www.reddit.com/r/WorkOnline',
      'https://www.reddit.com/r/beermoney',
      'https://www.reddit.com/r/sidehustle',
      'https://www.reddit.com/r/passive_income',
      'https://www.youtube.com/results?search_query=make+money+online',
      'https://www.linkedin.com/jobs',
      'https://www.instagram.com',
      'https://www.pinterest.com/search/pins/?q=work+from+home',
      'https://www.quora.com/topic/Working-From-Home',
      'https://medium.com/tag/work-from-home',
      'https://www.tiktok.com/tag/workfromhome'
    ];
    
    // 📱 Mobile user agents (35% mobile traffic)
    this.mobileUserAgents = [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 14; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 13; OnePlus 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'
    ];
    
    // 💻 Desktop user agents
    this.desktopUserAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0'
    ];
    
    // 🔥💰 ADSTERRA-ONLY MODE - MAXIMUM REVENUE!
    // NO regular pages - ONLY 2 ADSTERRA SMARTLINKS!
    this.pages = []; // NOT USED - We only visit smartlinks now!
    
    // 🔥💰 ADSTERRA SMARTLINKS - 100% FOCUS ON THESE 2 LINKS ONLY!
    // Bot will ONLY visit these 2 Adsterra links repeatedly for maximum impressions
    this.smartlinks = [
      'https://oatstuckalfred.com/pgghjpvahq?key=b54923b02bad9ca5d730e2f7fcf10256', // Adsterra 1
      'https://oatstuckalfred.com/b1k0d8tddz?key=63f2065791683072cc66284d81040d48'  // Adsterra 2
    ];
    
    console.log('🔥💰 ADSTERRA-ONLY MODE: Bot will ONLY visit 2 Adsterra smartlinks!');
    console.log('   ✅ Adsterra Link 1');
    console.log('   ✅ Adsterra Link 2');
    console.log('   ✅ 100% focus on Adsterra ad impressions!');
    console.log('   ❌ Monetag links REMOVED');
    
    // 🎲 Search queries for form filling
    this.searchQueries = [
      'data entry jobs',
      'survey jobs',
      'typing jobs',
      'easy tasks',
      'quick money',
      'online work'
    ];
  }
  
  // 🔥 Generate random email address
  generateRandomEmail() {
    const providers = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'protonmail.com'];
    const adjectives = ['cool', 'fast', 'smart', 'happy', 'lucky', 'super', 'mega', 'pro', 'elite', 'ultra'];
    const nouns = ['worker', 'user', 'task', 'job', 'earn', 'cash', 'money', 'work', 'hustle', 'pro'];
    
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 9999);
    const provider = providers[Math.floor(Math.random() * providers.length)];
    
    return `${randomAdj}${randomNoun}${randomNum}@${provider}`;
  }
  
  // 🔥 Generate random username
  generateRandomUsername() {
    const adjectives = ['cool', 'fast', 'smart', 'happy', 'lucky', 'super', 'mega', 'pro', 'elite', 'ultra'];
    const nouns = ['worker', 'user', 'task', 'job', 'earner', 'hustler', 'grinder', 'boss', 'master', 'pro'];
    
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 9999);
    
    return `${randomAdj}_${randomNoun}_${randomNum}`;
  }
  
  // 🔥 Generate random password
  generateRandomPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
  
  // 💾 Load previously created accounts
  loadAccounts() {
    try {
      if (fs.existsSync('./bot-accounts.json')) {
        const data = JSON.parse(fs.readFileSync('./bot-accounts.json', 'utf8'));
        this.createdAccounts = data.accounts || [];
        console.log(`📂 Loaded ${this.createdAccounts.length} existing accounts`);
      }
    } catch (error) {
      console.error('Error loading accounts:', error.message);
    }
  }
  
  // 💾 Save created accounts
  saveAccounts() {
    try {
      const data = {
        lastUpdate: new Date().toISOString(),
        totalAccounts: this.createdAccounts.length,
        accounts: this.createdAccounts
      };
      fs.writeFileSync('./bot-accounts.json', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving accounts:', error);
    }
  }
  
  // 🔥 Create a new account on the website
  async createAccount(page, tabIndex = 0) {
    try {
      console.log(`   👤 Tab ${tabIndex + 1}: Attempting to create account...`);
      
      // Generate random credentials
      const email = this.generateRandomEmail();
      const username = this.generateRandomUsername();
      const password = this.generateRandomPassword();
      const fullName = this.generateRandomFullName();
      
      // Check if page is valid
      await page.evaluate(() => true);
      
      // STEP 1: Look for "Create Free Account" or similar buttons on ANY page
      const signupSelectors = [
        'a:contains("Create Free Account")',
        'a:contains("Sign Up")',
        'a:contains("Register")',
        'button:contains("Sign Up")',
        'button:contains("Register")',
        'button:contains("Create Account")',
        'a[href*="signup"]',
        'a[href*="register"]',
        '.signup-btn',
        '.register-btn',
        '#signup',
        '#register',
        'a.btn-primary',
        'button.btn-primary'
      ];
      
      let signupClicked = false;
      
      // Try text-based selectors first
      try {
        const signupButtons = await page.$$('a, button');
        for (const button of signupButtons) {
          const text = await page.evaluate(el => el.textContent, button);
          if (text && (
            text.includes('Create Free Account') ||
            text.includes('Sign Up') ||
            text.includes('Register') ||
            text.includes('Get Started') ||
            text.includes('Join Now')
          )) {
            await button.click();
            await this.sleep(1000); // Wait for navigation/modal (SUPER FAST - 1 sec)
            signupClicked = true;
            console.log(`   ✅ Tab ${tabIndex + 1}: Clicked signup button: "${text.trim()}"`);
            break;
          }
        }
      } catch (e) {
        // Continue to next method
      }
      
      // If not clicked yet, try href-based selectors
      if (!signupClicked) {
        for (const selector of ['a[href*="signup"]', 'a[href*="register"]']) {
          try {
            const elements = await page.$$(selector);
            if (elements.length > 0) {
              await elements[0].click();
              await this.sleep(1000); // SUPER FAST (1 sec)
              signupClicked = true;
              console.log(`   ✅ Tab ${tabIndex + 1}: Clicked signup link`);
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }
      
      if (!signupClicked) {
        console.log(`   ⚠️  Tab ${tabIndex + 1}: No signup button found`);
        return false;
      }
      
      // STEP 2: Wait for signup form/page to load (SUPER FAST!)
      await this.sleep(1000); // 1 second (DOWN from 3!)
      
      // STEP 3: Fill in the registration form
      let fieldsFilledCount = 0;
      
      // Try to fill NAME/FULL NAME field
      const nameSelectors = [
        'input[name*="name"]',
        'input[id*="name"]',
        'input[placeholder*="name" i]',
        'input[placeholder*="full name" i]',
        'input[type="text"]'
      ];
      
      for (const selector of nameSelectors) {
        try {
          const input = await page.$(selector);
          if (input) {
            const currentValue = await page.evaluate(el => el.value, input);
            if (!currentValue) { // Only fill if empty
              await input.click();
              await this.sleep(100); // SUPER FAST (0.1 sec)
              await input.type(fullName, { delay: 20 + Math.random() * 30 }); // FASTER typing
              fieldsFilledCount++;
              console.log(`   👤 Tab ${tabIndex + 1}: Entered name: ${fullName}`);
              break;
            }
          }
        } catch (e) {
          continue;
        }
      }
      
      // Try to fill EMAIL field
      const emailSelectors = [
        'input[type="email"]',
        'input[name*="email"]',
        'input[id*="email"]',
        'input[placeholder*="email" i]'
      ];
      
      let emailFilled = false;
      for (const selector of emailSelectors) {
        try {
          const input = await page.$(selector);
          if (input) {
            const currentValue = await page.evaluate(el => el.value, input);
            if (!currentValue) {
              await input.click();
              await this.sleep(100); // SUPER FAST (0.1 sec)
              await input.type(email, { delay: 20 + Math.random() * 30 }); // FASTER typing
              emailFilled = true;
              fieldsFilledCount++;
              console.log(`   ✉️  Tab ${tabIndex + 1}: Entered email: ${email}`);
              break;
            }
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!emailFilled) {
        console.log(`   ⚠️  Tab ${tabIndex + 1}: Could not find email field`);
      }
      
      // Try to fill USERNAME field
      const usernameSelectors = [
        'input[name*="username"]',
        'input[id*="username"]',
        'input[placeholder*="username" i]'
      ];
      
      for (const selector of usernameSelectors) {
        try {
          const input = await page.$(selector);
          if (input) {
            const currentValue = await page.evaluate(el => el.value, input);
            if (!currentValue) {
              await input.click();
              await this.sleep(300);
              await input.type(username, { delay: 50 + Math.random() * 100 });
              fieldsFilledCount++;
              console.log(`   👤 Tab ${tabIndex + 1}: Entered username: ${username}`);
              break;
            }
          }
        } catch (e) {
          continue;
        }
      }
      
      // Try to fill PASSWORD field(s)
      const passwordSelectors = [
        'input[type="password"]',
        'input[name*="password"]',
        'input[id*="password"]'
      ];
      
      let passwordFilled = false;
      for (const selector of passwordSelectors) {
        try {
          const inputs = await page.$$(selector);
          if (inputs.length > 0) {
            // Fill first password field
            await inputs[0].click();
            await this.sleep(300);
            await inputs[0].type(password, { delay: 50 + Math.random() * 100 });
            passwordFilled = true;
            fieldsFilledCount++;
            console.log(`   🔒 Tab ${tabIndex + 1}: Entered password`);
            
            // If there's a confirm password field, fill it too
            if (inputs.length > 1) {
              await inputs[1].click();
              await this.sleep(300);
              await inputs[1].type(password, { delay: 50 + Math.random() * 100 });
              console.log(`   🔒 Tab ${tabIndex + 1}: Confirmed password`);
            }
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!passwordFilled) {
        console.log(`   ⚠️  Tab ${tabIndex + 1}: Could not find password field`);
      }
      
      // If no fields were filled, form doesn't exist
      if (fieldsFilledCount === 0) {
        console.log(`   ⚠️  Tab ${tabIndex + 1}: No signup form found`);
        return false;
      }
      
      await this.sleep(1500);
      
      // STEP 4: Submit the form
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:contains("Sign Up")',
        'button:contains("Register")',
        'button:contains("Create Account")',
        'button:contains("Join Now")',
        'button:contains("Get Started")',
        '.submit-btn',
        '.signup-btn',
        '.btn-primary',
        'button.btn'
      ];
      
      let formSubmitted = false;
      
      // Try text-based submit buttons
      try {
        const buttons = await page.$$('button');
        for (const button of buttons) {
          const text = await page.evaluate(el => el.textContent, button);
          if (text && (
            text.includes('Sign Up') ||
            text.includes('Register') ||
            text.includes('Create Account') ||
            text.includes('Join') ||
            text.includes('Submit') ||
            text.includes('Get Started')
          )) {
            await button.click();
            formSubmitted = true;
            console.log(`   ✅ Tab ${tabIndex + 1}: Clicked submit button: "${text.trim()}"`);
            break;
          }
        }
      } catch (e) {
        // Continue
      }
      
      // Try selector-based submit
      if (!formSubmitted) {
        for (const selector of submitSelectors) {
          try {
            const button = await page.$(selector);
            if (button) {
              await button.click();
              formSubmitted = true;
              console.log(`   ✅ Tab ${tabIndex + 1}: Submitted registration form`);
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }
      
      if (!formSubmitted) {
        // Try pressing Enter as fallback
        await page.keyboard.press('Enter');
        console.log(`   ✅ Tab ${tabIndex + 1}: Pressed Enter to submit`);
      }
      
      // Wait for registration to complete
      await this.sleep(5000);
      
      // Save the account
      const account = {
        email: email,
        username: username,
        password: password,
        fullName: fullName,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      };
      
      this.createdAccounts.push(account);
      this.saveAccounts();
      this.stats.accountsCreated++;
      
      console.log(`   🎉 Tab ${tabIndex + 1}: Account created successfully!`);
      console.log(`   📊 Total accounts created: ${this.stats.accountsCreated}`);
      
      return true;
      
    } catch (error) {
      console.log(`   ❌ Tab ${tabIndex + 1}: Account creation failed: ${error.message}`);
      return false;
    }
  }
  
  // 🔥 Generate random full name
  generateRandomFullName() {
    const firstNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
                        'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                       'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Walker', 'Hall'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  }
  
  // 🔥 Login with existing account
  async loginWithAccount(page, tabIndex = 0) {
    try {
      if (this.createdAccounts.length === 0) {
        return false;
      }
      
      // Pick a random account
      const account = this.createdAccounts[Math.floor(Math.random() * this.createdAccounts.length)];
      
      console.log(`   🔐 Tab ${tabIndex + 1}: Logging in with existing account...`);
      
      // Check if page is valid
      await page.evaluate(() => true);
      
      // Look for login button
      const loginSelectors = [
        'a[href*="login"]',
        'button:contains("Login")',
        'button:contains("Sign In")',
        'a:contains("Login")',
        'a:contains("Sign In")',
        '.login-btn',
        '#login'
      ];
      
      let loginClicked = false;
      for (const selector of loginSelectors) {
        try {
          const elements = await page.$$(selector);
          if (elements.length > 0) {
            await elements[0].click();
            await this.sleep(3000);
            loginClicked = true;
            console.log(`   ✅ Tab ${tabIndex + 1}: Clicked login button`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!loginClicked) {
        return false;
      }
      
      // Fill login form
      await this.sleep(2000);
      
      // Enter email/username
      const emailSelectors = [
        'input[type="email"]',
        'input[name*="email"]',
        'input[name*="username"]',
        'input[id*="email"]',
        'input[id*="username"]'
      ];
      
      for (const selector of emailSelectors) {
        try {
          const input = await page.$(selector);
          if (input) {
            await input.click();
            await this.sleep(500);
            await input.type(account.email, { delay: 50 + Math.random() * 100 });
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      // Enter password
      const passwordInput = await page.$('input[type="password"]');
      if (passwordInput) {
        await passwordInput.click();
        await this.sleep(500);
        await passwordInput.type(account.password, { delay: 50 + Math.random() * 100 });
      }
      
      await this.sleep(1500);
      
      // Submit login form
      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
      } else {
        await page.keyboard.press('Enter');
      }
      
      await this.sleep(5000);
      
      // Update account last used
      account.lastUsed = new Date().toISOString();
      this.saveAccounts();
      this.stats.accountsLoggedIn++;
      this.stats.successfulLogins++;
      
      console.log(`   ✅ Tab ${tabIndex + 1}: Logged in successfully!`);
      return true;
      
    } catch (error) {
      this.stats.failedLogins++;
      console.log(`   ⚠️  Tab ${tabIndex + 1}: Login failed`);
      return false;
    }
  }
  
  // 🔥 Complete Job Actions on External Sites (SUPER REALISTIC!)
  async completeJobActions(page, tabIndex = 0) {
    try {
      console.log(`   🎮 Tab ${tabIndex + 1}: Attempting to complete job tasks...`);
      
      // Check if page is valid
      await page.evaluate(() => true);
      
      // Wait for page to load (SUPER FAST!)
      await this.sleep(500); // 0.5 seconds (DOWN from 2!)
      
      const url = page.url();
      console.log(`   🌐 Tab ${tabIndex + 1}: On site: ${url.substring(0, 40)}...`);
      
      // 1. Look for and fill forms (surveys, signups, etc.)
      const formInputs = await page.$$('input[type="text"], input[type="email"], textarea');
      if (formInputs.length > 0) {
        console.log(`   📝 Tab ${tabIndex + 1}: Found ${formInputs.length} form fields, filling...`);
        
        for (let i = 0; i < Math.min(formInputs.length, 5); i++) {
          try {
            const input = formInputs[i];
            const placeholder = await page.evaluate(el => el.placeholder || el.name || '', input);
            
            let value = '';
            if (placeholder.toLowerCase().includes('email')) {
              value = this.generateRandomEmail();
            } else if (placeholder.toLowerCase().includes('name')) {
              value = ['John', 'Mike', 'Sarah', 'Emma'][Math.floor(Math.random() * 4)];
            } else {
              value = 'Test User';
            }
            
            await input.click();
            await this.sleep(100); // SUPER FAST (0.1 sec)
            await input.type(value, { delay: 20 + Math.random() * 30 }); // FASTER typing
            console.log(`   ✍️  Tab ${tabIndex + 1}: Filled field: ${placeholder.substring(0, 20)}`);
            await this.sleep(200); // SUPER FAST (0.2 sec)
          } catch (e) {
            continue;
          }
        }
      }
      
      // 2. Click checkboxes (terms/conditions, interests, etc.)
      const checkboxes = await page.$$('input[type="checkbox"]');
      if (checkboxes.length > 0 && checkboxes.length < 20) {
        console.log(`   ☑️  Tab ${tabIndex + 1}: Found ${checkboxes.length} checkboxes, checking...`);
        
        for (let i = 0; i < Math.min(checkboxes.length, 5); i++) {
          try {
            await checkboxes[i].click();
            await this.sleep(100 + Math.random() * 200); // SUPER FAST (0.1-0.3 sec)
          } catch (e) {
            continue;
          }
        }
      }
      
      // 3. Select radio buttons
      const radioButtons = await page.$$('input[type="radio"]');
      if (radioButtons.length > 0 && radioButtons.length < 30) {
        console.log(`   🔘 Tab ${tabIndex + 1}: Found radio buttons, selecting...`);
        
        // Select random options
        const groups = {};
        for (const radio of radioButtons) {
          try {
            const name = await page.evaluate(el => el.name, radio);
            if (!groups[name]) {
              groups[name] = [];
            }
            groups[name].push(radio);
          } catch (e) {
            continue;
          }
        }
        
        // Select one from each group
        for (const group of Object.values(groups)) {
          if (group.length > 0) {
            try {
              const randomOption = group[Math.floor(Math.random() * group.length)];
              await randomOption.click();
              await this.sleep(200); // SUPER FAST (0.2 sec)
            } catch (e) {
              continue;
            }
          }
        }
      }
      
      // 4. Click "Continue", "Next", "Submit" buttons
      const actionButtons = await page.$$('button, input[type="submit"]');
      for (const button of actionButtons) {
        try {
          const text = await page.evaluate(el => (el.textContent || el.value || '').toLowerCase(), button);
          
          if (text.includes('continue') || text.includes('next') || 
              text.includes('submit') || text.includes('start') ||
              text.includes('begin') || text.includes('proceed')) {
            
            console.log(`   🔘 Tab ${tabIndex + 1}: Clicking "${text.substring(0, 20)}" button...`);
            
            await button.scrollIntoView({ behavior: 'smooth' });
            await this.sleep(500); // SUPER FAST (0.5 sec)
            await button.click({ delay: 50 + Math.random() * 100 }); // FASTER click
            
            console.log(`   ✅ Tab ${tabIndex + 1}: Completed action!`);
            await this.sleep(1000 + Math.random() * 1000); // SUPER FAST (1-2 sec)
            
            // Only click one action button per visit
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      // 5. Click on offers/ads (if present)
      const offerLinks = await page.$$('a[class*="offer"], a[class*="ad"], div[class*="offer-item"]');
      if (offerLinks.length > 0 && Math.random() > 0.7) {
        try {
          const randomOffer = offerLinks[Math.floor(Math.random() * offerLinks.length)];
          await randomOffer.scrollIntoView({ behavior: 'smooth' });
          await this.sleep(500); // SUPER FAST (0.5 sec)
          await randomOffer.click();
          console.log(`   🎁 Tab ${tabIndex + 1}: Clicked on offer!`);
          await this.sleep(1000); // SUPER FAST (1 sec)
        } catch (e) {
          // Ignore
        }
      }
      
      // 6. Scroll through content (engagement signal)
      for (let i = 0; i < 3; i++) {
        try {
          await page.evaluate(() => window.scrollBy(0, 300 + Math.random() * 200));
          await this.sleep(500 + Math.random() * 500); // SUPER FAST (0.5-1 sec)
        } catch (e) {
          break;
        }
      }
      
      console.log(`   🎉 Tab ${tabIndex + 1}: Job actions completed!`);
      this.stats.estimatedCommissions += 0.5; // Estimate $0.50 commission
      
    } catch (error) {
      // Silently fail - not all pages have jobs to complete
    }
  }
  
  // 🎲 Calculate daily click rates based on day of year (8-12% range with decimal precision)
  getDailyClickRates() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Use day of year to generate consistent but varied click rates
    // Each day gets a unique rate between 8-12%
    const seed = dayOfYear;
    
    // Create pseudo-random but consistent decimal value based on day
    // This ensures same day always gets same rate, but looks natural
    const random1 = Math.sin(seed * 12.9898) * 43758.5453;
    const random2 = Math.sin(seed * 78.233) * 43758.5453;
    const decimal1 = random1 - Math.floor(random1);
    const decimal2 = random2 - Math.floor(random2);
    
    // Generate base rate between 8-12%
    const baseRate = 8 + (decimal1 * 4); // 8.0 to 12.0
    
    // Add more decimal precision (3-4 decimal places for natural look)
    const extraPrecision = decimal2 * 0.9999; // Add up to 0.9999
    const finalRate = baseRate + extraPrecision;
    
    // Clamp to 8-12 range
    const clampedRate = Math.min(12, Math.max(8, finalRate));
    
    // Determine pattern description
    let pattern = '';
    if (clampedRate < 9) {
      pattern = 'Low Activity Day';
    } else if (clampedRate < 10) {
      pattern = 'Normal Day';
    } else if (clampedRate < 11) {
      pattern = 'Busy Day';
    } else {
      pattern = 'Peak Activity Day';
    }
    
    // Display with 3-4 decimal places (looks like 8.367 or 12.3627)
    const decimals = (seed % 2 === 0) ? 3 : 4;
    const displayRate = clampedRate.toFixed(decimals);
    
    return {
      adClickRate: clampedRate / 100, // For actual probability (0.08-0.12)
      jobClickRate: clampedRate / 100, // Same rate for job clicks
      displayRate: displayRate, // For display (e.g., "8.367" or "12.3627")
      dayOfYear: dayOfYear,
      pattern: pattern
    };
  }
  
  // 💾 Save stats to file for dashboard
  saveStats() {
    try {
      const statsData = {
        ...this.stats,
        todayClickRate: this.config.todayClickRateDisplay,
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync('./bot-stats.json', JSON.stringify(statsData, null, 2));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  }
  
  // 📂 Load previous stats
  loadStats() {
    try {
      if (fs.existsSync('./bot-stats.json')) {
        const data = JSON.parse(fs.readFileSync('./bot-stats.json', 'utf8'));
        
        // Extract the actual stats object (handle nested structure)
        let actualStats = data.stats;
        while (actualStats && actualStats.stats && typeof actualStats.stats === 'object') {
          actualStats = actualStats.stats;
        }
        
        if (actualStats) {
          // Merge stats but keep new startTime and ensure all fields exist
          this.stats = {
            ...this.stats, // Keep defaults
            ...actualStats, // Override with saved values
            startTime: actualStats.startTime || new Date(),
            isRunning: true,
            sessionHistory: actualStats.sessionHistory || [],
            proxyUsage: actualStats.proxyUsage || {},
            // Ensure numeric fields exist
            accountsCreated: actualStats.accountsCreated || 0,
            accountsLoggedIn: actualStats.accountsLoggedIn || 0,
            successfulLogins: actualStats.successfulLogins || 0,
            failedLogins: actualStats.failedLogins || 0,
            totalVisits: actualStats.totalVisits || 0,
            totalClicks: actualStats.totalClicks || 0,
            totalJobClicks: actualStats.totalJobClicks || 0,
            totalPages: actualStats.totalPages || 0,
            sessionsCompleted: actualStats.sessionsCompleted || 0,
            sessionsFailed: actualStats.sessionsFailed || 0
          };
          console.log('📂 Loaded previous stats from file');
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error.message);
    }
  }
  
  // 🔥 GOD-LEVEL visitor session with AI behavior
  async visitWebsite(proxy) {
    let browser = null;
    try {
      console.log(`\n🔥 Starting GOD-LEVEL session with ${proxy.country} proxy...`);
      
      // Determine if mobile or desktop
      const isMobile = Math.random() < this.config.enableMobileSimulation;
      const isReturnVisitor = Math.random() < this.config.enableReturnVisitors && this.stats.sessionHistory.length > 0;
      
      // Determine specific device type
      let deviceType = '';
      let deviceEmoji = '';
      
      if (isMobile) {
        this.stats.mobileVisits++;
        const mobileTypes = ['iPhone', 'iPad', 'Android'];
        const weights = [0.45, 0.10, 0.45]; // 45% iPhone, 10% iPad, 45% Android (MOBILE-FOCUSED)
        const rand = Math.random();
        
        if (rand < weights[0]) {
          deviceType = 'iPhone';
          deviceEmoji = '📱';
          this.stats.iphoneVisits++;
        } else if (rand < weights[0] + weights[1]) {
          deviceType = 'iPad';
          deviceEmoji = '📱';
          this.stats.ipadVisits++;
        } else {
          deviceType = 'Android';
          deviceEmoji = '📱';
          this.stats.androidVisits++;
        }
      } else {
        this.stats.desktopVisits++;
        const desktopTypes = ['Windows', 'Mac', 'Linux'];
        const weights = [0.70, 0.25, 0.05]; // 70% Windows, 25% Mac, 5% Linux
        const rand = Math.random();
        
        if (rand < weights[0]) {
          deviceType = 'Windows';
          deviceEmoji = '💻';
          this.stats.windowsVisits++;
        } else if (rand < weights[0] + weights[1]) {
          deviceType = 'Mac';
          deviceEmoji = '💻';
          this.stats.macVisits++;
        } else {
          deviceType = 'Linux';
          deviceEmoji = '💻';
          this.stats.linuxVisits++;
        }
      }
      
      console.log(`   ${deviceEmoji} Device: ${deviceType}`);
      
      if (isReturnVisitor) {
        this.stats.returnVisitors++;
        console.log(`   🔄 Visitor Type: Returning`);
      } else {
        console.log(`   ⭐ Visitor Type: New`);
      }
      
      const proxyUrl = proxy ? `http://${proxy.host}:${proxy.port}` : null;
      
      // 🛡️ STEALTH MODE: Maximum anti-detection + Adsterra compatibility
      const browserArgs = [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--disable-dev-shm-usage', // 🔥 CRITICAL for Railway!
          '--disable-features=IsolateOrigins,site-per-process',
          '--disable-infobars',
          '--disable-notifications',
          '--disable-save-password-bubble',
          '--mute-audio',
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-background-timer-throttling',
          '--disable-renderer-backgrounding',
          '--disable-backgrounding-occluded-windows',
          '--window-size=1920,1080',
          '--flag-switches-begin',
          '--flag-switches-end',
          '--enable-features=NetworkService,NetworkServiceInProcess',
          '--proxy-bypass-list=<-loopback>',
          '--disable-web-security',
          '--ignore-certificate-errors',
          '--ignore-certificate-errors-spki-list',
          '--no-zygote', // 🔥 FIX: Prevent Railway resource exhaustion!
          '--single-process', // 🔥 FIX: Use single process mode on Railway!
          '--disable-gpu', // 🔥 FIX: Disable GPU to save resources
          isMobile ? '--user-agent=mobile' : '--user-agent=desktop'
        ];
      
      // Add proxy if available
      if (proxyUrl) {
        browserArgs.unshift(`--proxy-server=${proxyUrl}`);
      }
      
      browser = await puppeteer.launch({
        headless: 'new',
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
        args: browserArgs,
        ignoreHTTPSErrors: true,
        timeout: 10000 // ⚡ FAST: 10 seconds max (down from 60!)
      });
      
      // Track proxy usage
      if (proxy && proxy.host) {
        if (!this.stats.proxyUsage[proxy.host]) {
          this.stats.proxyUsage[proxy.host] = 0;
        }
        this.stats.proxyUsage[proxy.host]++;
      }
      
      // Open multiple tabs simultaneously (5 tabs like god-level!)
      const tabs = [];
      for (let i = 0; i < this.config.simultaneousTabs; i++) {
        const page = await browser.newPage();
        
        // 🔐 Proxy authentication (ONLY if username/password provided)
        if (proxy.username && proxy.password) {
          await page.authenticate({
            username: proxy.username,
            password: proxy.password
          });
        }
        // If no auth credentials, proxy is assumed to be open/public
        
        // 🛡️ ULTIMATE STEALTH: Advanced anti-detection for Adsterra
        await page.evaluateOnNewDocument(() => {
          // Hide webdriver
          Object.defineProperty(navigator, 'webdriver', {
            get: () => false
          });
          
          // Remove automation indicators
          delete navigator.__proto__.webdriver;
          
          // Fake Chrome plugins (more realistic)
          Object.defineProperty(navigator, 'plugins', {
            get: () => [
              { name: 'Chrome PDF Plugin', description: 'Portable Document Format', filename: 'internal-pdf-viewer' },
              { name: 'Chrome PDF Viewer', description: '', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
              { name: 'Native Client', description: '', filename: 'internal-nacl-plugin' }
            ]
          });
          
          // Fake languages
          Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en']
          });
          
          // Fake permissions
          const originalQuery = window.navigator.permissions.query;
          window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
              Promise.resolve({ state: Notification.permission }) :
              originalQuery(parameters)
          );
          
          // Override Chrome runtime
          window.chrome = {
            runtime: {},
            loadTimes: function() {},
            csi: function() {},
            app: {}
          };
          
          // Fake battery API
          Object.defineProperty(navigator, 'getBattery', {
            value: () => Promise.resolve({
              charging: true,
              chargingTime: 0,
              dischargingTime: Infinity,
              level: 0.85
            })
          });
          
          // Fake connection
          Object.defineProperty(navigator, 'connection', {
            value: {
              effectiveType: '4g',
              rtt: 50,
              downlink: 10,
              saveData: false
            }
          });
          
          // Fake hardware concurrency
          Object.defineProperty(navigator, 'hardwareConcurrency', {
            get: () => 8
          });
          
          // Fake device memory
          Object.defineProperty(navigator, 'deviceMemory', {
            get: () => 8
          });
          
          // Override toString to hide proxy
          const originalToString = Function.prototype.toString;
          Function.prototype.toString = function() {
            if (this === navigator.webdriver) {
              return 'function webdriver() { [native code] }';
            }
            return originalToString.call(this);
          };
        });
        
        // Set realistic user agent based on device type
        let userAgent;
        if (deviceType === 'iPhone') {
          userAgent = this.mobileUserAgents[0]; // iPhone user agent
        } else if (deviceType === 'iPad') {
          userAgent = this.mobileUserAgents[1]; // iPad user agent
        } else if (deviceType === 'Android') {
          const androidAgents = this.mobileUserAgents.slice(2); // Android user agents
          userAgent = androidAgents[Math.floor(Math.random() * androidAgents.length)];
        } else if (deviceType === 'Windows') {
          const windowsAgents = [this.desktopUserAgents[0], this.desktopUserAgents[1], this.desktopUserAgents[4]];
          userAgent = windowsAgents[Math.floor(Math.random() * windowsAgents.length)];
        } else if (deviceType === 'Mac') {
          const macAgents = [this.desktopUserAgents[2], this.desktopUserAgents[5]];
          userAgent = macAgents[Math.floor(Math.random() * macAgents.length)];
        } else { // Linux
          const linuxAgents = [this.desktopUserAgents[3], this.desktopUserAgents[6]];
          userAgent = linuxAgents[Math.floor(Math.random() * linuxAgents.length)];
        }
        await page.setUserAgent(userAgent);
        
        // Set viewport (mobile or desktop)
        let viewport;
        if (isMobile) {
          const mobileViewports = [
            { width: 375, height: 667, isMobile: true }, // iPhone SE
            { width: 414, height: 896, isMobile: true }, // iPhone 11 Pro Max
            { width: 390, height: 844, isMobile: true }, // iPhone 12/13
            { width: 393, height: 852, isMobile: true }, // Pixel 7
            { width: 412, height: 915, isMobile: true }  // Galaxy S21
          ];
          viewport = mobileViewports[Math.floor(Math.random() * mobileViewports.length)];
        } else {
          const desktopViewports = [
            { width: 1920, height: 1080 },
            { width: 1366, height: 768 },
            { width: 1536, height: 864 },
            { width: 1440, height: 900 },
            { width: 2560, height: 1440 }
          ];
          viewport = desktopViewports[Math.floor(Math.random() * desktopViewports.length)];
        }
        await page.setViewport(viewport);
        
        // Set referrer (from search engines/social media)
        if (this.config.enableReferrers && Math.random() > 0.3) {
          const referrer = this.referrers[Math.floor(Math.random() * this.referrers.length)];
          await page.setExtraHTTPHeaders({
            'Referer': referrer,
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'DNT': '1'
          });
          console.log(`   🔗 Referrer: ${referrer.substring(0, 50)}...`);
        }
        
        // Use cookies for return visitors
        if (isReturnVisitor && this.config.enableSessionCookies) {
          const previousSession = this.stats.sessionHistory[this.stats.sessionHistory.length - 1];
          if (previousSession && previousSession.cookies) {
            await page.setCookie(...previousSession.cookies);
            console.log(`   🍪 Loaded previous session cookies`);
          }
        }
        
        tabs.push(page);
      }
      
      console.log(`   📱 Opened ${tabs.length} tabs (GOD-LEVEL multi-tasking!)`);
      
      // 🎯 Browse multiple pages in each tab with ADVANCED behavior
      for (let tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
        const page = tabs[tabIndex];
        
        // 🔥 35% chance to create account or login (INCREASED for more ads!)
        const shouldCreateAccount = Math.random() < 0.35;
        const hasExistingAccounts = this.createdAccounts.length > 0;
        
        if (shouldCreateAccount) {
          if (hasExistingAccounts && Math.random() < 0.5) {
            // 50% chance to login if we have accounts
            await this.loginWithAccount(page, tabIndex);
          } else {
            // Otherwise create new account
            await this.createAccount(page, tabIndex);
          }
          
          // Wait a bit after account action (SUPER FAST!)
          await this.sleep(500 + Math.random() * 500);
        }
        
        // 🔥💰 SMARTLINK-ONLY MODE: Visit 6-10 smartlinks per session!
        const pagesToBrowse = 6 + Math.floor(Math.random() * 5); // 6-10 smartlinks per session
        
        for (let pageNum = 0; pageNum < pagesToBrowse; pageNum++) {
          // 🔥💰 100% SMARTLINKS - Pick random smartlink from the 4 available
          const fullUrl = this.smartlinks[Math.floor(Math.random() * this.smartlinks.length)];
          
          // All smartlinks are now ADSTERRA only!
          const isAdsterra = fullUrl.includes('oatstuckalfred.com');
          const networkName = '💰 ADSTERRA';
          
          console.log(`   ${networkName} Tab ${tabIndex + 1}: Loading smartlink ${pageNum + 1}/${pagesToBrowse}`);
          console.log(`   🌐 URL: ${fullUrl.substring(0, 60)}...`);
          
          try {
            await page.goto(fullUrl, { 
              waitUntil: 'domcontentloaded', // SUPER FAST: Don't wait for all network activity
              timeout: 15000 // 15 seconds timeout
            });
            
            this.stats.totalVisits++;
            this.stats.totalPages++;
            console.log(`   ✅ Smartlink loaded successfully`);
            
            // ⏰ SMARTLINK PAGE: ULTRA FAST MODE - minimal wait for impressions
            console.log(`   ⚡ Smartlink loaded - generating impression...`);
            await this.sleep(2000 + Math.random() * 2000); // 2-4 seconds ULTRA FAST!
            
            // 🔥 Scroll to trigger ad impressions (NO CLICKING!)
            try {
              // Scroll on the page (triggers ad impressions!)
              await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight * 0.5);
              });
              await this.sleep(500); // 0.5 second scroll
              
              // Scroll more to load all ads
              await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight * 0.3);
              });
              await this.sleep(500); // 0.5 second scroll
              
              // 🚫 NO CLICKING - IMPRESSIONS ONLY!
              console.log(`   📊 Ad impression generated (no clicks)`);
              
            } catch (adError) {
              console.log(`   ⚠️  Tab ${tabIndex + 1}: Smartlink interaction error: ${adError.message}`);
            }
            
            // 🔥 GOD-LEVEL user behavior simulation for ad clicking
            try {
              await this.simulateGodLevelBehavior(page, tabIndex, isMobile);
            } catch (behaviorError) {
              console.log(`   ⚠️  Tab ${tabIndex + 1}: Behavior error: ${behaviorError.message}`);
            }
            
            // Tab switching behavior (realistic multi-tasking)
            if (this.config.enableTabSwitching && tabs.length > 1 && Math.random() > 0.7) {
              console.log(`   🔄 Tab ${tabIndex + 1}: Switching to another tab...`);
              await this.sleep(500 + Math.random() * 500); // SUPER FAST tab switch (0.5-1 sec)
            }
            
            // Wait before loading next page (ULTRA FAST!)
            await this.sleep(300 + Math.random() * 700); // 0.3-1 second (ULTRA FAST!)
            
          } catch (error) {
            console.log(`   ⚠️  Tab ${tabIndex + 1} page load warning: ${error.message}`);
          }
        }
      }
      
      // Save cookies for return visits
      if (this.config.enableSessionCookies && tabs.length > 0) {
        try {
          const cookies = await tabs[0].cookies();
          this.stats.sessionHistory.push({
            timestamp: new Date(),
            cookies: cookies,
            proxy: proxy ? proxy.host : 'no-proxy'
          });
          // Keep last 10 sessions only
          if (this.stats.sessionHistory.length > 10) {
            this.stats.sessionHistory.shift();
          }
        } catch (e) {
          // Ignore cookie errors
        }
      }
      
      await browser.close();
      
      // Update session stats
      this.stats.sessionsCompleted++;
      this.stats.lastSession = {
        timestamp: new Date().toISOString(),
        visits: tabs.length * 3,
        clicks: this.stats.totalClicks,
        proxy: proxy ? `${proxy.country} (${proxy.location || 'Unknown'})` : 'Unknown'
      };
      
      // Save stats to file for dashboard
      this.saveStats();
      
      console.log(`   ✅ GOD-LEVEL session completed!`);
      console.log(`   📊 Total visits this session: ${tabs.length * 3}`);
      
      return true;
      
    } catch (error) {
      console.error(`   ❌ Session failed: ${error.message}`);
      
      // ⚡ FAST PROXY REMOVAL: If proxy caused the failure, remove it immediately!
      if (proxy && (
        error.message.includes('ERR_PROXY') ||
        error.message.includes('ERR_TUNNEL') ||
        error.message.includes('ERR_CONNECTION') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('ETIMEDOUT') ||
        error.message.includes('ERR_TIMED_OUT') ||
        error.message.includes('net::ERR')
      )) {
        console.log(`⚡ DEAD PROXY DETECTED - Removing ${proxy.host}:${proxy.port}`);
        this.proxyManager.markProxyAsFailed(proxy);
      }
      
      this.stats.sessionsFailed++;
      this.saveStats();
      if (browser) {
        try {
          await browser.close();
        } catch (e) {}
      }
      return false;
    }
  }
  
  // 🔥 GOD-LEVEL user behavior simulation with AI
  async simulateGodLevelBehavior(page, tabIndex = 0, isMobile = false) {
    try {
      console.log(`   🧠 Tab ${tabIndex + 1}: Activating GOD-LEVEL AI behavior...`);
      
      // Wait for page to be ready (SUPER FAST!)
      await this.sleep(500); // 0.5 seconds (DOWN from 2!)
      
      // Check if page is still valid (not closed or detached)
      let isPageValid = false;
      try {
        await page.evaluate(() => document.readyState);
        isPageValid = true;
      } catch (e) {
        console.log(`   ⚠️  Tab ${tabIndex + 1}: Page not ready, skipping behavior`);
        return;
      }
      
      // 🎲 Choose random behavior pattern
      const behaviorPatterns = [
        'researcher', 'job_hunter', 'quick_browser', 'thorough_reader', 'comparison_shopper'
      ];
      const pattern = behaviorPatterns[Math.floor(Math.random() * behaviorPatterns.length)];
      console.log(`   🎭 Tab ${tabIndex + 1}: ${pattern} persona`);
      
      // ====================================================================
      // 🎯 CLICK ADS AT THE BOTTOM OF THE PAGE (PRIMARY FOCUS!)
      // ====================================================================
      console.log(`   📜 Tab ${tabIndex + 1}: Scrolling DOWN to load and click bottom ads...`);
      
      // 🔥 STEP 1: INCREMENTAL SCROLL TO TRIGGER LAZY-LOADED ADS
      try {
        await page.evaluate(() => true);
        
        // Get page height
        const pageHeight = await page.evaluate(() => document.body.scrollHeight);
        const viewportHeight = await page.evaluate(() => window.innerHeight);
        
        console.log(`   📏 Tab ${tabIndex + 1}: Page height: ${pageHeight}px, Viewport: ${viewportHeight}px`);
        
        // Scroll down incrementally (5-7 scroll steps) to trigger lazy-loaded ads
        const scrollSteps = 5 + Math.floor(Math.random() * 3); // 5-7 steps
        const scrollAmount = Math.floor(pageHeight / scrollSteps);
        
        console.log(`   🔽 Tab ${tabIndex + 1}: Scrolling in ${scrollSteps} steps to load all ads...`);
        
        for (let step = 1; step <= scrollSteps; step++) {
          // Scroll down one step
          await page.evaluate((amount) => {
            window.scrollBy({
              top: amount,
              behavior: 'smooth'
            });
          }, scrollAmount);
          
          console.log(`   ⬇️  Tab ${tabIndex + 1}: Scroll step ${step}/${scrollSteps} (${Math.round((step/scrollSteps)*100)}%)`);
          
          // Wait for ads to load at this position (0.5-1 second SUPER FAST!)
          await this.sleep(500 + Math.random() * 500);
          
          // Check if we've reached bottom
          const atBottom = await page.evaluate(() => {
            return (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 100;
          });
          
          if (atBottom) {
            console.log(`   ✅ Tab ${tabIndex + 1}: Reached bottom of page!`);
            break;
          }
        }
        
        // Final scroll to absolute bottom
        await page.evaluate(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        });
        
        console.log(`   ✅ Tab ${tabIndex + 1}: At bottom - waiting for final ads to load...`);
        await this.sleep(1000); // 1 second wait (DOWN from 3!)
        
      } catch (e) {
        console.log(`   ⚠️  Tab ${tabIndex + 1}: Could not scroll to bottom: ${e.message}`);
      }
      
      // ====================================================================
      // 🎯 CLICK "100% FREE EARNING" OFFERS & BOTTOM ADS (PRIMARY FOCUS!)
      // ====================================================================
      if (this.config.jobClickProbability && Math.random() < this.config.jobClickProbability && isPageValid) {
        try {
          // Check page validity
          await page.evaluate(() => true);
          await this.sleep(500); // 0.5 seconds (DOWN from 2!)
          
          console.log(`   💰 Tab ${tabIndex + 1}: 🔥 PRIORITY: Looking for SMARTLINK ADS (8-12% click rate)...`);
          
          // 🔥 SMARTLINK-SPECIFIC AD SELECTORS (Adsterra + Monetag)
          const smartlinkAdSelectors = [
            // 🔥 ADSTERRA SPECIFIC SELECTORS
            'div[data-adsterra]',          // Adsterra data attribute
            'div[class*="adsterra"]',      // Adsterra class names
            'div[id*="adsterra"]',         // Adsterra IDs
            'ins[data-adsterra]',          // Adsterra ins elements
            'iframe[src*="adsterra"]',     // Adsterra iframes
            'a[href*="adsterra"]',         // Adsterra links
            'div[onclick*="adsterra"]',    // Adsterra onclick
            // 🔥 MONETAG SPECIFIC SELECTORS
            'div[data-monetag]',           // Monetag data attribute
            'div[class*="monetag"]',       // Monetag class names
            'div[id*="monetag"]',          // Monetag IDs
            'iframe[src*="omg10"]',        // Monetag iframes
            'a[href*="omg10"]',            // Monetag links
            // 🔥 GENERIC AD SELECTORS (work for both)
            'div[class*="adsbygoogle"]',   // Google Adsense
            'ins.adsbygoogle',             // Google Adsense ins
            'iframe[id*="google_ads"]',    // Google Ad iframes
            'iframe[id*="_ad_"]',          // Generic ad iframes
            'div[class*="ad-"]',           // Ad containers
            'div[id*="ad-"]',              // Ad containers by ID
            'a[class*="ad-"]',             // Ad links
            'div[class*="banner"]',        // Banner ads
            'div[class*="advertisement"]', // Advertisement containers
            'div[data-ad]',                // Data-ad attributes
            '[onclick*="ads"]',            // Onclick with "ads"
            '[onclick*="track"]',          // Tracking links
            'a[target="_blank"]',          // External links (likely ads)
            'button',                      // All buttons
            'a.btn',                       // Button-style links
            'div[onclick]',                // Clickable divs
            'iframe'                       // All iframes (may contain ads)
          ];
          
          // Try each selector to find clickable ads on smartlinks
          for (const selector of smartlinkAdSelectors) {
            const elements = await page.$$(selector);
            
            if (elements.length > 0) {
              console.log(`   ✅ Tab ${tabIndex + 1}: Found ${elements.length} offers with selector "${selector}"! Starting click cycle...`);
              
              // 🔥 FILTER: Prioritize elements that are in the bottom 30% of the page (where ads usually are!)
              const visibleElements = [];
              
              for (const element of elements) {
                try {
                  const isInViewport = await page.evaluate(el => {
                    const rect = el.getBoundingClientRect();
                    const pageHeight = document.body.scrollHeight;
                    const elementTop = rect.top + window.scrollY;
                    const bottomThreshold = pageHeight * 0.70; // Bottom 30% of page
                    
                    return elementTop >= bottomThreshold && rect.width > 0 && rect.height > 0;
                  }, element);
                  
                  if (isInViewport) {
                    visibleElements.push(element);
                  }
                } catch (e) {
                  continue;
                }
              }
              
              // If no bottom elements found, use all elements
              const targetElements = visibleElements.length > 0 ? visibleElements : elements;
              
              if (visibleElements.length > 0) {
                console.log(`   🎯 Tab ${tabIndex + 1}: ${visibleElements.length} ads are in BOTTOM section!`);
              } else {
                console.log(`   📍 Tab ${tabIndex + 1}: Using all ${elements.length} clickable elements`);
              }
              
              // 🔥 CLICK CYCLE: Click 4-8 offers (MAXIMUM REVENUE!)
              const offersToClick = Math.min(4 + Math.floor(Math.random() * 5), targetElements.length);
              
              for (let i = 0; i < offersToClick; i++) {
                try {
                  // Check page validity before each click
                  await page.evaluate(() => true);
                  
                  // Pick a random offer (more human-like)
                  const randomIndex = Math.floor(Math.random() * targetElements.length);
                  const offerElement = targetElements[randomIndex];
                  
                  // Get offer text for logging
                  const offerText = await page.evaluate(el => {
                    return el.textContent || el.innerText || el.title || 'Offer';
                  }, offerElement);
                  
                  console.log(`   \n🎯 Tab ${tabIndex + 1}: Clicking offer ${i + 1}/${offersToClick}: "${offerText.substring(0, 40).trim()}..."`);
                  
                  // Scroll offer into view (human behavior)
                  await page.evaluate(el => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, offerElement);
                  
                  // Wait a bit (human reading time SUPER FAST!)
                  await this.sleep(500 + Math.random() * 500); // 0.5-1 sec (DOWN from 1-3!)
                  
                  // Hover over element first (more human!)
                  try {
                    await offerElement.hover();
                    await this.sleep(200); // SUPER FAST (0.2 sec)
                  } catch (e) {}
                  
                  // Click the offer with better error handling and multiple strategies
                  try {
                    // Strategy 1: Try normal Puppeteer click first
                    try {
                      await Promise.race([
                        offerElement.click({ delay: 50 + Math.random() * 100 }), // FASTER click!
                        this.sleep(2000) // Timeout after 2 seconds (DOWN from 3!)
                      ]);
                      console.log(`   ✅ Clicked with Puppeteer! (Total clicks: ${this.stats.totalClicks + 1})`);
                    } catch (puppeteerError) {
                      // Strategy 2: Fallback to JavaScript click
                      console.log(`   🔄 Tab ${tabIndex + 1}: Puppeteer click failed, trying JavaScript click...`);
                      await page.evaluate(el => {
                        if (el.tagName === 'A') {
                          // For links, open in new tab/window
                          window.open(el.href, '_blank');
                        } else if (el.tagName === 'BUTTON') {
                          // For buttons, trigger click event
                          el.click();
                        } else if (el.onclick) {
                          // If has onclick handler, trigger it
                          el.onclick();
                        } else {
                          // Generic click
                          el.click();
                        }
                      }, offerElement);
                      console.log(`   ✅ Clicked with JavaScript! (Total clicks: ${this.stats.totalClicks + 1})`);
                    }
                    
                    this.stats.totalJobClicks++;
                    this.stats.totalClicks++;
                    
                    // ⏰ WAIT FOR AD PAGE TO LOAD (1-2 seconds SUPER FAST!)
                    console.log(`   ⏰ Tab ${tabIndex + 1}: Waiting for ad impression to register...`);
                    await this.sleep(1000 + Math.random() * 1000);
                  } catch (clickErr) {
                    console.log(`   ⚠️  Tab ${tabIndex + 1}: All click strategies failed: ${clickErr.message}`);
                    throw clickErr; // Re-throw to be caught by outer catch
                  }
                  
                  // 📊 VIEW THE AD (Stay 2-4 seconds - SUPER FAST!)
                  const adViewTime = 2000 + Math.random() * 2000; // DOWN from 8-15 sec!
                  console.log(`   👀 Tab ${tabIndex + 1}: Viewing ad for ${Math.round(adViewTime/1000)}s...`);
                  
                  // While viewing, do human-like actions
                  try {
                    // Scroll on ad page
                    await page.evaluate(() => {
                      window.scrollBy(0, 200 + Math.random() * 300);
                    });
                    await this.sleep(adViewTime / 2);
                    
                    // Scroll more
                    await page.evaluate(() => {
                      window.scrollBy(0, 100 + Math.random() * 200);
                    });
                    await this.sleep(adViewTime / 2);
                  } catch (e) {
                    // If scrolling fails, just wait
                    await this.sleep(adViewTime);
                  }
                  
                  console.log(`   ✅ Tab ${tabIndex + 1}: Ad viewed! Going back...`);
                  
                  // 🔙 GO BACK to your site (KEY STEP!)
                  try {
                    await page.goBack({ 
                      waitUntil: 'networkidle2', 
                      timeout: 15000 
                    });
                    console.log(`   ◀️  Tab ${tabIndex + 1}: Back to site!`);
                    
                    // Wait for page to load (SUPER FAST!)
                    await this.sleep(500 + Math.random() * 500); // 0.5-1 sec (DOWN from 2-4!)
                    
                    // 🔥 SCROLL BACK TO BOTTOM (where ads are!)
                    console.log(`   🔽 Tab ${tabIndex + 1}: Scrolling back to bottom for more ads...`);
                    await page.evaluate(() => {
                      window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth'
                      });
                    });
                    
                    // Wait for ads to reload at bottom (SUPER FAST!)
                    console.log(`   ⏰ Tab ${tabIndex + 1}: Waiting for bottom ads to reload...`);
                    await this.sleep(500 + Math.random() * 500); // 0.5-1 sec (DOWN from 2.5-4!)
                    
                  } catch (backError) {
                    console.log(`   ⚠️  Tab ${tabIndex + 1}: Couldn't go back, navigating to home...`);
                    // If can't go back, navigate to homepage
                    try {
                      await page.goto(this.websiteUrl, { 
                        waitUntil: 'networkidle2', 
                        timeout: 15000 
                      });
                      await this.sleep(3000);
                    } catch (e) {
                      break; // If this fails too, stop clicking
                    }
                  }
                  
                  // Small break between clicks (0.5-1 second SUPER FAST!)
                  await this.sleep(500 + Math.random() * 500);
                  
                  console.log(`   🔄 Tab ${tabIndex + 1}: Ready for next offer! (${i + 2}/${offersToClick})\n`);
                  
                } catch (clickError) {
                  console.log(`   ⚠️  Tab ${tabIndex + 1}: Click error, trying next offer...`);
                  continue;
                }
              }
              
              console.log(`   🎉 Tab ${tabIndex + 1}: Completed ${offersToClick} offer clicks!`);
              break; // Found clickable elements, stop trying selectors
            }
          }
          
          // 🔥 SPECIAL: Direct Adsterra Ad Click (if ads not clicked yet)
          if (this.stats.totalClicks === 0 || Math.random() > 0.7) {
            try {
              console.log(`   🎯 Tab ${tabIndex + 1}: Looking for direct Adsterra ad elements...`);
              
              // Try to find and click Adsterra ads directly via JavaScript
              const adClicked = await page.evaluate(() => {
                // Find all elements that might be Adsterra ads
                const adElements = document.querySelectorAll(
                  'div[data-adsterra], div[class*="adsterra"], div[id*="adsterra"], ' +
                  'ins[data-adsterra], a[href*="adsterra"], [onclick*="adsterra"], ' +
                  'ins.adsbygoogle, iframe[id*="google_ads"], div[data-ad]'
                );
                
                if (adElements.length > 0) {
                  // Click first ad
                  const ad = adElements[0];
                  ad.click();
                  return true;
                }
                return false;
              });
              
              if (adClicked) {
                this.stats.totalClicks++;
                console.log(`   ✅ Tab ${tabIndex + 1}: Direct Adsterra ad clicked! (Total: ${this.stats.totalClicks})`);
                await this.sleep(2000 + Math.random() * 2000); // View the ad (2-4 sec SUPER FAST!)
              }
            } catch (e) {
              // Silently continue
            }
          }
          
          // If no specific selectors worked, try generic external links
          if (this.stats.totalJobClicks === 0 || Math.random() > 0.5) {
            console.log(`   🔍 Tab ${tabIndex + 1}: Looking for any clickable ads/offers...`);
            const allLinks = await page.$$('a[href^="http"]');
            
            if (allLinks.length > 0) {
              // Click 2-3 random links
              const linksToTry = Math.min(2 + Math.floor(Math.random() * 2), allLinks.length);
              
              for (let i = 0; i < linksToTry; i++) {
                try {
                  const randomLink = allLinks[Math.floor(Math.random() * allLinks.length)];
                  await randomLink.click();
                  this.stats.totalClicks++;
                  console.log(`   ✅ Clicked external link! (Total clicks: ${this.stats.totalClicks})`);
                  await this.sleep(3000); // View ad (3 sec SUPER FAST!)
                  await page.goBack({ timeout: 10000 });
                  await this.sleep(500); // SUPER FAST (0.5 sec)
                } catch (e) {
                  continue;
                }
              }
            }
          }
          
        } catch (e) {
          // Silently skip if page closed
          console.log(`   ⚠️  Tab ${tabIndex + 1}: Offer clicking error: ${e.message}`);
        }
      }
      
      // ====================================================================
      // 🧠 AI BEHAVIORS (Mouse movements, scrolling, etc.)
      // ====================================================================
      
      // Mouse movements (restored to full)
      if (this.config.enableMouseMovements && isPageValid && Math.random() > 0.3) {
        try {
          const movements = 5 + Math.floor(Math.random() * 10); // Restored to 5-15 movements
          for (let i = 0; i < movements; i++) {
            // Check if page is still valid before each action
            await page.evaluate(() => document.readyState);
            
            const targetX = 100 + Math.random() * 1500;
            const targetY = 100 + Math.random() * 800;
            
            // Smooth curved movement
            await page.mouse.move(
              targetX,
              targetY,
              { steps: 15 + Math.floor(Math.random() * 30) }
            );
            
            // Random pauses (like reading)
            if (Math.random() > 0.7) {
              await this.sleep(500 + Math.random() * 2000);
            }
          }
          this.stats.totalScrolls++;
        } catch (e) {
          // Silently skip if page is closed
        }
      }
      
      // ⌨️ Keyboard events (typing in search boxes)
      if (this.config.enableKeyboardEvents && Math.random() > 0.6 && isPageValid) {
        try {
          // Check page validity
          await page.evaluate(() => true);
          
          const searchInputs = await page.$$('input[type="search"], input[type="text"], input[placeholder*="search" i]');
          if (searchInputs.length > 0) {
            const input = searchInputs[0];
            await input.click();
            await this.sleep(300);
            
            const query = this.searchQueries[Math.floor(Math.random() * this.searchQueries.length)];
            
            // Type character by character (human-like)
            for (const char of query) {
              await input.type(char, { delay: 50 + Math.random() * 150 });
            }
            
            this.stats.totalTypingEvents++;
            console.log(`   ⌨️  Tab ${tabIndex + 1}: Typed "${query}"`);
            await this.sleep(1000 + Math.random() * 2000);
            
            // Sometimes press Enter, sometimes don't
            if (Math.random() > 0.5) {
              await page.keyboard.press('Enter');
              await this.sleep(2000);
            }
          }
        } catch (e) {
          // Silently skip if error
        }
      }
      
      // 📜 Advanced scrolling patterns based on persona - SIMPLIFIED
      if (this.config.enableScrollVariations && isPageValid) {
        try {
          // Check page validity before scrolling
          await page.evaluate(() => true);
          
          if (pattern === 'researcher') {
            // Slow, methodical scrolling
            for (let i = 0; i < 3; i++) { // Reduced to 3
              await page.evaluate(() => {
                window.scrollBy({
                  top: 150 + Math.random() * 200,
                  behavior: 'smooth'
                });
              });
              await this.sleep(800 + Math.random() * 1200); // 800-2000ms
            }
          } else if (pattern === 'job_hunter') {
            // Quick scan, then focus on interesting parts
            await page.evaluate(() => window.scrollBy(0, 800));
            await this.sleep(500);
            await page.evaluate(() => window.scrollBy(0, -300));
            await this.sleep(500);
            await page.evaluate(() => {
              window.scrollBy({ top: 400, behavior: 'smooth' });
            });
            await this.sleep(1000);
          } else if (pattern === 'quick_browser') {
            // Fast scrolling
            for (let i = 0; i < 3; i++) { // Reduced to 3
              await page.evaluate(() => window.scrollBy(0, 600 + Math.random() * 400));
              await this.sleep(400 + Math.random() * 600); // 400-1000ms
            }
          } else if (pattern === 'thorough_reader') {
            // Moderate reading
            for (let i = 0; i < 4; i++) { // Reduced to 4
              await page.evaluate(() => {
                window.scrollBy({ top: 100 + Math.random() * 150, behavior: 'smooth' });
              });
              await this.sleep(800 + Math.random() * 1200); // 800-2000ms
            }
          } else {
            // Comparison shopper - back and forth
            for (let i = 0; i < 2; i++) { // Reduced to 2
              await page.evaluate(() => window.scrollBy(0, 500));
              await this.sleep(600);
              await page.evaluate(() => window.scrollBy(0, -200));
              await this.sleep(500);
              await page.evaluate(() => window.scrollBy(0, 600));
              await this.sleep(800);
            }
          }
          this.stats.totalScrolls++;
        } catch (e) {
          // Silently skip if page is closed
        }
      }
      
      // 🔍 Zoom actions (realistic behavior)
      if (this.config.enableZoomActions && Math.random() > 0.85 && isPageValid) {
        try {
          // Check page validity
          await page.evaluate(() => true);
          
          // Zoom in
          await page.evaluate(() => {
            document.body.style.zoom = '110%';
          });
          console.log(`   🔍 Tab ${tabIndex + 1}: Zoomed in to 110%`);
          await this.sleep(3000);
          
          // Zoom back to normal
          await page.evaluate(() => {
            document.body.style.zoom = '100%';
          });
          await this.sleep(1000);
        } catch (e) {
          // Silently skip
        }
      }
      
      // 📋 Copy/paste behavior (selecting text)
      if (this.config.enableCopyPaste && Math.random() > 0.8 && isPageValid) {
        try {
          // Check page validity
          await page.evaluate(() => true);
          
          await page.evaluate(() => {
            const selection = window.getSelection();
            const range = document.createRange();
            const textNodes = document.querySelectorAll('p, h1, h2, h3, span');
            if (textNodes.length > 0) {
              const randomNode = textNodes[Math.floor(Math.random() * textNodes.length)];
              range.selectNodeContents(randomNode);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          });
          console.log(`   📋 Tab ${tabIndex + 1}: Selected text`);
          await this.sleep(1500);
          
          // Deselect
          await page.evaluate(() => window.getSelection().removeAllRanges());
        } catch (e) {
          // Silently skip
        }
      }
      
      // 🖱️ Right-click context menu
      if (this.config.enableRightClicks && Math.random() > 0.85 && isPageValid) {
        try {
          // Check page validity
          await page.evaluate(() => true);
          
          await page.mouse.click(500 + Math.random() * 500, 300 + Math.random() * 300, { button: 'right' });
          console.log(`   🖱️  Tab ${tabIndex + 1}: Right-clicked (context menu)`);
          await this.sleep(1000);
          await page.keyboard.press('Escape');
        } catch (e) {
          // Silently skip
        }
      }
      
      // ⏱️ Stay time based on persona (restored)
      let stayTime;
      if (pattern === 'thorough_reader' || pattern === 'researcher') {
        stayTime = (this.config.minStayTime + Math.random() * (this.config.maxStayTime - this.config.minStayTime)) * 1000;
      } else if (pattern === 'quick_browser') {
        stayTime = (this.config.minStayTime + Math.random() * 15) * 1000;
      } else {
        stayTime = (this.config.minStayTime + Math.random() * 20) * 1000;
      }
      
      console.log(`   ⏱️  Tab ${tabIndex + 1}: Staying ${Math.round(stayTime/1000)}s (${pattern})`);
      await this.sleep(stayTime);
      
      console.log(`   ✅ Tab ${tabIndex + 1}: GOD-LEVEL behavior complete!`);
      
    } catch (error) {
      console.log(`   ⚠️  Tab ${tabIndex + 1}: Behavior error: ${error.message}`);
    }
  }

  // 🔥 Start running continuous sessions
  async start() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║      🔥 STARTING GOD-LEVEL TRAFFIC BOT V3.0 🔥        ║');
    console.log('║         🚀🚀🚀 SMARTLINK PRIORITY MODE! 💎💎💎        ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`   💎 90% PRIORITY: Smartlink clicks (3-6 per session!)`);
    console.log(`   🎯 10% WORK: "100% Free Earning" offers`);
    console.log(`   ⏰ Session Delay: 30-40s (optimized for speed!)`);
    console.log(`   📱 Mobile Traffic: ${this.stats.mobileTrafficPercentage}%`);
    console.log(`   🔥 Total Proxies: ${this.proxies.length}`);
    console.log(`   🌏 Countries: ${[...new Set(this.proxies.map(p => p.country))].length}`);
    console.log(`\n💡 TIP: This bot prioritizes smartlink (90% work!) with only 10% on site offers!`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    let sessionCount = 0;
    
    while (true) {
      sessionCount++;
      
      // Randomly select proxy from your diverse 92-proxy list!
      const proxy = this.proxies[Math.floor(Math.random() * this.proxies.length)];
      
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`🔥 Session ${sessionCount} - SMARTLINK PRIORITY MODE 💎`);
      console.log(`🌍 Proxy: ${proxy.country} (${proxy.location || 'Unknown'})`);
      console.log(`💎 Expected: 3-6 smartlink clicks (90% work!)`);
      console.log(`🎯 Expected: 0-2 site offer clicks (10% work)`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      
      const success = await this.visitWebsite(proxy);
      
      if (success) {
        // Calculate earnings
        this.calculateEarnings();
        
        // Display stats every 3 sessions
        if (sessionCount % 3 === 0) {
          this.displayStats();
        }
      }
      
      // Optimized delay (30-40 seconds for maximum smartlink clicks!)
      const delay = (30 + Math.random() * 10) * 1000; // 30-40 seconds
      console.log(`\n⏰ Next session in ${Math.round(delay/1000)} seconds (SMARTLINK PRIORITY!)...\n`);
      await this.sleep(delay);
    }
  }

  // 🔥 GOD-LEVEL earnings calculation
  calculateEarnings() {
    // Adsterra CPM/CPC estimates for Tier 1 countries
    const impressionValue = 0.006; // $6 CPM (higher quality traffic!)
    const adClickValue = 0.18; // $0.18 per ad click
    const jobClickValue = 0.50; // Estimated $0.50 commission per job click
    
    // Calculate ad earnings
    const adEarnings = 
      (this.stats.totalPages * impressionValue) + 
      ((this.stats.totalClicks - this.stats.totalJobClicks) * adClickValue);
    
    // Calculate commission earnings
    const commissionEarnings = this.stats.totalJobClicks * jobClickValue;
    
    this.stats.estimatedEarnings = adEarnings;
    this.stats.estimatedCommissions = commissionEarnings;
  }
  
  // 🔥 GOD-LEVEL statistics display
  displayStats() {
    const runtime = Math.floor((new Date() - this.stats.startTime) / 1000 / 60); // Minutes
    const runtimeHours = Math.floor(runtime / 60);
    const runtimeMins = runtime % 60;
    
    const pagesPerHour = runtime > 0 ? Math.floor(this.stats.totalPages / (runtime / 60)) : 0;
    
    // Calculate actual click rate from real data (with decimal precision)
    const actualClickRate = this.stats.totalPages > 0 ? 
      ((this.stats.totalClicks / this.stats.totalPages) * 100).toFixed(4) : '0.0000';
    const actualJobClickRate = this.stats.totalPages > 0 ? 
      ((this.stats.totalJobClicks / this.stats.totalPages) * 100).toFixed(4) : '0.0000';
    const actualAdClickRate = this.stats.totalPages > 0 ? 
      (((this.stats.totalClicks - this.stats.totalJobClicks) / this.stats.totalPages) * 100).toFixed(4) : '0.0000';
    
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║         🔥 GOD-LEVEL TRAFFIC STATISTICS 🔥            ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`   ⏱️  Runtime: ${runtimeHours}h ${runtimeMins}m`);
    console.log(`   📄 Total Page Views: ${this.stats.totalPages}`);
    console.log(`   📈 Pages/Hour: ${pagesPerHour}`);
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   👤 ACCOUNTS:`);
    console.log(`      👤 Created: ${this.stats.accountsCreated}`);
    console.log(`      🔐 Logged In: ${this.stats.accountsLoggedIn}`);
    console.log(`      ✅ Login Success: ${this.stats.successfulLogins}`);
    console.log(`      ❌ Login Failed: ${this.stats.failedLogins}`);
    console.log(`      📁 Total Stored: ${this.createdAccounts.length}`);
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   🎯 Target Click Rate Today: ${this.config.todayClickRateDisplay}%`);
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   🎯 Job Signup Clicks: ${this.stats.totalJobClicks} (${actualJobClickRate}% actual)`);
    console.log(`   💰 Adsterra Ad Clicks: ${this.stats.totalClicks - this.stats.totalJobClicks} (${actualAdClickRate}% actual)`);
    console.log(`   🖱️  Total Clicks: ${this.stats.totalClicks} (${actualClickRate}% CTR)`);
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   📱 MOBILE DEVICES:`);
    console.log(`      📱 iPhone: ${this.stats.iphoneVisits}`);
    console.log(`      📱 iPad: ${this.stats.ipadVisits}`);
    console.log(`      📱 Android: ${this.stats.androidVisits}`);
    console.log(`      Total Mobile: ${this.stats.mobileVisits}`);
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   💻 DESKTOP DEVICES:`);
    console.log(`      💻 Windows: ${this.stats.windowsVisits}`);
    console.log(`      💻 Mac: ${this.stats.macVisits}`);
    console.log(`      💻 Linux: ${this.stats.linuxVisits}`);
    console.log(`      Total Desktop: ${this.stats.desktopVisits}`);
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   🔄 Return Visitors: ${this.stats.returnVisitors}`);
    console.log(`   ⌨️  Typing Events: ${this.stats.totalTypingEvents}`);
    console.log(`   📜 Scroll Actions: ${this.stats.totalScrolls}`);
    console.log(`   🌍 Active Proxies: ${Object.keys(this.stats.proxyUsage).length}/${this.proxyManager.proxies.length}`);
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   💵 Adsterra Earnings: $${this.stats.estimatedEarnings.toFixed(2)}`);
    console.log(`   💰 Commission Earnings: $${this.stats.estimatedCommissions.toFixed(2)}`);
    console.log(`   🔥 TOTAL EARNINGS: $${(this.stats.estimatedEarnings + this.stats.estimatedCommissions).toFixed(2)}`);
    
    if (runtimeHours > 0) {
      const totalEarnings = this.stats.estimatedEarnings + this.stats.estimatedCommissions;
      const hourlyRate = totalEarnings / runtimeHours;
      const dailyProjection = hourlyRate * 24;
      const monthlyProjection = dailyProjection * 30;
      
      console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`   ⚡ Hourly Rate: $${hourlyRate.toFixed(2)}/hr`);
      console.log(`   📅 Daily Projection: $${dailyProjection.toFixed(2)}`);
      console.log(`   📆 Monthly Projection: $${monthlyProjection.toFixed(2)}`);
      console.log(`   🚀 ANNUAL PROJECTION: $${(monthlyProjection * 12).toFixed(2)}`);
    }
    
    // Top proxies
    const sortedProxies = Object.entries(this.stats.proxyUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    if (sortedProxies.length > 0) {
      console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`   🏆 Top Performing Proxies:`);
      sortedProxies.forEach(([host, count], i) => {
        const proxy = this.proxyManager.proxies.find(p => p.host === host);
        console.log(`      ${i + 1}. ${proxy?.country || 'Unknown'}: ${count} sessions`);
      });
    }
    
    console.log('');
  }
  
  // 🔥 Run GOD-LEVEL continuous traffic generation
  async run() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║   🔥 GOD-LEVEL TRAFFIC GENERATOR V3.0 ULTIMATE 🔥    ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    if (this.proxyManager.proxies.length === 0) {
      console.log('⚠️  No proxies configured. Running without proxies (not recommended)');
      console.log('   Configure proxies for better results!\n');
      return;
    }
    
    console.log(`✅ Loaded ${this.proxyManager.proxies.length} working proxies`);
    console.log(`🎯 Target: ${this.websiteUrl}`);
    console.log(`📱 Tabs per session: ${this.config.simultaneousTabs} (GOD-LEVEL!)`);
    console.log(`📄 Pages per tab: 3-5 pages`);
    console.log(`\n💎💎💎 SMARTLINK PRIORITY MODE 💎💎💎`);
    console.log(`🚀 Smartlink: 3-6 clicks per session (90% of work!)`);
    console.log(`🎯 Site offers: 10% of work (secondary)`);
    console.log(`⚡ Session delay: 30-40 seconds\n`);
    console.log(`📱 Mobile traffic: 97% (MOBILE-FOCUSED!)`);
    console.log(`🔄 Return visitors: ${this.config.enableReturnVisitors * 100}%`);
    console.log(`🛡️  Stealth mode: ${this.config.stealthMode ? 'ACTIVE' : 'OFF'}`);
    console.log(`🧠 AI behavior: MINIMAL (clicks priority!)`);
    console.log(`⚡ Mode: ULTRA AGGRESSIVE SMARTLINK FOCUS 24/7\n`);
    
    // Save stats periodically
    setInterval(() => {
      this.saveStats();
    }, 3 * 60 * 1000); // Every 3 minutes
    
    let sessionCount = 0;
    
    while (true) {
      sessionCount++;
      
      // Get proxy (rotate fairly)
      const proxy = this.proxyManager.getRandomProxy();
      
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`🔥 Session ${sessionCount} - SMARTLINK PRIORITY MODE 💎`);
      console.log(`🌍 Proxy: ${proxy.country} (${proxy.location || 'Unknown'})`);
      console.log(`💎 Expected: 3-6 smartlink clicks (90% work!)`);
      console.log(`🎯 Expected: 0-2 site offer clicks (10% work)`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      
      const success = await this.visitWebsite(proxy);
      
      if (success) {
        // Calculate earnings
        this.calculateEarnings();
        
        // Display stats every 3 sessions
        if (sessionCount % 3 === 0) {
          this.displayStats();
        }
      }
      
      // Optimized delay (30-40 seconds for maximum smartlink clicks!)
      const delay = (30 + Math.random() * 10) * 1000; // 30-40 seconds
      console.log(`\n⏰ Next session in ${Math.round(delay/1000)} seconds (SMARTLINK PRIORITY!)...\n`);
      await this.sleep(delay);
    }
  }
  
  // 🔥 GOD-LEVEL earnings calculation
  calculateEarnings() {
    // Adsterra CPM/CPC estimates for Tier 1 countries
    const impressionValue = 0.006; // $6 CPM (higher quality traffic!)
    const adClickValue = 0.18; // $0.18 per ad click
    const jobClickValue = 0.50; // Estimated $0.50 commission per job click
    
    // Calculate ad earnings
    const adEarnings = 
      (this.stats.totalPages * impressionValue) + 
      ((this.stats.totalClicks - this.stats.totalJobClicks) * adClickValue);
    
    // Calculate commission earnings
    const commissionEarnings = this.stats.totalJobClicks * jobClickValue;
    
    this.stats.estimatedEarnings = adEarnings;
    this.stats.estimatedCommissions = commissionEarnings;
  }
  
  // 🔥 GOD-LEVEL statistics display
  displayStats() {
    const runtime = Math.floor((new Date() - this.stats.startTime) / 1000 / 60); // Minutes
    const runtimeHours = Math.floor(runtime / 60);
    const runtimeMins = runtime % 60;
    
    const pagesPerHour = runtime > 0 ? Math.floor(this.stats.totalPages / (runtime / 60)) : 0;
    
    // Calculate actual click rate from real data (with decimal precision)
    const actualClickRate = this.stats.totalPages > 0 ? 
      ((this.stats.totalClicks / this.stats.totalPages) * 100).toFixed(4) : '0.0000';
    const actualJobClickRate = this.stats.totalPages > 0 ? 
      ((this.stats.totalJobClicks / this.stats.totalPages) * 100).toFixed(4) : '0.0000';
    const actualAdClickRate = this.stats.totalPages > 0 ? 
      (((this.stats.totalClicks - this.stats.totalJobClicks) / this.stats.totalPages) * 100).toFixed(4) : '0.0000';
    
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║         🔥 GOD-LEVEL TRAFFIC STATISTICS 🔥            ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`   ⏱️  Runtime: ${runtimeHours}h ${runtimeMins}m`);
    console.log(`   📄 Total Page Views: ${this.stats.totalPages}`);
    console.log(`   📈 Pages/Hour: ${pagesPerHour}`);
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   👤 ACCOUNTS:`);
    console.log(`      👤 Created: ${this.stats.accountsCreated}`);
    console.log(`      🔐 Logged In: ${this.stats.accountsLoggedIn}`);
    console.log(`      ✅ Login Success: ${this.stats.successfulLogins}`);
    console.log(`      ❌ Login Failed: ${this.stats.failedLogins}`);
    console.log(`      📁 Total Stored: ${this.createdAccounts.length}`);
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   🎯 Target Click Rate Today: ${this.config.todayClickRateDisplay}%`);
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   🎯 Job Signup Clicks: ${this.stats.totalJobClicks} (${actualJobClickRate}% actual)`);
    console.log(`   💰 Adsterra Ad Clicks: ${this.stats.totalClicks - this.stats.totalJobClicks} (${actualAdClickRate}% actual)`);
    console.log(`   🖱️  Total Clicks: ${this.stats.totalClicks} (${actualClickRate}% CTR)`);
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   📱 MOBILE DEVICES:`);
    console.log(`      📱 iPhone: ${this.stats.iphoneVisits}`);
    console.log(`      📱 iPad: ${this.stats.ipadVisits}`);
    console.log(`      📱 Android: ${this.stats.androidVisits}`);
    console.log(`      Total Mobile: ${this.stats.mobileVisits}`);
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   💻 DESKTOP DEVICES:`);
    console.log(`      💻 Windows: ${this.stats.windowsVisits}`);
    console.log(`      💻 Mac: ${this.stats.macVisits}`);
    console.log(`      💻 Linux: ${this.stats.linuxVisits}`);
    console.log(`      Total Desktop: ${this.stats.desktopVisits}`);
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   🔄 Return Visitors: ${this.stats.returnVisitors}`);
    console.log(`   ⌨️  Typing Events: ${this.stats.totalTypingEvents}`);
    console.log(`   📜 Scroll Actions: ${this.stats.totalScrolls}`);
    console.log(`   🌍 Active Proxies: ${Object.keys(this.stats.proxyUsage).length}/${this.proxyManager.proxies.length}`);
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   💵 Adsterra Earnings: $${this.stats.estimatedEarnings.toFixed(2)}`);
    console.log(`   💰 Commission Earnings: $${this.stats.estimatedCommissions.toFixed(2)}`);
    console.log(`   🔥 TOTAL EARNINGS: $${(this.stats.estimatedEarnings + this.stats.estimatedCommissions).toFixed(2)}`);
    
    if (runtimeHours > 0) {
      const totalEarnings = this.stats.estimatedEarnings + this.stats.estimatedCommissions;
      const hourlyRate = totalEarnings / runtimeHours;
      const dailyProjection = hourlyRate * 24;
      const monthlyProjection = dailyProjection * 30;
      
      console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`   ⚡ Hourly Rate: $${hourlyRate.toFixed(2)}/hr`);
      console.log(`   📅 Daily Projection: $${dailyProjection.toFixed(2)}`);
      console.log(`   📆 Monthly Projection: $${monthlyProjection.toFixed(2)}`);
      console.log(`   🚀 ANNUAL PROJECTION: $${(monthlyProjection * 12).toFixed(2)}`);
    }
    
    // Top proxies
    const sortedProxies = Object.entries(this.stats.proxyUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    if (sortedProxies.length > 0) {
      console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`   🏆 Top Performing Proxies:`);
      sortedProxies.forEach(([host, count], i) => {
        const proxy = this.proxyManager.proxies.find(p => p.host === host);
        console.log(`      ${i + 1}. ${proxy?.country || 'Unknown'}: ${count} sessions`);
      });
    }
    
    console.log('');
  }
  
  // Save stats to file
  saveStats() {
    try {
      const statsFile = {
        lastUpdate: new Date().toISOString(),
        runtime: Math.floor((new Date() - this.stats.startTime) / 1000 / 60),
        stats: this.stats,
        config: this.config
      };
      
      // Use consistent path - bot-stats.json in current directory
      fs.writeFileSync(
        './bot-stats.json',
        JSON.stringify(statsFile, null, 2)
      );
    } catch (error) {
      // Ignore save errors
    }
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the bot
if (require.main === module) {
  const bot = new AutoClickerBot();
  bot.run().catch(error => {
    console.error('❌ Bot crashed:', error.message);
    process.exit(1);
  });
}

module.exports = AutoClickerBot;
