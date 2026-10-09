# 🎮 Traffic Bot V2.0 - All Commands

Quick reference for all available commands in your advanced traffic bot system.

---

## 📦 INSTALLATION

### Initial Setup
```bash
cd traffic-bot
npm install
```

This installs:
- axios (for API calls)
- puppeteer (for browser automation)

---

## 🚀 MAIN COMMANDS

### 1. Auto-Clicker Bot (Advanced V2.0)
```bash
node auto-clicker-bot.js
```
or
```bash
npm run bot
```

**What it does:**
- Opens 3 tabs per session
- Browses 9-12 pages per session
- Clicks ads (40% probability)
- Rotates through all 10 proxies
- Anti-bot detection enabled
- Generates 30-50 page views/hour

**When to use:** Default mode for steady traffic generation

---

### 2. Dashboard (Monitor Stats)
```bash
node dashboard.js
```
or
```bash
npm run dashboard
```

**What it does:**
- Shows live statistics
- Earnings projections
- Top performing proxies
- Pages/hour rate
- Click-through rate (CTR)
- Auto-refreshes every 10 seconds

**When to use:** Monitor bot performance in real-time

**Pro Tip:** Run in separate terminal while bot is running!

---

### 3. Turbo Mode (3x Traffic)
```bash
node turbo-mode.js
```
or
```bash
npm run turbo
```

**What it does:**
- Runs 3 bot instances simultaneously
- 3x more traffic than normal mode
- Auto-restarts crashed instances
- Generates 100-150 page views/hour

**When to use:** Maximum traffic generation (needs more CPU/RAM)

---

## 🔧 SETUP COMMANDS

### 4. Setup Proxies
```bash
node setup-proxies.js
```
or
```bash
npm run setup-proxies
```

**What it does:**
- Interactive wizard to add proxies
- Tests each proxy
- Saves to proxies.json

**When to use:** First time setup or adding new proxies

---

### 5. Test Proxies
```bash
node test-proxies.js
```
or
```bash
npm run test-proxies
```

**What it does:**
- Tests all configured proxies
- Shows which ones work
- Displays country/location

**When to use:** Verify proxies are working before running bot

---

### 6. Setup Social Bots Config
```bash
node setup-config.js
```
or
```bash
npm run setup
```

**What it does:**
- Configure Reddit API keys
- Configure Twitter API keys
- Configure Pinterest API keys

**When to use:** Setting up Reddit/Twitter/Pinterest bots (optional)

---

## 🧪 TESTING COMMANDS

### 7. Test Bot (Single Run)
```bash
node test-bot.js
```
or
```bash
npm run test
```

**What it does:**
- Runs one complete bot session
- Tests all functionality
- Shows detailed output

**When to use:** Verify bot works before running 24/7

---

## 🌐 SOCIAL MEDIA BOTS

### 8. Reddit Bot
```bash
node reddit-bot.js
```

**What it does:**
- Posts to 8 subreddits
- AI-generated content
- 15+ post templates
- Runs every 6 hours

**When to use:** Generate organic traffic from Reddit

---

### 9. Twitter Bot
```bash
node twitter-bot.js
```

**What it does:**
- Tweets trending movies
- Peak USA/UK posting times
- Engagement strategy
- Runs every 4 hours

**When to use:** Generate organic traffic from Twitter/X

---

### 10. Pinterest Bot
```bash
node pinterest-bot.js
```

**What it does:**
- Auto-pins movie posters
- SEO-optimized descriptions
- 15 popular movies
- Runs every 12 hours

**When to use:** Generate organic traffic from Pinterest

---

### 11. All Social Bots (Orchestrator)
```bash
node index.js
```
or
```bash
npm start
```

**What it does:**
- Runs all 3 social bots on schedule
- Coordinates timing
- Prevents overlap

**When to use:** Run all social bots together

---

## 📊 MONITORING

### View Stats File
```bash
cat stats.json
```

**What it shows:**
- Last update time
- Total runtime
- All statistics
- Configuration

**When to use:** Quick stats check without dashboard

---

### View Proxies File
```bash
cat proxies.json
```

**What it shows:**
- All configured proxies
- Format for each proxy

**When to use:** Verify proxy configuration

---

## 🔄 COMMON WORKFLOWS

### Workflow 1: First Time Setup
```bash
cd traffic-bot
npm install
npm run setup-proxies    # Add your 10 proxies
npm run test-proxies     # Verify they work
npm run bot              # Start generating traffic!
```

---

### Workflow 2: Daily Monitoring
```bash
# Terminal 1
npm run bot

# Terminal 2 (new window)
npm run dashboard
```

Watch dashboard for 5-10 minutes, then let it run!

---

### Workflow 3: Maximum Traffic
```bash
npm run turbo
```

