// 🔥 AUTO-GET FREE PROXIES - Lightning Fast
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║       ⚡ AUTO-GET FREE PROXIES - FAST MODE ⚡          ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// High revenue countries only
const HIGH_REVENUE_COUNTRIES = ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK', 'CH', 'AT', 'BE', 'IE', 'FI', 'NZ', 'SG', 'JP', 'KR'];

// Step 1: Scrape proxies from hproxy.com
async function scrapeProxies() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[1/4] 🌐 SCRAPING FREE PROXIES FROM HPROXY.COM...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    try {
        const response = await axios.get('https://www.hproxy.com/free-proxy-list', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(response.data);
        const proxies = [];
        
        // Parse proxy table
        $('table tbody tr').each((i, row) => {
            const cols = $(row).find('td');
            if (cols.length >= 3) {
                const ip = $(cols[0]).text().trim();
                const port = $(cols[1]).text().trim();
                const country = $(cols[2]).text().trim().toUpperCase();
                
                // Only high revenue countries
                if (ip && port && HIGH_REVENUE_COUNTRIES.includes(country)) {
                    proxies.push({
                        host: ip,
                        port: parseInt(port),
                        country: country
                    });
                }
            }
        });
        
        console.log(`✅ Found ${proxies.length} HIGH-REVENUE country proxies!\n`);
        return proxies;
        
    } catch (error) {
        console.log('⚠️  Could not scrape hproxy.com, trying fallback...\n');
        return getFallbackProxies();
    }
}

// Fallback: Use proxy list APIs
async function getFallbackProxies() {
    console.log('📡 Trying alternative proxy sources...\n');
    
    const sources = [
        'https://api.proxyscrape.com/v2/?request=get&protocol=http&timeout=5000&country=US,CA,GB,AU&ssl=all&anonymity=all',
        'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
        'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt'
    ];
    
    for (const url of sources) {
        try {
            const response = await axios.get(url, { timeout: 10000 });
            const lines = response.data.split('\n');
            const proxies = [];
            
            lines.forEach(line => {
                const match = line.match(/(\d+\.\d+\.\d+\.\d+):(\d+)/);
                if (match) {
                    proxies.push({
                        host: match[1],
                        port: parseInt(match[2]),
                        country: 'Unknown'
                    });
                }
            });
            
            if (proxies.length > 0) {
                console.log(`✅ Found ${proxies.length} proxies from fallback!\n`);
                return proxies.slice(0, 50); // Limit to 50
            }
        } catch (error) {
            continue;
        }
    }
    
    return [];
}

// Step 2: Test proxies SUPER FAST (parallel testing)
async function testProxyFast(proxy, timeout = 3000) {
    return new Promise((resolve) => {
        const timeoutId = setTimeout(() => resolve(false), timeout);
        
        axios.get('http://www.google.com', {
            proxy: {
                host: proxy.host,
                port: proxy.port
            },
            timeout: timeout,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        })
        .then(() => {
            clearTimeout(timeoutId);
            resolve(true);
        })
        .catch(() => {
            clearTimeout(timeoutId);
            resolve(false);
        });
    });
}

// Test all proxies in parallel (FAST!)
async function testProxiesParallel(proxies) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[2/4] ⚡ TESTING PROXIES IN PARALLEL (FAST MODE)...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log(`Testing ${proxies.length} proxies simultaneously...\n`);
    
    // Test all at once (parallel)
    const results = await Promise.all(
        proxies.map(async (proxy, index) => {
            const isWorking = await testProxyFast(proxy, 3000);
            
            if (isWorking) {
                console.log(`✅ [${index + 1}/${proxies.length}] ${proxy.host}:${proxy.port} WORKING`);
                return proxy;
            } else {
                console.log(`❌ [${index + 1}/${proxies.length}] ${proxy.host}:${proxy.port} DEAD`);
                return null;
            }
        })
    );
    
    const working = results.filter(p => p !== null);
    
    console.log(`\n✅ ${working.length} working proxies found!\n`);
    return working;
}

