// Merge found proxies with existing ones
const fs = require('fs');

const current = JSON.parse(fs.readFileSync('./proxies.json', 'utf8'));
const found = JSON.parse(fs.readFileSync('./proxies-found.json', 'utf8'));

// Combine and remove duplicates
const combined = [...current.proxies, ...found.proxies];
const unique = Array.from(new Map(combined.map(p => [`${p.host}:${p.port}`, p])).values());

const merged = {
    lastUpdate: new Date().toISOString(),
    totalProxies: unique.length,
    comment: `MERGED - ${unique.length} total proxies (${current.proxies.length} old + ${found.proxies.length} found)`,
    proxies: unique
};

fs.writeFileSync('./proxies.json', JSON.stringify(merged, null, 2));
console.log(`✅ Merged! Total: ${unique.length} proxies`);
