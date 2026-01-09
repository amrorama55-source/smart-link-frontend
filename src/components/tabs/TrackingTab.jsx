import { Plus, Trash2, TrendingUp, AlertCircle } from 'lucide-react';

export default function TrackingTab({ 
  linkData, 
  addPixel, 
  removePixel, 
  updatePixel 
}) {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
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
          className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Pixel
        </button>
      </div>

      {/* Pixels List */}
      <div className="space-y-3">
        {linkData.pixels.map((pixel, idx) => (
          <div
            key={idx}
            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-900 dark:text-white">
                Pixel {idx + 1}
              </span>

              <button
                type="button"
                onClick={() => removePixel(idx)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Platform */}
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  Platform
                </label>
                <select
                  value={pixel.platform}
                  onChange={(e) =>
                    updatePixel(idx, 'platform', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                >
                  <option value="facebook">Facebook Pixel</option>
                  <option value="google">Google Analytics</option>
                  <option value="tiktok">TikTok Pixel</option>
                  <option value="linkedin">LinkedIn Insight</option>
                  <option value="twitter">Twitter Pixel</option>
                  <option value="snapchat">Snapchat Pixel</option>
                </select>
              </div>

              {/* Pixel ID */}
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  Pixel ID
                </label>
                <input
                  type="text"
                  value={pixel.pixelId}
                  onChange={(e) =>
                    updatePixel(idx, 'pixelId', e.target.value)
                  }
                  placeholder="Enter your pixel ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                />
              </div>

              {/* Event */}
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  Event Type
                </label>
                <select
                  value={pixel.event}
                  onChange={(e) =>
                    updatePixel(idx, 'event', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                >
                  <option value="PageView">Page View</option>
                  <option value="ViewContent">View Content</option>
                  <option value="AddToCart">Add to Cart</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Lead">Lead</option>
                  <option value="CompleteRegistration">
                    Complete Registration
                  </option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {linkData.pixels.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
            No tracking pixels yet. Add one to track conversions and events.
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800/30">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          How Tracking Works
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
          <li>Pixels fire when users click your link</li>
          <li>Track conversions in your platform dashboard</li>
          <li>Use UTM parameters for additional tracking</li>
          <li>View analytics in the Analytics tab</li>
        </ul>
      </div>

    </div>
  );
}
