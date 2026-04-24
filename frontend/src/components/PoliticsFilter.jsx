const OPTIONS = [
  { value: 'all',    label: 'All',     color: 'text-gray-600 dark:text-gray-400' },
  { value: 'left',   label: '⬅ Left',  color: 'text-blue-600 dark:text-blue-400' },
  { value: 'center', label: '⚖ Center', color: 'text-green-600 dark:text-green-400' },
  { value: 'right',  label: 'Right ➡', color: 'text-red-600 dark:text-red-400' },
];

export default function PoliticsFilter({ bias, onChange }) {
  return (
    <div className="mb-5 flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mr-1">
        Source Bias:
      </span>
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
            bias === opt.value
              ? 'border-current bg-white dark:bg-gray-900 shadow-sm ' + opt.color
              : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
