@echo off
echo.
echo ========================================
echo   STARTING GITHUB STATS SYNCER
echo ========================================
echo.
echo This will sync your bot stats to GitHub
echo every 60 seconds so your Netlify
echo dashboard can show real-time data!
echo.
cd /d "%~dp0"
node sync-to-github.js
pause
