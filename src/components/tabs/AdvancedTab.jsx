import { Plus, Trash2, Target, Zap, AlertCircle, TrendingUp, Trophy, CheckCircle, Percent } from 'lucide-react';

export default function AdvancedTab({ 
  linkData, 
  setLinkData, 
  errors, 
  addVariant, 
  removeVariant, 
  updateVariant,
  existingWinner
}) {
  // Calculate total weight
  const totalWeight = (linkData.abTest?.variants || []).reduce((sum, v) => 
    sum + (parseFloat(v.weight) || 0), 0
  );

  // Check if variant is valid
  const isVariantValid = (variant) => {
    return variant.name && variant.name.trim() && 
           variant.url && variant.url.trim();
  };

  // Auto-fix weights - equal distribution
  const autoFixWeights = () => {
    const variants = linkData.abTest?.variants || [];
    if (variants.length === 0) return;
    
    const equalWeight = Math.floor(100 / variants.length);
    const remainder = 100 - (equalWeight * variants.length);
    
    const updatedVariants = variants.map((v, i) => ({
      ...v,
      weight: i === 0 ? equalWeight + remainder : equalWeight
    }));
    
    setLinkData({
      ...linkData,
      abTest: {
        ...linkData.abTest,
        variants: updatedVariants
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* A/B Testing Toggle */}
      <div className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-xl border-2 border-purple-200 dark:border-purple-800/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">A/B Testing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Test multiple destinations to find the best performer</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={linkData.abTest?.enabled || false}
            onChange={(e) => {
              const enabled = e.target.checked;
              setLinkData({
                ...linkData,
                abTest: {
                  ...linkData.abTest,
                  enabled,
                  variants: enabled && (!linkData.abTest?.variants || linkData.abTest.variants.length === 0)
                    ? [
                        { name: 'Variant A', url: '', weight: 50 },
                        { name: 'Variant B', url: '', weight: 50 }
                      ]
                    : linkData.abTest?.variants || []
                }
              });
            }}
            className="sr-only peer"
          />
          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
        </label>
      </div>

      {linkData.abTest?.enabled && (
        <div className="space-y-6">
          
          {/* Winner Display */}
          {existingWinner && (
            <div className="p-5 bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/20 dark:via-amber-900/20 dark:to-orange-900/20 border-2 border-yellow-400 dark:border-yellow-700 rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg">🏆 Current Winner</h4>
              </div>
              <div className="ml-13 space-y-2 bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Variant:</span>{' '}
                  <span className="font-bold text-purple-700 dark:text-purple-400">
                    {existingWinner.name || `Variant ${String.fromCharCode(65 + existingWinner.variantIndex)}`}
                  </span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Confidence:</span>{' '}
                  <span className="font-bold text-green-700 dark:text-green-400">
                    {existingWinner.confidence}%
                  </span>
                </p>
                <div className="pt-2 border-t border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    💡 The winning variant has been automatically given higher weight
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Split Method */}
          <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Split Method
            </label>
            <select
              value={linkData.abTest.splitMethod || 'weighted'}
              onChange={(e) => setLinkData({
                ...linkData,
                abTest: {...linkData.abTest, splitMethod: e.target.value}
              })}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white text-sm font-medium"
            >
              <option value="weighted">⚖️ Weighted Split (Manual Control)</option>
              <option value="random">🎲 Random Split (Equal Distribution)</option>
              <option value="optimized">🤖 Optimized Split (AI-Powered)</option>
            </select>
            
            {/* Method Explanation */}
            <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {linkData.abTest.splitMethod === 'weighted' && (
                  <>
                    <strong className="text-purple-700 dark:text-purple-400">⚖️ Weighted:</strong> You manually control the traffic percentage for each variant using sliders below.
                  </>
                )}
                {linkData.abTest.splitMethod === 'random' && (
                  <>
                    <strong className="text-blue-700 dark:text-blue-400">🎲 Random:</strong> Traffic is distributed randomly and equally across all variants automatically.
                  </>
                )}
                {linkData.abTest.splitMethod === 'optimized' && (
                  <>
                    <strong className="text-green-700 dark:text-green-400">🤖 Optimized:</strong> AI automatically sends more traffic to better-performing variants in real-time.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Variants ({linkData.abTest.variants?.length || 0})
              </label>
              <button
                type="button"
                onClick={addVariant}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {(linkData.abTest.variants || []).map((variant, idx) => {
                const hasEmptyName = !variant.name || !variant.name.trim();
                const hasEmptyUrl = !variant.url || !variant.url.trim();
                const hasError = hasEmptyName || hasEmptyUrl;
                const variantLetter = String.fromCharCode(65 + idx);
                const actualPercentage = totalWeight > 0 ? ((variant.weight || 0) / totalWeight * 100).toFixed(1) : 0;
                
                return (
                  <div 
                    key={idx} 
                    className={`p-5 rounded-xl border-2 transition-all ${
                      hasError && errors.abTest
                        ? 'bg-red-50 dark:bg-red-900/10 border-red-400 dark:border-red-700 shadow-lg'
                        : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-300 dark:border-gray-600 hover:shadow-lg'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-lg shadow-lg">
                          {variantLetter}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white text-lg block">
                            Variant {variantLetter}
                          </span>
                          {/* Status Badges */}
                          <div className="flex items-center gap-2 mt-1">
                            {existingWinner?.variantIndex === idx && (
                              <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-xs font-bold rounded-full flex items-center gap-1">
                                <Trophy className="w-3 h-3" />
                                Winner
                              </span>
                            )}
                            {hasError && errors.abTest && (
                              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 text-xs font-bold rounded-full flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Incomplete
                              </span>
                            )}
                            {isVariantValid(variant) && !hasError && (
                              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-bold rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Ready
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="p-2.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Fields */}
                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                          Variant Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={variant.name || ''}
                          onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                          placeholder={`e.g., "Homepage", "Landing Page A"`}
                          className={`w-full px-4 py-3 border-2 rounded-lg dark:bg-gray-700 dark:text-white text-sm font-medium ${
                            hasEmptyName && errors.abTest
                              ? 'border-red-500 dark:border-red-400 ring-2 ring-red-200 dark:ring-red-900/50'
                              : 'border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                          }`}
                        />
                        {hasEmptyName && errors.abTest && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Name is required
                          </p>
                        )}
                      </div>

                      {/* URL */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                          Destination URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          value={variant.url || ''}
                          onChange={(e) => updateVariant(idx, 'url', e.target.value)}
                          placeholder="https://example.com/your-page"
                          className={`w-full px-4 py-3 border-2 rounded-lg dark:bg-gray-700 dark:text-white text-sm font-medium ${
                            hasEmptyUrl && errors.abTest
                              ? 'border-red-500 dark:border-red-400 ring-2 ring-red-200 dark:ring-red-900/50'
                              : 'border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                          }`}
                        />
                        {hasEmptyUrl && errors.abTest && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            URL is required (must start with http:// or https://)
                          </p>
                        )}
                      </div>

                      {/* Weight - IMPROVED */}
                      {linkData.abTest.splitMethod === 'weighted' && (
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                          <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <Percent className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              Traffic Weight
                            </label>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {variant.weight || 0}%
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                ({actualPercentage}% actual)
                              </span>
                            </div>
                          </div>
                          
                          {/* Slider */}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={variant.weight || 0}
                            onChange={(e) => updateVariant(idx, 'weight', parseFloat(e.target.value))}
                            className="w-full h-3 bg-gradient-to-r from-purple-200 to-purple-400 rounded-lg appearance-none cursor-pointer accent-purple-600 hover:accent-purple-700 transition"
                            style={{
                              background: `linear-gradient(to right, #9333ea 0%, #9333ea ${variant.weight || 0}%, #e5e7eb ${variant.weight || 0}%, #e5e7eb 100%)`
                            }}
                          />
                          
                          {/* Traffic Bar Visualization */}
                          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300"
                              style={{width: `${actualPercentage}%`}}
                            />
                          </div>
                          
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
                            {actualPercentage > 0 ? 
                              `This variant will receive ${actualPercentage}% of total traffic` : 
                              'No traffic will be sent to this variant'
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {(!linkData.abTest.variants || linkData.abTest.variants.length === 0) && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-6 text-center">
                <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
                <p className="text-sm font-bold text-yellow-800 dark:text-yellow-200 mb-1">
                  No Variants Yet
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Click "Add Variant" to create your first test variant
                </p>
              </div>
            )}

            {/* Weight Summary - ENHANCED */}
            {linkData.abTest.splitMethod === 'weighted' && linkData.abTest.variants && linkData.abTest.variants.length > 0 && (
              <div className={`mt-5 p-5 rounded-xl border-2 shadow-lg ${
                Math.abs(totalWeight - 100) < 1
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-400 dark:border-green-700'
                  : 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-yellow-400 dark:border-yellow-700'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Percent className="w-5 h-5" />
                    Total Weight Distribution:
                  </span>
                  <span className={`text-3xl font-bold ${
                    Math.abs(totalWeight - 100) < 1
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {totalWeight.toFixed(1)}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      Math.abs(totalWeight - 100) < 1
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    }`}
                    style={{width: `${Math.min(totalWeight, 100)}%`}}
                  />
                </div>
                
                {Math.abs(totalWeight - 100) >= 1 && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                        Weights will be auto-normalized to 100% by the backend, or click the button below to fix now
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={autoFixWeights}
                      className="w-full px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white text-sm font-bold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Zap className="w-5 h-5" />
                      Auto-Fix Weights to 100%
                    </button>
                  </div>
                )}
                
                {Math.abs(totalWeight - 100) < 1 && (
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-bold">Perfect! Weights are perfectly balanced at 100%</span>
                  </div>
                )}
              </div>
            )}

            {/* General Error */}
            {errors.abTest && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-700 rounded-xl shadow-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-900 dark:text-red-200 mb-1">
                      A/B Testing Configuration Error
                    </p>
                    <p className="text-sm text-red-800 dark:text-red-300">
                      {errors.abTest}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Auto-Optimization */}
          <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl border-2 border-green-300 dark:border-green-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white text-lg">Auto-Optimization</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">AI-powered winner selection</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkData.abTest.autoOptimize?.enabled || false}
                  onChange={(e) => setLinkData({
                    ...linkData,
                    abTest: {
                      ...linkData.abTest,
                      autoOptimize: {
                        ...(linkData.abTest.autoOptimize || {}),
                        enabled: e.target.checked,
                        minSampleSize: linkData.abTest.autoOptimize?.minSampleSize || 100,
                        confidenceLevel: linkData.abTest.autoOptimize?.confidenceLevel || 0.95
                      }
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>

            {linkData.abTest.autoOptimize?.enabled && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                    Minimum Sample Size (clicks)
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
                          minSampleSize: parseInt(e.target.value) || 100
                        }
                      }
                    })}
                    min="50"
                    max="1000"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
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
                          confidenceLevel: parseFloat(e.target.value)
                        }
                      }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  >
                    <option value="0.90">90% Confidence (Faster Results)</option>
                    <option value="0.95">95% Confidence (Balanced)</option>
                    <option value="0.99">99% Confidence (Most Accurate)</option>
                  </select>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-200 dark:border-green-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong className="text-green-700 dark:text-green-400">🤖 How it works:</strong> 
                    After reaching the minimum sample size, the system automatically identifies and promotes winning variants by adjusting traffic distribution in real-time.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}