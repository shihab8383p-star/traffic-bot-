@echo off
color 0A
title Bot Monitor - SUPER FAST MODE
echo.
echo ========================================
echo     BOT MONITOR - SUPER FAST MODE
echo ========================================
echo.

:loop
cls
echo ========================================
echo     BOT MONITOR - SUPER FAST MODE
echo ========================================
echo.

REM Count processes
for /f %%i in ('powershell -command "(Get-Process -Name node -ErrorAction SilentlyContinue).Count"') do set NODE_COUNT=%%i
for /f %%i in ('powershell -command "(Get-Process -Name chrome -ErrorAction SilentlyContinue).Count"') do set CHROME_COUNT=%%i

echo [NODE BOTS]
echo   Running: %NODE_COUNT% bots
echo.
echo [CHROME BROWSERS]
echo   Active: %CHROME_COUNT% browsers
echo.

REM Read stats if file exists
if exist bot-stats.json (
    echo [STATISTICS]
    powershell -command "$stats = Get-Content 'bot-stats.json' | ConvertFrom-Json; Write-Host '   Total Visits:' $stats.totalVisits; Write-Host '   Total Clicks:' $stats.totalClicks; Write-Host '   Sessions:' $stats.sessionsCompleted; Write-Host '   Mobile:' $stats.mobileVisits; Write-Host '   Desktop:' $stats.desktopVisits"
    echo.
    
    REM Calculate speed
    powershell -command "$stats = Get-Content 'bot-stats.json' | ConvertFrom-Json; $start = [DateTime]::Parse($stats.startTime); $now = Get-Date; $hours = ($now - $start).TotalHours; if ($hours -gt 0) { $speed = [math]::Round($stats.totalVisits / $hours, 1); Write-Host '   Speed:' $speed 'visits/hour' }"
    echo.
) else (
    echo [STATISTICS]
    echo   Initializing... Please wait.
    echo.
)

echo [LAST UPDATE]
echo   %date% %time%
echo.
echo ========================================
echo Press Ctrl+C to stop monitoring
echo Auto-refreshing every 5 seconds...
echo ========================================

timeout /t 5 /nobreak >nul
goto loop
