const NodeCache = require('node-cache');

const quoteCache  = new NodeCache({ stdTTL: 60 });   // 1-min cache
const searchCache = new NodeCache({ stdTTL: 300 });  // 5-min cache

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json',
};

// Fetch a single symbol via the v8 chart API
async function fetchOne(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${symbol}: HTTP ${res.status}`);
  const data = await res.json();
  const meta = data.chart?.result?.[0]?.meta;
  if (!meta) throw new Error(`${symbol}: no data`);

  const price    = meta.regularMarketPrice ?? null;
  const prevClose = meta.chartPreviousClose ?? null;
  const change   = price !== null && prevClose ? price - prevClose : null;
  const changePct = change !== null && prevClose ? (change / prevClose) * 100 : null;

  return {
    symbol: meta.symbol,
    name: meta.shortName || meta.longName || meta.symbol,
    price,
    change,
    changePercent: changePct,
    dayHigh: meta.regularMarketDayHigh ?? null,
    dayLow:  meta.regularMarketDayLow  ?? null,
    currency: meta.currency || 'USD',
    exchange: meta.fullExchangeName || meta.exchangeName || '',
  };
}

// Fetch multiple symbols in parallel, fail-safe per symbol
async function fetchQuotes(symbols) {
  const results = [];
  await Promise.allSettled(
    symbols.map(async sym => {
      const key = `q:${sym}`;
      const cached = quoteCache.get(key);
      if (cached) { results.push(cached); return; }
      try {
        const q = await fetchOne(sym);
        quoteCache.set(key, q);
        results.push(q);
      } catch (e) {
        console.warn('[stocks]', e.message);
      }
    })
  );
  // Preserve watchlist order
  const map = Object.fromEntries(results.map(r => [r.symbol, r]));
  return symbols.map(s => map[s]).filter(Boolean);
}

// Search Yahoo Finance for symbols
async function searchSymbols(query) {
  const key = `s:${query.toLowerCase()}`;
  const cached = searchCache.get(key);
  if (cached) return cached;

  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0&listsCount=0`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return [];

  const data = await res.json();
  const results = (data.quotes || [])
    .filter(q => ['EQUITY', 'CRYPTOCURRENCY', 'ETF', 'INDEX'].includes(q.quoteType))
    .slice(0, 8)
    .map(q => ({
      symbol:   q.symbol,
      name:     q.shortname || q.longname || q.symbol,
      exchange: q.exchange || '',
      type:     q.quoteType || '',
    }));

  searchCache.set(key, results);
  return results;
}

module.exports = { fetchQuotes, searchSymbols };
