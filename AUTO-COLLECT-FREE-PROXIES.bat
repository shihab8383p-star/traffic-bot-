@echo off
color 0B
title Auto-Collect Free Proxies from Internet
echo.
echo ========================================
echo   AUTO-COLLECT FREE PROXIES
echo ========================================
echo.
echo This tool will:
echo   1. Fetch free proxies from internet
echo   2. Test each one
echo   3. Keep only US HIGH-tier working proxies
echo   4. Auto-load into bot
echo   5. Restart bots
echo.
echo This may take 5-10 minutes...
echo.
pause
echo.
echo Starting automatic proxy collection...
echo.
node auto-collect-proxies.js
echo.
pause
