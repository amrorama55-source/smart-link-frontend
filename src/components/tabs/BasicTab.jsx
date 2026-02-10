import { SHORT_URL_BASE } from '../../config';
import { X, Link2, FileText, Tag, Calendar, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { useState } from 'react';

export default function BasicTab({ linkData, setLinkData, editingLink, errors }) {
  const [tags, setTags] = useState(linkData.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [showUTM, setShowUTM] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

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
    <div className="space-y-6 min-h-full">

      {/* Original URL */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
          <Link2 className="inline w-4 h-4 mr-1" />
          Original URL *
        </label>
        <input
          type="url"
          value={linkData.originalUrl || ''}
          onChange={(e) => setLinkData({ ...linkData, originalUrl: e.target.value })}
          placeholder="https://example.com/your-long-url"
          autoComplete="off"
          className={`w-full px-4 py-3 min-h-[48px] text-base bg-white dark:bg-slate-800 border-2 rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500/50 ${errors.originalUrl ? 'border-red-500/50 bg-red-50/10' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
            } dark:text-white`}
          required
        />
        {errors.originalUrl && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.originalUrl}</p>
        )}
      </div>

      {/* Custom Alias */}
      {!editingLink && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
            Custom Alias (Optional)
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium bg-slate-100 dark:bg-slate-800 px-3 py-2.5 rounded-xl border-2 border-transparent truncate sm:max-w-[200px]">
              {SHORT_URL_BASE}/
            </span>
            <input
              type="text"
              value={linkData.customAlias || ''}
              onChange={(e) => setLinkData({ ...linkData, customAlias: e.target.value })}
              placeholder="my-custom-link"
              autoComplete="off"
              className={`w-full sm:flex-1 px-4 py-3 min-h-[48px] text-base bg-white dark:bg-slate-800 border-2 rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500/50 ${errors.customAlias ? 'border-red-500/50 bg-red-50/10' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
                } dark:text-white`}
            />
          </div>
          {errors.customAlias && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customAlias}</p>
          )}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
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
          className="w-full px-4 py-3 min-h-[48px] text-base bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white"
        />
      </div>

      {/* More Options Toggle (Mobile Only) */}
      <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 pt-4">
        <button
          type="button"
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {showMoreOptions ? 'Hide optional fields' : 'More options (Description, Tags...)'}
          </span>
          {showMoreOptions ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>
      </div>

      {/* Collapsible Content */}
      <div className={`${showMoreOptions ? 'block' : 'hidden'} sm:block space-y-6 animate-in fade-in slide-in-from-top-4 duration-300`}>
        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
            <FileText className="inline w-4 h-4 mr-1" />
            Description
          </label>
          <textarea
            value={linkData.description || ''}
            onChange={(e) => setLinkData({ ...linkData, description: e.target.value })}
            placeholder="Add notes about this link..."
            autoComplete="off"
            rows={2}
            maxLength={1000}
            className="w-full px-4 py-3 min-h-[80px] sm:min-h-[96px] text-base bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white resize-none sm:resize-y"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 text-right">
            {linkData.description?.length || 0}/1000
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
            <Tag className="inline w-4 h-4 mr-1" />
            Tags (Optional)
          </label>
          <div className="flex flex-wrap gap-2 p-3 min-h-[48px] bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl transition-all focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200/50 dark:border-blue-700/50"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-1 min-w-[28px] min-h-[28px] flex items-center justify-center transition-colors touch-manipulation"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X className="w-3.5 h-3.5" />
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
              className="flex-1 min-w-[100px] outline-none bg-transparent dark:text-white text-base"
            />
          </div>
        </div>

        {/* Expiration Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Expiration Date
            </label>
            <input
              type="datetime-local"
              value={linkData.expiresAt || ''}
              onChange={(e) => setLinkData({ ...linkData, expiresAt: e.target.value })}
              className="w-full px-4 py-3 min-h-[48px] text-base bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white dark:[color-scheme:dark]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
              <Shield className="inline w-4 h-4 mr-1" />
              Password Protection
            </label>
            <input
              type="password"
              value={linkData.password || ''}
              onChange={(e) => setLinkData({ ...linkData, password: e.target.value })}
              placeholder="Optional"
              autoComplete="new-password"
              className="w-full px-4 py-3 min-h-[48px] text-base bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white"
            />
          </div>
        </div>

        {/* UTM Parameters */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-3 sm:pt-4 sm:mt-4">
          <button
            type="button"
            onClick={() => setShowUTM(!showUTM)}
            className="w-full flex items-center justify-between p-3 min-h-[48px] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all group touch-manipulation"
            aria-expanded={showUTM}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm shadow-inner">
                📊
              </div>
              <div className="text-left">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  UTM Parameters
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Campaign tracking (Optional)
                </p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all text-xs ${showUTM ? 'bg-blue-600 text-white rotate-180 shadow-lg shadow-blue-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
              ▼
            </div>
          </button>

          {showUTM && (
            <div className="space-y-3 p-3 mt-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Source
                  </label>
                  <input
                    type="text"
                    value={linkData.utmSource || ''}
                    onChange={(e) => setLinkData({ ...linkData, utmSource: e.target.value })}
                    placeholder="e.g. facebook"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg transition-all outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Medium
                  </label>
                  <input
                    type="text"
                    value={linkData.utmMedium || ''}
                    onChange={(e) => setLinkData({ ...linkData, utmMedium: e.target.value })}
                    placeholder="e.g. cpc"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg transition-all outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Campaign
                  </label>
                  <input
                    type="text"
                    value={linkData.utmCampaign || ''}
                    onChange={(e) => setLinkData({ ...linkData, utmCampaign: e.target.value })}
                    placeholder="e.g. summer_sale"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg transition-all outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
