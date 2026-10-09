@echo off
cd /d "%~dp0"
echo.
echo ============================================
echo    CHECKING BOT STATUS...
echo ============================================
echo.
node check-bot-status.js
echo.
pause