That's it! Turbo mode handles everything.

---

### Workflow 4: With Social Bots
```bash
# Terminal 1: Auto-clicker (direct traffic)
npm run bot

# Terminal 2: Social bots (organic traffic)
npm start

# Terminal 3: Dashboard (monitoring)
npm run dashboard
```

---

## ⚡ QUICK COMMANDS

### Start Everything
```bash
# Method 1: Multiple terminals
npm run turbo        # Terminal 1
npm start            # Terminal 2
npm run dashboard    # Terminal 3

# Method 2: Background processes (Windows)
start /B node turbo-mode.js
start /B node index.js
node dashboard.js
```

---

### Stop Everything
Press **Ctrl+C** in each terminal window

Or (if running in background):
```bash
# Windows
taskkill /F /IM node.exe

# Then restart only what you need
```

---

## 🎯 USE CASES

### Scenario 1: "I want steady traffic while I sleep"
```bash
npm run bot
```
Leave it running, check stats in morning via dashboard.

---

### Scenario 2: "I want MAXIMUM traffic"
```bash
npm run turbo
```
3x more traffic than normal mode.

---

### Scenario 3: "I want to monitor earnings"
```bash
# Terminal 1
npm run bot

# Terminal 2
npm run dashboard
```
Dashboard updates every 10 seconds.

---

### Scenario 4: "My proxies stopped working"
```bash
npm run test-proxies
```
See which proxies failed, then re-run setup:
```bash
npm run setup-proxies
```

---

### Scenario 5: "I want organic + direct traffic"
```bash
# Start auto-clicker bot
npm run bot

# In new terminal, start social bots
npm start
```

---

## 🛠️ ADVANCED USAGE

### Modify Configuration
Edit `auto-clicker-bot.js` line 19-25:
```javascript
this.config = {
  simultaneousTabs: 3,      // Change to 2-5
  pagesPerSession: 3,       // Change to 2-5
  clickProbability: 0.40,   // Change to 0.3-0.5
  minStayTime: 20,          // Change to 15-30
  maxStayTime: 60,          // Change to 45-90
};
```

Then restart:
```bash
npm run bot
```

---

### Run Multiple Websites
```bash
# Copy bot folder
cp -r traffic-bot traffic-bot-2

# Edit auto-clicker-bot.js line 11
this.websiteUrl = 'https://your-other-website.com';

# Run both
cd traffic-bot
npm run bot

cd ../traffic-bot-2
npm run bot
```

---

### Deploy to Cloud
```bash
npm run deploy
```
Follow prompts to deploy to Railway, Render, or Fly.io

---

## 📋 COMMAND CHEATSHEET

| Task | Command | Description |
|------|---------|-------------|
| **Start bot** | `npm run bot` | Normal mode traffic |
| **Turbo mode** | `npm run turbo` | 3x traffic |
| **Dashboard** | `npm run dashboard` | Monitor stats |
| **Setup proxies** | `npm run setup-proxies` | Add proxies |
| **Test proxies** | `npm run test-proxies` | Verify proxies |
| **Test bot** | `npm run test` | Single test run |
| **Social bots** | `npm start` | Reddit/Twitter/Pinterest |
| **Deploy** | `npm run deploy` | Deploy to cloud |

---

## 💡 PRO TIPS

### Tip 1: Always Test First
```bash
npm run test-proxies   # Verify proxies work
npm run test           # Test bot once
npm run bot            # Then run continuously
```

### Tip 2: Monitor Initially
Run dashboard for first 30 minutes to ensure everything works:
```bash
npm run dashboard
```

### Tip 3: Use Turbo at Night
```bash
# Daytime: Normal mode
npm run bot

# Nighttime (before sleep): Turbo mode
npm run turbo
```

### Tip 4: Check Stats Daily
```bash
npm run dashboard
```
Look for:
- CTR: 35-45% (good)
- Pages/Hour: 30-50 normal, 100-150 turbo
- All proxies being used

---

## 🚨 TROUBLESHOOTING

### Problem: "Cannot find module 'puppeteer'"
**Solution:**
```bash
npm install puppeteer
```

### Problem: "Proxies not found"
**Solution:**
```bash
npm run setup-proxies
```

### Problem: "Low page views"
**Solution:**
```bash
# Check proxies
npm run test-proxies

# If proxies ok, use turbo mode
npm run turbo
```

### Problem: "No ad clicks"
**Solution:**
Check if ads showing on website, then edit config:
```javascript
clickProbability: 0.50  // Increase from 0.40
```

---

## 🎉 READY TO GO!

**Most common command:**
```bash
npm run bot
```

**To monitor:**
```bash
npm run dashboard
```

**For maximum traffic:**
```bash
npm run turbo
```

That's it! Pick the command that fits your goal and let it run! 🚀💰
