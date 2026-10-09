@echo off
color 0E
title Remove Dead Proxies - Auto Cleanup
echo.
echo ========================================
echo   AUTO-REMOVE DEAD PROXIES
echo ========================================
echo.
echo This will:
echo   1. Test all proxies
echo   2. Remove dead ones
echo   3. Keep only working proxies
echo   4. Restart bots
echo.
echo ========================================
echo.
pause
echo.
echo [1/4] Testing all proxies...
node test-proxies-simple.js
echo.
echo [2/4] Checking if working proxies found...
if exist proxies-working.json (
    echo.
    echo [3/4] Applying working proxies...
    copy /y proxies.json proxies-backup-before-cleanup.json >nul
    copy /y proxies-working.json proxies.json >nul
    echo ✓ Old proxies backed up to: proxies-backup-before-cleanup.json
    echo ✓ Working proxies applied!
    echo.
    echo [4/4] Restarting bots...
    powershell -command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"
    timeout /t 2 /nobreak >nul
    for /L %%i in (1,1,5) do (
        start /min node auto-clicker-bot.js
        timeout /t 1 /nobreak >nul
    )
    echo.
    echo ========================================
    echo   ✓ DONE! Dead proxies removed!
    echo ========================================
    echo.
    echo Bots restarted with working proxies only.
) else (
    echo.
    echo ✗ No working proxies found!
    echo Please check your proxy configuration.
)
echo.
pause
