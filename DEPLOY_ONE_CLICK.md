# 🚀 ONE-CLICK RAILWAY DEPLOYMENT

## No Configuration Required! ✨

Everything is pre-configured in the repo. Just click and deploy!

## 📡 Deploy Proxy API (1 Minute)

### Step 1: Go to Railway
Visit: https://railway.app/dashboard

### Step 2: New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: `shihab8383p-star/traffic-bot`
4. Click **"Deploy"**

**That's it!** Railway will automatically:
- ✅ Read `railway.toml` configuration
- ✅ Set `PORT=3000`
- ✅ Set `API_KEY=super-secret-key-123`
- ✅ Run `node proxy-api.js`
- ✅ Deploy in 2-3 minutes

### Step 3: Get Your URL
After deployment, Railway shows your URL:
```
https://traffic-bot-production-xxxx.up.railway.app
```

**Copy this URL** - you need it for traffic bots!

## 📤 Upload Your 180 Proxies

Open PowerShell and run:

```powershell
# Replace with your Railway URL
$apiUrl = "https://traffic-bot-production-xxxx.up.railway.app"

# Load proxies
$proxies = Get-Content proxies.json | ConvertFrom-Json

# Upload
$body = @{ proxies = $proxies } | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "$apiUrl/proxies" -Method POST -Headers @{"x-api-key"="super-secret-key-123"; "Content-Type"="application/json"} -Body $body
```

You should see:
```json
{"success":true,"message":"Proxies updated successfully","totalProxies":180}
```

## 🤖 Deploy Traffic Bots (Same Process)

For each of your 13 traffic bots:

1. **New Project** on Railway
2. **Same repo**: `shihab8383p-star/traffic-bot`
3. Railway will detect it needs variables, add:
   ```
   PROXY_API_URL=https://traffic-bot-production-xxxx.up.railway.app
   ```
4. **Deploy**

Railway automatically uses the Chrome crash fix we pushed!

## ✅ Verify Everything Works

### Check Proxy API:
```
https://your-railway-url/stats
```

Should show:
```json
{
  "status": "online",
  "totalProxies": 180,
  "lastUpdate": "2026-10-01T..."
}
```

### Check Traffic Bot Logs:
On Railway dashboard → Select bot → "Logs" tab

Look for:
```
✅ Loaded 180 proxies from centralized API
🌍 Using proxy: us-proxy-1.example.com:8080
```

## 🎯 What's Pre-Configured

In the GitHub repo:
- ✅ `railway.toml` - Railway configuration
- ✅ `proxy-api.js` - Default PORT and API_KEY
- ✅ `auto-clicker-bot.js` - Chrome crash fix
- ✅ `package.json` - All dependencies

**No manual setup required!**

## 💡 Pro Tips

### Change API Key (Optional):
On Railway dashboard:
1. Go to Proxy API project
2. Variables tab
3. Edit `API_KEY` to something more secure
4. Save (auto-redeploys)

### Monitor System:
- Proxy API stats: `https://your-url/stats`
- Bot logs: Railway dashboard → Logs tab

### Scale Up:
Railway free tier supports:
- **1 Proxy API** (always online)
- **13 Traffic Bots** (5 hours each = 65 hours total free)

---

**Deploy time: ~5 minutes total for entire system!** 🎉
