import { Globe, AlertCircle, CheckCircle, Copy, Shield, Eye, EyeOff, ChevronDown, ChevronUp, Key } from 'lucide-react';
import { useState, useRef } from 'react';
import { SHORT_URL_BASE } from '../../config';

export default function CustomDomain({ linkData, setLinkData }) {
  const [showDNSInstructions, setShowDNSInstructions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState(false);
  const passwordInputRef = useRef(null);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setLinkData({ ...linkData, password: newPassword });
    
    if (newPassword && newPassword.length < 6) {
      setPasswordWarning(true);
    } else {
      setPasswordWarning(false);
    }
  };

  const handlePasswordFocus = () => {
    setPasswordWarning(false);
  };

  const copyDNSRecord = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
        <div className="flex items-start gap-3">
          <Globe className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Custom Domain & Security
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use your own domain for branded links and add password protection
            </p>
          </div>
        </div>
      </div>

      {/* Custom Domain Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <Globe className="inline w-4 h-4 mr-1" />
          Custom Domain (Optional)
        </label>
        <input
          type="text"
          value={linkData.customDomain || ''}
          onChange={(e) => setLinkData({ ...linkData, customDomain: e.target.value })}
          placeholder="link.yourdomain.com"
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          💡 Use your own domain instead of {SHORT_URL_BASE}
        </p>
      </div>

      {/* DNS Instructions Toggle */}
      {linkData.customDomain && (
        <button
          type="button"
          onClick={() => setShowDNSInstructions(!showDNSInstructions)}
          className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-blue-900 dark:text-blue-100">
              DNS Configuration Instructions
            </span>
          </div>
          {showDNSInstructions ? (
            <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          )}
        </button>
      )}

      {/* DNS Instructions Content */}
      {linkData.customDomain && showDNSInstructions && (
        <div className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Step 1: Add CNAME Record
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Go to your domain's DNS settings and add this CNAME record:
            </p>
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-3 font-mono text-sm">
              <div className="grid grid-cols-3 gap-4 mb-2">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">Type</span>
                  <span className="text-gray-900 dark:text-white">CNAME</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">Name</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-white break-all">{linkData.customDomain}</span>
                    <button
                      type="button"
                      onClick={() => copyDNSRecord(linkData.customDomain)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">Value</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-white">{SHORT_URL_BASE}</span>
                    <button
                      type="button"
                      onClick={() => copyDNSRecord(SHORT_URL_BASE)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-semibold mb-1">DNS Propagation Time</p>
                <p>It may take up to 48 hours for DNS changes to propagate worldwide.</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800 dark:text-green-200">
                <p className="font-semibold mb-1">SSL Certificate</p>
                <p>We'll automatically provision an SSL certificate for your custom domain.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alias - Only shown when custom domain is set */}
      {linkData.customDomain && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Custom Alias (Optional)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              https://{linkData.customDomain}/
            </span>
            <input
              type="text"
              value={linkData.customAlias || ''}
              onChange={(e) => setLinkData({ ...linkData, customAlias: e.target.value })}
              placeholder="my-custom-link"
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Leave empty for random short code
          </p>
        </div>
      )}

      {/* Divider */}
      <div className="border-t-2 border-gray-200 dark:border-gray-700"></div>

      {/* Password Protection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <Shield className="inline w-4 h-4 mr-1" />
          Password Protection (Optional)
        </label>
        <div className="relative">
          <input
            ref={passwordInputRef}
            type={showPassword ? "text" : "password"}
            value={linkData.password || ''}
            onChange={handlePasswordChange}
            onFocus={(e) => {
              e.target.removeAttribute('readonly');
              handlePasswordFocus();
            }}
            placeholder="Create a password for this link..."
            autoComplete="new-password"
            data-form-type="other"
            data-lpignore="true"
            readOnly
            className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white ${
              passwordWarning ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        
        {passwordWarning && (
          <div className="mt-2 flex items-start gap-2 text-sm text-yellow-700 dark:text-yellow-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>Password should be at least 6 characters for better security</p>
          </div>
        )}
        
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          🔒 Visitors will need to enter this password to access the link
        </p>
      </div>

      {/* Security Tips */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-indigo-900 dark:text-indigo-100">
            <p className="font-semibold mb-1">Security Tips</p>
            <ul className="list-disc list-inside space-y-1 text-indigo-800 dark:text-indigo-200">
              <li>Use a strong password (at least 8 characters)</li>
              <li>Combine letters, numbers, and symbols</li>
              <li>Don't reuse passwords from other services</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}