// Pinterest Auto-Pinning Bot for Organic Traffic (Tier 1 Countries)
// Auto-downloads movie posters and pins them - Pinterest has MASSIVE USA traffic!

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class PinterestBot {
  constructor(config) {
    this.config = config;
    this.websiteUrl = config.websiteUrl || 'https://cinestream-cs.netlify.app';
    
    // Board names to create/use
    this.boards = [
      'Movies to Watch',
      'Best Movies 2024',
      'Trending Movies',
      'Action Movies',
      'Drama Movies',
      'Comedy Movies',
      'Must Watch Films'
    ];
    
    // Movie posters database with TMDB image URLs
    this.movies = [
      { 
        title: 'Oppenheimer', 
        poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        description: 'Epic biographical thriller about J. Robert Oppenheimer',
        tags: ['movie', 'thriller', 'biography', 'drama']
      },
      { 
        title: 'Barbie', 
        poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
        description: 'Barbie and Ken embark on a journey of self-discovery',
        tags: ['movie', 'comedy', 'fantasy', 'adventure']
      },
      { 
        title: 'Dune Part Two', 
        poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        description: 'Paul Atreides unites with Chani and the Fremen',
        tags: ['movie', 'scifi', 'adventure', 'action']
      },
      { 
        title: 'The Batman', 
        poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
        description: 'Batman ventures into Gotham City\'s underworld',
        tags: ['movie', 'action', 'crime', 'superhero']
      },
      { 
        title: 'Spider-Man No Way Home', 
        poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        description: 'Spider-Man seeks help from Doctor Strange',
        tags: ['movie', 'action', 'superhero', 'marvel']
      },
      { 
        title: 'Avatar The Way of Water', 
        poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        description: 'Jake Sully and Neytiri form a family on Pandora',
        tags: ['movie', 'scifi', 'adventure', 'fantasy']
      },
      { 
        title: 'Top Gun Maverick', 
        poster: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        description: 'Maverick trains a group of Top Gun graduates',
        tags: ['movie', 'action', 'drama', 'thriller']
      },
      { 
        title: 'Guardians of the Galaxy Vol 3', 
        poster: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg',
        description: 'The Guardians embark on a mission to protect Rocket',
        tags: ['movie', 'action', 'comedy', 'marvel']
      },
      { 
        title: 'John Wick Chapter 4', 
        poster: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
        description: 'John Wick discovers a path to defeating the High Table',
        tags: ['movie', 'action', 'thriller', 'crime']
      },
      { 
        title: 'Mission Impossible Dead Reckoning', 
        poster: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg',
        description: 'Ethan Hunt faces the most dangerous enemy yet',
        tags: ['movie', 'action', 'thriller', 'spy']
      },
      { 
        title: 'The Super Mario Bros Movie', 
        poster: 'https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg',
        description: 'Mario and Luigi embark on an adventure to save Princess Peach',
        tags: ['movie', 'animation', 'family', 'adventure']
      },
      { 
        title: 'Everything Everywhere All at Once', 
        poster: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
        description: 'A multiverse adventure exploring infinite possibilities',
        tags: ['movie', 'scifi', 'comedy', 'action']
      },
      { 
        title: 'Poor Things', 
        poster: 'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
        description: 'A young woman brought back to life embarks on adventures',
        tags: ['movie', 'comedy', 'drama', 'fantasy']
      },
      { 
        title: 'Killers of the Flower Moon', 
        poster: 'https://image.tmdb.org/t/p/w500/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg',
        description: 'Osage Nation murders in 1920s Oklahoma',
        tags: ['movie', 'crime', 'drama', 'history']
      },
      { 
        title: 'The Holdovers', 
        poster: 'https://image.tmdb.org/t/p/w500/m8c3EJ9WANXUO4pMMr7pR9yUccA.jpg',
        description: 'A cranky teacher remains on campus during Christmas',
        tags: ['movie', 'comedy', 'drama']
      }
    ];
    
    // Pin description templates (SEO optimized for Pinterest)
    this.pinTemplates = [
      "Watch {title} now! 🎬 Stream in HD quality. Click to watch: {link} #Movies #Streaming #{tag1} #{tag2}",
      "🍿 {title} - One of the best movies to watch! Full movie available: {link} #MovieNight #{tag1}",
      "Looking for {title}? Watch it here in great quality! {link} 🎥 #{tag1} #{tag2} #Movies",
      "⭐️ {title} - {description}. Watch now: {link} #Films #{tag1} #{tag2}",
      "Stream {title} online! Perfect for movie night 🎬 {link} #Streaming #Movies #{tag1}",
      "Must watch: {title}! Click to stream: {link} 🎥 #{tag1} #{tag2} #Entertainment",
      "🔥 {title} - Now streaming! Watch here: {link} #MovieRecommendation #{tag1}",
      "Don't miss {title}! Full movie available: {link} 🍿 #{tag1} #{tag2} #WatchNow"
    ];
  }
  
  // Authenticate with Pinterest API
  async authenticate() {
    console.log('🔐 Pinterest authentication ready...');
    // Pinterest uses OAuth access token
    return true;
  }
  
  // Create a board if it doesn't exist
  async createBoard(boardName) {
    try {
      console.log(`📌 Creating board: ${boardName}...`);
      
      const response = await axios.post(
        'https://api.pinterest.com/v5/boards',
        {
          name: boardName,
          description: `Collection of amazing movies to watch. Stream full movies in HD quality!`,
          privacy: 'PUBLIC'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.pinterest.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ Board created: ${boardName}`);
      return response.data.id;
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`ℹ️ Board "${boardName}" already exists`);
        // Get board ID
        return await this.getBoardId(boardName);
      }
      console.error(`❌ Failed to create board:`, error.response?.data || error.message);
      return null;
    }
  }
  
  // Get board ID by name
  async getBoardId(boardName) {
    try {
      const response = await axios.get(
        'https://api.pinterest.com/v5/boards',
        {
          headers: {
            'Authorization': `Bearer ${this.config.pinterest.accessToken}`
          }
        }
      );
      
      const board = response.data.items.find(b => b.name === boardName);
      return board ? board.id : null;
    } catch (error) {
      console.error('❌ Failed to get boards:', error.message);
      return null;
    }
  }
  
  // Download movie poster
  async downloadPoster(url, filename) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      
      const posterDir = './traffic-bot/posters';
      if (!fs.existsSync(posterDir)) {
        fs.mkdirSync(posterDir, { recursive: true });
      }
      
      const filepath = path.join(posterDir, filename);
      fs.writeFileSync(filepath, buffer);
      
      return filepath;
    } catch (error) {
      console.error('❌ Failed to download poster:', error.message);
      return null;
    }
  }
  
  // Create a pin with movie poster
  async createPin(movie, boardId) {
    try {
      console.log(`📍 Creating pin for: ${movie.title}...`);
      
      // Generate pin description
      const template = this.pinTemplates[Math.floor(Math.random() * this.pinTemplates.length)];
      const tag1 = movie.tags[0] || 'movies';
      const tag2 = movie.tags[1] || 'streaming';
      
      const description = template
        .replace('{title}', movie.title)
        .replace('{description}', movie.description)
        .replace('{link}', this.websiteUrl)
        .replace('{tag1}', tag1)
        .replace('{tag2}', tag2);
      
      // Create pin using media (image URL)
      const response = await axios.post(
        'https://api.pinterest.com/v5/pins',
        {
          board_id: boardId,
          title: `${movie.title} - Watch Full Movie`,
          description: description,
          link: this.websiteUrl,
          media_source: {
            source_type: 'image_url',
            url: movie.poster
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.pinterest.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ Pin created for ${movie.title}! ID: ${response.data.id}`);
      this.logSuccess(movie.title, response.data.id, boardId);
      return true;
    } catch (error) {
      console.error(`❌ Failed to create pin for ${movie.title}:`, error.response?.data || error.message);
      return false;
    }
  }
  
  // Run bot cycle
  async run() {
    console.log('\n🤖 Starting Pinterest Bot...\n');
    
    await this.authenticate();
    
    // Create/get boards
    const boardIds = [];
    for (const boardName of this.boards.slice(0, 3)) { // Use 3 main boards
      const boardId = await this.createBoard(boardName);
      if (boardId) {
        boardIds.push(boardId);
      }
      await this.sleep(2000); // Small delay between board creations
    }
    
    if (boardIds.length === 0) {
      console.error('❌ No boards available to pin to!');
      return;
    }
    
    // Pin movies (3-5 pins per run to avoid spam)
    const pinsToCreate = 3 + Math.floor(Math.random() * 3);
    const shuffledMovies = this.movies.sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < pinsToCreate && i < shuffledMovies.length; i++) {
      const movie = shuffledMovies[i];
      const randomBoard = boardIds[Math.floor(Math.random() * boardIds.length)];
      
      await this.createPin(movie, randomBoard);
      
      // Wait 10-20 minutes between pins (Pinterest limits)
      const delay = (10 + Math.random() * 10) * 60 * 1000;
      console.log(`⏰ Waiting ${Math.round(delay/60000)} minutes before next pin...\n`);
      await this.sleep(delay);
    }
    
    console.log('✅ Pinterest Bot cycle complete!\n');
  }
  
  // Log successful pins
  logSuccess(movieTitle, pinId, boardId) {
    const log = {
      timestamp: new Date().toISOString(),
      platform: 'Pinterest',
      movie: movieTitle,
      pinId: pinId,
      boardId: boardId,
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

module.exports = PinterestBot;
