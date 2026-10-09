// Test all proxies to see which ones are working
const ProxyManager = require('./proxy-manager.js');

async function testAllProxies() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   TESTING ALL 92 PROXIES              ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  const proxyManager = new ProxyManager();
  
  if (proxyManager.proxies.length === 0) {
    console.log('❌ No proxies loaded!');
    return;
  }
  
  console.log(`📊 Total proxies to test: ${proxyManager.proxies.length}\n`);
  console.log('⏳ This will take a few minutes...\n');
  
  const results = await proxyManager.testAllProxies();
  
  // Separate working and failed proxies
  const working = results.filter(r => r.working);
  const failed = results.filter(r => !r.working);
  
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║          FINAL SUMMARY                ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  console.log(`✅ Working: ${working.length}/${results.length} (${Math.round(working.length/results.length*100)}%)`);
  console.log(`❌ Failed:  ${failed.length}/${results.length} (${Math.round(failed.length/results.length*100)}%)\n`);
  
  if (failed.length > 0) {
    console.log('\n❌ Failed Proxies:');
    failed.forEach(r => {
      console.log(`   - ${r.proxy}`);
    });
  }
  
  console.log('\n✅ All tests completed!\n');
}

testAllProxies().catch(err => {
  console.error('❌ Error testing proxies:', err);
});
