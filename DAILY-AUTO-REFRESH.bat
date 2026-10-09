@echo off
color 0A
title Daily Auto Proxy Refresh
echo.
echo ========================================
echo   🔄 DAILY AUTO PROXY REFRESH 🔄
echo ========================================
echo.
echo This will run automatically every day:
echo   1. Fetch fresh FREE proxies
echo   2. Test them FAST
echo   3. Keep HIGH revenue countries only
echo   4. Replace old proxies
echo   5. Restart bots
echo.
echo ========================================
echo.
echo Starting in 5 seconds...
timeout /t 5 /nobreak >nul
echo.
node auto-proxy-fetcher-fast.js
echo.
echo ========================================
echo   ✅ DONE! Bots refreshed!
echo ========================================
echo.
echo Next refresh: Tomorrow same time
echo.
pause
