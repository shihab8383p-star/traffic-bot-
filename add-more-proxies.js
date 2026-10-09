// 🔥 ADD/REPLACE PROXIES - Easy Script
// Add new proxies OR replace all old ones

const fs = require('fs');
const readline = require('readline');

// Check if --replace flag is used
const REPLACE_MODE = process.argv.includes('--replace');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

if (REPLACE_MODE) {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║       🔄 REPLACE ALL PROXIES MODE 🔄                   ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
} else {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║          🔥 ADD MORE PROXIES TO BOT 🔥                 ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
}

// Load existing proxies
let existingProxies = { proxies: [], rotateEvery: 1 };
if (!REPLACE_MODE) {
  try {
    if (fs.existsSync('./proxies.json')) {
      const data = fs.readFileSync('./proxies.json', 'utf8');
      existingProxies = JSON.parse(data);
      console.log(`✅ Found ${existingProxies.proxies.length} existing proxies\n`);
    }
  } catch (error) {
    console.log('⚠️  No existing proxies found. Starting fresh.\n');
  }
} else {
  console.log('⚠️  REPLACE MODE: All old proxies will be deleted!\n');
}

const newProxies = [];

// Check for new-proxies.txt file (batch mode)
if (fs.existsSync('./new-proxies.txt')) {
  console.log('📄 Found new-proxies.txt file!\n');
  const fileContent = fs.readFileSync('./new-proxies.txt', 'utf8');
  const lines = fileContent.split('\n').filter(line => {
    line = line.trim();
    return line && !line.startsWith('#') && line.includes(':');
  });
  
  console.log(`📦 Processing ${lines.length} proxies from file...\n`);
  
  // High revenue countries
  const highRevenue = ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'NL', 'SE', 'NO', 'DK', 'CH', 'AT', 'BE', 'IE', 'FI', 'NZ', 'SG', 'JP', 'KR'];
  
  lines.forEach((line, index) => {
    const parts = line.trim().split(':');
    if (parts.length >= 2) {
      const host = parts[0].trim();
      const port = parseInt(parts[1]);
      const username = parts[2] ? parts[2].trim() : '';
      const password = parts[3] ? parts[3].trim() : '';
      
      // Skip if already exists (in ADD mode)
      if (!REPLACE_MODE) {
        const exists = existingProxies.proxies.some(p => p.host === host && p.port === port);
        if (exists) {
          console.log(`⚠️  Skipping duplicate: ${host}:${port}`);
          return;
        }
      }
      
      // Detect country (basic IP geolocation)
      let country = 'Unknown';
      let tier = 'LOW';
      let cpm = '$0.1-0.5';
      
      // US IPs typically start with certain ranges
      if (host.startsWith('107.') || host.startsWith('192.') || host.startsWith('162.') || 
          host.startsWith('139.') || host.startsWith('165.') || host.startsWith('54.') || 
          host.startsWith('3.') || host.startsWith('44.') || host.startsWith('152.') ||
          host.startsWith('207.') || host.startsWith('15.')) {
        country = 'US';
        tier = 'HIGH';
        cpm = '$2-5';
      } else if (host.startsWith('51.') || host.startsWith('62.')) {
        country = 'FR';
        tier = 'HIGH';
        cpm = '$1.5-3';
      } else if (host.startsWith('85.')) {
        country = 'EU';
        tier = 'HIGH';
        cpm = '$1.5-3';
      }
      
      newProxies.push({
        host,
        port,
        username,
        password,
        country,
        location: `${country} ${index + 1}`,
        tier,
        cpm
      });
      
      console.log(`✅ Added: ${host}:${port} [${country}]`);
    }
  });
  
  console.log(`\n✅ Loaded ${newProxies.length} proxies from file!\n`);
  finishAdding();
  return;
}

console.log('📝 Enter your NEW proxies (from new Webshare account)');
console.log('Format: host:port:username:password');
console.log('Example: 198.46.161.42:5092:rfatimcj:872uh9omp4we');
console.log('Type "done" when finished\n');

function askForProxy(count) {
  rl.question(`New Proxy #${count} (or "done"): `, (answer) => {
    if (answer.toLowerCase() === 'done') {
      finishAdding();
      return;
    }
    
    if (!answer.trim()) {
      console.log('⚠️  Empty input. Type "done" to finish.\n');
      askForProxy(count);
      return;
    }
    
    // Parse proxy
    const parts = answer.split(':');
    if (parts.length !== 4) {
      console.log('❌ Invalid format! Use: host:port:username:password\n');
      askForProxy(count);
      return;
    }
    
    const [host, port, username, password] = parts;
    
    // Check if proxy already exists (only in ADD mode)
    if (!REPLACE_MODE) {
      const exists = existingProxies.proxies.some(p => p.host === host && p.port === parseInt(port));
      if (exists) {
        console.log('⚠️  This proxy already exists! Skipping.\n');
        askForProxy(count);
        return;
      }
    }
    
    // Determine country (you can manually edit later)
    const proxy = {
      host: host.trim(),
      port: parseInt(port),
      username: username.trim(),
      password: password.trim(),
      country: 'Unknown',
      location: 'Unknown'
    };
    
    newProxies.push(proxy);
    console.log(`✅ Added: ${host}:${port}\n`);
    askForProxy(count + 1);
  });
}

function finishAdding() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Summary:`);
  if (REPLACE_MODE) {
    console.log(`   Old proxies: DELETED`);
    console.log(`   New proxies: ${newProxies.length}`);
    console.log(`   Total: ${newProxies.length}`);
  } else {
    console.log(`   Existing proxies: ${existingProxies.proxies.length}`);
    console.log(`   New proxies: ${newProxies.length}`);
    console.log(`   Total: ${existingProxies.proxies.length + newProxies.length}`);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (newProxies.length === 0) {
    console.log('⚠️  No new proxies added. Exiting.\n');
    rl.close();
    return;
  }
  
  rl.question('💾 Save these proxies? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      // Combine existing + new (or just new in REPLACE mode)
      const allProxies = REPLACE_MODE ? newProxies : [...existingProxies.proxies, ...newProxies];
      
      const proxyData = {
        lastUpdate: new Date().toISOString(),
        totalProxies: allProxies.length,
        comment: REPLACE_MODE ? `REPLACED - ${allProxies.length} new proxies` : `${allProxies.length} proxies - Updated ${new Date().toISOString()}`,
        proxies: allProxies
      };
      
      // Backup old file
      if (fs.existsSync('./proxies.json')) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        fs.copyFileSync('./proxies.json', `./proxies-backup-${timestamp}.json`);
        console.log(`\n✅ Backed up old proxies to proxies-backup-${timestamp}.json`);
      }
      
      // Save new file
      fs.writeFileSync('./proxies.json', JSON.stringify(proxyData, null, 2));
      
      console.log(`\n🎉 SUCCESS! Saved ${allProxies.length} total proxies!`);
      console.log('\n╔════════════════════════════════════════════════════════╗');
      if (REPLACE_MODE) {
        console.log('║          ✅ PROXIES REPLACED! ✅                       ║');
      } else {
        console.log('║              ✅ PROXIES UPDATED! ✅                    ║');
      }
      console.log('╚════════════════════════════════════════════════════════╝\n');
      console.log(`📊 You now have ${allProxies.length} proxies!`);
      console.log('\n🚀 Bots will auto-restart with new proxies!\n');
      
    } else {
      console.log('\n❌ Cancelled. No changes made.\n');
    }
    
    rl.close();
  });
}

// Start asking
askForProxy(1);
