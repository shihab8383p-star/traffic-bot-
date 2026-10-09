@echo off
color 0A
title Live Bot Progress Monitor
mode con: cols=100 lines=40

:loop
cls
echo ========================================
echo      LIVE BOT PROGRESS MONITOR
echo ========================================
echo.
echo [%date% %time:~0,8%]
echo.

REM Bot Processes
echo 🤖 BOT PROCESSES:
powershell -command "$procs = Get-Process -Name node -ErrorAction SilentlyContinue; if ($procs) { $i=1; foreach($p in $procs) { $runtime = (Get-Date) - $p.StartTime; $mem = [math]::Round($p.WorkingSet64/1MB,1); Write-Host '   Bot' $i '-' 'PID:' $p.Id '|' 'Runtime:' ([math]::Floor($runtime.TotalMinutes)) 'min' $runtime.Seconds 'sec' '|' 'Memory:' $mem 'MB'; $i++ } } else { Write-Host '   ⚠️  No bots running!' }"
echo.

REM Chrome Browsers
echo 🌐 CHROME BROWSERS:
powershell -command "$chrome = Get-Process -Name chrome -ErrorAction SilentlyContinue; if ($chrome) { Write-Host '   Total Browsers:' $chrome.Count; $totalMem = [math]::Round(($chrome | Measure-Object WorkingSet64 -Sum).Sum/1MB,1); Write-Host '   Total Memory:' $totalMem 'MB' } else { Write-Host '   No browsers yet...' }"
echo.

REM Statistics
echo 📊 STATISTICS:
if exist bot-stats.json (
    powershell -command "$stats = Get-Content 'bot-stats.json' | ConvertFrom-Json; Write-Host '   Visits:' $stats.totalVisits; Write-Host '   Clicks:' $stats.totalClicks; Write-Host '   Sessions:' $stats.sessionsCompleted; if ($stats.totalVisits -gt 0) { $rate = [math]::Round(($stats.totalClicks/$stats.totalVisits)*100,2); Write-Host '   Click Rate:' $rate'%%' }; if ($stats.startTime) { $start = [DateTime]::Parse($stats.startTime); $runtime = (Get-Date) - $start; if ($runtime.TotalMinutes -gt 0) { $vph = [math]::Round(($stats.totalVisits/$runtime.TotalMinutes)*60,0); $cph = [math]::Round(($stats.totalClicks/$runtime.TotalMinutes)*60,0); Write-Host ''; Write-Host '⚡ CURRENT SPEED:'; Write-Host '   Visits/Hour:' $vph; Write-Host '   Clicks/Hour:' $cph } }"
) else (
    echo    Initializing...
)
echo.

REM Proxies
echo 🌍 PROXIES:
powershell -command "if (Test-Path 'proxies.json') { $p = (Get-Content 'proxies.json' | ConvertFrom-Json).totalProxies; Write-Host '   Total Proxies:' $p } else { Write-Host '   Loading...' }"
echo.

echo ========================================
echo Refreshing in 5 seconds... (Press Ctrl+C to stop)
echo ========================================

timeout /t 5 /nobreak >nul
goto loop
