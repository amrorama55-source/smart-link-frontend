const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function BrowserBars({ browsers }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
        Browsers
      </h3>

      {browsers && browsers.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {browsers.map((browser, idx) => (
            <div key={idx}>
              {/* Label Row */}
              <div className="flex justify-between items-baseline text-xs sm:text-sm mb-1.5 sm:mb-2">
                <span className="font-medium text-gray-900 dark:text-gray-200 truncate mr-2">
                  {browser.name}
                </span>
                <div className="flex items-baseline gap-2 flex-shrink-0">
                  <span className="text-gray-500 dark:text-gray-400 font-bold">
                    {browser.count}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    ({browser.percentage}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(100, parseFloat(browser.percentage))}%`,
                    backgroundColor: COLORS[idx % COLORS.length]
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400 text-sm">
          No browser data available
        </div>
      )}
    </div>
  );
}