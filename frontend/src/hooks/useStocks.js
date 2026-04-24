import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export function useStocks(symbols) {
  const [quotes, setQuotes]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const symbolKey = symbols.join(',');
  const timerRef = useRef(null);

  const fetchStocks = useCallback(async () => {
    if (!symbols.length) { setLoading(false); return; }
    try {
      const res = await fetch(`${API_BASE}/api/stocks?symbols=${symbolKey}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setQuotes(data.quotes || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [symbolKey]);

  useEffect(() => {
    fetchStocks();
    timerRef.current = setInterval(fetchStocks, 60_000);
    return () => clearInterval(timerRef.current);
  }, [fetchStocks]);

  return { quotes, loading, error, lastUpdated, refetch: fetchStocks };
}
