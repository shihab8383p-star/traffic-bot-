@echo off
echo.
echo ========================================
echo   STARTING TRAFFIC BOT DASHBOARD
echo ========================================
echo.
echo Starting dashboard server...
echo.
cd /d "%~dp0"
start node dashboard-server.js
timeout /t 3 /nobreak > nul
echo.
echo Opening dashboard in browser...
start http://localhost:3001/dashboard.html
echo.
echo ========================================
echo   DASHBOARD IS NOW RUNNING!
echo ========================================
echo.
echo Dashboard URL: http://localhost:3001/dashboard.html
echo.
echo The dashboard will update automatically every 3 seconds
echo Press Ctrl+C in the server window to stop
echo.
pause
