// 🔥 ADD PROXIES FROM DESKTOP - Auto Filter HIGH Revenue Countries
const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║       ⚡ ADDING PROXIES FROM DESKTOP ⚡                ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// HIGH revenue countries only - SMART TIER SYSTEM
// 🥇 TIER S (TOP 3): US, FR, GB - 70% priority
// 🥈 TIER 1: CA, DE, AU, CH, NL - 20% priority  
// 🥉 TIER 2 (RISING): SE, NO, DK, FI, JP, KR, SG, AT, BE, IE, NZ - 10% priority
const HIGH_REVENUE_COUNTRIES = [
  // TIER S - Absolute best
  'US', 'FR', 'GB',
  // TIER 1 - Very high value
  'CA', 'DE', 'AU', 'CH', 'NL',
  // TIER 2 - Rising stars (will be high-value next!)
  'SE', 'NO', 'DK', 'FI', 'JP', 'KR', 'SG', 'AT', 'BE', 'IE', 'NZ'
];

// Country detection based on IP ranges
function detectCountryFromIP(ip) {
    const firstOctet = parseInt(ip.split('.')[0]);
    const secondOctet = parseInt(ip.split('.')[1]);
    
    // US ranges (most common)
    if ([3, 4, 5, 13, 15, 16, 18, 23, 34, 35, 38, 40, 43, 44, 45, 47, 52, 54, 56, 65, 67, 68, 72, 97, 98, 104, 107, 108, 109, 128, 134, 138, 139, 140, 142, 143, 144, 151, 159, 161, 162, 165, 172, 174, 184, 185, 192, 198, 199, 206, 209, 216].includes(firstOctet)) {
        return 'US';
    }
    
    // Canada ranges
    if ([142, 184].includes(firstOctet) && [54, 75].includes(secondOctet)) {
        return 'CA';
    }
    
    // UK ranges
    if ([2, 5, 51, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94].includes(firstOctet)) {
        return 'GB';
    }
    
    // Germany ranges
    if ([80, 81, 82, 88, 89, 91, 103].includes(firstOctet)) {
        return 'DE';
    }
    
    // France ranges
    if ([51, 62, 109, 188].includes(firstOctet)) {
        return 'FR';
    }
    
    // Netherlands ranges
    if ([62, 77, 85, 86, 94, 95].includes(firstOctet)) {
        return 'NL';
    }
    
    // Switzerland ranges
    if ([85, 91, 94, 165, 185, 194].includes(firstOctet)) {
        return 'CH';
    }
    
    // Japan ranges
    if ([97, 140, 202].includes(firstOctet)) {
        return 'JP';
    }
    
    // South Korea ranges
    if ([140, 144, 211].includes(firstOctet)) {
        return 'KR';
    }
    
    // Singapore ranges
    if ([4, 172].includes(firstOctet)) {
        return 'SG';
    }
    
    // Australia ranges
    if ([1, 27, 58, 101, 103, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 202, 203, 210, 218, 219, 220].includes(firstOctet)) {
        return 'AU';
    }
    
    return 'UNKNOWN';
}

function getCountryName(code) {
    const names = {
        'US': 'United States',
        'CA': 'Canada',
        'GB': 'United Kingdom',
        'AU': 'Australia',
        'DE': 'Germany',
        'FR': 'France',
        'NL': 'The Netherlands',
        'SE': 'Sweden',
        'NO': 'Norway',
        'DK': 'Denmark',
        'CH': 'Switzerland',
        'AT': 'Austria',
        'BE': 'Belgium',
        'IE': 'Ireland',
        'FI': 'Finland',
        'NZ': 'New Zealand',
        'SG': 'Singapore',
        'JP': 'Japan',
        'KR': 'South Korea'
    };
    return names[code] || 'Unknown';
}

// Parse proxy line
function parseProxyLine(line) {
    line = line.trim();
    
    // Skip empty lines and comments
    if (!line || line.startsWith('//') || line.startsWith('#')) {
        return null;
    }
    
    // Format: user:pass@IP:PORT or IP:PORT
    let username = '';
    let password = '';
    let host = '';
    let port = '';
    
    if (line.includes('@')) {
        // Has authentication
        const [auth, address] = line.split('@');
        [username, password] = auth.split(':');
        [host, port] = address.split(':');
    } else {
        // No authentication
        [host, port] = line.split(':');
    }
    
    if (!host || !port) {
        return null;
    }
    
    // Detect country
    const country = detectCountryFromIP(host);
    
    // Only HIGH revenue countries
    if (!HIGH_REVENUE_COUNTRIES.includes(country)) {
        console.log(`⏭️  Skipping ${host}:${port} - Country: ${country} (LOW revenue)`);
        return null;
    }
    
    return {
        host: host.trim(),
        port: parseInt(port.trim()),
        username: username.trim(),
        password: password.trim(),
        country: country,
        location: getCountryName(country),
        tier: 'HIGH',
        cpm: '$2-5'
    };
}

