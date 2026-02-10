import { Globe } from 'lucide-react';

export default function CountriesList({ countries }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Countries</h3>
      <div className="space-y-3">
        {countries && countries.length > 0 ? (
          countries.map((country, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 dark:from-blue-900/30 to-transparent rounded-lg border border-blue-100 dark:border-blue-900/50"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Globe className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-200 truncate">
                    {country.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {country.percentage}% of traffic
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600 flex-shrink-0 ml-4">
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