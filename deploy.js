// Cloud Deployment Script
// Deploys traffic bot to free cloud platforms (Render, Railway, Fly.io)

const fs = require('fs');
const { execSync } = require('child_process');

class CloudDeployer {
  constructor() {
    this.platform = process.argv[2] || 'render';
    this.projectName = 'cinestream-traffic-bot';
  }
  
  async deploy() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║       ☁️  Cloud Deployment Wizard                     ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    console.log(`🎯 Target Platform: ${this.platform.toUpperCase()}\n`);
    
    // Check if config exists
    if (!fs.existsSync('./traffic-bot/config.json')) {
      console.error('❌ Configuration not found!');
      console.log('   Please run: node setup-config.js first\n');
      process.exit(1);
    }
    
    // Create necessary deployment files
    this.createPackageJson();
    this.createProcfile();
    this.createDockerfile();
    
    // Platform-specific deployment
    switch (this.platform.toLowerCase()) {
      case 'render':
        await this.deployRender();
        break;
      case 'railway':
        await this.deployRailway();
        break;
      case 'fly':
        await this.deployFly();
        break;
      default:
        console.error('❌ Unknown platform. Use: render, railway, or fly');
        process.exit(1);
    }
  }
  
  // Create package.json for deployment
  createPackageJson() {
    const packageJson = {
      name: 'cinestream-traffic-bot',
      version: '1.0.0',
      description: 'AI-powered traffic generation bot for Tier 1 countries',
      main: 'traffic-bot/index.js',
      scripts: {
        start: 'node traffic-bot/index.js',
        setup: 'node traffic-bot/setup-config.js'
      },
      dependencies: {
        axios: '^1.6.0'
      },
      engines: {
        node: '>=14.0.0'
      },
      keywords: ['traffic', 'automation', 'bot', 'social-media'],
      author: 'CineStream',
      license: 'MIT'
    };
    
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ Created package.json');
  }
  
  // Create Procfile for deployment
  createProcfile() {
    const procfile = 'worker: node traffic-bot/index.js';
    fs.writeFileSync('./Procfile', procfile);
    console.log('✅ Created Procfile');
  }
  
  // Create Dockerfile
  createDockerfile() {
    const dockerfile = `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["node", "traffic-bot/index.js"]
`;
    
    fs.writeFileSync('./Dockerfile', dockerfile);
    console.log('✅ Created Dockerfile\n');
  }
  
  // Deploy to Render.com
  async deployRender() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 DEPLOYING TO RENDER.COM');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📋 Manual Deployment Steps:\n');
    console.log('1. Go to: https://render.com');
    console.log('2. Sign up / Log in (use GitHub for easier setup)');
    console.log('3. Click "New +" → "Background Worker"');
    console.log('4. Connect your GitHub repository');
    console.log('   OR');
    console.log('   Upload this folder as ZIP\n');
    
    console.log('5. Configure:');
    console.log('   • Name: cinestream-traffic-bot');
    console.log('   • Environment: Node');
    console.log('   • Build Command: npm install');
    console.log('   • Start Command: node traffic-bot/index.js');
    console.log('   • Plan: Free ($0/month)\n');
    
    console.log('6. Add Environment Variables:');
    console.log('   (Copy from your config.json)\n');
    
    const config = JSON.parse(fs.readFileSync('./traffic-bot/config.json', 'utf8'));
    
    console.log('   WEBSITE_URL=' + config.websiteUrl);
    if (config.reddit.username) {
      console.log('   REDDIT_CLIENT_ID=' + config.reddit.clientId);
      console.log('   REDDIT_CLIENT_SECRET=' + config.reddit.clientSecret);
      console.log('   REDDIT_USERNAME=' + config.reddit.username);
      console.log('   REDDIT_PASSWORD=' + config.reddit.password);
    }
    if (config.twitter.bearerToken) {
      console.log('   TWITTER_BEARER_TOKEN=' + config.twitter.bearerToken);
      console.log('   TWITTER_USER_ID=' + config.twitter.userId);
    }
    if (config.pinterest.accessToken) {
      console.log('   PINTEREST_ACCESS_TOKEN=' + config.pinterest.accessToken);
    }
    
    console.log('\n7. Click "Create Background Worker"\n');
    console.log('✅ Your bot will start running automatically!\n');
    console.log('💡 Render free tier: Bot runs 24/7 for FREE! 🎉\n');
  }
  
  // Deploy to Railway.app
  async deployRailway() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 DEPLOYING TO RAILWAY.APP');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📋 Deployment Steps:\n');
    console.log('1. Go to: https://railway.app');
    console.log('2. Sign up with GitHub');
    console.log('3. Click "New Project"');
    console.log('4. Select "Deploy from GitHub repo"');
    console.log('5. Choose your repository\n');
    
    console.log('6. Railway will auto-detect Node.js');
    console.log('   Start Command: node traffic-bot/index.js\n');
    
    console.log('7. Add Environment Variables in Settings:\n');
    
    const config = JSON.parse(fs.readFileSync('./traffic-bot/config.json', 'utf8'));
    
    console.log('   WEBSITE_URL=' + config.websiteUrl);
    if (config.reddit.username) {
      console.log('   REDDIT_CLIENT_ID=' + config.reddit.clientId);
      console.log('   REDDIT_CLIENT_SECRET=' + config.reddit.clientSecret);
      console.log('   REDDIT_USERNAME=' + config.reddit.username);
      console.log('   REDDIT_PASSWORD=' + config.reddit.password);
    }
    if (config.twitter.bearerToken) {
      console.log('   TWITTER_BEARER_TOKEN=' + config.twitter.bearerToken);
      console.log('   TWITTER_USER_ID=' + config.twitter.userId);
    }
    if (config.pinterest.accessToken) {
      console.log('   PINTEREST_ACCESS_TOKEN=' + config.pinterest.accessToken);
    }
    
    console.log('\n8. Deploy!\n');
    console.log('✅ Railway will build and start your bot!\n');
    console.log('💡 Railway: $5 free credits/month (enough for 24/7!)\n');
  }
  
  // Deploy to Fly.io
  async deployFly() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 DEPLOYING TO FLY.IO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📋 Installation & Deployment:\n');
    
    // Create fly.toml
    const flyToml = `app = "${this.projectName}"
primary_region = "iad"

[build]

[env]
  NODE_ENV = "production"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [services.concurrency]
    type = "requests"
    hard_limit = 25
    soft_limit = 20

[processes]
  app = "node traffic-bot/index.js"
`;
    
    fs.writeFileSync('./fly.toml', flyToml);
    console.log('✅ Created fly.toml\n');
    
    console.log('1. Install Fly CLI:');
    console.log('   • Windows: powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"');
    console.log('   • Mac/Linux: curl -L https://fly.io/install.sh | sh\n');
    
    console.log('2. Sign up / Log in:');
    console.log('   fly auth signup');
    console.log('   OR');
    console.log('   fly auth login\n');
    
    console.log('3. Launch your app:');
    console.log('   fly launch\n');
    
    console.log('4. Set environment variables:');
    
    const config = JSON.parse(fs.readFileSync('./traffic-bot/config.json', 'utf8'));
    
    console.log('   fly secrets set WEBSITE_URL="' + config.websiteUrl + '"');
    if (config.reddit.username) {
      console.log('   fly secrets set REDDIT_CLIENT_ID="' + config.reddit.clientId + '"');
      console.log('   fly secrets set REDDIT_CLIENT_SECRET="' + config.reddit.clientSecret + '"');
      console.log('   fly secrets set REDDIT_USERNAME="' + config.reddit.username + '"');
      console.log('   fly secrets set REDDIT_PASSWORD="' + config.reddit.password + '"');
    }
    if (config.twitter.bearerToken) {
      console.log('   fly secrets set TWITTER_BEARER_TOKEN="' + config.twitter.bearerToken + '"');
      console.log('   fly secrets set TWITTER_USER_ID="' + config.twitter.userId + '"');
    }
    if (config.pinterest.accessToken) {
      console.log('   fly secrets set PINTEREST_ACCESS_TOKEN="' + config.pinterest.accessToken + '"');
    }
    
    console.log('\n5. Deploy:');
    console.log('   fly deploy\n');
    
    console.log('✅ Your bot will be live!\n');
    console.log('💡 Fly.io: Free tier includes enough to run 24/7!\n');
  }
  
  // Create .gitignore
  createGitignore() {
    const gitignore = `node_modules/
config.json
logs.json
stats.json
traffic-bot/posters/
.env
*.log
.DS_Store
`;
    
    fs.writeFileSync('./.gitignore', gitignore);
    console.log('✅ Created .gitignore');
  }
}

// Main execution
console.log('\n🚀 Starting deployment process...\n');

const deployer = new CloudDeployer();
deployer.createGitignore();
deployer.deploy().then(() => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║         ✅ DEPLOYMENT INSTRUCTIONS READY!             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log('Follow the steps above to deploy your bot to the cloud!\n');
  console.log('🎉 Once deployed, your bot will run 24/7 automatically!\n');
}).catch(error => {
  console.error('❌ Deployment preparation failed:', error.message);
  process.exit(1);
});
