// Twitter/X Auto-Posting Bot for Organic Traffic (Tier 1 Countries)
// Auto-tweets trending movies with CineStream link targeting USA/UK audiences

const axios = require('axios');
const fs = require('fs');

class TwitterBot {
  constructor(config) {
    this.config = config;
    this.websiteUrl = config.websiteUrl || 'https://cinestream-cs.netlify.app';
    
    // Trending movie hashtags (USA/UK focused)
    this.trendingMovies = [
      { name: 'Oppenheimer', hashtags: '#Oppenheimer #ChristopherNolan #Movies' },
      { name: 'Barbie', hashtags: '#BarbieMovie #Barbie #Movies' },
      { name: 'Dune Part Two', hashtags: '#Dune #DunePartTwo #SciFi' },
      { name: 'The Batman', hashtags: '#TheBatman #Batman #DCComics' },
      { name: 'Top Gun Maverick', hashtags: '#TopGunMaverick #TomCruise #Movies' },
      { name: 'Everything Everywhere All at Once', hashtags: '#EEAAO #Movies #Oscar' },
      { name: 'Spider-Man No Way Home', hashtags: '#SpiderMan #Marvel #MCU' },
      { name: 'Avatar The Way of Water', hashtags: '#Avatar #Avatar2 #JamesCameron' },
      { name: 'Guardians of the Galaxy Vol 3', hashtags: '#GuardiansOfTheGalaxy #Marvel #MCU' },
      { name: 'John Wick Chapter 4', hashtags: '#JohnWick #JohnWick4 #KeanuReeves' },
      { name: 'Mission Impossible Dead Reckoning', hashtags: '#MissionImpossible #TomCruise #Action' },
      { name: 'The Super Mario Bros Movie', hashtags: '#SuperMarioBros #Nintendo #Animation' },
      { name: 'Killers of the Flower Moon', hashtags: '#KillersOfTheFlowerMoon #Scorsese #Movies' },
      { name: 'Poor Things', hashtags: '#PoorThings #EmmaStone #Movies' },
      { name: 'The Holdovers', hashtags: '#TheHoldovers #PaulGiamatti #Movies' }
    ];
    
    // Tweet templates with engagement hooks
    this.tweetTemplates = [
      "Just watched {movie}! 🔥 Absolutely incredible. Stream it here: {link} {hashtags}",
      "{movie} is a masterpiece! 🎬 If you haven't seen it yet, check it out: {link} {hashtags}",
      "Movie night sorted! 🍿 Watching {movie} on {link} - quality is amazing! {hashtags}",
      "Highly recommend {movie}! 👌 Found it on this site: {link} {hashtags}",
      "Can't stop thinking about {movie}! 🤯 Watch it here: {link} {hashtags}",
      "{movie} exceeded all expectations! ⭐️⭐️⭐️⭐️⭐️ Stream: {link} {hashtags}",
      "PSA: {movie} is streaming now! 📺 Great quality: {link} {hashtags}",
      "If you loved {movie}, you need to watch it again here: {link} {hashtags}",
      "Weekend plans: Rewatching {movie}! 🎥 Join me: {link} {hashtags}",
      "{movie} is THE movie to watch this week! 🔥 {link} {hashtags}"
    ];
    
    // Engagement tweets (no direct link but builds authority)
    this.engagementTweets = [
      "What's everyone watching this weekend? 🍿 Drop your recommendations! #Movies #MovieNight",
      "Hot take: {movie} is one of the best films of the decade. Agree? 🎬 #Movies",
      "Top 3 must-watch movies right now:\n1. {movie1}\n2. {movie2}\n3. {movie3}\n\nWhat's yours? #Movies",
      "Unpopular opinion: {movie} is underrated and deserves more love! 💯 #Movies",
      "Just finished {movie} and WOW. That ending! 🤯 (No spoilers) #Movies",
      "Movie recommendation thread: Reply with your favorite film from 2024! 🎥 #Movies",
      "Can't decide what to watch tonight. {movie} or something else? Help! 🤔 #MovieNight",
      "That moment when you finish {movie} and need 24 hours to process it... 😮 #Movies"
    ];
    
    // Best times to tweet for USA/UK audiences (EST timezone)
    this.peakTimes = [
      { hour: 9, minute: 0 },   // 9 AM EST (Morning USA)
      { hour: 12, minute: 30 }, // 12:30 PM EST (Lunch USA)
      { hour: 18, minute: 0 },  // 6 PM EST (Evening USA)
      { hour: 21, minute: 0 }   // 9 PM EST (Prime time USA/UK)
    ];
  }
  
  // Authenticate with Twitter API v2
  async authenticate() {
    console.log('🔐 Twitter authentication ready...');
    // Twitter API v2 uses Bearer token, no need for separate auth
    return true;
  }
  
