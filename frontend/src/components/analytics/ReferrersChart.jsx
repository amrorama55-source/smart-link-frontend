import { ExternalLink, Link2 } from 'lucide-react';

export default function ReferrersChart({ referrers }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <ExternalLink className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Referrers</h3>
        </div>
      </div>

      {referrers && referrers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {referrers.map((referrer, idx) => (
            <div key={idx} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-6">
                    #{idx + 1}
                  </span>
                  <div className="flex items-center gap-2 min-w-0">
                    <Link2 className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
                      {referrer.name === 'Direct' ? 'Direct / None' : referrer.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {referrer.percentage}%
                  </span>
                  <span className="text-sm font-bold text-blue-600 w-8 text-right">
                    {referrer.count}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700 ease-out group-hover:from-blue-600 group-hover:to-indigo-600"
                  style={{ width: `${Math.min(100, parseFloat(referrer.percentage))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
          <ExternalLink className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-sm font-medium">No referrer data available yet</p>
        </div>
      )}
    </div>
  );
}