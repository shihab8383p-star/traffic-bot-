@echo off
color 0B
title Easy Proxy Updater
echo.
echo ========================================
echo      EASY PROXY UPDATER
echo ========================================
echo.
echo This tool will help you update proxies.
echo.
echo STEP 1: Open proxies.json in Notepad
echo STEP 2: Delete all old proxies
echo STEP 3: Paste your new proxies
echo STEP 4: Save the file
echo STEP 5: Restart bots
echo.
echo ========================================
echo.
pause
echo.
echo Opening proxies.json in Notepad...
notepad proxies.json
echo.
echo ========================================
echo.
echo File saved? Now restart the bots!
echo.
echo Press any key to stop all bots...
pause >nul
echo.
echo Stopping all bots...
powershell -command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"
echo.
echo All bots stopped!
echo.
echo Press any key to start 5 bots with new proxies...
pause >nul
echo.
echo Starting 5 bots...
for /L %%i in (1,1,5) do (
    start /min node auto-clicker-bot.js
    echo Bot %%i started!
    timeout /t 1 /nobreak >nul
)
echo.
echo ========================================
echo   ALL 5 BOTS RUNNING WITH NEW PROXIES!
echo ========================================
echo.
pause
