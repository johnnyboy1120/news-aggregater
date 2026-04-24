import { useState, useCallback } from 'react';

const STORAGE_KEY = 'pulse_bookmarks';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(load);

  const toggleBookmark = useCallback((article) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.url === article.url);
      const next = exists
        ? prev.filter(b => b.url !== article.url)
        : [{ ...article, savedAt: new Date().toISOString() }, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (url) => bookmarks.some(b => b.url === url),
    [bookmarks]
  );

  return { bookmarks, toggleBookmark, isBookmarked };
}
