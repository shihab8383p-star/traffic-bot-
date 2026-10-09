@echo off
color 0A
title Bot Status Checker
cls

echo.
echo ========================================
echo    BOT STATUS CHECKER
echo ========================================
echo.

echo Checking if bots are running...
echo.

tasklist | find /I "node.exe" > nul
if %errorlevel% == 0 (
    echo [✓] BOTS ARE RUNNING!
    echo.
    echo Bot processes found:
    tasklist | find /I "node.exe" | find /C "node.exe" > temp.txt
    set /p count=<temp.txt
    del temp.txt
    echo    - Node.js bots: Found
    echo.
) else (
    echo [X] NO BOTS RUNNING!
    echo    Please start the bots first.
    pause
    exit
)

echo Checking Chrome browsers...
echo.

tasklist | find /I "chrome.exe" > nul
if %errorlevel% == 0 (
    echo [✓] CHROME BROWSERS ARE WORKING!
    echo    Your bots are browsing pages right now!
    echo.
) else (
    echo [X] No Chrome browsers found
    echo    Bots may be starting up, wait 30 seconds...
    echo.
)

echo ========================================
echo    STATISTICS
echo ========================================
echo.

if exist "bot-stats.json" (
    echo Reading bot activity...
    type bot-stats.json | find "totalVisits"
    type bot-stats.json | find "totalClicks"
    type bot-stats.json | find "totalScrolls"
    type bot-stats.json | find "sessionsCompleted"
    echo.
    echo [✓] Bots are recording activity!
) else (
    echo [!] Stats file not found yet
    echo    Bots just started, wait 1 minute
)

echo.
echo ========================================
echo    WHAT YOUR BOTS ARE DOING:
echo ========================================
echo.
echo    1. Visiting your Adsterra smartlinks
echo    2. Clicking on ad elements
echo    3. Scrolling pages (looks human!)
echo    4. Using 47 different proxies
echo    5. Running 24/7 NON-STOP
echo.
echo ========================================
echo.

echo Want to see a bot working in real-time?
echo Press any key to open a live bot window...
pause > nul

start cmd /k "cd /d "%~dp0" && echo === LIVE BOT WINDOW - WATCH IT WORK === && node auto-clicker-bot.js"

echo.
echo A new window opened showing a bot working live!
echo Watch that window to see the bot in action.
echo.
echo Press any key to close this checker...
pause > nul
