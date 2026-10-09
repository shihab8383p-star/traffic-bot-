// 🔥 PROXY STATUS CHECKER - Quick overview
const fs = require('fs');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║          📊 PROXY STATUS DASHBOARD 📊                  ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Load current proxies
let proxyData;
try {
  const data = fs.readFileSync('./proxies.json', 'utf8');
  proxyData = JSON.parse(data);
} catch (error) {
  console.log('❌ ERROR: Could not load proxies.json');
  process.exit(1);
}

console.log('📊 CURRENT PROXY CONFIGURATION:\n');
console.log(`   Total Proxies: ${proxyData.totalProxies}`);
console.log(`   Last Update: ${new Date(proxyData.lastUpdate).toLocaleString()}`);
console.log(`   Comment: ${proxyData.comment}\n`);

// Count by country
const countryCount = {};
const tierCount = { HIGH: 0, MID: 0, LOW: 0 };

proxyData.proxies.forEach(p => {
  countryCount[p.country] = (countryCount[p.country] || 0) + 1;
  tierCount[p.tier] = (tierCount[p.tier] || 0) + 1;
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🌍 BY COUNTRY:\n');
Object.keys(countryCount).sort((a, b) => countryCount[b] - countryCount[a]).forEach(country => {
  const flag = country === 'US' ? '🇺🇸' : country === 'FR' ? '🇫🇷' : country === 'EU' ? '🇪🇺' : '🌐';
  console.log(`   ${flag} ${country}: ${countryCount[country]} proxies`);
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('💰 BY REVENUE TIER:\n');
console.log(`   💎 HIGH tier: ${tierCount.HIGH} proxies ($2-5 CPM)`);
console.log(`   💵 MID tier: ${tierCount.MID} proxies ($0.5-1.5 CPM)`);
if (tierCount.LOW > 0) {
  console.log(`   💸 LOW tier: ${tierCount.LOW} proxies ($0.1-0.5 CPM)`);
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 ALL PROXIES:\n');
proxyData.proxies.forEach((p, i) => {
  const tierIcon = p.tier === 'HIGH' ? '💎' : p.tier === 'MID' ? '💵' : '💸';
  const countryFlag = p.country === 'US' ? '🇺🇸' : p.country === 'FR' ? '🇫🇷' : p.country === 'EU' ? '🇪🇺' : '🌐';
  console.log(`   ${i + 1}. ${countryFlag} ${p.host}:${p.port} [${p.country}] ${tierIcon} ${p.tier}`);
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🎯 AVAILABLE TOOLS:\n');
console.log('   1. TEST-PROXIES-LIVE.bat     → Test which proxies work');
console.log('   2. REMOVE-DEAD-PROXIES.bat   → Auto-remove dead proxies');
console.log('   3. REPLACE-PROXIES.bat       → Replace all proxies');
console.log('   4. AUTO-ADD-PROXIES.bat      → Add more proxies\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
