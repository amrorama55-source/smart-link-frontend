import { Plus, Trash2, Target, Zap, AlertCircle, TrendingUp, Trophy } from 'lucide-react';

export default function AdvancedTab({ 
  linkData, 
  setLinkData, 
  errors, 
  addVariant, 
  removeVariant, 
  updateVariant,
  existingWinner // NEW: pass winner data if editing
}) {
  return (
    <div className="space-y-6">
      
      {/* A/B Testing Toggle */}
      <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800/30">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">A/B Testing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Test multiple destinations</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={linkData.abTest?.enabled}
            onChange={(e) => setLinkData({
              ...linkData,
              abTest: {...linkData.abTest, enabled: e.target.checked}
            })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
        </label>
      </div>

      {linkData.abTest?.enabled && (
        <div className="space-y-4">
          
          {/* Winner Display (if exists) */}
          {existingWinner && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                <h4 className="font-bold text-gray-900 dark:text-white">Current Winner Detected</h4>
              </div>
              <div className="ml-9 space-y-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Variant:</span>{' '}
                  {existingWinner.name || `Variant ${String.fromCharCode(65 + existingWinner.variantIndex)}`}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Confidence:</span>{' '}
                  {existingWinner.confidence}%
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  💡 The winning variant has been automatically given higher weight
                </p>
              </div>
            </div>
          )}

          {/* Split Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Split Method
            </label>
            <select
              value={linkData.abTest.splitMethod}
              onChange={(e) => setLinkData({
                ...linkData,
                abTest: {...linkData.abTest, splitMethod: e.target.value}
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="weighted">Weighted Split (Manual Control)</option>
              <option value="random">Random Split (Equal Distribution)</option>
              <option value="optimized">Optimized Split (AI-Powered) 🤖</option>
            </select>
            
            {/* Method Explanation */}
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {linkData.abTest.splitMethod === 'weighted' && (
                  <>
                    <strong>Weighted:</strong> You manually control the traffic percentage for each variant.
                  </>
                )}
                {linkData.abTest.splitMethod === 'random' && (
                  <>
                    <strong>Random:</strong> Traffic is distributed randomly and equally across all variants.
                  </>
                )}
                {linkData.abTest.splitMethod === 'optimized' && (
                  <>
                    <strong>Optimized:</strong> AI automatically sends more traffic to better-performing variants
                    using Multi-Armed Bandit algorithm. Requires conversion tracking.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Variants ({linkData.abTest.variants?.length || 0})
              </label>
              <button
                type="button"
                onClick={addVariant}
                className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition flex items-center gap-1 touch-target"
              >
                <Plus className="w-4 h-4" />
                Add Variant
              </button>
            </div>

            <div className="space-y-3">
              {linkData.abTest.variants?.map((variant, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Variant {String.fromCharCode(65 + idx)}
                      </span>
                      {/* Winner Badge */}
                      {existingWinner?.variantIndex === idx && (
                        <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-full flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          Winner
                        </span>
                      )}
                      {/* Performance Indicators (if editing) */}
                      {variant.clicks > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({variant.clicks} clicks, {variant.conversionRate || 0}% CVR)
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                      placeholder="Variant Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    />

                    <input
                      type="url"
                      value={variant.url}
                      onChange={(e) => updateVariant(idx, 'url', e.target.value)}
                      placeholder="https://example.com/variant-url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    />

                    {linkData.abTest.splitMethod === 'weighted' && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs text-gray-600 dark:text-gray-400">
                            Weight: {variant.weight}%
                          </label>
                          {/* Auto-calculated percentage */}
                          <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                            {linkData.abTest.variants?.length > 0 
                              ? Math.round((variant.weight / linkData.abTest.variants.reduce((sum, v) => sum + (v.weight || 0), 0)) * 100) 
                              : 0}% of total
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={variant.weight}
                          onChange={(e) => updateVariant(idx, 'weight', Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Weight Validation */}
            {linkData.abTest.splitMethod === 'weighted' && linkData.abTest.variants?.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Total Weight:
                  </span>
                  <span className={`text-sm font-bold ${
                    linkData.abTest.variants.reduce((sum, v) => sum + (v.weight || 0), 0) === 100
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {linkData.abTest.variants.reduce((sum, v) => sum + (v.weight || 0), 0)}%
                  </span>
                </div>
                {linkData.abTest.variants.reduce((sum, v) => sum + (v.weight || 0), 0) !== 100 && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    ⚠️ Weights must sum to 100%
                  </p>
                )}
              </div>
            )}

            {errors.abTest && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.abTest}
              </p>
            )}
          </div>

          {/* Auto-Optimization */}
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-gray-900 dark:text-white">Auto-Optimization</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkData.abTest.autoOptimize?.enabled}
                  onChange={(e) => setLinkData({
                    ...linkData,
                    abTest: {
                      ...linkData.abTest,
                      autoOptimize: {
                        ...linkData.abTest.autoOptimize,
                        enabled: e.target.checked
                      }
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>

            {linkData.abTest.autoOptimize?.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                    Minimum Sample Size (clicks before optimization)
                  </label>
                  <input
                    type="number"
                    value={linkData.abTest.autoOptimize?.minSampleSize || 100}
                    onChange={(e) => setLinkData({
                      ...linkData,
                      abTest: {
                        ...linkData.abTest,
                        autoOptimize: {
                          ...linkData.abTest.autoOptimize,
                          minSampleSize: Number(e.target.value)
                        }
                      }
                    })}
                    min="50"
                    max="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                    Confidence Level
                  </label>
                  <select
                    value={linkData.abTest.autoOptimize?.confidenceLevel || 0.95}
                    onChange={(e) => setLinkData({
                      ...linkData,
                      abTest: {
                        ...linkData.abTest,
                        autoOptimize: {
                          ...linkData.abTest.autoOptimize,
                          confidenceLevel: Number(e.target.value)
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  >
                    <option value="0.90">90% Confidence (Faster)</option>
                    <option value="0.95">95% Confidence (Balanced)</option>
                    <option value="0.99">99% Confidence (More Accurate)</option>
                  </select>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 rounded border border-green-200 dark:border-green-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    <strong className="text-green-700 dark:text-green-400">How it works:</strong><br/>
                    After reaching the minimum sample size, the system automatically:
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-3 h-3 mt-0.5 text-green-600 flex-shrink-0" />
                      <span>Calculates statistical significance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="w-3 h-3 mt-0.5 text-green-600 flex-shrink-0" />
                      <span>Adjusts traffic to favor winning variants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Trophy className="w-3 h-3 mt-0.5 text-green-600 flex-shrink-0" />
                      <span>Declares a winner when confidence threshold is met</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}