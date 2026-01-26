import { SHORT_URL_BASE } from '../../config';
import { X, Link2, FileText, Tag, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function BasicTab({ linkData, setLinkData, editingLink, errors }) {
  const [tags, setTags] = useState(linkData.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [showUTM, setShowUTM] = useState(false);

  const handleTagInput = (e) => {
    const value = e.target.value;
    if (value.endsWith(',') || value.endsWith(' ')) {
      const tag = value.slice(0, -1).trim();
      if (tag && !tags.includes(tag)) {
        const newTags = [...tags, tag];
        setTags(newTags);
        setLinkData({ ...linkData, tags: newTags });
        setTagInput('');
      }
    } else {
      setTagInput(value);
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !tags.includes(tag)) {
        const newTags = [...tags, tag];
        setTags(newTags);
        setLinkData({ ...linkData, tags: newTags });
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      const newTags = tags.slice(0, -1);
      setTags(newTags);
      setLinkData({ ...linkData, tags: newTags });
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setLinkData({ ...linkData, tags: newTags });
  };

  return (
    <div className="space-y-6">
      
      {/* Original URL */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <Link2 className="inline w-4 h-4 mr-1" />
          Original URL *
        </label>
        <input
          type="url"
          value={linkData.originalUrl || ''}
          onChange={(e) => setLinkData({ ...linkData, originalUrl: e.target.value })}
          placeholder="https://example.com/your-long-url"
          autoComplete="off"
          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
            errors.originalUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          required
        />
        {errors.originalUrl && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.originalUrl}</p>
        )}
      </div>

      {/* Custom Alias */}
      {!editingLink && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Custom Alias (Optional)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {SHORT_URL_BASE}/
            </span>
            <input
              type="text"
              value={linkData.customAlias || ''}
              onChange={(e) => setLinkData({ ...linkData, customAlias: e.target.value })}
              placeholder="my-custom-link"
              autoComplete="off"
              className={`flex-1 px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.customAlias ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
          </div>
          {errors.customAlias && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customAlias}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Leave empty for random short code
          </p>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <FileText className="inline w-4 h-4 mr-1" />
          Title
        </label>
        <input
          type="text"
          value={linkData.title || ''}
          onChange={(e) => setLinkData({ ...linkData, title: e.target.value })}
          placeholder="My Campaign Link"
          autoComplete="off"
          maxLength={200}
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
          {linkData.title?.length || 0}/200
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <FileText className="inline w-4 h-4 mr-1" />
          Description
        </label>
        <textarea
          value={linkData.description || ''}
          onChange={(e) => setLinkData({ ...linkData, description: e.target.value })}
          placeholder="Add notes about this link..."
          autoComplete="off"
          rows={3}
          maxLength={1000}
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
          {linkData.description?.length || 0}/1000
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <Tag className="inline w-4 h-4 mr-1" />
          Tags (Press Enter to add)
        </label>
        <div className="flex flex-wrap gap-2 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={handleTagInput}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length === 0 ? "Add tags..." : ""}
            autoComplete="off"
            className="flex-1 min-w-[120px] outline-none bg-transparent dark:text-white"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Press Enter or comma to add a tag
        </p>
      </div>

      {/* Expiration Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <Calendar className="inline w-4 h-4 mr-1" />
          Expiration Date (Optional)
        </label>
        <input
          type="datetime-local"
          value={linkData.expiresAt || ''}
          onChange={(e) => setLinkData({ ...linkData, expiresAt: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:[color-scheme:dark]"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Link will automatically expire after this date
        </p>
      </div>

      {/* UTM Parameters - Collapsible */}
      <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <button
          type="button"
          onClick={() => setShowUTM(!showUTM)}
          className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors mb-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                UTM Parameters (Advanced - Optional)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Track campaign performance in Google Analytics
              </p>
            </div>
          </div>
          <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
            {showUTM ? '▼' : '▶'}
          </span>
        </button>
        
        {showUTM && (
          <div className="space-y-3 animate-fadeIn">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-3">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                💡 <strong>Pro Tip:</strong> UTM parameters help you track where your traffic comes from. 
                Leave empty if you don't use Google Analytics.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                UTM Source <span className="text-gray-400">(e.g., facebook, google, newsletter)</span>
              </label>
              <input
                type="text"
                value={linkData.utmSource || ''}
                onChange={(e) => setLinkData({ ...linkData, utmSource: e.target.value })}
                placeholder="facebook"
                autoComplete="off"
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                UTM Medium <span className="text-gray-400">(e.g., cpc, email, social)</span>
              </label>
              <input
                type="text"
                value={linkData.utmMedium || ''}
                onChange={(e) => setLinkData({ ...linkData, utmMedium: e.target.value })}
                placeholder="cpc"
                autoComplete="off"
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                UTM Campaign <span className="text-gray-400">(e.g., summer_sale, product_launch)</span>
              </label>
              <input
                type="text"
                value={linkData.utmCampaign || ''}
                onChange={(e) => setLinkData({ ...linkData, utmCampaign: e.target.value })}
                placeholder="summer_sale"
                autoComplete="off"
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}