  // Generate AI tweet content
  generateTweet(includeLink = true) {
    const movie = this.trendingMovies[Math.floor(Math.random() * this.trendingMovies.length)];
    
    if (!includeLink) {
      // Engagement tweet (builds followers)
      const template = this.engagementTweets[Math.floor(Math.random() * this.engagementTweets.length)];
      const movie2 = this.trendingMovies[Math.floor(Math.random() * this.trendingMovies.length)];
      const movie3 = this.trendingMovies[Math.floor(Math.random() * this.trendingMovies.length)];
      
      return template
        .replace('{movie}', movie.name)
        .replace('{movie1}', movie.name)
        .replace('{movie2}', movie2.name)
        .replace('{movie3}', movie3.name);
    }
    
    // Promotional tweet (with link)
    const template = this.tweetTemplates[Math.floor(Math.random() * this.tweetTemplates.length)];
    
    const tweet = template
      .replace('{movie}', movie.name)
      .replace('{link}', this.websiteUrl)
      .replace('{hashtags}', movie.hashtags);
    
    return tweet;
  }
  
  // Post tweet using Twitter API v2
  async postTweet(tweetText) {
    try {
      console.log(`📝 Posting tweet: "${tweetText.substring(0, 50)}..."`);
      
      const response = await axios.post(
        'https://api.twitter.com/2/tweets',
        { text: tweetText },
        {
          headers: {
            'Authorization': `Bearer ${this.config.twitter.bearerToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ Tweet posted successfully! ID: ${response.data.data.id}`);
      this.logSuccess(tweetText, response.data.data.id);
      return true;
    } catch (error) {
      console.error('❌ Failed to post tweet:', error.response?.data || error.message);
      return false;
    }
  }
  
  // Like and retweet popular movie tweets (increases visibility)
  async engageWithTrending() {
    try {
      console.log('💬 Engaging with trending movie tweets...');
      
      // Search for trending movie tweets
      const movie = this.trendingMovies[Math.floor(Math.random() * this.trendingMovies.length)];
      const searchQuery = encodeURIComponent(`${movie.name} movie -is:retweet lang:en`);
      
      const response = await axios.get(
        `https://api.twitter.com/2/tweets/search/recent?query=${searchQuery}&max_results=10`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.twitter.bearerToken}`
          }
        }
      );
      
      if (response.data.data && response.data.data.length > 0) {
        const randomTweet = response.data.data[Math.floor(Math.random() * response.data.data.length)];
        
        // Like the tweet
        await axios.post(
          `https://api.twitter.com/2/users/${this.config.twitter.userId}/likes`,
          { tweet_id: randomTweet.id },
          {
            headers: {
              'Authorization': `Bearer ${this.config.twitter.bearerToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log(`✅ Liked tweet about ${movie.name}`);
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to engage with tweets:', error.response?.data || error.message);
      return false;
    }
  }
  
  // Run bot cycle
  async run() {
    console.log('\n🤖 Starting Twitter Bot...\n');
    
    await this.authenticate();
    
    // Strategy: Alternate between promotional and engagement tweets
    // 1 promotional tweet, then 2 engagement tweets (builds trust)
    
    // Promotional tweet with link
    const promotionalTweet = this.generateTweet(true);
    await this.postTweet(promotionalTweet);
    
    // Wait 2-4 hours
    await this.sleep((2 + Math.random() * 2) * 60 * 60 * 1000);
    
    // Engagement tweet (no link)
    const engagementTweet1 = this.generateTweet(false);
    await this.postTweet(engagementTweet1);
    
    // Wait 3-5 hours
    await this.sleep((3 + Math.random() * 2) * 60 * 60 * 1000);
    
    // Engage with trending tweets
    await this.engageWithTrending();
    
    // Wait 2-4 hours
    await this.sleep((2 + Math.random() * 2) * 60 * 60 * 1000);
    
    // Another engagement tweet
    const engagementTweet2 = this.generateTweet(false);
    await this.postTweet(engagementTweet2);
    
    console.log('✅ Twitter Bot cycle complete!\n');
  }
  
  // Schedule tweets at peak USA/UK times
  getNextPeakTime() {
    const now = new Date();
    const currentHour = now.getUTCHours() - 5; // Convert to EST
    
    for (const time of this.peakTimes) {
      if (time.hour > currentHour) {
        return time;
      }
    }
    
    // If past all peak times, return first one for tomorrow
    return this.peakTimes[0];
  }
  
  // Log successful tweets
  logSuccess(tweetText, tweetId) {
    const log = {
      timestamp: new Date().toISOString(),
      platform: 'Twitter',
      tweet: tweetText,
      tweetId: tweetId,
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

module.exports = TwitterBot;
