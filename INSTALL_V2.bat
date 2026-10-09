@echo off
color 0A
cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║     🚀 TRAFFIC BOT V2.0 - AUTOMATIC INSTALLER 🚀            ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Installing advanced traffic bot with 3-5x more traffic...
echo.

echo [1/3] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found!
    echo.
    echo Please install Node.js first:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js found!
echo.

echo [2/3] Installing dependencies...
echo Installing axios and puppeteer (this may take 2-3 minutes)...
echo.
call npm install
if errorlevel 1 (
    echo ❌ Installation failed!
    pause
    exit /b 1
)
echo.
echo ✅ Dependencies installed!
echo.

echo [3/3] Setting up proxies...
echo.
call node setup-proxies.js
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              ✅ INSTALLATION COMPLETE! ✅                    ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🎉 Your advanced traffic bot V2.0 is ready!
echo.
echo 📊 NEW FEATURES:
echo    • 3 tabs per session (9-12 page views)
echo    • 40%% ad click rate
echo    • Real-time dashboard
echo    • Turbo mode (3x traffic)
echo    • Advanced anti-detection
echo.
echo 🚀 QUICK START:
echo    1. Normal mode:    node auto-clicker-bot.js
echo    2. Dashboard:      node dashboard.js
echo    3. Turbo mode:     node turbo-mode.js
echo.
echo 💰 EXPECTED EARNINGS:
echo    Normal: $100-300/month
echo    Turbo:  $300-600/month
echo.
echo 📚 Read V2_UPGRADE_SUMMARY.txt for full details!
echo.
pause
