@echo off
color 0B
title Auto-Get Free Proxies - Fast Mode
echo.
echo ========================================
echo   AUTO-GET FREE PROXIES
echo ========================================
echo.
echo This will:
echo   1. Scrape free proxies from hproxy.com
echo   2. Test them FAST with SOAX checker
echo   3. Filter for US/CA/GB/AU only
echo   4. Add working proxies to your bots
echo   5. Restart bots
echo.
echo ========================================
echo.
pause
echo.
echo Please wait, this may take 2-3 minutes...
echo.
node auto-get-proxies-fast.js
echo.
pause
