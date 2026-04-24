import { useState } from 'react';
import { useStocks } from '../hooks/useStocks';
import { useWatchlist } from '../hooks/useWatchlist';
import StockSearch from './StockSearch';

function fmt(price, currency) {
  if (price === null || price === undefined) return '—';
  const n = Number(price);
  if (currency === 'BTC' || n > 10000)
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (n >= 1000) return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + n.toFixed(2);
}

function StockRow({ quote, onRemove }) {
  const [hovered, setHovered] = useState(false);
  const up = quote.change !== null && quote.change >= 0;
  const sign = quote.change !== null && quote.change >= 0 ? '+' : '';
  const changePct = quote.changePercent !== null
    ? `${sign}${Number(quote.changePercent).toFixed(2)}%`
    : null;
  const changeAbs = quote.change !== null
    ? `${sign}${Math.abs(quote.change) < 10 ? Number(quote.change).toFixed(2) : Number(quote.change).toFixed(0)}`
    : null;

  return (
    <div
      className="relative flex items-center justify-between px-3 py-2.5 border-b border-gray-100 dark:border-gray-800/70 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left: symbol + name */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">{quote.symbol}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5 max-w-[100px]">{quote.name}</p>
      </div>

      {/* Right: price + change */}
      <div className="text-right flex-shrink-0 ml-2">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-none tabular-nums">
          {fmt(quote.price, quote.currency)}
        </p>
        {changePct && (
          <p className={`text-xs font-medium mt-0.5 tabular-nums ${up ? 'text-emerald-500' : 'text-red-500'}`}>
            {up ? '▲' : '▼'} {changeAbs} ({changePct})
          </p>
        )}
      </div>

      {/* Remove button — appears on hover */}
      {hovered && (
        <button
          onClick={() => onRemove(quote.symbol)}
          title={`Remove ${quote.symbol}`}
          className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-500 transition-colors text-xs leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}

// Mobile: exported horizontal scrolling strip with its own data
export function MobileStockStrip() {
  const { symbols } = useWatchlist();
  const { quotes, loading } = useStocks(symbols);
  return (
    <div className="lg:hidden -mx-4 sm:-mx-6 px-4 mb-4 border-b border-gray-200 dark:border-gray-800 pb-3 bg-white dark:bg-gray-950">
      <MobileStripInner quotes={quotes} loading={loading} />
    </div>
  );
}

function MobileStripInner({ quotes, loading }) {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-shrink-0 h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-2">
      {quotes.map(q => {
        const up = q.change !== null && q.change >= 0;
        const pct = q.changePercent !== null ? `${up ? '+' : ''}${Number(q.changePercent).toFixed(2)}%` : null;
        return (
          <div
            key={q.symbol}
            className="flex-shrink-0 flex flex-col items-center px-3 py-1.5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 min-w-[80px]"
          >
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{q.symbol}</span>
            <span className="text-xs text-gray-700 dark:text-gray-300 tabular-nums">{fmt(q.price, q.currency)}</span>
            {pct && (
              <span className={`text-xs font-medium tabular-nums ${up ? 'text-emerald-500' : 'text-red-500'}`}>
                {up ? '▲' : '▼'} {pct}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function StockBar({ mobileOnly } = {}) {
  const { symbols, addSymbol, removeSymbol, resetToDefaults } = useWatchlist();
  const { quotes, loading, error, lastUpdated } = useStocks(symbols);
  const [showSearch, setShowSearch] = useState(false);

  const quoteMap = Object.fromEntries(quotes.map(q => [q.symbol, q]));

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 self-start sticky top-28">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Markets</span>
              {lastUpdated && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowSearch(true)}
              className="w-6 h-6 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors font-bold text-base leading-none"
              title="Add stock"
            >
              +
            </button>
          </div>

          {/* Stock list */}
          <div className="max-h-[65vh] overflow-y-auto scrollbar-hide">
            {loading && (
              <div className="p-3 space-y-3">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="space-y-1.5">
                      <div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-2 w-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                    </div>
                    <div className="space-y-1.5 text-right">
                      <div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-2 w-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && !loading && (
              <div className="p-4 text-center">
                <p className="text-xs text-red-400">Market data unavailable</p>
              </div>
            )}

            {!loading && !error && symbols.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-xs text-gray-400">No stocks pinned</p>
                <button onClick={resetToDefaults} className="mt-2 text-xs text-blue-500 hover:underline">
                  Reset to defaults
                </button>
              </div>
            )}

            {!loading && symbols.map(sym => {
              const q = quoteMap[sym];
              if (!q) return null;
              return <StockRow key={sym} quote={q} onRemove={removeSymbol} />;
            })}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-400">Delayed ~15 min</p>
            <p className="text-xs text-gray-400">Yahoo Finance</p>
          </div>
        </div>
      </aside>

      {/* Search modal */}
      {showSearch && (
        <StockSearch
          watchlist={symbols}
          onAdd={addSymbol}
          onClose={() => setShowSearch(false)}
        />
      )}
    </>
  );
}
