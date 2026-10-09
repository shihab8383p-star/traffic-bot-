@echo off
color 0A
title Auto Find Free Proxies - FAST MODE
echo.
echo ========================================
echo   AUTO FIND FREE PROXIES
echo ========================================
echo.
echo This will:
echo   1. Scrape proxies from multiple sources
echo   2. Test them SUPER FAST (20 at a time)
echo   3. Keep only HIGH-revenue countries
echo   4. Save working proxies
echo.
echo Countries: US, CA, GB, AU, EU, etc.
echo.
echo ========================================
echo.
pause
echo.
echo Please wait, this may take 2-5 minutes...
echo.
node auto-find-proxies.js
echo.
pause
