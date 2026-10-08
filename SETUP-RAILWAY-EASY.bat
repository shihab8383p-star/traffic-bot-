@echo off
echo ========================================
echo   RAILWAY DEPLOYMENT - SUPER EASY SETUP
echo ========================================
echo.
echo This script will prepare everything for Railway deployment.
echo.
echo STEP 1: Install Railway CLI
echo ----------------------------------------
echo.
choice /C YN /M "Do you want to install Railway CLI"
if errorlevel 2 goto skip_install
if errorlevel 1 goto do_install

:do_install
echo Installing Railway CLI...
powershell -Command "iwr https://railway.app/install.ps1 -useb | iex"
echo.
echo ✅ Railway CLI installed!
echo.
goto after_install

:skip_install
echo Skipping Railway CLI installation...
echo.

:after_install
echo STEP 2: Login to Railway
echo ----------------------------------------
echo.
echo Opening Railway login...
railway login
echo.
echo ✅ Logged in!
echo.

echo STEP 3: Create New Railway Project
echo ----------------------------------------
echo.
choice /C YN /M "Create new Railway project for Proxy API"
if errorlevel 2 goto skip_create
if errorlevel 1 goto do_create

:do_create
echo Creating Railway project...
railway init
echo.
echo ✅ Project created!
echo.
goto after_create

:skip_create
echo Using existing Railway project...
railway link
echo.

:after_create
echo STEP 4: Set Environment Variables
echo ----------------------------------------
echo.
set /p API_KEY="Enter your API_KEY (or press Enter for default 'super-secret-key-123'): "
if "%API_KEY%"=="" set API_KEY=super-secret-key-123

railway variables set PORT=3000
railway variables set API_KEY=%API_KEY%
echo.
echo ✅ Environment variables set!
echo   - PORT=3000
echo   - API_KEY=%API_KEY%
echo.

echo STEP 5: Deploy Proxy API
echo ----------------------------------------
echo.
echo Deploying proxy-api.js to Railway...
railway up
echo.
echo ✅ Deployed!
echo.

echo STEP 6: Get Your Railway URL
echo ----------------------------------------
echo.
railway domain
echo.
echo Copy the URL above - you'll need it next!
echo.
pause

echo.
echo STEP 7: Upload Proxies to Railway
echo ----------------------------------------
echo.
set /p RAILWAY_URL="Paste your Railway URL (without https://): "

echo.
echo Uploading your 180 proxies...
powershell -Command "$apiUrl = 'https://%RAILWAY_URL%'; $apiKey = '%API_KEY%'; $proxies = Get-Content proxies.json | ConvertFrom-Json; $body = @{ proxies = $proxies } | ConvertTo-Json -Depth 10; Invoke-RestMethod -Uri \"$apiUrl/proxies\" -Method POST -Headers @{'x-api-key'=$apiKey; 'Content-Type'='application/json'} -Body $body"
echo.
echo ✅ Proxies uploaded!
echo.

echo STEP 8: Verify Deployment
echo ----------------------------------------
echo.
echo Opening your Proxy API stats page...
start https://%RAILWAY_URL%/stats
echo.
echo You should see: {"totalProxies":180,...}
echo.

echo.
echo ========================================
echo   🎉 PROXY API IS LIVE ON RAILWAY! 🎉
echo ========================================
echo.
echo Your Proxy API URL: https://%RAILWAY_URL%
echo Your API Key: %API_KEY%
echo.
echo NEXT: Add this to your 13 traffic bots:
echo   PROXY_API_URL=https://%RAILWAY_URL%
echo.
echo Then redeploy each bot on Railway!
echo.
pause
