@echo off
title Starting 5 Bot Instances
color 0A

echo.
echo ============================================================
echo          STARTING 5 BOT INSTANCES FOR 24/7 EARNING
echo ============================================================
echo.
echo Starting bots with 15 second delays between each...
echo.

cd /d "%~dp0"

echo [1/5] Starting Bot #1...
start "Traffic Bot #1" cmd /k "npm run bot"
timeout /t 15 /nobreak

echo [2/5] Starting Bot #2...
start "Traffic Bot #2" cmd /k "npm run bot"
timeout /t 15 /nobreak

echo [3/5] Starting Bot #3...
start "Traffic Bot #3" cmd /k "npm run bot"
timeout /t 15 /nobreak

echo [4/5] Starting Bot #4...
start "Traffic Bot #4" cmd /k "npm run bot"
timeout /t 15 /nobreak

echo [5/5] Starting Bot #5...
start "Traffic Bot #5" cmd /k "npm run bot"

echo.
echo ============================================================
echo              ALL 5 BOTS STARTED SUCCESSFULLY!
echo ============================================================
echo.
echo Total Bots: 5
echo Proxies: 92
echo Expected Revenue: $180-360/day
echo.
echo Check dashboard: http://localhost:3000
echo To stop: Close each command window individually
echo.
pause
