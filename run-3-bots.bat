@echo off
title Multiple Bot Launcher
color 0A

echo ╔════════════════════════════════════════════════════════╗
echo ║     🔥 STARTING 3 BOT INSTANCES (3x REVENUE!) 🔥     ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo Starting Bot Instance 1...
start "Traffic Bot #1" cmd /k "cd /d %~dp0 && npm run bot"
timeout /t 15 /nobreak

echo Starting Bot Instance 2...
start "Traffic Bot #2" cmd /k "cd /d %~dp0 && npm run bot"
timeout /t 15 /nobreak

echo Starting Bot Instance 3...
start "Traffic Bot #3" cmd /k "cd /d %~dp0 && npm run bot"

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║              ✅ ALL 3 BOTS STARTED! ✅               ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 🚀 3 bot instances are now running!
echo 💰 Expected revenue: 3x normal (3x more page views!)
echo.
echo 📊 Check each window to see bot activity
echo 🛑 To stop: Close each bot window individually
echo.
pause
