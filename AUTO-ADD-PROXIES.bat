@echo off
color 0B
title Automatic Proxy Updater
echo.
echo ========================================
echo   AUTOMATIC PROXY UPDATER
echo ========================================
echo.
echo This tool will help you add proxies automatically!
echo.
echo STEP 1: Copy your new proxies
echo STEP 2: Paste them in new-proxies.txt
echo STEP 3: Run this tool
echo STEP 4: Bots restart automatically!
echo.
echo ========================================
echo.
pause
echo.
echo Opening new-proxies.txt for you...
if not exist new-proxies.txt (
    echo Creating new-proxies.txt...
    echo # PASTE YOUR NEW PROXIES HERE > new-proxies.txt
    echo # Format: IP:PORT >> new-proxies.txt
    echo # One proxy per line >> new-proxies.txt
    echo # >> new-proxies.txt
    echo # Example: >> new-proxies.txt
    echo # 1.2.3.4:8080 >> new-proxies.txt
    echo # 5.6.7.8:3128 >> new-proxies.txt
)
notepad new-proxies.txt
echo.
echo ========================================
echo.
echo Did you paste your proxies? (y/n)
set /p answer=
if /i "%answer%"=="y" (
    echo.
    echo Converting proxies to JSON format...
    powershell -File convert-proxies.ps1
    echo.
    echo Restarting bots...
    powershell -command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"
    timeout /t 2 /nobreak >nul
    for /L %%i in (1,1,5) do (
        start /min node auto-clicker-bot.js
        timeout /t 1 /nobreak >nul
    )
    echo.
    echo ========================================
    echo   ALL DONE! Bots running with new proxies!
    echo ========================================
) else (
    echo.
    echo Cancelled. Run this tool again when ready!
)
echo.
pause
