import { MapPin } from 'lucide-react';

export default function CitiesList({ cities }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Cities</h3>
      <div className="space-y-3">
        {cities.map((city, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 dark:from-purple-900/30 to-transparent rounded-lg border border-purple-100 dark:border-purple-900/50"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <MapPin className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-200 truncate">
                  {city.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {city.percentage}% of traffic
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-purple-600 flex-shrink-0 ml-4">
              {city.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}