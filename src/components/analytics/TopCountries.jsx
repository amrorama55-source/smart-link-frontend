export default function TopCountries({ countries }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Countries</h3>
      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
        {countries.slice(0, 10).map((country, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="text-base font-bold text-gray-400 dark:text-gray-500 flex-shrink-0">
                #{idx + 1}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                {country.name}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
              <div className="w-20 sm:w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${Math.min(100, country.percentage)}%` }} 
                />
              </div>
              <span className="text-sm font-bold text-blue-600 w-10 text-right">
                {country.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}