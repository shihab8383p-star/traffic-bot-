// 🚀 TURBO MODE - Maximum Traffic Generation
// Runs multiple bot instances simultaneously for MAXIMUM traffic

const { spawn } = require('child_process');
const fs = require('fs');

class TurboMode {
  constructor() {
    this.instances = 3; // Run 3 bot instances at once
    this.processes = [];
  }
  
  start() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║          🚀 TURBO MODE - MAXIMUM TRAFFIC              ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    console.log(`🔥 Starting ${this.instances} bot instances...`);
    console.log(`⚡ Expected traffic: ${this.instances}x higher than normal mode\n`);
    
    // Start multiple instances
    for (let i = 0; i < this.instances; i++) {
      console.log(`🤖 Starting Bot Instance #${i + 1}...`);
      
      const bot = spawn('node', ['auto-clicker-bot.js'], {
        cwd: __dirname,
        stdio: 'inherit'
      });
      
      bot.on('error', (error) => {
        console.error(`❌ Bot #${i + 1} error:`, error.message);
      });
      
      bot.on('exit', (code) => {
        console.log(`⚠️  Bot #${i + 1} exited with code ${code}`);
        
        // Restart crashed bots
        console.log(`🔄 Restarting Bot #${i + 1}...`);
        setTimeout(() => {
          this.restartBot(i);
        }, 5000);
      });
      
      this.processes.push(bot);
      
      // Delay between starting instances
      this.sleep(10000);
    }
    
    console.log('\n✅ All bot instances started!');
    console.log(`📊 Total traffic will be ${this.instances}x higher`);
    console.log(`💰 Expected earnings: ${this.instances}x multiplier\n`);
    
    // Keep process alive
    process.stdin.resume();
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\n🛑 Stopping all bots...\n');
      this.processes.forEach((bot, i) => {
        console.log(`   Stopping Bot #${i + 1}...`);
        bot.kill();
      });
      console.log('\n✅ All bots stopped!\n');
      process.exit(0);
    });
  }
  
  restartBot(index) {
    const bot = spawn('node', ['auto-clicker-bot.js'], {
      cwd: __dirname,
      stdio: 'inherit'
    });
    
    bot.on('exit', (code) => {
      console.log(`⚠️  Bot #${index + 1} exited with code ${code}`);
      setTimeout(() => this.restartBot(index), 5000);
    });
    
    this.processes[index] = bot;
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run turbo mode
if (require.main === module) {
  const turbo = new TurboMode();
  turbo.start();
}

module.exports = TurboMode;
