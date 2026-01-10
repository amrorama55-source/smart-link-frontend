import { Plus, Trash2, TrendingUp, AlertCircle } from 'lucide-react';

export default function TrackingTab({ 
  linkData, 
  addPixel, 
  removePixel, 
  updatePixel,
  errors 
}) {
  // ✅ CRITICAL FIX: Handle undefined linkData FIRST
  if (!linkData) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  // ✅ SECOND CHECK: Ensure pixels array exists
  const pixels = linkData.pixels || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Tracking Pixels
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add conversion tracking pixels
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={addPixel}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Pixel
        </button>
      </div>

      {/* Pixels List */}
      <div className="space-y-4">
        {pixels.map((pixel, idx) => (
          <div
            key={idx}
            className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Pixel {idx + 1}
              </span>

              <button
                type="button"
                onClick={() => removePixel(idx)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition"
                title="Remove pixel"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Platform */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Platform
                </label>
                <select
                  value={pixel.platform || 'facebook'}
                  onChange={(e) => updatePixel(idx, 'platform', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="facebook">Facebook Pixel</option>
                  <option value="google">Google Analytics</option>
                  <option value="tiktok">TikTok Pixel</option>
                  <option value="linkedin">LinkedIn Insight</option>
                  <option value="twitter">Twitter Pixel</option>
                  <option value="snapchat">Snapchat Pixel</option>
                  <option value="pinterest">Pinterest Tag</option>
                  <option value="reddit">Reddit Pixel</option>
                </select>
              </div>

              {/* Pixel ID */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Pixel ID
                </label>
                <input
                  type="text"
                  value={pixel.pixelId || ''}
                  onChange={(e) => updatePixel(idx, 'pixelId', e.target.value)}
                  placeholder="Enter your pixel ID"
                  autoComplete="off"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Example: For Facebook, use your 15-16 digit Pixel ID
                </p>
              </div>

              {/* Event */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Event Type
                </label>
                <select
                  value={pixel.event || 'PageView'}
                  onChange={(e) => updatePixel(idx, 'event', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="PageView">Page View</option>
                  <option value="ViewContent">View Content</option>
                  <option value="AddToCart">Add to Cart</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Lead">Lead</option>
                  <option value="CompleteRegistration">Complete Registration</option>
                  <option value="InitiateCheckout">Initiate Checkout</option>
                  <option value="AddPaymentInfo">Add Payment Info</option>
                  <option value="Search">Search</option>
                  <option value="Contact">Contact</option>
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This event will fire when users click your link
                </p>
              </div>
            </div>
          </div>
        ))}

        {(!pixels || pixels.length === 0) && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <TrendingUp className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              No tracking pixels yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Add pixels to track conversions and events
            </p>
          </div>
        )}

        {errors.pixels && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errors.pixels}
            </p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800/30">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          How Tracking Works
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5 list-disc list-inside">
          <li>Pixels fire when users click your link</li>
          <li>Track conversions in your platform dashboard</li>
          <li>Use UTM parameters for additional tracking</li>
          <li>View analytics in the Analytics tab</li>
          <li>Multiple pixels can be added to one link</li>
        </ul>
      </div>

    </div>
  );
}