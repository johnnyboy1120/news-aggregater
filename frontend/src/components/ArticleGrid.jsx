import ArticleCard from './ArticleCard';
import LoadingSkeleton from './LoadingSkeleton';

export default function ArticleGrid({
  articles,
  loading,
  error,
  onRetry,
  onBookmark,
  isBookmarked,
  hasMore,
  onLoadMore,
}) {
  if (loading) return <LoadingSkeleton count={12} />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-gray-900 dark:text-gray-100 font-semibold">Failed to load news</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            The server may be waking up (free tier). Try again in a few seconds.
          </p>
        </div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <span className="text-5xl">📰</span>
        <p className="text-gray-900 dark:text-gray-100 font-semibold">No articles found</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Try a different category or search term</p>
      </div>
    );
  }

  const [featured, ...rest] = articles;

  return (
    <div className="animate-fade-in">
      {/* Featured article — full width on mobile, 2-col on desktop */}
      <div className="mb-4">
        <ArticleCard
          article={featured}
          onBookmark={onBookmark}
          isBookmarked={isBookmarked}
          featured
        />
      </div>

      {/* Regular grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rest.map(article => (
          <ArticleCard
            key={article.id || article.url}
            article={article}
            onBookmark={onBookmark}
            isBookmarked={isBookmarked}
          />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full text-sm font-medium transition-all shadow-sm"
          >
            Load more articles
          </button>
        </div>
      )}
    </div>
  );
}
