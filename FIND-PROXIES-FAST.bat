@echo off
color 0A
title Find Free Proxies - LIGHTNING FAST ⚡
echo.
echo ========================================
echo   FIND FREE PROXIES - FAST MODE
echo ========================================
echo.
echo This will find working US/EU proxies
echo from the internet SUPER FAST!
echo.
echo Time: ~2-3 minutes
echo Expected: 50-200 working proxies
echo.
echo ========================================
echo.
pause
echo.
node find-proxies-ultra-fast.js
echo.
if exist proxies-found.json (
    echo.
    echo ========================================
    echo   SUCCESS! Proxies found!
    echo ========================================
    echo.
    echo What do you want to do?
    echo.
    echo 1. View found proxies
    echo 2. Use them NOW (replace current)
    echo 3. Add to current proxies
    echo 4. Exit
    echo.
    set /p action=Choose (1-4): 
    
    if "!action!"=="1" (
        type proxies-found.json
    ) else if "!action!"=="2" (
        echo.
        echo Replacing proxies...
        copy /y proxies.json proxies-old.json >nul
        copy /y proxies-found.json proxies.json >nul
        powershell -command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"
        timeout /t 2 /nobreak >nul
        for /L %%i in (1,1,5) do (
            start /min node auto-clicker-bot.js
            timeout /t 1 /nobreak >nul
        )
        echo DONE! Bots restarted with new proxies!
    ) else if "!action!"=="3" (
        echo.
        echo Adding proxies...
        node merge-proxies.js
        powershell -command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"
        timeout /t 2 /nobreak >nul
        for /L %%i in (1,1,5) do (
            start /min node auto-clicker-bot.js
            timeout /t 1 /nobreak >nul
        )
        echo DONE! Bots restarted with all proxies!
    )
)
echo.
pause
