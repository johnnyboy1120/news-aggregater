const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { fetchAllFeeds, fetchFeedsByCategory, warmCache } = require('./fetcher');
const { fetchQuotes, searchSymbols } = require('./stocks');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? [process.env.FRONTEND_URL, /\.vercel\.app$/, 'http://localhost:5173']
      : true,
    methods: ['GET'],
    maxAge: 86400,
  })
);
app.use(express.json());

// ── Rate limiting ─────────────────────────────────────────────────────────────

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ── Routes ────────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/news', async (_req, res) => {
  try {
    const articles = await fetchAllFeeds();
    res.json({ articles, count: articles.length });
  } catch (err) {
    console.error('[/api/news]', err.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.get('/api/news/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { bias } = req.query;
    const articles = await fetchFeedsByCategory(category, bias);
    res.json({ articles, count: articles.length, category, bias: bias || 'all' });
  } catch (err) {
    console.error(`[/api/news/${req.params.category}]`, err.message);
    res.status(500).json({ error: 'Failed to fetch category news' });
  }
});

// ── Stocks ────────────────────────────────────────────────────────────────────

const DEFAULT_SYMBOLS = ['AAPL','MSFT','GOOGL','AMZN','TSLA','NVDA','META','SPY','BTC-USD','ETH-USD'];

app.get('/api/stocks', async (req, res) => {
  try {
    const symbols = (req.query.symbols || '')
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean)
      .slice(0, 30);
    const quotes = await fetchQuotes(symbols.length ? symbols : DEFAULT_SYMBOLS);
    res.json({ quotes, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error('[/api/stocks]', err.message);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.get('/api/stocks/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 1) return res.json({ results: [] });
    const results = await searchSymbols(q.trim());
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── 404 ───────────────────────────────────────────────────────────────────────

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, async () => {
  console.log(`News Aggregator API running on port ${PORT}`);
  warmCache();
  setInterval(warmCache, 10 * 60 * 1000); // refresh every 10 min
});
