import { useMemo } from 'react';

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with','by','is','are',
  'was','were','be','been','being','have','has','had','do','does','did','will','would',
  'could','should','may','might','shall','can','need','from','as','into','through',
  'this','that','these','those','it','its','he','she','they','we','you','i','his','her',
  'their','our','your','my','news','says','new','after','over','about','more','than',
  'how','what','when','where','why','who','which','first','last','year','years',
]);

function extractKeywords(articles) {
  const freq = {};
  articles.forEach(a => {
    const words = a.title
      .toLowerCase()
      .replace(/[^a-z\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 4 && !STOP_WORDS.has(w));
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  });

  return Object.entries(freq)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}

export default function TrendingSection({ articles, onSearch }) {
  const keywords = useMemo(() => extractKeywords(articles), [articles]);

  if (!keywords.length) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Trending
        </span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.map(kw => (
          <button
            key={kw}
            onClick={() => onSearch(kw)}
            className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            #{kw}
          </button>
        ))}
      </div>
    </div>
  );
}
