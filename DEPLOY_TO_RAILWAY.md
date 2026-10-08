# 🚀 Deploy to Railway - Complete Guide

## ✅ Step 1: Chrome Fix (DONE!)
The Chrome crash fix has been pushed to GitHub. Your traffic bots will now work on Railway's free tier without "posix_spawn" errors.

## 📡 Step 2: Deploy Proxy API to Railway

### 2.1 Create New Project on Railway
1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `shihab8383p-star/traffic-bot`
5. Railway will ask which service to start with - click **"Add variables first"**

### 2.2 Set Environment Variables
Add these variables:
```
PORT=3000
API_KEY=your-secret-key-123
```
(Change `your-secret-key-123` to something secure)

### 2.3 Configure Build & Start Commands
- **Build Command:** `npm install`
- **Start Command:** `node proxy-api.js`
- **Root Directory:** `/` (leave default)

### 2.4 Deploy!
Click **"Deploy"** and wait 2-3 minutes.

Railway will give you a URL like:
```
https://traffic-bot-production-xxxx.up.railway.app
```

## 📤 Step 3: Upload Your 180 Proxies

Once deployed, open PowerShell and run:

```powershell
# Replace with your actual Railway URL
$apiUrl = "https://traffic-bot-production-xxxx.up.railway.app"
$apiKey = "your-secret-key-123"

# Load your proxies
$proxies = Get-Content proxies.json | ConvertFrom-Json

# Upload to Railway
$body = @{ proxies = $proxies } | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "$apiUrl/proxies" -Method POST -Headers @{"x-api-key"=$apiKey; "Content-Type"="application/json"} -Body $body
```

You should see:
```json
{"success":true,"message":"Proxies updated successfully","count":180}
```

## 🤖 Step 4: Update Your 13 Traffic Bots

For each of your 13 traffic bots on Railway:

1. Go to the bot's settings
2. Add environment variable:
   ```
   PROXY_API_URL=https://traffic-bot-production-xxxx.up.railway.app
   ```
3. Click **"Redeploy"**

## ✅ Step 5: Verify Everything Works

### Check Proxy API:
Visit: `https://traffic-bot-production-xxxx.up.railway.app/stats`

Should show:
```json
{
  "totalProxies": 180,
  "lastUpdated": "2026-10-01T..."
}
```

### Check Traffic Bots:
Look at the logs for each bot. You should see:
```
✅ Loaded 180 proxies from centralized API
🌍 Using proxy: us-proxy-1.example.com:8080
```

## 🎯 What You Get

- **1 Proxy API** serving 180 proxies (always online)
- **13 Traffic Bots** all fetching from the same API
- **No manual proxy updates** - just update API once, all bots get new proxies
- **100% FREE** on Railway's free tier
- **Chrome crash fixed** - bots run smoothly with memory-saving flags

## 🔧 Future Proxy Updates

When you want to add new proxies:

```powershell
# Edit proxies.json locally
# Then upload again
$proxies = Get-Content proxies.json | ConvertFrom-Json
$body = @{ proxies = $proxies } | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "$apiUrl/proxies" -Method POST -Headers @{"x-api-key"=$apiKey; "Content-Type"="application/json"} -Body $body
```

All 13 bots automatically use the new proxies!

## 📊 Monitor Your System

Check proxy stats anytime:
```
https://your-railway-url/stats
```

Check bot logs:
- Railway Dashboard → Select Bot → "Logs" tab

---

**Need help?** Check the Railway logs if something isn't working.
