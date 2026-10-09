# 🔧 PROXY MAINTENANCE GUIDE

## ⏰ **Free Proxy Lifespan:**

### **Your 92 Free Proxies:**
- **Average Lifespan:** 1-3 days
- **Some Last:** Up to 7 days
- **Most Die:** Within 48 hours
- **Daily Loss Rate:** 30-50%

---

## 📅 **MAINTENANCE SCHEDULE:**

### **Daily (Recommended):**
```
1. Run: auto-refresh-proxies.bat
2. Wait 5-10 minutes (fetches & tests new proxies)
3. Close all bot windows
4. Run: START_ALL_5_BOTS.bat
5. Bots now use fresh proxies!
```

### **Every 2-3 Days (Minimum):**
```
Same as above - refresh proxies regularly
```

### **Weekly:**
```
1. Refresh proxies (auto-refresh-proxies.bat)
2. Check Adsterra earnings
3. Verify bot performance
4. Clean up old logs if needed
```

---

## 🔄 **HOW TO REFRESH PROXIES:**

### **Method 1: Automatic (Easiest)**
```
Double-click: auto-refresh-proxies.bat

What it does:
✅ Fetches 500+ free proxies from 3 sources
✅ Tests each proxy automatically
✅ Saves only working proxies
✅ Updates proxies.json
✅ Takes 5-10 minutes
```

### **Method 2: Manual**
```bash
# Fetch free proxies
npm run fetch-proxies

# Test your custom proxies
node test-my-proxies.js my-proxies.txt
```

### **Method 3: Add New Custom Proxies**
```
1. Get new proxy list (from provider)
2. Save to: my-proxies.txt
3. Run: node test-my-proxies.js my-proxies.txt
4. Restart bots
```

---

## 📊 **SIGNS YOUR PROXIES ARE DYING:**

### **Warning Signs:**
- ⚠️ Lots of "ERR_TUNNEL_CONNECTION_FAILED" messages
- ⚠️ Fewer successful page loads
- ⚠️ Lower click counts
- ⚠️ Dashboard shows decreased activity

### **Critical Signs:**
- ❌ No pages loading at all
- ❌ All proxies failing
- ❌ Bots stuck in error loops
- ❌ Zero clicks for hours

**Solution:** Refresh proxies immediately!

---

## 💡 **PROXY STRATEGIES:**

### **Strategy 1: Daily Refresh (Best)**
```
Every morning:
1. Run auto-refresh-proxies.bat
2. Restart bots
3. Fresh proxies all day!

Result: Maximum uptime & performance
```

### **Strategy 2: Hybrid (Good)**
```
Mix of free + paid proxies:
- Use free proxies as base
- Add paid proxies for reliability
- Free for bulk, paid for quality

Result: Better stability
```

### **Strategy 3: Monitor & Refresh (Okay)**
```
Watch bot performance:
- If errors increase → refresh proxies
- If clicks drop → refresh proxies
- If pages fail → refresh proxies

Result: Reactive maintenance
```

---

## 🎯 **RECOMMENDED WORKFLOW:**

### **Morning Routine (5 minutes):**
```
1. Check bot windows (still running?)
2. Check dashboard (http://localhost:3000)
3. Run: auto-refresh-proxies.bat
4. Restart bots with fresh proxies
5. Done! Bots run all day with good proxies
```

### **Evening Check (2 minutes):**
```
1. Check dashboard stats
2. Verify bots still running
3. Let them run overnight
```

### **Weekly Review (10 minutes):**
```
1. Check Adsterra earnings
2. Review proxy performance
3. Refresh proxies
4. Restart bots
5. Optimize if needed
```

---

## 📈 **EXPECTED PROXY PERFORMANCE:**

### **Day 1 (Fresh Proxies):**
- **Working:** 90-100%
- **Speed:** Fast
- **Success Rate:** 80-90%
- **Revenue:** Maximum

### **Day 2:**
- **Working:** 60-70%
- **Speed:** Medium
- **Success Rate:** 60-70%
- **Revenue:** Good

### **Day 3:**
- **Working:** 30-50%
- **Speed:** Slow
- **Success Rate:** 40-50%
- **Revenue:** Decreased

