import { Globe } from 'lucide-react';

export default function TopCountries({ countries }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Countries</h3>
      <div className="space-y-3">
        {countries && countries.length > 0 ? (
          countries.slice(0, 5).map((country, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 dark:from-indigo-900/30 to-transparent rounded-lg border border-indigo-100 dark:border-indigo-900/50"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs shrink-0">
                  #{idx + 1}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-200 truncate">
                    {country.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-16 sm:w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${Math.min(100, parseFloat(country.percentage))}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {country.percentage}%
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-2xl font-bold text-indigo-600 flex-shrink-0 ml-4">
                {country.count}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <Globe className="w-12 h-12 text-gray-100 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No country data available</p>
          </div>
        )}
      </div>
    </div>
  );
}