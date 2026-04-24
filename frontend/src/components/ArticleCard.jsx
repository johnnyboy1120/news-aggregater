import { useState } from 'react';

const CATEGORY_COLORS = {
  ai:          'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  technology:  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  science:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  politics:    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  environment: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  finance:     'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  weather:     'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  wars:        'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

const BIAS_LABELS = {
  left:   { label: 'Left',   classes: 'bg-blue-500' },
  center: { label: 'Center', classes: 'bg-green-500' },
  right:  { label: 'Right',  classes: 'bg-red-500' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function getDomain(url) {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return ''; }
}

export default function ArticleCard({ article, onBookmark, isBookmarked, featured }) {
  const [imgError, setImgError] = useState(false);
  const bookmarked = isBookmarked(article.url);
  const domain = getDomain(article.url);
  const biasInfo = article.bias ? BIAS_LABELS[article.bias] : null;

  return (
    <article
      className={`group bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-200 flex flex-col animate-fade-in ${
        featured ? 'md:flex-row' : ''
      }`}
    >
      {/* Thumbnail */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block overflow-hidden flex-shrink-0 ${
          featured ? 'md:w-72 md:h-auto h-48' : 'h-44'
        } bg-gray-100 dark:bg-gray-800`}
      >
        {!imgError && article.image ? (
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
            {article.category === 'ai' ? '🤖' :
             article.category === 'technology' ? '💻' :
             article.category === 'science' ? '🔬' :
             article.category === 'politics' ? '🏛️' :
             article.category === 'environment' ? '🌿' :
             article.category === 'finance' ? '📈' :
             article.category === 'weather' ? '🌤️' : '🌍'}
          </div>
        )}
      </a>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category + Bias badges */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.category] || 'bg-gray-100 text-gray-600'}`}>
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </span>
          {biasInfo && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${biasInfo.classes}`}>
              {biasInfo.label}
            </span>
          )}
        </div>

        {/* Title */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
        >
          <h2 className={`font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 ${featured ? 'text-lg' : 'text-sm'}`}>
            {article.title}
          </h2>
        </a>

        {/* Description */}
        {article.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
            {article.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1.5 min-w-0">
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
              alt=""
              className="w-4 h-4 rounded-sm flex-shrink-0"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium">
              {article.source}
            </span>
            <span className="text-gray-300 dark:text-gray-700 text-xs">·</span>
            <time className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
              {timeAgo(article.timestamp)}
            </time>
          </div>

          {/* Bookmark button */}
          <button
            onClick={e => { e.stopPropagation(); onBookmark(article); }}
            className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
              bookmarked
                ? 'text-blue-500 hover:text-blue-600'
                : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400'
            }`}
            title={bookmarked ? 'Remove bookmark' : 'Save article'}
          >
            <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