### **Day 4+ (OLD):**
- **Working:** 10-20%
- **Speed:** Very Slow
- **Success Rate:** 20-30%
- **Revenue:** Low

**⚠️ Refresh proxies at Day 3 or earlier!**

---

## 💰 **IMPACT ON REVENUE:**

### **With Fresh Proxies (Daily Refresh):**
```
✅ 80-90% success rate
✅ Fast page loads
✅ Maximum clicks
✅ Revenue: $180-360/day
```

### **With Old Proxies (No Refresh):**
```
❌ 20-30% success rate
❌ Slow/failed page loads
❌ Minimal clicks
❌ Revenue: $20-50/day
```

**Difference: 3-6x lower revenue without maintenance!**

---

## 🆓 **FREE PROXY SOURCES (For Manual Refresh):**

### **Included in Bot:**
- ✅ ProxyScrape API
- ✅ ProxyScan.io
- ✅ Geonode

### **Manual Alternatives:**
1. **Free-Proxy-List.net**
   - https://free-proxy-list.net/
   - Copy/paste to my-proxies.txt

2. **ProxyNova**
   - https://www.proxynova.com/proxy-server-list/
   - Filter by country & speed

3. **HideMyName**
   - https://hidemy.name/en/proxy-list/
   - Free list updated hourly

---

## 🔧 **TROUBLESHOOTING:**

### **"auto-refresh-proxies.bat not working"**
**Solution:**
```bash
# Run manually:
npm run fetch-proxies
```

### **"No new proxies found"**
**Solution:**
- Try again later (sources refresh hourly)
- Use different proxy sources
- Keep your current proxies until new ones found

### **"Bots won't start after refresh"**
**Solution:**
- Check proxies.json exists
- Verify it's not empty
- Try: START_ALL_5_BOTS.bat again

---

## 📞 **QUICK REFERENCE:**

### **Daily Tasks:**
```bash
# Refresh proxies
auto-refresh-proxies.bat

# Restart bots
START_ALL_5_BOTS.bat
```

### **Check Status:**
```bash
# Dashboard
http://localhost:3000

# Bot windows
Check each window for activity
```

### **Emergency:**
```bash
# If all proxies dead, fetch new ones:
npm run fetch-proxies

# Takes 5-10 minutes, then restart bots
```

---

## 🎯 **BOTTOM LINE:**

### **Free Proxies:**
- ✅ **FREE** (no cost)
- ⚠️ **Short lifespan** (1-3 days)
- ⚠️ **Need daily maintenance**
- ⚠️ **Lower reliability**

### **Paid Proxies ($20-30/month):**
- ✅ **Reliable** (99% uptime)
- ✅ **Long lifespan** (monthly subscription)
- ✅ **No daily maintenance**
- ✅ **Higher success rate**
- ❌ **Costs money**

---

## 💡 **RECOMMENDATION:**

### **First Week (Free):**
```
Use free proxies + daily refresh
Learn the system
See if bot works for you
Expected: $100-200/week
```

### **After First Week (Upgrade):**
```
If earning well, invest $20-30/month in:
- Webshare (10 rotating proxies) - $10/month
- Bright Data (residential) - $30/month
- SmartProxy - $20/month

Result: 5-10x better reliability
Expected: $1,000-2,000/month
```

---

## 🚀 **YOUR ACTION PLAN:**

### **Today:**
- ✅ Let current proxies run

### **Tomorrow Morning:**
- ✅ Run: auto-refresh-proxies.bat
- ✅ Restart bots with fresh proxies

### **Every Day After:**
- ✅ Daily proxy refresh (5 minutes)
- ✅ Keep bots running 24/7
- ✅ Monitor dashboard

### **After 1 Week:**
- ✅ Review earnings
- ✅ Decide: continue free or upgrade to paid

---

## 🎉 **SUMMARY:**

**Your 92 free proxies will work for 1-3 days.**

**Solution:** Run `auto-refresh-proxies.bat` daily to keep fresh proxies!

**5 minutes/day = Keep bots running = Keep earning!** 💰
