# Start 5 Bot Instances in Separate Windows
$botPath = "c:\Users\Shihab\Documents\Rockstar Games\Social Club\microjob-platform\traffic-bot"

Write-Host "🚀 Starting 5 Bot Instances..." -ForegroundColor Green
Write-Host ""

# Start Bot 1
Write-Host "Starting Bot #1..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$botPath'; Write-Host '🔥 BOT #1 STARTED' -ForegroundColor Green; npm run bot"
Start-Sleep -Seconds 15

# Start Bot 2
Write-Host "Starting Bot #2..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$botPath'; Write-Host '🔥 BOT #2 STARTED' -ForegroundColor Green; npm run bot"
Start-Sleep -Seconds 15

# Start Bot 3
Write-Host "Starting Bot #3..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$botPath'; Write-Host '🔥 BOT #3 STARTED' -ForegroundColor Green; npm run bot"
Start-Sleep -Seconds 15

# Start Bot 4
Write-Host "Starting Bot #4..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$botPath'; Write-Host '🔥 BOT #4 STARTED' -ForegroundColor Green; npm run bot"
Start-Sleep -Seconds 15

# Start Bot 5
Write-Host "Starting Bot #5..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$botPath'; Write-Host '🔥 BOT #5 STARTED' -ForegroundColor Green; npm run bot"

Write-Host ""
Write-Host "✅ ALL 5 BOTS STARTED!" -ForegroundColor Green
Write-Host "💰 Expected Revenue: `$180-360/day" -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 Check dashboard: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🛑 To stop: Close each PowerShell window individually" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this launcher..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
