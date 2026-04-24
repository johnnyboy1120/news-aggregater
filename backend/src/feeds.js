const CATEGORIES = {
  AI: 'ai',
  TECHNOLOGY: 'technology',
  SCIENCE: 'science',
  POLITICS: 'politics',
  ENVIRONMENT: 'environment',
  FINANCE: 'finance',
  WEATHER: 'weather',
  WARS: 'wars',
};

const BIAS = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
};

const DEFAULT_IMAGES = {
  ai: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
  science: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&q=80',
  politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=80',
  environment: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
  finance: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
  weather: 'https://images.unsplash.com/photo-1504608524841-42584120d693?w=600&q=80',
  wars: 'https://images.unsplash.com/photo-1586290786622-ce5e8eba1d72?w=600&q=80',
};

const FEEDS = [
  // ── AI ──────────────────────────────────────────────────────────────────────
  { url: 'https://venturebeat.com/category/ai/feed/', sourceName: 'VentureBeat AI', category: CATEGORIES.AI },
  { url: 'https://www.technologyreview.com/feed/', sourceName: 'MIT Technology Review', category: CATEGORIES.AI },
  { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', sourceName: 'The Verge AI', category: CATEGORIES.AI },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', sourceName: 'Ars Technica', category: CATEGORIES.AI },
  { url: 'https://openai.com/blog/rss.xml', sourceName: 'OpenAI Blog', category: CATEGORIES.AI },

  // ── TECHNOLOGY ───────────────────────────────────────────────────────────────
  { url: 'https://techcrunch.com/feed/', sourceName: 'TechCrunch', category: CATEGORIES.TECHNOLOGY },
  { url: 'https://www.wired.com/feed/rss', sourceName: 'Wired', category: CATEGORIES.TECHNOLOGY },
  { url: 'https://www.theverge.com/rss/index.xml', sourceName: 'The Verge', category: CATEGORIES.TECHNOLOGY },
  { url: 'https://www.zdnet.com/news/rss.xml', sourceName: 'ZDNet', category: CATEGORIES.TECHNOLOGY },
  { url: 'https://9to5mac.com/feed/', sourceName: '9to5Mac', category: CATEGORIES.TECHNOLOGY },

  // ── SCIENCE ──────────────────────────────────────────────────────────────────
  { url: 'https://www.sciencedaily.com/rss/all.xml', sourceName: 'Science Daily', category: CATEGORIES.SCIENCE },
  { url: 'https://rss.sciam.com/ScientificAmerican-Global', sourceName: 'Scientific American', category: CATEGORIES.SCIENCE },
  { url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', sourceName: 'NASA', category: CATEGORIES.SCIENCE },
  { url: 'https://www.newscientist.com/feed/home/', sourceName: 'New Scientist', category: CATEGORIES.SCIENCE },
  { url: 'https://phys.org/rss-feed/', sourceName: 'Phys.org', category: CATEGORIES.SCIENCE },

  // ── POLITICS — LEFT ──────────────────────────────────────────────────────────
  { url: 'https://www.theguardian.com/us-news/rss', sourceName: 'The Guardian', category: CATEGORIES.POLITICS, bias: BIAS.LEFT },
  { url: 'https://www.theguardian.com/politics/rss', sourceName: 'The Guardian Politics', category: CATEGORIES.POLITICS, bias: BIAS.LEFT },
  { url: 'https://www.vox.com/rss/index.xml', sourceName: 'Vox', category: CATEGORIES.POLITICS, bias: BIAS.LEFT },

  // ── POLITICS — CENTER ────────────────────────────────────────────────────────
  { url: 'https://feeds.npr.org/1014/rss.xml', sourceName: 'NPR Politics', category: CATEGORIES.POLITICS, bias: BIAS.CENTER },
  { url: 'https://feeds.npr.org/1001/rss.xml', sourceName: 'NPR News', category: CATEGORIES.POLITICS, bias: BIAS.CENTER },
  { url: 'https://abcnews.go.com/abcnews/politicsheadlines', sourceName: 'ABC News Politics', category: CATEGORIES.POLITICS, bias: BIAS.CENTER },
  { url: 'https://www.pbs.org/newshour/feeds/rss/politics', sourceName: 'PBS NewsHour', category: CATEGORIES.POLITICS, bias: BIAS.CENTER },

  // ── POLITICS — RIGHT ─────────────────────────────────────────────────────────
  { url: 'https://moxie.foxnews.com/google-publisher/politics.xml', sourceName: 'Fox News Politics', category: CATEGORIES.POLITICS, bias: BIAS.RIGHT },
  { url: 'https://nypost.com/politics/feed/', sourceName: 'New York Post', category: CATEGORIES.POLITICS, bias: BIAS.RIGHT },
  { url: 'https://feeds.feedburner.com/breitbart', sourceName: 'Breitbart', category: CATEGORIES.POLITICS, bias: BIAS.RIGHT },

  // ── FINANCE ──────────────────────────────────────────────────────────────────
  { url: 'https://finance.yahoo.com/news/rssindex', sourceName: 'Yahoo Finance', category: CATEGORIES.FINANCE },
  { url: 'https://feeds.marketwatch.com/marketwatch/topstories/', sourceName: 'MarketWatch', category: CATEGORIES.FINANCE },
  { url: 'https://www.investing.com/rss/news.rss', sourceName: 'Investing.com', category: CATEGORIES.FINANCE },
  { url: 'https://feeds.marketwatch.com/marketwatch/marketpulse/', sourceName: 'MarketWatch Pulse', category: CATEGORIES.FINANCE },

  // ── ENVIRONMENT ──────────────────────────────────────────────────────────────
  { url: 'https://insideclimatenews.org/feed/', sourceName: 'Inside Climate News', category: CATEGORIES.ENVIRONMENT },
  { url: 'https://www.sciencedaily.com/rss/earth_climate.xml', sourceName: 'Science Daily — Environment', category: CATEGORIES.ENVIRONMENT },
  { url: 'https://e360.yale.edu/rss.xml', sourceName: 'Yale Environment 360', category: CATEGORIES.ENVIRONMENT },
  { url: 'https://www.theguardian.com/environment/rss', sourceName: 'Guardian Environment', category: CATEGORIES.ENVIRONMENT },

  // ── WEATHER ──────────────────────────────────────────────────────────────────
  // Weather RSS is notoriously hard to aggregate from free sources; we pull from
  // reputable science/environment publishers that cover weather events.
  { url: 'https://www.sciencedaily.com/rss/earth_climate/weather.xml', sourceName: 'Science Daily Weather', category: CATEGORIES.WEATHER },
  { url: 'https://phys.org/rss-feed/earth-news/weather-climate/', sourceName: 'Phys.org Weather', category: CATEGORIES.WEATHER },
  { url: 'https://earthobservatory.nasa.gov/feeds/earth-observatory.rss', sourceName: 'NASA Earth Observatory', category: CATEGORIES.WEATHER },

  // ── WARS / WORLD AFFAIRS ─────────────────────────────────────────────────────
  { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', sourceName: 'BBC World News', category: CATEGORIES.WARS },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', sourceName: 'Al Jazeera', category: CATEGORIES.WARS },
  { url: 'https://www.france24.com/en/rss', sourceName: 'France 24', category: CATEGORIES.WARS },
  { url: 'https://feeds.feedburner.com/timesonline/world', sourceName: 'The Times World', category: CATEGORIES.WARS },
];

module.exports = { FEEDS, CATEGORIES, BIAS, DEFAULT_IMAGES };
