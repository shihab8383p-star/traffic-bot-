@echo off
color 0B
title Update Proxies
cls

echo.
echo ========================================
echo    PROXY UPDATE TOOL
echo ========================================
echo.
echo This will help you add new proxies
echo.
echo STEP 1: Open proxies.json
echo.

start notepad "proxies.json"

echo Opened proxies.json in Notepad!
echo.
echo ========================================
echo    HOW TO ADD NEW PROXIES:
echo ========================================
echo.
echo 1. You'll see a list like this:
echo    {"host": "1.2.3.4", "port": 8080, ...}
echo.
echo 2. Copy the last line (one full proxy entry)
echo.
echo 3. Paste it below the last proxy
echo.
echo 4. Add a comma (,) after the previous line
echo.
echo 5. Change the IP and port to your new proxy
echo.
echo 6. Update "totalProxies" number at the top
echo.
echo 7. Save the file (Ctrl+S)
echo.
echo ========================================
echo.
echo EXAMPLE:
echo.
echo OLD:
echo     {"host": "1.2.3.4", "port": 8080, "country": "US"}
echo   ]
echo }
echo.
echo NEW (adding 5.6.7.8:9090):
echo     {"host": "1.2.3.4", "port": 8080, "country": "US"},
echo     {"host": "5.6.7.8", "port": 9090, "country": "DE"}
echo   ]
echo }
echo.
echo ========================================
echo.
echo After saving, do you want to restart bots
echo with new proxies?
echo.
echo Press 'Y' to restart bots
echo Press 'N' to exit (bots will use new proxies 
echo                     automatically on next session)
echo.
choice /C YN /N /M "Your choice (Y/N): "

if errorlevel 2 goto :skip
if errorlevel 1 goto :restart

:restart
echo.
echo Restarting bots with new proxies...
echo.
taskkill /F /IM node.exe 2>nul
taskkill /F /IM chrome.exe 2>nul
timeout /t 3 /nobreak >nul

echo Starting 5 bots...
cd /d "%~dp0"
start /min cmd /c "node auto-clicker-bot.js"
timeout /t 1 /nobreak >nul
start /min cmd /c "node auto-clicker-bot.js"
timeout /t 1 /nobreak >nul
start /min cmd /c "node auto-clicker-bot.js"
timeout /t 1 /nobreak >nul
start /min cmd /c "node auto-clicker-bot.js"
timeout /t 1 /nobreak >nul
start /min cmd /c "node auto-clicker-bot.js"

echo.
echo ✓ Done! 5 bots restarted with new proxies!
echo.
goto :end

:skip
echo.
echo Bots will pick up new proxies automatically!
echo No restart needed.
echo.

:end
echo ========================================
echo.
pause
