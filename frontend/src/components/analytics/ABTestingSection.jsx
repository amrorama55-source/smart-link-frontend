import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import { Target, TrendingUp } from 'lucide-react';

export default function ABTestingSection({ abTest }) {
  if (!abTest || !abTest.enabled) {
    return null;
  }

  const variants = abTest.variants || [];
  const totalTestClicks = abTest.totalTestClicks || 
    variants.reduce((sum, v) => sum + (v.clicksInRange || 0), 0);
  
  const processedVariants = variants.map((variant, index) => {
    const clicksInRange = variant.clicksInRange || 0;
    const percentage = totalTestClicks > 0 
      ? ((clicksInRange / totalTestClicks) * 100).toFixed(1)
      : '0.0';
    
    return {
      ...variant,
      index,
      clicksInRange,
      percentage,
      name: variant.name || `Variant ${String.fromCharCode(65 + index)}`
    };
  });

  const sortedVariants = [...processedVariants].sort((a, b) => 
    (b.clicksInRange || 0) - (a.clicksInRange || 0)
  );
  
  const winner = sortedVariants[0];
  const hasWinner = winner && (winner.clicksInRange || 0) > 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              A/B Test Results
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Split Method: <span className="font-semibold capitalize">{abTest.splitMethod || 'weighted'}</span>
            <span className="ml-3">• Total: <span className="font-bold">{totalTestClicks}</span></span>
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 w-fit">
          ● Active
        </span>
      </div>

      {/* Winner Badge */}
      {hasWinner && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm sm:text-base text-yellow-700 dark:text-yellow-400 truncate">
              🏆 Current Leader: {winner.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {winner.clicksInRange} clicks ({winner.percentage}% of test traffic)
            </p>
          </div>
        </div>
      )}

      {/* Variants Grid */}
      {processedVariants.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {processedVariants.map((variant) => {
              const isWinner = hasWinner && variant.index === winner.index;
              return (
                <div
                  key={variant.index}
                  className={`bg-white dark:bg-gray-800/80 border ${isWinner ? 'ring-2 ring-yellow-400 dark:ring-yellow-500/50' : ''} border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5 relative overflow-hidden transition-all hover:shadow-lg`}
                >
                  {isWinner && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <span className="px-2 py-1 text-xs font-bold rounded bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400">
                        👑 Winner
                      </span>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h3 className="font-bold text-base sm:text-lg mb-1 text-gray-900 dark:text-white truncate pr-16">
                      {variant.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {variant.url}
                    </p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Clicks in Range
                        </span>
                        <span className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                          {variant.clicksInRange}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 sm:h-3">
                        <div
                          className={`h-2.5 sm:h-3 rounded-full transition-all duration-500 ${isWinner ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(100, parseFloat(variant.percentage))}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Split Weight</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {variant.weight}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Total Clicks</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {variant.totalClicks || 0}
                      </span>
                    </div>
                  </div>

                  <div className="text-center py-2 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                    <span className={`text-xl sm:text-2xl font-bold ${isWinner ? 'text-green-500' : 'text-blue-600 dark:text-blue-400'}`}>
                      {variant.percentage}%
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">of test traffic</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance Chart */}
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
              Performance Comparison
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={processedVariants} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#6b7280' }} 
                  stroke="#9ca3af"
                  tickMargin={8}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#6b7280' }} 
                  stroke="#9ca3af"
                  tickMargin={8}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="rect"
                />
                <Bar dataKey="clicksInRange" name="Clicks in Range" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="totalClicks" name="Total Clicks" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        /* No Variants */
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium text-sm sm:text-base">
            A/B Test is enabled but no variants configured
          </p>
          <p className="text-xs sm:text-sm">Edit your link to add test variants</p>
        </div>
      )}

      {/* No Data Yet */}
      {totalTestClicks === 0 && processedVariants.length > 0 && (
        <div className="mt-6 text-center py-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
          <Target className="w-10 h-10 mx-auto mb-2 text-blue-600 dark:text-blue-400 opacity-50" />
          <p className="font-medium text-sm sm:text-base text-blue-900 dark:text-blue-100">
            No test data yet
          </p>
          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
            Share your link to start collecting A/B test results
          </p>
        </div>
      )}
    </div>
  );
}