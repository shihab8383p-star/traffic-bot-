@echo off
color 0B
title Use Found Proxies
echo.
echo ========================================
echo   USE FOUND PROXIES
echo ========================================
echo.
if not exist proxies-found.json (
    echo ERROR: No proxies found!
    echo.
    echo Please run FIND-FREE-PROXIES.bat first.
    echo.
    pause
    exit
)

echo Found proxies file!
echo.
echo Choose an option:
echo.
echo   1. REPLACE all current proxies
echo   2. ADD to current proxies
echo.
set /p choice=Enter choice (1 or 2): 

if "%choice%"=="1" (
    echo.
    echo [1/3] Backing up current proxies...
    copy /y proxies.json proxies-backup-before-found.json >nul
    echo.
    echo [2/3] Replacing with found proxies...
    copy /y proxies-found.json proxies.json >nul
    echo.
    echo [3/3] Restarting bots...
    powershell -command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"
    timeout /t 2 /nobreak >nul
    for /L %%i in (1,1,5) do (
        start /min node auto-clicker-bot.js
        timeout /t 1 /nobreak >nul
    )
    echo.
    echo ========================================
    echo   DONE! Using found proxies!
    echo ========================================
) else if "%choice%"=="2" (
    echo.
    echo [1/2] Merging proxies...
    node merge-proxies.js
    echo.
    echo [2/2] Restarting bots...
    powershell -command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"
    timeout /t 2 /nobreak >nul
    for /L %%i in (1,1,5) do (
        start /min node auto-clicker-bot.js
        timeout /t 1 /nobreak >nul
    )
    echo.
    echo ========================================
    echo   DONE! Added found proxies!
    echo ========================================
) else (
    echo.
    echo Invalid choice!
)
echo.
pause
