import { useState, useCallback } from 'react';

const KEY = 'pulse_watchlist';
const DEFAULTS = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'BTC-USD', 'SPY'];

function load() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function useWatchlist() {
  const [symbols, setSymbols] = useState(load);

  const persist = (next) => {
    setSymbols(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const addSymbol = useCallback((symbol) => {
    setSymbols(prev => {
      if (prev.includes(symbol)) return prev;
      const next = [...prev, symbol];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeSymbol = useCallback((symbol) => {
    setSymbols(prev => {
      const next = prev.filter(s => s !== symbol);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const resetToDefaults = useCallback(() => persist(DEFAULTS), []);

  return { symbols, addSymbol, removeSymbol, resetToDefaults };
}
