# Traffic Bot Pro Dashboard

Real-time monitoring dashboard for your traffic bot with beautiful UI and comprehensive statistics.

## Features

✅ Real-time earnings tracking (Adsterra + Commissions)
✅ Device & platform breakdown
✅ Proxy performance monitoring
✅ Live activity feed
✅ Click rate tracking
✅ Earnings projections (Hourly, Daily, Monthly, Annual)
✅ Auto-updates every 3 seconds

## Deploy to Netlify

### Option 1: Direct Drag & Drop (Easiest!)

1. Go to https://app.netlify.com/drop
2. Drag and drop this entire folder
3. Done! You'll get a URL like: https://random-name.netlify.app

### Option 2: Deploy from GitHub

1. Push this code to GitHub
2. Go to Netlify → New site from Git
3. Connect your repository
4. Deploy!

## Configuration

After deployment, set environment variable:

**GITHUB_STATS_URL** = Your stats JSON file URL

Example: `https://raw.githubusercontent.com/username/repo/main/bot-stats.json`

## How It Works

1. Your bot runs locally and generates stats
2. Stats get synced to GitHub (or any public URL)
3. Dashboard fetches stats from that URL
4. You see real-time data from anywhere!

## Local Development

To test locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run locally
netlify dev
```

Open http://localhost:8888

## Support

For issues or questions, check the deployment guide.
