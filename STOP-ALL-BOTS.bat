@echo off
title 🛑 STOPPING ALL BOTS 🛑
color 0C

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║           🛑 STOPPING ALL BOTS 🛑                      ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo Stopping all Node.js bot processes...
echo.

taskkill /F /FI "WINDOWTITLE eq Bot*" 2>nul

timeout /t 1 /nobreak >nul

echo.
echo ✅ All bots stopped!
echo.
echo Press any key to close...
pause >nul