// Main function
async function addProxiesFromDesktop() {
    try {
        const desktopPath = path.join(process.env.USERPROFILE || process.env.HOME, 'Desktop', 'new-proxies.txt');
        
        console.log('📂 Reading proxies from Desktop...\n');
        console.log(`   File: ${desktopPath}\n`);
        
        // Check if file exists
        if (!fs.existsSync(desktopPath)) {
            console.log('❌ File not found on Desktop: new-proxies.txt\n');
            console.log('💡 TIP: Create a file called "new-proxies.txt" on your Desktop\n');
            return;
        }
        
        // Read file
        const content = fs.readFileSync(desktopPath, 'utf8');
        const lines = content.split('\n');
        
        console.log(`📄 Found ${lines.length} lines in file\n`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔍 FILTERING HIGH REVENUE COUNTRIES ONLY...');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Parse proxies
        const newProxies = [];
        const rejected = [];
        
        lines.forEach((line, index) => {
            const proxy = parseProxyLine(line);
            if (proxy) {
                newProxies.push(proxy);
                console.log(`✅ [${index + 1}] ${proxy.host}:${proxy.port} - ${proxy.country} (${proxy.location})`);
            } else if (line.trim() && !line.startsWith('//') && !line.startsWith('#')) {
                rejected.push(line.trim());
            }
        });
        
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`✅ Accepted: ${newProxies.length} HIGH revenue proxies`);
        console.log(`⏭️  Rejected: ${rejected.length} LOW revenue proxies`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
        
        if (newProxies.length === 0) {
            console.log('❌ No HIGH revenue proxies found!\n');
            console.log('💡 Make sure proxies are from: US, CA, GB, AU, DE, FR, NL, SE, NO, DK, CH, AT, BE, IE, FI, NZ, SG, JP, KR\n');
            return;
        }
        
        // Load existing proxies
        let existingProxies = [];
        const proxiesFile = './proxies.json';
        
        if (fs.existsSync(proxiesFile)) {
            const data = fs.readFileSync(proxiesFile, 'utf8');
            const existing = JSON.parse(data);
            existingProxies = existing.proxies || [];
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 MERGING WITH EXISTING PROXIES...');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Merge (avoid duplicates)
        let duplicates = 0;
        let added = 0;
        
        newProxies.forEach(newProxy => {
            const exists = existingProxies.some(p => 
                p.host === newProxy.host && p.port === newProxy.port
            );
            
            if (exists) {
                duplicates++;
                console.log(`⚠️  Duplicate: ${newProxy.host}:${newProxy.port} - Already exists`);
            } else {
                existingProxies.push(newProxy);
                added++;
                console.log(`✅ Added: ${newProxy.host}:${newProxy.port} - ${newProxy.country}`);
            }
        });
        
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`✅ Added: ${added} new proxies`);
        console.log(`⚠️  Skipped: ${duplicates} duplicates`);
        console.log(`📊 Total: ${existingProxies.length} proxies`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
        
        // Backup old file
        if (fs.existsSync(proxiesFile)) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const backupFile = `./proxies-backup-${timestamp}.json`;
            fs.copyFileSync(proxiesFile, backupFile);
            console.log(`💾 Backup saved: ${backupFile}\n`);
        }
        
        // Save
        const proxyData = {
            lastUpdate: new Date().toISOString(),
            totalProxies: existingProxies.length,
            comment: `AUTO-FETCHED - ${existingProxies.length} HIGH revenue proxies`,
            proxies: existingProxies
        };
        
        fs.writeFileSync(proxiesFile, JSON.stringify(proxyData, null, 2));
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║              ✅ SUCCESS! ✅                            ║');
        console.log('╚════════════════════════════════════════════════════════╝');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log(`✅ ${added} new proxies added!`);
        console.log(`📊 Total proxies: ${existingProxies.length}`);
        console.log(`🎯 HIGH revenue countries only`);
        console.log(`💰 Ready to earn more!\n`);
        
        // Clear the desktop file
        console.log('🧹 Cleaning up Desktop file...\n');
        fs.writeFileSync(desktopPath, '// ⚡ PASTE YOUR NEW PROXIES HERE ⚡\n// Format: IP:PORT or user:pass@IP:PORT\n// One proxy per line\n// Example:\n// 192.168.1.1:8080\n// user:pass@192.168.1.2:8080\n\n');
        console.log('✅ Desktop file cleared and ready for next batch!\n');
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔄 NEXT STEP: Restart your bots to use new proxies!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
    } catch (error) {
        console.log(`\n❌ ERROR: ${error.message}\n`);
    }
}

// Run
addProxiesFromDesktop();
