import ArticleCard from './ArticleCard';

export default function BookmarksList({ bookmarks, onRemove }) {
  if (!bookmarks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <span className="text-5xl">🔖</span>
        <p className="text-gray-900 dark:text-gray-100 font-semibold">No saved articles yet</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tap the bookmark icon on any article to save it here
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Saved Articles
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({bookmarks.length})
          </span>
        </h2>
        <button
          onClick={() => {
            if (window.confirm('Clear all saved articles?')) {
              bookmarks.forEach(b => onRemove(b));
            }
          }}
          className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {bookmarks.map(article => (
          <ArticleCard
            key={article.url}
            article={article}
            onBookmark={onRemove}
            isBookmarked={() => true}
          />
        ))}
      </div>
    </div>
  );
}
