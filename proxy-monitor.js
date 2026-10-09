// 🔍 REAL-TIME PROXY MONITOR - Shows which proxy each bot is using
const fs = require('fs');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║       🔍 LIVE PROXY MONITOR 🔍                        ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

console.log('📊 Monitoring bot proxy usage in real-time...\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Track last displayed stats to only show updates
let lastProxyUsage = {};
let lastTotalClicks = 0;
let lastTotalVisits = 0;
let displayCount = 0;

function displayProxyStatus() {
    try {
        displayCount++;
        
        // Read bot stats
        const statsFile = './bot-stats.json';
        
        if (!fs.existsSync(statsFile)) {
            console.log('⏳ Waiting for bots to start and generate stats...');
            return;
        }
        
        const data = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
        
        // Extract actual stats (handle nested structure)
        let stats = data.stats;
        while (stats && stats.stats && typeof stats.stats === 'object') {
            stats = stats.stats;
        }
        
        if (!stats || !stats.proxyUsage) {
            console.log('⏳ No proxy usage data yet...');
            return;
        }
        
        // Load proxy details
        const proxiesData = JSON.parse(fs.readFileSync('./proxies.json', 'utf8'));
        const proxies = proxiesData.proxies || [];
        
        // Clear console every 10 displays for clean view
        if (displayCount % 10 === 0) {
            console.clear();
            console.log('\n╔════════════════════════════════════════════════════════╗');
            console.log('║       🔍 LIVE PROXY MONITOR 🔍                        ║');
            console.log('╚════════════════════════════════════════════════════════╝\n');
        }
        
        const now = new Date().toLocaleTimeString();
        console.log(`\n🕐 ${now} - Update #${displayCount}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Show current session info
        if (stats.lastSession) {
            console.log('🔥 CURRENT/LAST SESSION:');
            console.log(`   🌍 Proxy: ${stats.lastSession.proxy || 'Unknown'}`);
            console.log(`   📊 Visits: ${stats.lastSession.visits || 0}`);
            console.log(`   🖱️  Clicks: ${stats.lastSession.clicks || 0}`);
            console.log(`   🕐 Time: ${new Date(stats.lastSession.timestamp).toLocaleTimeString()}`);
            console.log('');
        }
        
        // Show proxy usage statistics
        const proxyUsage = stats.proxyUsage || {};
        const sortedProxies = Object.entries(proxyUsage)
            .sort((a, b) => b[1] - a[1]); // Sort by usage count
        
        if (sortedProxies.length > 0) {
            console.log('📊 PROXY USAGE STATISTICS:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            
            sortedProxies.forEach(([host, count], index) => {
                // Find proxy details
                const proxy = proxies.find(p => p.host === host);
                
                if (proxy) {
                    const flag = getCountryFlag(proxy.country);
                    const isNew = !lastProxyUsage[host] || lastProxyUsage[host] < count;
                    const indicator = isNew ? '🔥' : '  ';
                    
                    console.log(`${indicator} ${index + 1}. ${flag} ${proxy.country} - ${proxy.location || 'Unknown'}`);
                    console.log(`      IP: ${host}:${proxy.port}`);
                    console.log(`      Sessions: ${count}`);
                    console.log(`      Tier: ${proxy.tier || 'HIGH'} | CPM: ${proxy.cpm || '$2-5'}`);
                    console.log('');
                }
            });
            
            lastProxyUsage = { ...proxyUsage };
        } else {
            console.log('⏳ No proxy usage data yet...\n');
        }
        
        // Show overall stats
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📈 OVERALL STATISTICS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        const totalVisits = stats.totalVisits || 0;
        const totalClicks = stats.totalClicks || 0;
        const totalPages = stats.totalPages || 0;
        const earnings = (stats.estimatedEarnings || 0) + (stats.estimatedCommissions || 0);
        
        // Show changes
        const visitDiff = totalVisits - lastTotalVisits;
        const clickDiff = totalClicks - lastTotalClicks;
        
        console.log(`   📊 Total Visits: ${totalVisits} ${visitDiff > 0 ? `(+${visitDiff})` : ''}`);
        console.log(`   📄 Total Pages: ${totalPages}`);
        console.log(`   🖱️  Total Clicks: ${totalClicks} ${clickDiff > 0 ? `(+${clickDiff})` : ''}`);
        console.log(`   🌍 Active Proxies: ${sortedProxies.length}/${proxies.length}`);
        console.log(`   💰 Earnings: $${earnings.toFixed(2)}`);
        console.log(`   ✅ Sessions Completed: ${stats.sessionsCompleted || 0}`);
        console.log(`   ❌ Sessions Failed: ${stats.sessionsFailed || 0}`);
        
        lastTotalVisits = totalVisits;
        lastTotalClicks = totalClicks;
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('💡 This monitor updates every 5 seconds');
        console.log('💡 Press Ctrl+C to stop monitoring');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
    } catch (error) {
        console.log(`⚠️  Error reading stats: ${error.message}`);
    }
}

function getCountryFlag(code) {
    const flags = {
        'US': '🇺🇸',
        'CA': '🇨🇦',
        'GB': '🇬🇧',
        'AU': '🇦🇺',
        'DE': '🇩🇪',
        'FR': '🇫🇷',
        'NL': '🇳🇱',
        'SE': '🇸🇪',
        'NO': '🇳🇴',
        'DK': '🇩🇰',
        'CH': '🇨🇭',
        'AT': '🇦🇹',
        'BE': '🇧🇪',
        'IE': '🇮🇪',
        'FI': '🇫🇮',
        'NZ': '🇳🇿',
        'SG': '🇸🇬',
        'JP': '🇯🇵',
        'KR': '🇰🇷'
    };
    return flags[code] || '🌍';
}

// Display immediately
displayProxyStatus();

// Update every 5 seconds
setInterval(displayProxyStatus, 5000);

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
    console.log('\n\n✅ Monitoring stopped. Bots are still running!\n');
    process.exit(0);
});
