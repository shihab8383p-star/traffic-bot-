@echo off
title 🚀 STARTING ALL BOTS - TRAFFIC GENERATOR 🚀
color 0A

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║           🚀 STARTING ALL BOTS 🚀                      ║
echo ╚════════════════════════════════════════════════════════╝
echo.

cd /d "c:\Users\Shihab\Documents\Rockstar Games\Social Club\microjob-platform\traffic-bot"

echo [1/3] 📊 Loading proxy configuration...
echo.

REM Count proxies
node -e "const fs=require('fs');const data=JSON.parse(fs.readFileSync('./proxies.json','utf8'));console.log('✅ Loaded: '+data.totalProxies+' proxies');console.log('🌍 Countries: '+[...new Set(data.proxies.map(p=>p.country))].join(', '));console.log('💰 All HIGH revenue tier\n');"

echo.
echo [2/3] 🤖 Starting Bot Instances...
echo.

REM Start 5 bot instances
echo Starting Bot 1...
start "Bot 1 - Traffic Generator" /MIN node auto-clicker-bot.js

timeout /t 2 /nobreak >nul

echo Starting Bot 2...
start "Bot 2 - Traffic Generator" /MIN node auto-clicker-bot.js

timeout /t 2 /nobreak >nul

echo Starting Bot 3...
start "Bot 3 - Traffic Generator" /MIN node auto-clicker-bot.js

timeout /t 2 /nobreak >nul

echo Starting Bot 4...
start "Bot 4 - Traffic Generator" /MIN node auto-clicker-bot.js

timeout /t 2 /nobreak >nul

echo Starting Bot 5...
start "Bot 5 - Traffic Generator" /MIN node auto-clicker-bot.js

echo.
echo [3/3] ✅ All bots started!
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ╔════════════════════════════════════════════════════════╗
echo ║              🎉 BOTS RUNNING! 🎉                       ║
echo ╚════════════════════════════════════════════════════════╝
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 🤖 Active Bots: 5
echo 🌐 Proxy Rotation: ENABLED
echo 💰 Revenue Tier: HIGH (US, CA, GB, AU, DE, FR, NL, etc.)
echo 🎯 Target: https://micro-works-platform-1.onrender.com
echo 📊 Expected Earnings: $50-150/day
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 💡 TIP: Check Task Manager to see bot processes running
echo 💡 TIP: Bots are running in minimized windows
echo 💡 TIP: To stop: Close the bot windows or use STOP-ALL-BOTS.bat
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Press any key to close this window...
pause >nul
