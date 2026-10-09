@echo off
title Multiple Bot Launcher - 5 Instances
color 0A

echo ╔════════════════════════════════════════════════════════╗
echo ║     🔥 STARTING 5 BOT INSTANCES (5x REVENUE!) 🔥     ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo ⚠️  WARNING: This will use significant CPU/RAM
echo 💡 Make sure your computer can handle 5 browsers!
echo.
pause

echo Starting Bot Instance 1...
start "Traffic Bot #1" cmd /k "cd /d %~dp0 && npm run bot"
timeout /t 15 /nobreak

echo Starting Bot Instance 2...
start "Traffic Bot #2" cmd /k "cd /d %~dp0 && npm run bot"
timeout /t 15 /nobreak

echo Starting Bot Instance 3...
start "Traffic Bot #3" cmd /k "cd /d %~dp0 && npm run bot"
timeout /t 15 /nobreak

echo Starting Bot Instance 4...
start "Traffic Bot #4" cmd /k "cd /d %~dp0 && npm run bot"
timeout /t 15 /nobreak

echo Starting Bot Instance 5...
start "Traffic Bot #5" cmd /k "cd /d %~dp0 && npm run bot"

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║              ✅ ALL 5 BOTS STARTED! ✅               ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 🚀 5 bot instances are now running!
echo 💰 Expected revenue: 5x normal (MAXIMUM EARNINGS!)
echo.
echo 📊 Check each window to see bot activity
echo 🛑 To stop: Close each bot window individually
echo ⚠️  Monitor CPU usage to avoid overheating
echo.
pause
