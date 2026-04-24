import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import ArticleGrid from './components/ArticleGrid';
import PoliticsFilter from './components/PoliticsFilter';
import TrendingSection from './components/TrendingSection';
import BookmarksList from './components/BookmarksList';
import { useNews } from './hooks/useNews';
import { useBookmarks } from './hooks/useBookmarks';

export const CATEGORIES = [
  { id: 'all',         label: 'Top Stories',  emoji: '🌐', color: 'text-blue-500' },
  { id: 'ai',          label: 'AI',            emoji: '🤖', color: 'text-purple-500' },
  { id: 'technology',  label: 'Technology',    emoji: '💻', color: 'text-blue-500' },
  { id: 'science',     label: 'Science',       emoji: '🔬', color: 'text-emerald-500' },
  { id: 'politics',    label: 'Politics',      emoji: '🏛️', color: 'text-red-500' },
  { id: 'environment', label: 'Environment',   emoji: '🌿', color: 'text-green-500' },
  { id: 'finance',     label: 'Finance',       emoji: '📈', color: 'text-amber-500' },
  { id: 'weather',     label: 'Weather',       emoji: '🌤️', color: 'text-sky-500' },
  { id: 'wars',        label: 'World Affairs', emoji: '🌍', color: 'text-rose-600' },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('pulse_dark');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery]         = useState('');
  const [bias, setBias]                       = useState('all');
  const [showBookmarks, setShowBookmarks]     = useState(false);
  const [visibleCount, setVisibleCount]       = useState(24);

  const { articles, loading, error, refetch } = useNews(activeCategory, bias);
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('pulse_dark', String(darkMode));
  }, [darkMode]);

  // Reset pagination when category/bias/search changes
  useEffect(() => { setVisibleCount(24); }, [activeCategory, bias, searchQuery]);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q)
    );
  }, [articles, searchQuery]);

  const displayedArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  function handleCategoryChange(cat) {
    setActiveCategory(cat);
    setSearchQuery('');
    setBias('all');
    setShowBookmarks(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        bookmarkCount={bookmarks.length}
        showBookmarks={showBookmarks}
        onToggleBookmarks={() => setShowBookmarks(s => !s)}
      />

      <CategoryNav
        categories={CATEGORIES}
        active={activeCategory}
        onChange={handleCategoryChange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeCategory === 'politics' && !showBookmarks && (
          <PoliticsFilter bias={bias} onChange={setBias} />
        )}

        {!showBookmarks && !searchQuery && articles.length > 0 && (
          <TrendingSection articles={articles} onSearch={setSearchQuery} />
        )}

        {showBookmarks ? (
          <BookmarksList bookmarks={bookmarks} onRemove={toggleBookmark} />
        ) : (
          <ArticleGrid
            articles={displayedArticles}
            loading={loading}
            error={error}
            onRetry={refetch}
            onBookmark={toggleBookmark}
            isBookmarked={isBookmarked}
            hasMore={hasMore}
            onLoadMore={() => setVisibleCount(n => n + 24)}
          />
        )}
      </main>
    </div>
  );
}
