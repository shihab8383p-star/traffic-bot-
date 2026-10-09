// ⚡ SUPER FAST AUTO PROXY FETCHER
// Fetches free proxies, tests FAST, filters HIGH revenue countries

const https = require('https');
const http = require('http');
const fs = require('fs');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║        ⚡ AUTO PROXY FETCHER - FAST MODE ⚡            ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// HIGH revenue countries only
const HIGH_REVENUE_COUNTRIES = ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'NL', 'SE', 'NO', 'DK', 'CH', 'AT', 'BE', 'IE', 'FI', 'NZ', 'SG', 'JP', 'KR'];

// Free proxy APIs
const PROXY_SOURCES = [
    'https://api.proxyscrape.com/v2/?request=get&protocol=http&timeout=5000&country=all&ssl=all&anonymity=all',
    'https://www.proxy-list.download/api/v1/get?type=http',
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt'
];

let allProxies = [];
let fetchedCount = 0;

console.log('📡 Step 1: Fetching proxies from multiple sources...\n');

// Fetch from source
function fetchProxies(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        
        client.get(url, { timeout: 10000 }, (res) => {
            let data = '';
            
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const proxies = data.split('\n')
                    .filter(line => line.trim() && line.includes(':'))
                    .map(line => {
                        const parts = line.trim().split(':');
                        if (parts.length >= 2) {
                            return { host: parts[0], port: parseInt(parts[1]) };
                        }
                        return null;
                    })
                    .filter(p => p !== null);
                
                fetchedCount += proxies.length;
                console.log(`✅ Fetched ${proxies.length} proxies from source ${PROXY_SOURCES.indexOf(url) + 1}`);
                resolve(proxies);
            });
        }).on('error', () => {
            console.log(`⚠️  Source ${PROXY_SOURCES.indexOf(url) + 1} failed`);
            resolve([]);
        });
    });
}

// SUPER FAST parallel test (max 2 seconds per proxy)
function testProxyFast(proxy) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(null), 2000); // Only 2 seconds!

        try {
            const req = http.request({
                hostname: proxy.host,
                port: proxy.port,
                method: 'GET',
                path: 'http://ip-api.com/json/',
                timeout: 2000
            }, (res) => {
                clearTimeout(timeout);
                
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const geoData = JSON.parse(data);
                        if (geoData.countryCode) {
                            resolve({
                                ...proxy,
                                country: geoData.countryCode,
                                countryName: geoData.country
                            });
                        } else {
                            resolve(null);
                        }
                    } catch {
                        resolve(null);
                    }
                });
            });

            req.on('error', () => {
                clearTimeout(timeout);
                resolve(null);
            });

            req.on('timeout', () => {
                clearTimeout(timeout);
                req.destroy();
                resolve(null);
            });

            req.end();
        } catch {
            clearTimeout(timeout);
            resolve(null);
        }
    });
}

// Main execution
(async () => {
    // Step 1: Fetch all proxies in parallel
    const fetchPromises = PROXY_SOURCES.map(url => fetchProxies(url));
    const results = await Promise.all(fetchPromises);
    
    results.forEach(proxies => allProxies.push(...proxies));
    
    // Remove duplicates
    const uniqueProxies = Array.from(new Map(
        allProxies.map(p => [`${p.host}:${p.port}`, p])
    ).values());
    
    console.log(`\n📊 Total unique proxies fetched: ${uniqueProxies.length}\n`);
    
    if (uniqueProxies.length === 0) {
        console.log('❌ No proxies fetched! Check your internet connection.\n');
        process.exit(1);
    }
    
    // Step 2: FAST parallel testing (50 at a time for SPEED!)
    console.log('⚡ Step 2: Testing proxies FAST (parallel mode)...\n');
    console.log('Testing up to 50 proxies at once for maximum speed!\n');
    
    const workingProxies = [];
    const batchSize = 50;
    
    for (let i = 0; i < uniqueProxies.length; i += batchSize) {
        const batch = uniqueProxies.slice(i, i + batchSize);
        process.stdout.write(`\rTesting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(uniqueProxies.length / batchSize)}...`);
        
        const results = await Promise.all(batch.map(p => testProxyFast(p)));
        const working = results.filter(p => p !== null);
        
        // Filter for HIGH revenue countries only
        const highRevenue = working.filter(p => HIGH_REVENUE_COUNTRIES.includes(p.country));
        workingProxies.push(...highRevenue);
        
        if (workingProxies.length >= 50) {
            console.log(`\n\n✅ Found ${workingProxies.length} HIGH revenue proxies! Stopping early.\n`);
            break;
        }
    }
    
    console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log('📊 RESULTS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`✅ Working HIGH revenue proxies: ${workingProxies.length}`);
    console.log(`📊 Total tested: ${uniqueProxies.length}\n`);
    
    if (workingProxies.length === 0) {
        console.log('❌ No working HIGH revenue proxies found!');
        console.log('Try running again or check different sources.\n');
        process.exit(1);
    }
    
    // Group by country
    const byCountry = {};
    workingProxies.forEach(p => {
        byCountry[p.country] = (byCountry[p.country] || 0) + 1;
    });
    
    console.log('🌍 By Country:');
    Object.keys(byCountry).sort((a, b) => byCountry[b] - byCountry[a]).forEach(country => {
        const flag = country === 'US' ? '🇺🇸' : country === 'CA' ? '🇨🇦' : country === 'GB' ? '🇬🇧' : 
                     country === 'DE' ? '🇩🇪' : country === 'FR' ? '🇫🇷' : country === 'AU' ? '🇦🇺' : '🌐';
        console.log(`   ${flag} ${country}: ${byCountry[country]} proxies`);
    });
    
    // Step 3: Save to file
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💾 Step 3: Saving proxies...\n');
    
    const proxyData = {
        lastUpdate: new Date().toISOString(),
        totalProxies: workingProxies.length,
        comment: `AUTO-FETCHED - ${workingProxies.length} HIGH revenue proxies`,
        proxies: workingProxies.map(p => ({
            host: p.host,
            port: p.port,
            username: '',
            password: '',
            country: p.country,
            location: `${p.countryName || p.country}`,
            tier: 'HIGH',
            cpm: '$2-5'
        }))
    };
    
    // Backup old
    if (fs.existsSync('./proxies.json')) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        fs.copyFileSync('./proxies.json', `./proxies-backup-${timestamp}.json`);
        console.log('✅ Backed up old proxies');
    }
    
    // Save new
    fs.writeFileSync('./proxies.json', JSON.stringify(proxyData, null, 2));
    console.log('✅ Saved new proxies to proxies.json\n');
    
    // Step 4: Restart bots
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🤖 Step 4: Restarting bots...\n');
    
    const { exec } = require('child_process');
    
    // Stop bots
    exec('taskkill /F /IM node.exe', (err) => {
        setTimeout(() => {
            // Start 5 bots
            for (let i = 0; i < 5; i++) {
                exec('start /min node auto-clicker-bot.js', { cwd: __dirname });
            }
            
            console.log('✅ 5 bots restarted with new proxies!\n');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('╔════════════════════════════════════════════════════════╗');
            console.log('║              ✅ ALL DONE! BOTS RUNNING! ✅             ║');
            console.log('╚════════════════════════════════════════════════════════╝\n');
            console.log(`🌍 ${workingProxies.length} HIGH revenue proxies loaded`);
            console.log('💰 Earning potential increased!');
            console.log('📈 Check dashboard.html to see performance\n');
            console.log('💡 TIP: Run this daily to get fresh proxies!\n');
        }, 2000);
    });
    
})();
