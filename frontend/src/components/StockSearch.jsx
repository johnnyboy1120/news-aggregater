import { useState, useEffect, useRef } from 'react';

const POPULAR = [
  { symbol: 'AAPL',   name: 'Apple Inc.' },
  { symbol: 'MSFT',   name: 'Microsoft Corp.' },
  { symbol: 'GOOGL',  name: 'Alphabet Inc.' },
  { symbol: 'AMZN',   name: 'Amazon.com Inc.' },
  { symbol: 'TSLA',   name: 'Tesla Inc.' },
  { symbol: 'META',   name: 'Meta Platforms' },
  { symbol: 'NVDA',   name: 'NVIDIA Corp.' },
  { symbol: 'SPY',    name: 'S&P 500 ETF' },
  { symbol: 'QQQ',    name: 'Nasdaq 100 ETF' },
  { symbol: 'DIA',    name: 'Dow Jones ETF' },
  { symbol: 'BTC-USD',name: 'Bitcoin' },
  { symbol: 'ETH-USD',name: 'Ethereum' },
  { symbol: 'JPM',    name: 'JPMorgan Chase' },
  { symbol: 'V',      name: 'Visa Inc.' },
  { symbol: 'BAC',    name: 'Bank of America' },
  { symbol: 'NFLX',   name: 'Netflix Inc.' },
  { symbol: 'AMD',    name: 'Advanced Micro Devices' },
  { symbol: 'INTC',   name: 'Intel Corp.' },
  { symbol: 'GLD',    name: 'Gold ETF (SPDR)' },
  { symbol: 'WMT',    name: 'Walmart Inc.' },
  { symbol: 'DIS',    name: 'Walt Disney Co.' },
  { symbol: 'UBER',   name: 'Uber Technologies' },
  { symbol: 'PLTR',   name: 'Palantir Technologies' },
  { symbol: 'COIN',   name: 'Coinbase Global' },
];

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function StockSearch({ watchlist, onAdd, onClose }) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState(POPULAR);
  const [searching, setSearching] = useState(false);
  const inputRef  = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults(POPULAR);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`${API_BASE}/api/stocks/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(
          data.results?.length
            ? data.results
            : POPULAR.filter(
                p =>
                  p.symbol.includes(query.toUpperCase()) ||
                  p.name.toLowerCase().includes(query.toLowerCase())
              )
        );
      } catch {
        setResults(
          POPULAR.filter(
            p =>
              p.symbol.includes(query.toUpperCase()) ||
              p.name.toLowerCase().includes(query.toLowerCase())
          )
        );
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [query]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">Add to Watchlist</h3>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search symbol or company…"
            className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto scrollbar-hide">
          {searching && (
            <p className="p-4 text-center text-sm text-gray-400">Searching…</p>
          )}

          {!searching && results.map(stock => {
            const inWatchlist = watchlist.includes(stock.symbol);
            return (
              <button
                key={stock.symbol}
                onClick={() => { if (!inWatchlist) { onAdd(stock.symbol); onClose(); } }}
                disabled={inWatchlist}
                className={`w-full flex items-center justify-between px-4 py-3 text-left border-b border-gray-50 dark:border-gray-800/50 transition-colors ${
                  inWatchlist
                    ? 'opacity-40 cursor-default'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
                }`}
              >
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{stock.symbol}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stock.name}</p>
                </div>
                {inWatchlist ? (
                  <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">Added</span>
                ) : (
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">+ Pin</span>
                )}
              </button>
            );
          })}

          {!searching && !results.length && (
            <p className="p-4 text-center text-sm text-gray-400">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}
