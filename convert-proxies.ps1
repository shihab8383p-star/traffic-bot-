# Automatic Proxy Converter
# Reads new-proxies.txt and adds them to proxies.json

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AUTOMATIC PROXY CONVERTER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Read new proxies from file
if (Test-Path "new-proxies.txt") {
    $lines = Get-Content "new-proxies.txt" | Where-Object { $_ -match '^\d+\.\d+\.\d+\.\d+:\d+$' }
    
    if ($lines.Count -eq 0) {
        Write-Host "❌ No valid proxies found in new-proxies.txt!" -ForegroundColor Red
        Write-Host "   Format should be: IP:PORT (one per line)" -ForegroundColor Yellow
        exit
    }
    
    Write-Host "✅ Found $($lines.Count) new proxies!" -ForegroundColor Green
    Write-Host ""
    
    # Load existing proxies
    $existingProxies = @()
    if (Test-Path "proxies.json") {
        $existingData = Get-Content "proxies.json" | ConvertFrom-Json
        $existingProxies = $existingData.proxies
        Write-Host "📁 Loaded $($existingProxies.Count) existing proxies" -ForegroundColor White
    }
    
    # Convert new proxies to JSON format
    $newProxies = @()
    $counter = 1
    foreach ($line in $lines) {
        $parts = $line.Split(':')
        $ip = $parts[0]
        $port = [int]$parts[1]
        
        # Try to guess country from IP (basic)
        $country = "US"  # Default to US
        $tier = "HIGH"
        $cpm = "`$2-5"
        
        # Simple IP range detection
        if ($ip -match '^107\.|^23\.|^54\.|^3\.|^44\.|^207\.|^15\.|^139\.171') {
            $country = "US"
            $tier = "HIGH"
            $cpm = "`$2-5"
        } elseif ($ip -match '^51\.|^62\.') {
            $country = "EU"
            $tier = "HIGH"
            $cpm = "`$1.5-3"
        } elseif ($ip -match '^43\.|^18\.166') {
            $country = "HK"
            $tier = "MID"
            $cpm = "`$1-2"
        }
        
        $proxy = [PSCustomObject]@{
            host = $ip
            port = $port
            username = ""
            password = ""
            country = $country
            location = "Auto-Added $counter"
            tier = $tier
            cpm = $cpm
        }
        
        $newProxies += $proxy
        $counter++
    }
    
    # Combine with existing (remove duplicates)
    $allProxies = $existingProxies + $newProxies | Group-Object -Property host,port | ForEach-Object { $_.Group[0] }
    
    Write-Host "➕ Added $($newProxies.Count) new proxies" -ForegroundColor Green
    Write-Host "📊 Total proxies: $($allProxies.Count)" -ForegroundColor Cyan
    Write-Host ""
    
    # Create JSON structure
    $jsonData = [PSCustomObject]@{
        lastUpdate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        totalProxies = $allProxies.Count
        comment = "AUTO-UPDATED - Added $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        proxies = $allProxies
    }
    
    # Save to file
    $jsonData | ConvertTo-Json -Depth 10 | Set-Content "proxies.json"
    
    Write-Host "✅ proxies.json updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌍 Proxy Distribution:" -ForegroundColor Cyan
    $allProxies | Group-Object country | ForEach-Object {
        Write-Host "   $($_.Name): $($_.Count) proxies" -ForegroundColor White
    }
    Write-Host ""
    
    # Clear new-proxies.txt
    "# PASTE YOUR NEW PROXIES HERE`n# Format: IP:PORT`n# One proxy per line`n" | Set-Content "new-proxies.txt"
    
} else {
    Write-Host "❌ new-proxies.txt not found!" -ForegroundColor Red
    Write-Host "   Creating template file..." -ForegroundColor Yellow
    "# PASTE YOUR NEW PROXIES HERE`n# Format: IP:PORT`n# One proxy per line`n# Example:`n# 1.2.3.4:8080`n# 5.6.7.8:3128" | Set-Content "new-proxies.txt"
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
