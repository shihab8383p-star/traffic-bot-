# 🤖 Update Your 13 Traffic Bots on Railway

After deploying the Proxy API, you need to tell your traffic bots where to find it.

## Quick Method: Update All Bots at Once

### Step 1: Get Your Proxy API URL
From Railway dashboard, copy your Proxy API URL. It looks like:
```
https://traffic-bot-production-xxxx.up.railway.app
```

### Step 2: Update Each Bot

For **each of your 13 traffic bots** on Railway:

1. Open Railway dashboard: https://railway.app/dashboard
2. Click on the bot (e.g., "traffic-bot-1", "traffic-bot-2", etc.)
3. Go to **"Variables"** tab
4. Click **"+ New Variable"**
5. Add:
   ```
   Variable: PROXY_API_URL
   Value: https://traffic-bot-production-xxxx.up.railway.app
   ```
6. Click **"Add"**
7. The bot will automatically redeploy

### Step 3: Verify It's Working

Check the bot logs:
1. Click on the bot
2. Go to **"Logs"** tab
3. Look for:
   ```
   ✅ Loaded 180 proxies from centralized API
   🌍 Using proxy: us-proxy-1.example.com:8080
   🚀 Starting browser session...
   ```

If you see these messages, the bot is working perfectly! ✅

## Alternative Method: Use Railway CLI

If you have Railway CLI installed, you can update bots faster:

```bash
# For each bot project
railway link
railway variables set PROXY_API_URL=https://your-url.up.railway.app
```

## What Changed?

**Before:**
- Each bot loaded proxies from `proxies.json` file
- Had to update file and redeploy all 13 bots

**After:**
- All bots load from centralized Proxy API
- Update proxies once → all bots get new proxies automatically
- No redeployment needed for proxy updates

## Troubleshooting

### Bot shows "No proxies available"
- Check `PROXY_API_URL` is set correctly
- Verify Proxy API is running: visit `https://your-url.up.railway.app/stats`
- Make sure you uploaded proxies in Step 7

### Bot crashes with "posix_spawn" error
- This should be fixed now with the Chrome flags
- If still happening, check Railway logs
- Make sure you pulled latest code from GitHub

### Bot can't connect to Proxy API
- Check Railway API is online
- Verify URL doesn't have trailing slash
- Check Railway API logs for errors

---

**All 13 bots updated?** You're done! Your entire system is now running on Railway for FREE! 🎉
