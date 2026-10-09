# 🧪 TEST LOCALLY BEFORE RAILWAY DEPLOYMENT

Test the entire system on your computer first to make sure everything works!

---

## 📋 Prerequisites

Make sure you have:
- ✅ Node.js installed (v20+)
- ✅ All files in the `traffic-bot` folder
- ✅ Internet connection (for proxy fetching)

---

## 🚀 STEP 1: Start Proxy API Server

Open **Terminal 1:**

```bash
cd traffic-bot

# Install dependencies
npm install express

# Start the API
node proxy-api.js
```

**Expected output:**
```
╔════════════════════════════════════════════════════════╗
║         🌐 PROXY API SERVER STARTED 🌐               ║
╚════════════════════════════════════════════════════════╝

✅ Server running on port 3000
🔗 URL: http://localhost:3000
📊 Endpoints:
   GET  /proxies - Fetch proxy list
   POST /proxies - Update proxy list
   GET  /stats   - API statistics

💡 Waiting for proxy updates...
```

**✅ If you see this, API is running!**

---

## 🔍 STEP 2: Start Proxy Finder Bot

Open **Terminal 2** (keep Terminal 1 running!):

```bash
cd traffic-bot

# Install dependencies
npm install axios

# Start the finder
node proxy-finder-api.js
```

**Expected output:**
```
╔════════════════════════════════════════════════════════╗
║  ⚡ PROXY FINDER BOT - API INTEGRATION ⚡            ║
╚════════════════════════════════════════════════════════╝

🚀 Starting Proxy Finder Bot with API Integration...
📦 Sources: GitHub repos (HProxy, Proxifly)
⏰ Refresh interval: 2 minutes
🎯 Target: Tier S (US, FR, GB) priority
📤 API URL: http://localhost:3000

🔌 Testing API connection...
✅ API is reachable!

🔍 STEP 1: Fetching proxies from GitHub repos...
   ✅ Found 2000+ proxies

🧪 STEP 2: Testing 300 proxies...
   ✅ 150 working proxies found

🎯 STEP 3: Filtering by TIER...
   💎 Tier S: 50 proxies (US, FR, GB)
   🌟 Tier 1: 30 proxies
   ⭐ Tier 2: 20 proxies

📤 STEP 4: Pushing to API...
   ✅ PUSHED TO API SUCCESSFULLY!
```

**✅ If you see "PUSHED TO API SUCCESSFULLY!", finder is working!**

---

## 🎯 STEP 3: Test Traffic Bot

Open **Terminal 3** (keep Terminal 1 & 2 running!):

```bash
cd traffic-bot

# Install dependencies (if not already)
npm install

# Start the bot
node auto-clicker-bot.js
```

**Expected output:**
```
╔════════════════════════════════════════════════════════╗
║   🔥 GOD-LEVEL TRAFFIC GENERATOR V3.0 ULTIMATE 🔥    ║
╚════════════════════════════════════════════════════════╝

🔄 Fetching proxies from API: http://localhost:3000
✅ Fetched 100 fresh proxies from API!
✅ Loaded proxies from Proxy API (AUTOMATED MODE!)

✅ Loaded 100 working proxies
🎯 Target: https://micro-works-platform-1.onrender.com
📱 Tabs per session: 8 (GOD-LEVEL!)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 Session 1 - SMARTLINK PRIORITY MODE 💎
🌍 Proxy: US (United States)
💎 Expected: 3-6 smartlink clicks (90% work!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**✅ If you see "Loaded from Proxy API", bot is working!**

---

## 🧪 STEP 4: Verify API Integration

While all 3 terminals are running, open your browser:

### 1. Check API Stats:
```
http://localhost:3000/stats
```

**Should show:**
```json
{
  "status": "online",
  "totalProxies": 100,
  "lastUpdate": "2026-10-01T...",
  "updateCount": 1
}
```

### 2. Check Proxies:
```
http://localhost:3000/proxies
```

**Should show:**
```json
{
  "success": true,
  "proxies": [
    {
      "host": "1.2.3.4",
      "port": 8080,
      "country": "US",
      "tier": "TIER S"
    },
    ...
  ],
  "totalProxies": 100
}
```

**✅ If you see proxies, API is serving data!**

---

## ✅ VERIFICATION CHECKLIST

After 5 minutes of running, verify:

### Terminal 1 (Proxy API):
- [ ] Shows "Server running on port 3000"
- [ ] Shows "Proxy update #1" (when finder pushes)
- [ ] Shows "Received 100 working proxies"

### Terminal 2 (Proxy Finder):
- [ ] Shows "✅ PUSHED TO API SUCCESSFULLY!"
- [ ] Updates every 2 minutes
- [ ] Shows "Cycle #2" after 2 minutes

### Terminal 3 (Traffic Bot):
- [ ] Shows "✅ Loaded from Proxy API (AUTOMATED MODE!)"
- [ ] Shows "💎 TIER S proxy: US (United States)"
- [ ] Runs sessions continuously
- [ ] Fetches new proxies before each session

### Browser (API endpoint):
- [ ] `http://localhost:3000` shows API info
- [ ] `http://localhost:3000/stats` shows stats
- [ ] `http://localhost:3000/proxies` shows proxy list

