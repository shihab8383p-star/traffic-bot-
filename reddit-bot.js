// Reddit Auto-Posting Bot for Organic Traffic (Tier 1 Countries)
// Posts AI-generated movie recommendations to Reddit targeting USA/UK users

const axios = require('axios');
const fs = require('fs');
const ProxyManager = require('./proxy-manager');

class RedditBot {
  constructor(config) {
    this.config = config;
    this.accessToken = null;
    this.websiteUrl = config.websiteUrl || 'https://cinestream-cs.netlify.app';
    this.proxyManager = new ProxyManager();
    
    // Target subreddits with USA/UK audience
    this.targetSubreddits = [
      'movies',
      'MovieSuggestions', 
      'NetflixBestOf',
      'television',
      'entertainment',
      'moviecritic',
      'flicks',
      'TrueFilm'
    ];
    
    // AI-generated movie recommendation templates
    this.postTemplates = [
      "Just found this amazing movie streaming site! {movie} is trending right now. Check it out: {link}",
      "If you haven't watched {movie} yet, you're missing out! Found it on this site: {link}",
      "Looking for {movie}? This site has it with great quality: {link}",
      "PSA: {movie} is available to stream here: {link}",
      "Finally found a good place to watch {movie}! {link}",
      "Highly recommend checking out {movie} on this platform: {link}"
    ];
    
    // Trending movies for Tier 1 audiences
    this.trendingMovies = [
      'Oppenheimer', 'Barbie', 'Dune Part Two', 'The Batman',
      'Top Gun Maverick', 'Everything Everywhere All at Once',
      'Spider-Man No Way Home', 'Avatar The Way of Water',
      'Guardians of the Galaxy Vol 3', 'John Wick Chapter 4',
      'Mission Impossible Dead Reckoning', 'Fast X',
      'The Super Mario Bros Movie', 'Ant-Man Quantumania',
      'Scream VI', 'Dungeons & Dragons Honor Among Thieves'
    ];
  }
  
  // Authenticate with Reddit
  async authenticate() {
    try {
      console.log('🔐 Authenticating with Reddit...');
      
      const auth = Buffer.from(
        `${this.config.reddit.clientId}:${this.config.reddit.clientSecret}`
      ).toString('base64');
      
      // Use proxy if available
      const proxy = this.proxyManager.getRandomProxy();
      const proxyConfig = this.proxyManager.getAxiosProxyConfig(proxy);
      
      const response = await axios.post(
        'https://www.reddit.com/api/v1/access_token',
        'grant_type=password&username=' + this.config.reddit.username + 
        '&password=' + this.config.reddit.password,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'CineStreamBot/1.0'
          },
          proxy: proxyConfig
        }
      );
      
      this.accessToken = response.data.access_token;
      console.log('✅ Reddit authentication successful!');
      return true;
    } catch (error) {
      console.error('❌ Reddit authentication failed:', error.message);
      return false;
    }
  }
  
  // Generate AI content for post
  generatePost() {
    const movie = this.trendingMovies[Math.floor(Math.random() * this.trendingMovies.length)];
    const template = this.postTemplates[Math.floor(Math.random() * this.postTemplates.length)];
    
    const title = template
      .replace('{movie}', movie)
      .replace('{link}', this.websiteUrl);
    
    return { title, movie };
  }
  
  // Post to Reddit
  async postToSubreddit(subreddit) {
    try {
      const { title, movie } = this.generatePost();
      
      console.log(`📝 Posting to r/${subreddit}: "${title}"`);
      
      // Use proxy if available
      const proxy = this.proxyManager.getRandomProxy();
      const proxyConfig = this.proxyManager.getAxiosProxyConfig(proxy);
      
      const response = await axios.post(
        'https://oauth.reddit.com/api/submit',
        {
          sr: subreddit,
          kind: 'self',
          title: title,
          text: `I've been using this site to watch movies and it's been great! Highly recommend.\n\n${this.websiteUrl}`,
          api_type: 'json'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'User-Agent': 'CineStreamBot/1.0',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          proxy: proxyConfig
        }
      );
      
      if (response.data.json && response.data.json.errors.length === 0) {
        console.log(`✅ Successfully posted to r/${subreddit}!`);
        this.logSuccess(subreddit, title);
        return true;
      } else {
        console.log(`⚠️ Post to r/${subreddit} had issues:`, response.data.json.errors);
        return false;
      }
    } catch (error) {
      console.error(`❌ Failed to post to r/${subreddit}:`, error.message);
      return false;
    }
  }
  
  // Post comment on trending posts (more organic)
  async postComment(subreddit) {
    try {
      console.log(`💬 Finding trending posts in r/${subreddit}...`);
      
      // Get hot posts
      const response = await axios.get(
        `https://oauth.reddit.com/r/${subreddit}/hot`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'User-Agent': 'CineStreamBot/1.0'
          },
          params: { limit: 10 }
        }
      );
      
      const posts = response.data.data.children;
      if (posts.length === 0) return false;
      
      // Pick random post
      const post = posts[Math.floor(Math.random() * posts.length)].data;
      const movie = this.trendingMovies[Math.floor(Math.random() * this.trendingMovies.length)];
      
      const comments = [
        `If you like this, you should check out ${movie} on ${this.websiteUrl} - really good quality!`,
        `This reminds me of ${movie}! Been watching on ${this.websiteUrl} lately, great site.`,
        `${this.websiteUrl} has a ton of similar movies if you're interested!`,
        `You can find this and similar content on ${this.websiteUrl} - discovered it recently!`
      ];
      
      const comment = comments[Math.floor(Math.random() * comments.length)];
      
      await axios.post(
        'https://oauth.reddit.com/api/comment',
        {
          thing_id: post.name,
          text: comment,
          api_type: 'json'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'User-Agent': 'CineStreamBot/1.0',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      console.log(`✅ Posted comment on r/${subreddit}!`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to comment on r/${subreddit}:`, error.message);
      return false;
    }
  }
  
  // Run bot cycle
  async run() {
    console.log('\n🤖 Starting Reddit Bot...\n');
    
    // Authenticate
    const authenticated = await this.authenticate();
    if (!authenticated) return;
    
    // Randomly choose between posting or commenting (comments are less suspicious)
    const action = Math.random() > 0.5 ? 'post' : 'comment';
    
    for (const subreddit of this.targetSubreddits) {
      // Random delay between 5-15 minutes to avoid spam detection
      const delay = (5 + Math.random() * 10) * 60 * 1000;
      
      if (action === 'post') {
        await this.postToSubreddit(subreddit);
      } else {
        await this.postComment(subreddit);
      }
      
      console.log(`⏰ Waiting ${Math.round(delay/60000)} minutes before next action...\n`);
      await this.sleep(delay);
    }
    
    console.log('✅ Reddit Bot cycle complete!\n');
  }
  
  // Log successful posts
  logSuccess(subreddit, title) {
    const log = {
      timestamp: new Date().toISOString(),
      platform: 'Reddit',
      subreddit: subreddit,
      title: title,
      url: this.websiteUrl
    };
    
    const logFile = './traffic-bot/logs.json';
    let logs = [];
    
    if (fs.existsSync(logFile)) {
      logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    }
    
    logs.push(log);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = RedditBot;
