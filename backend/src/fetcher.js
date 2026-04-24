const Parser = require('rss-parser');
const NodeCache = require('node-cache');
const { FEEDS, DEFAULT_IMAGES } = require('./feeds');

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // 10-min TTL

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['media:group', 'mediaGroup'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
  timeout: 12000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0; +https://newsagg.vercel.app)',
    Accept: 'application/rss+xml, application/atom+xml, text/xml, */*',
  },
});

// ── Image extraction ──────────────────────────────────────────────────────────

function extractImage(item) {
  // media:content
  if (item.mediaContent) {
    const mc = Array.isArray(item.mediaContent) ? item.mediaContent[0] : item.mediaContent;
    if (mc && mc.$ && mc.$.url) return mc.$.url;
    if (mc && mc.url) return mc.url;
  }

  // media:thumbnail
  if (item.mediaThumbnail) {
    const mt = Array.isArray(item.mediaThumbnail) ? item.mediaThumbnail[0] : item.mediaThumbnail;
    if (mt && mt.$ && mt.$.url) return mt.$.url;
    if (mt && mt.url) return mt.url;
  }

  // enclosure (podcasts / images)
  if (item.enclosure && item.enclosure.type && item.enclosure.type.startsWith('image/')) {
    return item.enclosure.url;
  }

  // Scan content:encoded or content for first <img>
  const htmlSource = item.contentEncoded || item.content || item['content:encoded'] || '';
  const imgMatch = htmlSource.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];

  return null;
}

// ── HTML stripping ────────────────────────────────────────────────────────────

function stripHtml(html = '') {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Normalize one RSS item into our schema ────────────────────────────────────

function normalizeArticle(item, feedMeta) {
  const url = item.link || item.guid || '';
  if (!url) return null;

  const image =
    extractImage(item) ||
    (feedMeta.defaultImage || DEFAULT_IMAGES[feedMeta.category]);

  const raw = item.contentSnippet || item.content || item.summary || '';
  const description = stripHtml(raw).slice(0, 280);

  return {
    id: Buffer.from(url).toString('base64').slice(0, 20),
    title: stripHtml(item.title || '').slice(0, 200),
    source: feedMeta.sourceName,
    url,
    image,
    category: feedMeta.category,
    bias: feedMeta.bias || null,
    timestamp: item.isoDate || item.pubDate || new Date().toISOString(),
    description,
  };
}

// ── Fetch a single feed ───────────────────────────────────────────────────────

async function fetchFeed(feedMeta) {
  try {
    const feed = await parser.parseURL(feedMeta.url);
    const articles = (feed.items || [])
      .slice(0, 15)
      .map(item => normalizeArticle(item, feedMeta))
      .filter(Boolean);
    return articles;
  } catch (err) {
    console.warn(`[feed] Failed ${feedMeta.sourceName}: ${err.message}`);
    return [];
  }
}

// ── Deduplication by URL ──────────────────────────────────────────────────────

function deduplicate(articles) {
  const seen = new Set();
  return articles.filter(a => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });
}

// ── Sort by timestamp (newest first) ─────────────────────────────────────────

function sortByDate(articles) {
  return articles.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// ── Public API ────────────────────────────────────────────────────────────────

async function fetchAllFeeds() {
  const CACHE_KEY = 'all';
  const cached = cache.get(CACHE_KEY);
  if (cached) return cached;

  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  const articles = deduplicate(
    sortByDate(results.flatMap(r => (r.status === 'fulfilled' ? r.value : [])))
  );

  cache.set(CACHE_KEY, articles);
  return articles;
}

async function fetchFeedsByCategory(category, bias) {
  const CACHE_KEY = `${category}:${bias || 'all'}`;
  const cached = cache.get(CACHE_KEY);
  if (cached) return cached;

  const feeds = FEEDS.filter(f => {
    if (f.category !== category) return false;
    if (bias && bias !== 'all') return f.bias === bias;
    return true;
  });

  if (!feeds.length) return [];

  const results = await Promise.allSettled(feeds.map(fetchFeed));
  const articles = deduplicate(
    sortByDate(results.flatMap(r => (r.status === 'fulfilled' ? r.value : [])))
  );

  cache.set(CACHE_KEY, articles);
  return articles;
}

// Pre-warm cache on startup and every 10 minutes
async function warmCache() {
  console.log('[cache] Warming cache...');
  try {
    await fetchAllFeeds();
    console.log('[cache] Done.');
  } catch (e) {
    console.error('[cache] Warm failed:', e.message);
  }
}

module.exports = { fetchAllFeeds, fetchFeedsByCategory, warmCache };
