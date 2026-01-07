const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function BrowserBars({ browsers }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Browsers</h3>
      <div className="space-y-3">
        {browsers.map((browser, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-900 dark:text-gray-200 truncate mr-2">
                {browser.name}
              </span>
              <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
                {browser.count}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full transition-all" 
                style={{ 
                  width: `${Math.min(100, browser.percentage)}%`, 
                  backgroundColor: COLORS[idx % COLORS.length] 
                }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}