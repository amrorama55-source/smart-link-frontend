import { ExternalLink } from 'lucide-react';

export default function ReferrersChart({ referrers }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Referrers</h3>
        <ExternalLink className="w-5 h-5 text-gray-400" />
      </div>
      
      {referrers.length > 0 ? (
        <div className="space-y-4">
          {referrers.map((referrer, idx) => (
            <div key={idx} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 flex-shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                    {referrer.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {referrer.percentage}%
                  </span>
                  <span className="text-sm font-bold text-blue-600 min-w-[40px] text-right">
                    {referrer.count}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 group-hover:from-blue-600 group-hover:to-purple-600" 
                  style={{ width: `${Math.min(100, referrer.percentage)}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          <ExternalLink className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No referrer data available</p>
        </div>
      )}
    </div>
  );
}