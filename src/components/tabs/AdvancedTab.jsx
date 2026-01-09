import { Plus, Trash2, Target, Zap, AlertCircle, TrendingUp, Trophy, CheckCircle } from 'lucide-react';

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

  // Auto-fix weights
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
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
        </label>
      </div>

      {linkData.abTest?.enabled && (
        <div className="space-y-4">
          
          {/* Winner Display */}
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
              value={linkData.abTest.splitMethod || 'weighted'}
              onChange={(e) => setLinkData({
                ...linkData,
                abTest: {...linkData.abTest, splitMethod: e.target.value}
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[44px]"
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
                    <strong>Optimized:</strong> AI automatically sends more traffic to better-performing variants.
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
                className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition flex items-center gap-1 min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {(linkData.abTest.variants || []).map((variant, idx) => {
                const hasEmptyName = !variant.name || !variant.name.trim();
                const hasEmptyUrl = !variant.url || !variant.url.trim();
                const hasError = hasEmptyName || hasEmptyUrl;
                const variantLetter = String.fromCharCode(65 + idx);
                
                return (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      hasError && errors.abTest
                        ? 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-800'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold text-sm">
                          {variantLetter}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Variant {variantLetter}
                        </span>
                        
                        {/* Status Badges */}
                        {existingWinner?.variantIndex === idx && (
                          <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-full flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            Winner
                          </span>
                        )}
                        {hasError && errors.abTest && (
                          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-full flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Missing Info
                          </span>
                        )}
                        {isVariantValid(variant) && !hasError && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition min-h-[44px] min-w-[44px]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Fields */}
                    <div className="space-y-3">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Variant Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={variant.name || ''}
                          onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                          placeholder={`e.g., "Homepage", "Landing Page A"`}
                          className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm min-h-[44px] ${
                            hasEmptyName && errors.abTest
                              ? 'border-red-500 dark:border-red-400 ring-2 ring-red-200 dark:ring-red-900/50'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                        {hasEmptyName && errors.abTest && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Name is required
                          </p>
                        )}
                      </div>

                      {/* URL */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Destination URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          value={variant.url || ''}
                          onChange={(e) => updateVariant(idx, 'url', e.target.value)}
                          placeholder="https://example.com/your-page"
                          className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm min-h-[44px] ${
                            hasEmptyUrl && errors.abTest
                              ? 'border-red-500 dark:border-red-400 ring-2 ring-red-200 dark:ring-red-900/50'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                        {hasEmptyUrl && errors.abTest && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            URL is required (must start with http:// or https://)
                          </p>
                        )}
                      </div>

                      {/* Weight */}
                      {linkData.abTest.splitMethod === 'weighted' && (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Traffic Weight
                            </label>
                            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                              {variant.weight || 0}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={variant.weight || 0}
                            onChange={(e) => updateVariant(idx, 'weight', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-600"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {totalWeight > 0 ? 
                              `${((variant.weight || 0) / totalWeight * 100).toFixed(1)}% of total traffic` : 
                              '0% of total traffic'
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
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Click "Add Variant" to create your first test variant
                </p>
              </div>
            )}

            {/* Weight Validation */}
            {linkData.abTest.splitMethod === 'weighted' && linkData.abTest.variants && linkData.abTest.variants.length > 0 && (
              <div className={`mt-4 p-4 rounded-lg border-2 ${
                Math.abs(totalWeight - 100) < 1
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-800'
                  : 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-300 dark:border-yellow-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Weight:
                  </span>
                  <span className={`text-lg font-bold ${
                    Math.abs(totalWeight - 100) < 1
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {totalWeight.toFixed(1)}%
                  </span>
                </div>
                
                {Math.abs(totalWeight - 100) >= 1 && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Weights will be auto-normalized to 100% by the backend
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={autoFixWeights}
                      className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <Zap className="w-4 h-4" />
                      Auto-Fix Weights Now
                    </button>
                  </div>
                )}
                
                {Math.abs(totalWeight - 100) < 1 && (
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Perfect! Weights are balanced.</span>
                  </div>
                )}
              </div>
            )}

            {/* General Error */}
            {errors.abTest && (
              <div className="mt-3 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                      A/B Testing Error
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {errors.abTest}
                    </p>
                  </div>
                </div>
              </div>
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>

            {linkData.abTest.autoOptimize?.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block font-medium">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block font-medium">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm min-h-[44px]"
                  >
                    <option value="0.90">90% Confidence (Faster)</option>
                    <option value="0.95">95% Confidence (Balanced)</option>
                    <option value="0.99">99% Confidence (More Accurate)</option>
                  </select>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 rounded border border-green-200 dark:border-green-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    <strong className="text-green-700 dark:text-green-400">How it works:</strong> 
                    After reaching minimum clicks, the system automatically adjusts traffic to favor winning variants.
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