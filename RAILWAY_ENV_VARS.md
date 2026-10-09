# 🔧 RAILWAY ENVIRONMENT VARIABLES GUIDE

Complete list of environment variables needed for each bot type.

---

## 🌐 PROXY API SERVER

**Service Name:** `proxy-api-server`

**Environment Variables:**

```bash
# Required
PORT=3000

# Optional (for security)
API_KEY=your-secret-key-123
```

### How to set on Railway:
1. Go to your `proxy-api-server` service
2. Click **Variables** tab
3. Add each variable:
   - Key: `PORT`, Value: `3000`
   - Key: `API_KEY`, Value: `your-secret-key-123`
4. Click **Deploy** to apply changes

---

## 🔍 PROXY FINDER BOT

**Service Name:** `proxy-finder-bot`

**Environment Variables:**

```bash
# Required - API URL from your proxy-api deployment
PROXY_API_URL=https://proxy-api-server.up.railway.app

# Required - Must match API's API_KEY
API_KEY=your-secret-key-123
```

⚠️ **CRITICAL:** 
- Replace `proxy-api-server.up.railway.app` with YOUR actual API URL
- To get your API URL: Go to proxy-api service → Settings → Copy domain
- **NO TRAILING SLASH** at end of URL!

### How to set on Railway:
1. Go to your `proxy-finder-bot` service
2. Click **Variables** tab
3. Add:
   - Key: `PROXY_API_URL`, Value: `https://your-actual-api-url.up.railway.app`
   - Key: `API_KEY`, Value: `your-secret-key-123`
4. Click **Deploy**

---

## 🎯 TRAFFIC BOTS (All 13 bots)

**Service Names:** `traffic-bot-1`, `traffic-bot-2`, ... `traffic-bot-13`

**Environment Variables:**

```bash
# Required - API URL (SAME FOR ALL 13 BOTS!)
PROXY_API_URL=https://proxy-api-server.up.railway.app

# Required - Fix Chrome launch issues
PUPPETEER_EXECUTABLE_PATH=/root/.cache/puppeteer/chrome/linux-*/chrome-linux64/chrome

# Optional - Custom website (if you want to change target)
# WEBSITE_URL=https://your-site.com
```

⚠️ **CRITICAL:**
- **ALL 13 bots MUST use the SAME `PROXY_API_URL`**
- Replace `proxy-api-server.up.railway.app` with YOUR actual API URL
- `PUPPETEER_EXECUTABLE_PATH` fixes "Failed to launch browser" error

### How to set on Railway:
1. Go to any traffic bot (e.g., `traffic-bot-1`)
2. Click **Variables** tab
3. Add:
   - Key: `PROXY_API_URL`, Value: `https://your-actual-api-url.up.railway.app`
   - Key: `PUPPETEER_EXECUTABLE_PATH`, Value: `/root/.cache/puppeteer/chrome/linux-*/chrome-linux64/chrome`
4. Click **Deploy**

**Repeat for ALL 13 traffic bots!**

---

## 📋 QUICK REFERENCE TABLE

| Bot Type | Service Name | Required Env Vars |
|----------|--------------|-------------------|
| **API** | `proxy-api-server` | `PORT=3000`<br>`API_KEY=your-secret-key-123` |
| **Finder** | `proxy-finder-bot` | `PROXY_API_URL=https://...`<br>`API_KEY=your-secret-key-123` |
| **Traffic** | `traffic-bot-1` to `traffic-bot-13` | `PROXY_API_URL=https://...`<br>`PUPPETEER_EXECUTABLE_PATH=/root/.cache/...` |

---

## 🎯 HOW TO GET YOUR API URL

After deploying `proxy-api-server`:

1. Go to Railway dashboard
2. Click on `proxy-api-server` service
3. Click **Settings** tab
4. Find **Domains** section
5. Copy the URL (e.g., `https://proxy-api-server-production-abc123.up.railway.app`)
6. **USE THIS URL** in `PROXY_API_URL` for finder and all traffic bots!

**Example:**
```
Your API URL: https://proxy-api-server-production-abc123.up.railway.app

For Finder:
PROXY_API_URL=https://proxy-api-server-production-abc123.up.railway.app

For ALL Traffic Bots:
PROXY_API_URL=https://proxy-api-server-production-abc123.up.railway.app
```

⚠️ **DO NOT include `/proxies` or any path - just the domain!**

---

## 🧪 TESTING YOUR ENV VARS

### Test Proxy API:
```bash
curl https://your-api-url.up.railway.app/stats
```

**Expected response:**
```json
{
  "status": "online",
  "totalProxies": 0,
  "lastUpdate": "2026-10-01T..."
}
```