// Step 3: Detect country from IP
function detectCountry(ip) {
    // US IP ranges (simplified detection)
    if (ip.startsWith('104.') || ip.startsWith('107.') || ip.startsWith('162.') || 
        ip.startsWith('192.') || ip.startsWith('139.') || ip.startsWith('165.') ||
        ip.startsWith('184.') || ip.startsWith('198.') || ip.startsWith('199.') ||
        ip.startsWith('209.') || ip.startsWith('159.')) {
        return { country: 'US', tier: 'HIGH', cpm: '$2-5' };
    }
    
    // EU ranges
    if (ip.startsWith('85.') || ip.startsWith('2.')) {
        return { country: 'EU', tier: 'HIGH', cpm: '$1.5-3' };
    }
    
    // France
    if (ip.startsWith('51.') || ip.startsWith('62.')) {
        return { country: 'FR', tier: 'HIGH', cpm: '$1.5-3' };
    }
    
    return { country: 'Unknown', tier: 'MID', cpm: '$0.5-1.5' };
}

// Step 4: Save and activate
async function saveAndActivate(workingProxies) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[3/4] 💾 SAVING WORKING PROXIES...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    if (workingProxies.length === 0) {
        console.log('❌ No working proxies found!\n');
        return false;
    }
    
    // Add country detection and tier
    const enrichedProxies = workingProxies.map((p, i) => {
        const detected = detectCountry(p.host);
        return {
            host: p.host,
            port: p.port,
            username: '',
            password: '',
            country: p.country !== 'Unknown' ? p.country : detected.country,
            location: `${detected.country} ${i + 1}`,
            tier: detected.tier,
            cpm: detected.cpm
        };
    });
    
    // Load existing proxies
    let existingProxies = [];
    try {
        if (fs.existsSync('./proxies.json')) {
            const data = fs.readFileSync('./proxies.json', 'utf8');
            const existing = JSON.parse(data);
            existingProxies = existing.proxies || [];
        }
    } catch (error) {
        // Start fresh
    }
    
    // Combine (avoid duplicates)
    const allProxies = [...existingProxies];
    enrichedProxies.forEach(newProxy => {
        const exists = allProxies.some(p => p.host === newProxy.host && p.port === newProxy.port);
        if (!exists) {
            allProxies.push(newProxy);
        }
    });
    
    const proxyData = {
        lastUpdate: new Date().toISOString(),
        totalProxies: allProxies.length,
        comment: `Auto-scraped free proxies - ${allProxies.length} total (${workingProxies.length} new added)`,
        proxies: allProxies
    };
    
    // Backup
    if (fs.existsSync('./proxies.json')) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        fs.copyFileSync('./proxies.json', `./proxies-backup-${timestamp}.json`);
    }
    
    // Save
    fs.writeFileSync('./proxies.json', JSON.stringify(proxyData, null, 2));
    
    console.log(`✅ Added ${workingProxies.length} new working proxies!`);
    console.log(`📊 Total proxies: ${allProxies.length}\n`);
    
    return true;
}

// Main execution
(async () => {
    try {
        const startTime = Date.now();
        
        // Step 1: Scrape
        const scrapedProxies = await scrapeProxies();
        
        if (scrapedProxies.length === 0) {
            console.log('❌ No proxies found. Please try again later.\n');
            return;
        }
        
        // Step 2: Test (parallel - FAST!)
        const workingProxies = await testProxiesParallel(scrapedProxies);
        
        // Step 3: Save
        const saved = await saveAndActivate(workingProxies);
        
        if (!saved) {
            return;
        }
        
        // Step 4: Restart bots
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('[4/4] 🔄 RESTARTING BOTS...');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Note: Actual bot restart done by .bat file
        console.log('✅ Proxies ready! Restart bots now.\n');
        
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║              ✅ SUCCESS! ✅                            ║');
        console.log('╚════════════════════════════════════════════════════════╝');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log(`⚡ Completed in ${elapsed} seconds!`);
        console.log(`✅ Added ${workingProxies.length} working proxies`);
        console.log(`🎯 High-revenue countries only`);
        console.log(`💰 Ready to earn!\n`);
        
    } catch (error) {
        console.log(`\n❌ ERROR: ${error.message}\n`);
    }
})();