**✅ If ALL checked, system is working perfectly!**

---

## 🔄 TEST PROXY AUTO-REFRESH

Wait 2 minutes and watch Terminal 2 (Proxy Finder):

**At 2:00 minutes:**
```
╔════════════════════════════════════════════════════════╗
║  🔄 CYCLE 2 - Finding Fresh Proxies...                ║
╚════════════════════════════════════════════════════════╝

🔍 STEP 1: Fetching proxies from GitHub repos...
   ✅ Found 2200 proxies

🧪 STEP 2: Testing 300 proxies...
   ✅ 140 working

📤 STEP 4: Pushing to API...
   ✅ PUSHED TO API SUCCESSFULLY!
```

**Check Terminal 1 (API):**
```
📤 Proxy update #2
✅ Received 140 working proxies
⏰ Updated at: 2026-10-01T...
```

**Check Terminal 3 (Traffic Bot):**
- Next session should fetch the NEW proxies (140 instead of 100)
- Look for: "✅ Fetched 140 fresh proxies from API!"

**✅ If proxies auto-update, automation is working!**

---

## 🛑 STOP TESTING

When you're done testing:

1. **Terminal 3:** Press `Ctrl+C` (stop traffic bot)
2. **Terminal 2:** Press `Ctrl+C` (stop proxy finder)
3. **Terminal 1:** Press `Ctrl+C` (stop API)

---

## ❌ TROUBLESHOOTING

### Issue: "Could not fetch from API"
**Fix:**
1. Make sure Terminal 1 (API) is running
2. Check `http://localhost:3000` in browser
3. If API is not running, restart Terminal 1

### Issue: "No proxies available yet"
**Fix:**
1. Wait 2 minutes for proxy finder to complete first cycle
2. Check Terminal 2 logs for errors
3. Make sure you have internet connection

### Issue: "API not reachable"
**Fix:**
1. Check Terminal 1 is running
2. Try `http://127.0.0.1:3000` instead of `localhost`
3. Check firewall isn't blocking port 3000

### Issue: Traffic bot uses local proxies instead of API
**Fix:**
1. Delete `proxies.json` file temporarily
2. Bot will be FORCED to use API
3. Check Terminal 3 logs for "Loaded from Proxy API"

---

## 🎉 SUCCESS!

If everything worked:

✅ **API server stores proxies**
✅ **Proxy finder auto-updates every 2 minutes**
✅ **Traffic bot fetches from API automatically**
✅ **All proxies are Tier S (US/FR/GB priority)**
✅ **No manual updates needed!**

**You're ready for Railway deployment! 🚀**

---

## 📚 NEXT STEPS

1. Stop all 3 terminals
2. Push code to GitHub
3. Follow `DEPLOYMENT_GUIDE.md`
4. Deploy to Railway
5. Watch the earnings roll in! 💰

---

**💡 TIP:** Keep this test setup for debugging if Railway deployment has issues!

**🔥 IMPORTANT:** The exact same behavior you see locally will happen on Railway!
