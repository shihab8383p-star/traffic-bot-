// 🚀 AUTO PROXY FINDER - Fast & Smart
// Scrapes free proxies, tests them FAST, filters for HIGH revenue countries

const https = require('https');
const http = require('http');
const fs = require('fs');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║       🚀 AUTO PROXY FINDER - FAST MODE 🚀             ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// HIGH revenue countries only
const HIGH_REVENUE_COUNTRIES = ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK', 'CH', 'AT', 'BE', 'IE', 'FI', 'NZ', 'SG', 'JP', 'KR'];

// Free proxy sources
const PROXY_SOURCES = [
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
    'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
    'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt'
];

let allProxies = [];
let testedCount = 0;
let workingProxies = [];

// Fetch proxies from URL
function fetchProxies(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const proxies = data.split('\n')
                    .map(line => line.trim())
                    .filter(line => line && line.match(/^\d+\.\d+\.\d+\.\d+:\d+$/))
                    .map(line => {
                        const [host, port] = line.split(':');
                        return { host, port: parseInt(port) };
                    });
                resolve(proxies);
            });
        }).on('error', () => resolve([]));
    });
}

// FAST parallel proxy test
function testProxy(proxy, timeout = 3000) {
    return new Promise((resolve) => {
        const timer = setTimeout(() => {
            resolve(null);
        }, timeout);

        try {
            const options = {
                hostname: proxy.host,
                port: proxy.port,
                method: 'CONNECT',
                path: 'google.com:80',
                timeout: timeout
            };

            const req = http.request(options);
            
            req.on('connect', (res) => {
                clearTimeout(timer);
                req.end();
                resolve({ host: proxy.host, port: proxy.port, working: true });
            });

            req.on('error', (err) => {
                clearTimeout(timer);
                resolve(null);
            });

            req.on('timeout', () => {
                clearTimeout(timer);
                req.destroy();
                resolve(null);
            });

            req.end();
        } catch (error) {
            clearTimeout(timer);
            resolve(null);
        }
    }).catch(() => null);
}

// Get country from IP
function getCountry(host) {
    // Simple IP range detection for major countries
    const firstOctet = parseInt(host.split('.')[0]);
    
    // US IP ranges (simplified)
    if ((firstOctet >= 3 && firstOctet <= 7) || 
        (firstOctet >= 12 && firstOctet <= 15) ||
        (firstOctet >= 23 && firstOctet <= 24) ||
        (firstOctet >= 40 && firstOctet <= 52) ||
        (firstOctet >= 54 && firstOctet <= 76) ||
        (firstOctet >= 96 && firstOctet <= 107) ||
        (firstOctet >= 128 && firstOctet <= 168) ||
        (firstOctet >= 192 && firstOctet <= 216)) {
        return 'US';
    }
    
    // EU ranges
    if ((firstOctet >= 77 && firstOctet <= 95) ||
        (firstOctet >= 176 && firstOctet <= 191)) {
        return 'EU';
    }
    
    return 'Unknown';
}

// Main function
(async () => {
    console.log('🌐 Step 1: Fetching proxies from multiple sources...\n');
    
    for (const source of PROXY_SOURCES) {
        process.stdout.write(`   Fetching from ${source.split('/')[2]}...`);
        const proxies = await fetchProxies(source);
        allProxies.push(...proxies);
        console.log(` ✅ (${proxies.length} proxies)`);
    }
    
    // Remove duplicates
    const uniqueProxies = Array.from(new Map(allProxies.map(p => [`${p.host}:${p.port}`, p])).values());
    console.log(`\n✅ Found ${uniqueProxies.length} unique proxies\n`);
    
    console.log('⚡ Step 2: FAST parallel testing (20 at a time)...\n');
    console.log('This will be SUPER FAST! ⚡\n');
    
    const batchSize = 20; // Test 20 proxies at once
    const totalBatches = Math.ceil(uniqueProxies.length / batchSize);
    
    for (let i = 0; i < uniqueProxies.length; i += batchSize) {
        const batch = uniqueProxies.slice(i, i + batchSize);
        const currentBatch = Math.floor(i / batchSize) + 1;
        
        process.stdout.write(`\r[${currentBatch}/${totalBatches}] Testing batch ${currentBatch}... (${workingProxies.length} working so far)`);
        
        const results = await Promise.all(batch.map(p => testProxy(p).catch(() => null)));
        const working = results.filter(r => r !== null);
        
        working.forEach(proxy => {
            const country = getCountry(proxy.host);
            if (HIGH_REVENUE_COUNTRIES.includes(country) || country === 'US' || country === 'EU') {
                workingProxies.push({
                    host: proxy.host,
                    port: proxy.port,
                    username: '',
                    password: '',
                    country: country,
                    location: `${country} ${workingProxies.filter(p => p.country === country).length + 1}`,
                    tier: country === 'US' ? 'HIGH' : country === 'EU' ? 'HIGH' : 'MID',
                    cpm: country === 'US' ? '$2-5' : country === 'EU' ? '$1.5-3' : '$0.5-1.5'
                });
            }
        });
    }
    
    console.log('\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESULTS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`✅ Working HIGH-revenue proxies: ${workingProxies.length}`);
    console.log(`📊 Total tested: ${uniqueProxies.length}`);
    console.log(`⚡ Success rate: ${((workingProxies.length / uniqueProxies.length) * 100).toFixed(1)}%\n`);
    
    if (workingProxies.length > 0) {
        // Count by country
        const countryCount = {};
        workingProxies.forEach(p => {
            countryCount[p.country] = (countryCount[p.country] || 0) + 1;
        });
        
        console.log('🌍 By Country:');
        Object.keys(countryCount).forEach(country => {
            const flag = country === 'US' ? '🇺🇸' : country === 'EU' ? '🇪🇺' : '🌐';
            console.log(`   ${flag} ${country}: ${countryCount[country]} proxies`);
        });
        console.log('');
        
        // Save to file
        const proxyData = {
            lastUpdate: new Date().toISOString(),
            totalProxies: workingProxies.length,
            comment: `AUTO-FOUND - ${workingProxies.length} working HIGH-revenue proxies`,
            proxies: workingProxies
        };
        
        fs.writeFileSync('./proxies-found.json', JSON.stringify(proxyData, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('💾 SAVED:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('✅ Proxies saved to: proxies-found.json\n');
        console.log('To use these proxies:');
        console.log('1. Run: USE-FOUND-PROXIES.bat');
        console.log('2. Done! Bots will use new proxies\n');
        
        // Show first 10
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 First 10 proxies found:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        workingProxies.slice(0, 10).forEach((p, i) => {
            const flag = p.country === 'US' ? '🇺🇸' : p.country === 'EU' ? '🇪🇺' : '🌐';
            console.log(`${i + 1}. ${flag} ${p.host}:${p.port} [${p.country} - ${p.tier}] ${p.cpm}`);
        });
        if (workingProxies.length > 10) {
            console.log(`... and ${workingProxies.length - 10} more!`);
        }
        console.log('');
    } else {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  NO WORKING PROXIES FOUND!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('Reasons:');
        console.log('  • Free proxies are often dead');
        console.log('  • High-revenue country proxies are rare');
        console.log('  • Proxies blocked or banned\n');
        console.log('Try again later or use paid proxies for better results.\n');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
})();
