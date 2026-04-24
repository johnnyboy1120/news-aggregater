import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export function useNews(category, bias) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchNews = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const url =
        category === 'all'
          ? `${API_BASE}/api/news`
          : `${API_BASE}/api/news/${category}${bias && bias !== 'all' ? `?bias=${bias}` : ''}`;

      const res = await fetch(url, {
        signal: abortRef.current.signal,
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to load news');
      }
    } finally {
      setLoading(false);
    }
  }, [category, bias]);

  useEffect(() => {
    fetchNews();
    return () => abortRef.current?.abort();
  }, [fetchNews]);

  return { articles, loading, error, refetch: fetchNews };
}
