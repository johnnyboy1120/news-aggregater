function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="h-44 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="h-3 bg-gray-100 dark:bg-gray-800/60 rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-800/60 rounded animate-pulse" />
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
