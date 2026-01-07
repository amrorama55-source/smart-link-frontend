// src/components/ConversionTracking.jsx - NEW COMPONENT
import { useState } from 'react';
import { Copy, CheckCircle, Code, TrendingUp } from 'lucide-react';
import api from '../services/api';

export default function ConversionTracking({ shortCode }) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const trackingCode = `<!-- Smart Link Conversion Tracking -->
<script src="${import.meta.env.VITE_API_URL || 'https://api.smart-link.website'}/api/conversions/${shortCode}/tracking-code"></script>

<script>
// Track conversion when user completes purchase
document.getElementById('purchase-button').addEventListener('click', function() {
  smartLinkTrackConversion({
    value: 99.99,
    event: 'purchase',
    callback: function(result) {
      console.log('Conversion tracked:', result);
    }
  });
});
</script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadConversionStats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/conversions/${shortCode}/stats`);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load conversion stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Conversion Tracking
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track purchases, signups, and other conversions
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowCode(!showCode)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Code className="w-4 h-4" />
          {showCode ? 'Hide Code' : 'Get Code'}
        </button>
      </div>

      {/* Conversion Stats */}
      {stats ? (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Conversions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalConversions || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Conversion Rate</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.conversionRate || 0}%
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${stats.totalRevenue?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={loadConversionStats}
          disabled={loading}
          className="w-full py-3 mb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load Conversion Stats'}
        </button>
      )}

      {/* Tracking Code */}
      {showCode && (
        <div className="space-y-4">
          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{trackingCode}</code>
            </pre>
            <button
              onClick={copyCode}
              className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              How to use:
            </h4>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
              <li>Add the first script tag to your website's &lt;head&gt;</li>
              <li>Call <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 rounded">smartLinkTrackConversion()</code> when conversion happens</li>
              <li>Optionally pass <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 rounded">value</code> and <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 rounded">event</code> parameters</li>
            </ol>
          </div>

          {/* Examples */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Usage Examples:
            </h4>
            <div className="space-y-2">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Basic conversion:</p>
                <code className="text-sm text-gray-900 dark:text-white">
                  smartLinkTrackConversion();
                </code>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">With value:</p>
                <code className="text-sm text-gray-900 dark:text-white">
                  smartLinkTrackConversion({'{'}value: 29.99{'}'});
                </code>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Custom event:</p>
                <code className="text-sm text-gray-900 dark:text-white">
                  smartLinkTrackConversion({'{'}event: 'signup', value: 0{'}'});
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}