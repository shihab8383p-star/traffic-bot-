// 🔥 QUICK PROXY REPLACEMENT - Auto version
const fs = require('fs');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║       🔄 AUTO PROXY REPLACEMENT 🔄                     ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Read new-proxies.txt
if (!fs.existsSync('./new-proxies.txt')) {
  console.log('❌ ERROR: new-proxies.txt not found!');
  process.exit(1);
}

const fileContent = fs.readFileSync('./new-proxies.txt', 'utf8');
const lines = fileContent.split('\n').filter(line => {
  line = line.trim();
  return line && !line.startsWith('#') && line.includes(':');
});

console.log(`📦 Processing ${lines.length} proxies from file...\n`);

const newProxies = [];
let usCount = 0, euCount = 0, frCount = 0, unknownCount = 0;

lines.forEach((line, index) => {
  const parts = line.trim().split(':');
  if (parts.length >= 2) {
    const host = parts[0].trim();
    const port = parseInt(parts[1]);
    const username = parts[2] ? parts[2].trim() : '';
    const password = parts[3] ? parts[3].trim() : '';
    
    // Detect country
    let country = 'Unknown';
    let tier = 'MID';
    let cpm = '$0.5-1.5';
    
    // US IPs
    if (host.startsWith('107.') || host.startsWith('192.') || host.startsWith('162.') || 
        host.startsWith('139.') || host.startsWith('165.') || host.startsWith('54.') || 
        host.startsWith('3.') || host.startsWith('44.') || host.startsWith('152.') ||
        host.startsWith('207.') || host.startsWith('15.') || host.startsWith('184.') ||
        host.startsWith('199.') || host.startsWith('198.') || host.startsWith('209.') ||
        host.startsWith('159.') || host.startsWith('34.') || host.startsWith('23.') ||
        host.startsWith('67.') || host.startsWith('68.') || host.startsWith('98.') ||
        host.startsWith('72.') || host.startsWith('104.') || host.startsWith('161.') ||
        host.startsWith('174.') || host.startsWith('216.') || host.startsWith('142.') ||
        host.startsWith('16.') || host.startsWith('18.') || host.startsWith('40.') ||
        host.startsWith('50.') || host.startsWith('52.') || host.startsWith('56.')) {
      country = 'US';
      tier = 'HIGH';
      cpm = '$2-5';
      usCount++;
    } else if (host.startsWith('51.') || host.startsWith('62.210')) {
      country = 'FR';
      tier = 'HIGH';
      cpm = '$1.5-3';
      frCount++;
    } else if (host.startsWith('85.') || host.startsWith('2.') || host.startsWith('62.72')) {
      country = 'EU';
      tier = 'HIGH';
      cpm = '$1.5-3';
      euCount++;
    } else {
      unknownCount++;
    }
    
    newProxies.push({
      host,
      port,
      username,
      password,
      country,
      location: `${country} ${newProxies.filter(p => p.country === country).length + 1}`,
      tier,
      cpm
    });
  }
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 Proxy Summary:');
console.log(`   🇺🇸 US proxies: ${usCount}`);
console.log(`   🇪🇺 EU proxies: ${euCount}`);
console.log(`   🇫🇷 FR proxies: ${frCount}`);
console.log(`   ❓ Unknown: ${unknownCount}`);
console.log(`   ✅ Total: ${newProxies.length}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const proxyData = {
  lastUpdate: new Date().toISOString(),
  totalProxies: newProxies.length,
  comment: `REPLACED - ${newProxies.length} new proxies (${usCount} US, ${euCount} EU, ${frCount} FR)`,
  proxies: newProxies
};

// Backup old file
if (fs.existsSync('./proxies.json')) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  fs.copyFileSync('./proxies.json', `./proxies-backup-${timestamp}.json`);
  console.log(`✅ Backed up old proxies to proxies-backup-${timestamp}.json`);
}

// Save new file
fs.writeFileSync('./proxies.json', JSON.stringify(proxyData, null, 2));

console.log(`\n🎉 SUCCESS! Saved ${newProxies.length} total proxies!`);
console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║          ✅ PROXIES REPLACED! ✅                       ║');
console.log('╚════════════════════════════════════════════════════════╝\n');
console.log('🚀 Bots will auto-restart with new proxies!\n');
