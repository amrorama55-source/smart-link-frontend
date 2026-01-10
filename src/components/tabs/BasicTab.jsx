import { SHORT_URL_BASE } from '../../config';
import { X, AlertCircle, Globe, Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function BasicTab({ linkData, setLinkData, editingLink, errors }) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState(false);
  const passwordInputRef = useRef(null);
  
  // ✅ Generate random field names to prevent autocomplete
  const [fieldIds] = useState({
    password: `pwd_${Math.random().toString(36).substring(7)}`,
    domain: `dom_${Math.random().toString(36).substring(7)}`
  });

  // ✅ Check if targeting is being used (for Smart UI)
  const hasGeoTargeting = linkData.geoRules && linkData.geoRules.some(r => 
    r.countries?.length > 0 && r.targetUrl?.trim()
  );
  const hasDeviceTargeting = linkData.deviceRules && (
    linkData.deviceRules.mobile?.trim() ||
    linkData.deviceRules.desktop?.trim() ||
    linkData.deviceRules.tablet?.trim()
  );
  const hasABTest = linkData.abTest?.enabled && 
                    linkData.abTest.variants?.length >= 2;
  
  const hasAnyTargeting = hasGeoTargeting || hasDeviceTargeting || hasABTest;

  // ✅ Detect autofill
  useEffect(() => {
    if (!passwordTouched && passwordInputRef.current) {
      const timer = setTimeout(() => {
        const input = passwordInputRef.current;
        if (input && input.value && !passwordTouched) {
          setPasswordWarning(true);
          console.warn('⚠️ Autofill detected!');
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [passwordTouched]);

  const handlePasswordChange = (e) => {
    setLinkData({...linkData, password: e.target.value});
    setPasswordTouched(true);
    setPasswordWarning(false);
  };

  const handlePasswordFocus = () => {
    if (!passwordTouched && passwordInputRef.current?.value) {
      // Clear autofilled value
      setLinkData({...linkData, password: ''});
      passwordInputRef.current.value = '';
      setPasswordWarning(false);
    }
    setPasswordTouched(true);
  };

  const clearPassword = () => {
    setLinkData({...linkData, password: ''});
    if (passwordInputRef.current) {
      passwordInputRef.current.value = '';
    }
    setPasswordWarning(false);
    setPasswordTouched(false);
  };

  return (
    <div className="space-y-4">
      
      {/* ======================================== */}
      {/* ORIGINAL URL - SMART UI (Solution 3) */}
      {/* ======================================== */}
      {!editingLink && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {hasAnyTargeting ? (
              <span className="flex items-center gap-2">
                🔗 Fallback URL
                <span className="text-xs text-orange-600 dark:text-orange-400 font-normal px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 rounded">
                  Recommended
                </span>
              </span>
            ) : (
              <>Original URL *</>
            )}
          </label>
          
          <input
            type="url"
            value={linkData.originalUrl}
            onChange={(e) => setLinkData({...linkData, originalUrl: e.target.value})}
            placeholder={
              hasAnyTargeting 
                ? "https://example.com/default (users go here if no targeting rule matches)"
                : "https://example.com/your-long-url"
            }
            autoComplete="off"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.originalUrl ? 'border-red-500' : 'border-gray-300'
            }`}
            required={!hasAnyTargeting}
          />
          
          {/* ✅ Smart Helper Text - Show only when targeting is enabled */}
          {!errors.originalUrl && hasAnyTargeting && !linkData.originalUrl?.trim() && (
            <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-lg">
              <p className="text-sm text-orange-700 dark:text-orange-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Tip:</strong> Add a fallback URL for visitors who don't match your targeting rules.
                  Without it, unmatched users will see an error.
                </span>
              </p>
            </div>
          )}
          
          {/* ✅ Success Message - Show when fallback URL is set */}
          {hasAnyTargeting && linkData.originalUrl?.trim() && (
            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg">
              <p className="text-xs text-green-700 dark:text-green-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Smart targeting enabled! This URL will be used as fallback.
              </p>
            </div>
          )}
          
          {errors.originalUrl && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.originalUrl}
            </p>
          )}
          
          {linkData.originalUrl && !hasAnyTargeting && (
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
              autoComplete="off"
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
            Leave empty for random short code
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
          autoComplete="off"
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
          autoComplete="off"
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
          autoComplete="off"
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

      {/* Custom Domain */}
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
            autoComplete="off"
            name={fieldIds.domain}
            id={fieldIds.domain}
            data-lpignore="true"
            data-form-type="other"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        {linkData.customDomain && (
          <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                DNS verification required after saving
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Password Protection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Password Protection (Optional)
        </label>
        
        {/* Warning */}
        <div className="mb-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-900 dark:text-red-200 mb-1">
                🚨 IMPORTANT: Read This!
              </p>
              <p className="text-sm text-red-800 dark:text-red-300">
                This is a <strong>NEW password for THIS LINK ONLY</strong> - NOT your account password!
                <br/>
                <span className="text-xs mt-1 block">
                  ⚠️ Your browser may auto-fill your account password - ALWAYS verify before saving!
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Autofill Warning */}
        {passwordWarning && (
          <div className="mb-3 p-3 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500 dark:border-yellow-600 rounded-lg animate-pulse">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-700 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-yellow-900 dark:text-yellow-200">
                  ⚠️ Browser Auto-Filled This Field!
                </p>
                <p className="text-xs text-yellow-800 dark:text-yellow-300 mt-1">
                  Is this the password for THIS LINK (not your account)?
                </p>
                <button
                  type="button"
                  onClick={clearPassword}
                  className="mt-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded font-medium transition"
                >
                  ❌ Clear & Enter Manually
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Honeypot fields */}
        <div style={{position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden'}}>
          <input type="email" tabIndex="-1" autoComplete="email" />
          <input type="password" tabIndex="-1" autoComplete="current-password" />
        </div>

        <div className="relative">
          <input
            ref={passwordInputRef}
            type={showPassword ? "text" : "password"}
            value={linkData.password || ''}
            onChange={handlePasswordChange}
            onFocus={handlePasswordFocus}
            placeholder="Create a NEW password for this link"
            autoComplete="new-password"
            data-form-type="other"
            data-lpignore="true"
            data-1p-ignore="true"
            data-bwignore="true"
            data-dashlane-ignore="true"
            name={fieldIds.password}
            id={fieldIds.password}
            readOnly
            onFocus={(e) => {
              e.target.removeAttribute('readonly');
              handlePasswordFocus();
            }}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              passwordWarning ? 'border-yellow-500 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/10' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="mt-2 space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            👥 Users will need this password to access the link
          </p>
          
          {linkData.password && passwordTouched && (
            <>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-600 dark:text-gray-400">
                  Strength:
                </span>
                <span className={`font-medium ${
                  linkData.password.length >= 8 
                    ? 'text-green-600 dark:text-green-400' 
                    : linkData.password.length >= 6 
                    ? 'text-yellow-600 dark:text-yellow-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {linkData.password.length >= 8 ? '✅ Strong' : linkData.password.length >= 6 ? '⚠️ Medium' : '❌ Weak'}
                </span>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  <strong>Current password:</strong>
                  <br/>
                  <code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded font-mono text-xs mt-1 inline-block">
                    {showPassword ? linkData.password : '•'.repeat(linkData.password.length)}
                  </code>
                </p>
              </div>
            </>
          )}
        </div>
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
      </div>

      {/* UTM Parameters */}
      <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
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
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}