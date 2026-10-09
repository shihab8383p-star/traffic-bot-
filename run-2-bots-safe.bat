@echo off
title Safe Bot Setup - 2 Instances
color 0A

echo ╔════════════════════════════════════════════════════════╗
echo ║        🔒 SAFE SETUP - 2 BOTS (SAME IP) 🔒           ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo ✅ Running 2 bots from same IP (SAFE)
echo 💰 Expected: $20-40/day
echo 🛡️  Low risk of detection
echo.
echo 💡 TIP: Use different IPs for more bots!
echo    - Phone hotspot
echo    - Free VPN (Cloudflare WARP)
echo    - Public Wi-Fi
echo.
pause

echo.
echo Starting Bot Instance 1...
start "Traffic Bot #1 (Home IP)" cmd /k "cd /d %~dp0 && npm run bot"
timeout /t 15 /nobreak

echo Starting Bot Instance 2...
start "Traffic Bot #2 (Home IP)" cmd /k "cd /d %~dp0 && npm run bot"

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║              ✅ 2 BOTS STARTED (SAFE) ✅             ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 🚀 2 bot instances running on same IP
echo 💰 Expected revenue: $20-40/day
echo 🛡️  This is the SAFEST setup
echo.
echo 📊 Check dashboard: http://localhost:3000
echo.
echo 💡 Want more revenue? Add different IPs:
echo    1. Phone hotspot (different IP)
echo    2. Cloudflare WARP (different IP)
echo    3. Public Wi-Fi (different IP)
echo.
pause
