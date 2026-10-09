@echo off
color 0E
title Auto-Refresh Proxies - Daily Task
echo.
echo ========================================
echo   AUTO-REFRESH PROXIES DAILY
echo ========================================
echo.
echo This will run EVERY DAY automatically:
echo   1. Get fresh free proxies
echo   2. Test them FAST
echo   3. Add working ones
echo   4. Remove dead ones
echo   5. Restart bots
echo.
echo This ensures you ALWAYS have working proxies!
echo.
echo ========================================
echo.
pause
echo.
echo [STEP 1/2] Getting fresh proxies...
node auto-get-proxies-fast.js
echo.
echo [STEP 2/2] Restarting bots...
powershell -command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"
timeout /t 2 /nobreak >nul
for /L %%i in (1,1,5) do (
    start /min node auto-clicker-bot.js
    timeout /t 1 /nobreak >nul
)
echo.
echo ========================================
echo   ✅ DONE! Fresh proxies loaded!
echo ========================================
echo.
pause
