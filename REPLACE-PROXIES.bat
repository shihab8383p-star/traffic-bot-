@echo off
color 0E
title REPLACE ALL PROXIES - Delete Old, Add New
echo.
echo ========================================
echo   PROXY REPLACEMENT TOOL
echo ========================================
echo.
echo This will:
echo   1. DELETE all old proxies
echo   2. ADD your new proxies
echo   3. RESTART all bots
echo.
echo ========================================
echo.
echo WARNING: Old proxies will be removed!
echo.
set /p confirm=Continue? (y/n): 
if /i not "%confirm%"=="y" (
    echo.
    echo Cancelled!
    pause
    exit
)

echo.
echo Opening new-proxies.txt...
if not exist new-proxies.txt (
    echo # PASTE YOUR NEW PROXIES HERE > new-proxies.txt
    echo # Format: IP:PORT >> new-proxies.txt
    echo # One proxy per line >> new-proxies.txt
    echo. >> new-proxies.txt
)
notepad new-proxies.txt

echo.
set /p ready=Did you paste your new proxies? (y/n): 
if /i not "%ready%"=="y" (
    echo.
    echo Cancelled!
    pause
    exit
)

echo.
echo ========================================
echo   PROCESSING...
echo ========================================
echo.

echo [1/4] Stopping all bots...
powershell -command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"
timeout /t 2 /nobreak >nul

echo [2/4] Backing up old proxies...
if exist proxies.json (
    copy /y proxies.json proxies-backup-%date:~-4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%.json >nul
)

echo [3/4] Converting new proxies...
node add-more-proxies.js --replace

echo [4/4] Starting bots with new proxies...
for /L %%i in (1,1,5) do (
    start /min node auto-clicker-bot.js
    timeout /t 1 /nobreak >nul
)

echo.
echo ========================================
echo   ✓ COMPLETE!
echo ========================================
echo.
echo Old proxies: DELETED
echo New proxies: LOADED
echo Bots: RUNNING
echo.
pause
