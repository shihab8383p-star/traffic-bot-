@echo off
title Auto Proxy Refresh - Run Daily
color 0E

echo.
echo ============================================================
echo          AUTOMATIC PROXY REFRESH SYSTEM
echo ============================================================
echo.
echo This will fetch and test fresh free proxies daily.
echo.
echo Recommendation: Run this script EVERY DAY before starting bots
echo.
pause

cd /d "%~dp0"

echo.
echo [Step 1/2] Fetching fresh free proxies...
echo.
node fetch-free-proxies.js

echo.
echo [Step 2/2] Testing your custom proxies...
echo.
if exist "my-proxies.txt" (
    node test-my-proxies.js my-proxies.txt
) else (
    echo No custom proxies found, skipping...
)

echo.
echo ============================================================
echo          PROXY REFRESH COMPLETE!
echo ============================================================
echo.
echo Your proxies.json has been updated with working proxies.
echo.
echo Next steps:
echo 1. Restart your bots (close all bot windows)
echo 2. Run: START_ALL_5_BOTS.bat
echo.
pause
