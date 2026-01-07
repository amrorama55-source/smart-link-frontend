import { SHORT_URL_BASE } from '../../config';
import { X, AlertCircle, Globe, Shield, CheckCircle2 } from 'lucide-react';

export default function BasicTab({ linkData, setLinkData, editingLink, errors }) {
  return (
    <div className="space-y-4">
      
      {/* Original URL */}
      {!editingLink && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Original URL *
          </label>
          <input
            type="url"
            value={linkData.originalUrl}
            onChange={(e) => setLinkData({...linkData, originalUrl: e.target.value})}
            placeholder="https://example.com/your-long-url"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.originalUrl ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.originalUrl && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.originalUrl}
            </p>
          )}
          
          {/* URL Safety Indicator */}
          {linkData.originalUrl && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-gray-600 dark:text-gray-400">
                URL will be checked for safety
              </span>
            </div>
          )}
        </div>
      )}

      {/* Custom Alias */}
      {!editingLink && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Custom Alias (Optional)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {SHORT_URL_BASE}/
            </span>
            <input
              type="text"
              value={linkData.customAlias}
              onChange={(e) => setLinkData({...linkData, customAlias: e.target.value})}
              placeholder="my-custom-link"
              className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.customAlias ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.customAlias && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.customAlias}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Leave empty for random short code. Only letters, numbers, hyphens, and underscores.
          </p>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title
        </label>
        <input
          type="text"
          value={linkData.title}
          onChange={(e) => setLinkData({...linkData, title: e.target.value})}
          placeholder="My Campaign Link"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          maxLength={200}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
          {linkData.title?.length || 0}/200
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={linkData.description}
          onChange={(e) => setLinkData({...linkData, description: e.target.value})}
          placeholder="Add notes about this link..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
          maxLength={1000}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
          {linkData.description?.length || 0}/1000
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags (Press Enter to add)
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {linkData.tags?.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => {
                  const newTags = linkData.tags.filter((_, i) => i !== idx);
                  setLinkData({...linkData, tags: newTags});
                }}
                className="hover:text-blue-900 dark:hover:text-blue-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add tag..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const value = e.target.value.trim();
              if (value && !linkData.tags?.includes(value)) {
                setLinkData({
                  ...linkData, 
                  tags: [...(linkData.tags || []), value]
                });
                e.target.value = '';
              }
            }
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Custom Domain (NEW) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Custom Domain (Optional)
        </label>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={linkData.customDomain || ''}
            onChange={(e) => setLinkData({...linkData, customDomain: e.target.value})}
            placeholder="yourdomain.com"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        {linkData.customDomain && (
          <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                Custom domains require DNS verification. After saving, you'll receive instructions to verify your domain.
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Password Protection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password Protection (Optional)
        </label>
        <input
          type="password"
          value={linkData.password || ''}
          onChange={(e) => setLinkData({...linkData, password: e.target.value})}
          placeholder="Set password to protect this link"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Users will need this password to access the link
        </p>
      </div>

      {/* Expiration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Expiration Date (Optional)
        </label>
        <input
          type="datetime-local"
          value={linkData.expiresAt || ''}
          onChange={(e) => setLinkData({...linkData, expiresAt: e.target.value})}
          min={new Date().toISOString().slice(0, 16)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Link will automatically expire and become inaccessible after this date
        </p>
      </div>

      {/* UTM Parameters (NEW) */}
      <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          📊 UTM Parameters (Optional)
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              UTM Source
            </label>
            <input
              type="text"
              value={linkData.utmSource || ''}
              onChange={(e) => setLinkData({...linkData, utmSource: e.target.value})}
              placeholder="facebook, google, newsletter"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              UTM Medium
            </label>
            <input
              type="text"
              value={linkData.utmMedium || ''}
              onChange={(e) => setLinkData({...linkData, utmMedium: e.target.value})}
              placeholder="cpc, email, social"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              UTM Campaign
            </label>
            <input
              type="text"
              value={linkData.utmCampaign || ''}
              onChange={(e) => setLinkData({...linkData, utmCampaign: e.target.value})}
              placeholder="summer_sale, product_launch"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}