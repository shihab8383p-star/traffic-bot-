# 🔍 How to Check if Your Bot is Running

## ✅ Quick Check Methods

### Method 1: Use the Status Checker Script (EASIEST!)
```bash
npm run check
```
or
```bash
node check-bot-status.js
```

This will show you:
- ✅ If bot is running
- 📊 Current statistics (pages, clicks, earnings)
- 👤 Account creation stats
- 🌍 Proxy information
- 🕐 Last activity time

---

### Method 2: Check Windows Task Manager
1. Press `Ctrl + Shift + Esc` to open Task Manager
2. Look for **node.exe** processes
3. If you see 1-2 node.exe processes, bot is running!

---

### Method 3: Check Stats File
Look for `bot-stats.json` in your bot folder:
- If file exists and `lastUpdate` is recent → Bot is working!
- If file doesn't exist → Bot just started or not running

---

### Method 4: Check Accounts File
Look for `bot-accounts.json` in your bot folder:
- Shows all accounts the bot has created
- Updates every time a new account is created

---

## 📊 Understanding the Stats

When you run `npm run check`, you'll see:

```
✅ Bot is RUNNING (2 Node processes found)

📊 CURRENT STATISTICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️  Runtime: 2h 45m
📄 Total Pages: 150
🖱️  Total Clicks: 18
🎯 Job Clicks: 12
💰 Ad Clicks: 6
✅ Sessions Completed: 25
❌ Sessions Failed: 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 Mobile Visits: 52
💻 Desktop Visits: 98
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 ACCOUNTS:
   👤 Created: 5
   🔐 Logged In: 3
   ✅ Login Success: 3
   ❌ Login Failed: 0
   📁 Total Stored: 5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💵 Estimated Earnings: $0.85
💰 Commission Earnings: $6.00
🔥 TOTAL: $6.85
```

---

## 🎯 What Does Each Stat Mean?

### Traffic Stats
- **Total Pages**: How many pages the bot has visited
- **Total Clicks**: All clicks (ads + job links)
- **Job Clicks**: Clicks on job signup links (earn you commission!)
- **Ad Clicks**: Clicks on Adsterra ads (earn you ad revenue!)

### Account Stats (NEW!)
- **Created**: Total accounts bot created with random emails
- **Logged In**: How many times bot logged in with existing accounts
- **Login Success/Failed**: Login attempt results
- **Total Stored**: Accounts saved in `bot-accounts.json`

### Session Stats
- **Sessions Completed**: Successful browsing sessions
- **Sessions Failed**: Failed sessions (usually proxy issues)

### Earnings
- **Estimated Earnings**: From Adsterra ad impressions and clicks
- **Commission Earnings**: From job signups (estimated $0.50 per signup)
- **TOTAL**: Your total estimated earnings!

---

## 🔄 How Account Creation Works

### Automatic Account Creation
- Bot has a **25% chance** to create account or login per tab
- If accounts exist, **60% chance** to login instead of creating new
- Accounts stored in `bot-accounts.json`

### What Bot Does:
1. 🔍 Finds signup/register button
2. 📧 Generates random email (e.g., `coolworker1234@gmail.com`)
3. 👤 Generates random username (e.g., `fast_earner_5678`)
4. 🔒 Generates random secure password
5. ✅ Fills form and submits
6. 💾 Saves account for future use

### Why Create Accounts?
- **More ads shown** to logged-in users
- **Better earnings** with personalized content
- **Realistic behavior** - real users create accounts
- **Build account database** for future use

---

## 📝 Account File Format

Check `bot-accounts.json` to see your accounts:

```json
{
  "lastUpdate": "2026-10-01T06:45:30.123Z",
  "totalAccounts": 5,
  "accounts": [
    {
      "email": "coolworker1234@gmail.com",
      "username": "fast_earner_5678",
      "password": "Abc123!@#xyz",
      "createdAt": "2026-10-01T06:30:15.000Z",
      "lastUsed": "2026-10-01T06:45:30.000Z"
    },
    ...
  ]
}
```

---

## 🚀 Bot Commands

| Command | Description |
|---------|-------------|
| `npm run bot` | Start the bot |
| `npm run check` | Check bot status |
| `npm run local` | Start dashboard |
| `Ctrl+C` | Stop the bot (in bot terminal) |

---

## ⚠️ Troubleshooting

### Bot Not Running?
```bash
npm run bot
```

### Want to see live output?
Check the terminal window where you started the bot

### Stats not updating?
- Check if bot terminal shows activity
- Look at `lastUpdate` timestamp in stats file
- If > 5 minutes old, bot might be stuck

### Too many accounts created?
The bot will naturally balance between creating new accounts and logging in with existing ones. The more accounts you have, the less likely bot will create new ones.

---

## 💡 Pro Tips

1. **Check status every hour** to ensure bot is working
2. **Watch the account count** - more accounts = more earning potential
3. **Monitor earnings** to track your progress
4. **Check session success rate** - should be > 90%
5. **Accounts are reusable** - bot will login with them randomly

---

## 🎉 What's New in This Version?

### ✨ Automatic Account Creation
- Creates accounts with random emails
- Stores credentials securely
- Logs in with existing accounts
- 25% chance per session

### 🐛 Bug Fixes
- ✅ Fixed "Detached Frame" errors
- ✅ Fixed mouse movement errors  
- ✅ Fixed scroll errors
- ✅ Fixed file path inconsistencies
- ✅ Improved error handling
- ✅ Better page validation

### 🚀 Performance Improvements
- Faster page loading
- Better timeout handling
- More reliable behavior simulation
- Cleaner error messages

---

**Happy Botting! 🚀💰**

Questions? Check the bot terminal for live updates!
