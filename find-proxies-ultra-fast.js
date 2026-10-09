// 🚀⚡ ULTRA FAST PROXY FINDER - Optimized for speed
const https = require('https');
const http = require('http');
const fs = require('fs');
const { promisify } = require('util');
const setTimeoutPromise = promisify(setTimeout);

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║       ⚡ ULTRA FAST PROXY FINDER ⚡                    ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

const HIGH_REV = ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK', 'CH', 'AT', 'BE', 'IE', 'FI', 'NZ', 'SG', 'JP', 'KR'];

const SOURCES = [
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
    'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt'
];

let workingProxies = [];

function fetchProxies(url) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => resolve([]), 10000);
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                clearTimeout(timeout);
                const proxies = data.split('\n')
                    .filter(line => line.match(/^\d+\.\d+\.\d+\.\d+:\d+$/))
                    .map(line => {
                        const [host, port] = line.trim().split(':');
                        return { host, port: parseInt(port) };
                    });
                resolve(proxies);
            });
        }).on('error', () => {
            clearTimeout(timeout);
            resolve([]);
        });
    });
}

async function testProxy(proxy) {
    return new Promise((resolve) => {
        const timer = setTimeout(() => resolve(null), 2000); // 2 sec timeout
        
        try {
            const req = http.request({
                hostname: proxy.host,
                port: proxy.port,
                method: 'CONNECT',
                path: 'google.com:80',
                timeout: 2000
            });
            
            req.on('connect', () => {
                clearTimeout(timer);
                req.destroy();
                resolve(proxy);
            });
            
            req.on('error', () => {
                clearTimeout(timer);
                resolve(null);
            });
            
            req.on('timeout', () => {
                clearTimeout(timer);
                req.destroy();
                resolve(null);
            });
            
            req.end();
        } catch {
            clearTimeout(timer);
            resolve(null);
        }
    });
}

function getCountry(host) {
    const first = parseInt(host.split('.')[0]);
    
    // US ranges
    if ((first >= 3 && first <= 76) || (first >= 96 && first <= 107) || 
        (first >= 128 && first <= 168) || (first >= 192 && first <= 216)) {
        return 'US';
    }
    // EU ranges
    if ((first >= 77 && first <= 95) || (first >= 176 && first <= 191)) {
        return 'EU';
    }
    return 'Unknown';
}

function saveProgress() {
    if (workingProxies.length > 0) {
        const data = {
            lastUpdate: new Date().toISOString(),
            totalProxies: workingProxies.length,
            comment: `AUTO-FOUND - ${workingProxies.length} HIGH-revenue proxies`,
            proxies: workingProxies
        };
        fs.writeFileSync('./proxies-found.json', JSON.stringify(data, null, 2));
    }
}

(async () => {
    console.log('⚡ Step 1: Fetching proxies from GitHub sources...\n');
    
    let allProxies = [];
    for (const source of SOURCES) {
        process.stdout.write(`   Fetching...`);
        const proxies = await fetchProxies(source);
        allProxies.push(...proxies);
        console.log(` ✅ (${proxies.length})`);
    }
    
    const unique = Array.from(new Map(allProxies.map(p => [`${p.host}:${p.port}`, p])).values());
    console.log(`\n✅ Found ${unique.length} unique proxies\n`);
    
    console.log('⚡ Step 2: Lightning-fast testing (50 parallel)...\n');
    
    const BATCH_SIZE = 50;
    const totalBatches = Math.ceil(unique.length / BATCH_SIZE);
    let saveCounter = 0;
    
    for (let i = 0; i < unique.length; i += BATCH_SIZE) {
        const batch = unique.slice(i, i + BATCH_SIZE);
        const currentBatch = Math.floor(i / BATCH_SIZE) + 1;
        
        process.stdout.write(`\r⚡ [${currentBatch}/${totalBatches}] ${workingProxies.length} working found...`);
        
        const results = await Promise.allSettled(batch.map(p => testProxy(p)));
        
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                const proxy = result.value;
                const country = getCountry(proxy.host);
                
                if (country === 'US' || country === 'EU') {
                    workingProxies.push({
                        host: proxy.host,
                        port: proxy.port,
                        username: '',
                        password: '',
                        country: country,
                        location: `${country} ${workingProxies.filter(p => p.country === country).length + 1}`,
                        tier: country === 'US' ? 'HIGH' : 'HIGH',
                        cpm: country === 'US' ? '$2-5' : '$1.5-3'
                    });
                }
            }
        });
        
        // Save progress every 10 batches
        saveCounter++;
        if (saveCounter >= 10) {
            saveProgress();
            saveCounter = 0;
        }
    }
    
    console.log('\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 RESULTS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`✅ Working HIGH-revenue proxies: ${workingProxies.length}`);
    console.log(`📊 Total tested: ${unique.length}`);
    console.log(`⚡ Success rate: ${((workingProxies.length / unique.length) * 100).toFixed(1)}%\n`);
    
    if (workingProxies.length > 0) {
        const usCount = workingProxies.filter(p => p.country === 'US').length;
        const euCount = workingProxies.filter(p => p.country === 'EU').length;
        
        console.log('🌍 By Country:');
        if (usCount > 0) console.log(`   🇺🇸 US: ${usCount} proxies (HIGH CPM $2-5)`);
        if (euCount > 0) console.log(`   🇪🇺 EU: ${euCount} proxies (HIGH CPM $1.5-3)`);
        console.log('');
        
        saveProgress();
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('💾 SAVED: proxies-found.json');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        console.log('📋 First 15 proxies:\n');
        workingProxies.slice(0, 15).forEach((p, i) => {
            console.log(`${(i+1).toString().padStart(2)}. ${p.country === 'US' ? '🇺🇸' : '🇪🇺'} ${p.host}:${p.port} [${p.tier} - ${p.cpm}]`);
        });
        if (workingProxies.length > 15) {
            console.log(`... and ${workingProxies.length - 15} more!\n`);
        }
    } else {
        console.log('⚠️  No HIGH-revenue proxies found in this batch.\n');
        console.log('Try running again in 10-15 minutes.\n');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
})().catch(err => {
    console.error('\n❌ Error:', err.message);
    saveProgress(); // Save what we have
    console.log('\n✅ Saved progress before exit.');
});