### Test from Traffic Bot logs:
Look for these lines in traffic bot logs:
```
🔄 Fetching proxies from API: https://your-api-url...
✅ Fetched 100 fresh proxies from API!
✅ Loaded proxies from Proxy API (AUTOMATED MODE!)
```

**✅ If you see "AUTOMATED MODE!", env vars are correct!**

---

## ❌ COMMON MISTAKES

### ❌ Wrong: Trailing slash
```bash
PROXY_API_URL=https://proxy-api-server.up.railway.app/
                                                      ^ BAD!
```

### ✅ Correct: No trailing slash
```bash
PROXY_API_URL=https://proxy-api-server.up.railway.app
                                                     ^ GOOD!
```

---

### ❌ Wrong: Including /proxies path
```bash
PROXY_API_URL=https://proxy-api-server.up.railway.app/proxies
                                                      ^^^^^^^^ BAD!
```

### ✅ Correct: Just the domain
```bash
PROXY_API_URL=https://proxy-api-server.up.railway.app
                                                     ^ GOOD!
```

---

### ❌ Wrong: Using localhost
```bash
PROXY_API_URL=http://localhost:3000
              ^^^^^^^^^^^^^^^^^^^^^ BAD!
```

### ✅ Correct: Using Railway URL
```bash
PROXY_API_URL=https://proxy-api-server.up.railway.app
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ GOOD!
```

---

### ❌ Wrong: Different API URLs for different bots
```bash
traffic-bot-1: PROXY_API_URL=https://api-1.up.railway.app
traffic-bot-2: PROXY_API_URL=https://api-2.up.railway.app
                                      ^ BAD! All bots must use SAME API!
```

### ✅ Correct: Same API URL for ALL bots
```bash
traffic-bot-1: PROXY_API_URL=https://proxy-api-server.up.railway.app
traffic-bot-2: PROXY_API_URL=https://proxy-api-server.up.railway.app
traffic-bot-3: PROXY_API_URL=https://proxy-api-server.up.railway.app
...
traffic-bot-13: PROXY_API_URL=https://proxy-api-server.up.railway.app
                               ^ GOOD! All use same API!
```

---

## 🔒 SECURITY NOTE

**API_KEY** is optional but recommended:
- If you set it on API, you MUST set it on Finder
- Both must have the EXACT same value
- Traffic bots don't need API_KEY (only Finder needs it to UPDATE proxies)

**Without API_KEY:** Anyone can update your proxies (not recommended)
**With API_KEY:** Only your Finder bot can update proxies (secure!)

---

## 💡 PRO TIP: Copy Variables from Working Bot

If you have a bot that's working (like bot-1):

1. Go to working bot → **Variables** tab
2. Copy all variables
3. Go to new bot → **Variables** tab
4. Paste same variables
5. Deploy!

This ensures all bots have identical config!

---

## 📊 VERIFICATION CHECKLIST

After setting env vars, verify:

- [ ] Proxy API has `PORT` and `API_KEY`
- [ ] Proxy Finder has correct `PROXY_API_URL` and `API_KEY`
- [ ] ALL 13 traffic bots have same `PROXY_API_URL`
- [ ] ALL traffic bots have `PUPPETEER_EXECUTABLE_PATH`
- [ ] No trailing slashes in any URLs
- [ ] API_KEY matches between API and Finder
- [ ] Test API URL in browser (should show stats)

**✅ If all checked, you're ready to deploy!**

---

## 🚀 DEPLOYMENT ORDER

**IMPORTANT:** Deploy in this order!

1. **Deploy Proxy API FIRST** → Get URL
2. **Set env vars for Finder** → Use API URL
3. **Deploy Proxy Finder** → Wait 2 minutes
4. **Set env vars for Traffic Bots** → Use API URL
5. **Deploy ALL Traffic Bots** → They'll auto-fetch from API!

**Never deploy Finder or Traffic Bots before API is running!**

---

## 📚 TROUBLESHOOTING

### Issue: "Could not fetch from API"
**Check:**
- Is `PROXY_API_URL` set correctly?
- Does it have `https://`?
- No trailing slash?
- Is the API actually running?

### Issue: "Invalid API key"
**Check:**
- Does `API_KEY` match between API and Finder?
- Is it spelled correctly?
- Any extra spaces?

### Issue: "Failed to launch browser"
**Check:**
- Is `PUPPETEER_EXECUTABLE_PATH` set?
- Is the path exactly: `/root/.cache/puppeteer/chrome/linux-*/chrome-linux64/chrome`
- Try adding `nixpacks.toml` file

### Issue: Bot uses local proxies instead of API
**Check:**
- Is `PROXY_API_URL` set?
- Check bot logs for "Loaded from Proxy API"
- If not found, check API is returning proxies

---

**🎉 With correct env vars, your system will run flawlessly on Railway!**
