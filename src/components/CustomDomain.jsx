// src/components/CustomDomain.jsx - FIXED VERSION
import { useState, useEffect } from 'react';
import { Globe, CheckCircle, X, AlertTriangle, Loader, ExternalLink, Shield } from 'lucide-react';
import api from '../services/api';
import { API_URL } from '../config'; // ✅ Import API_URL

export default function CustomDomain({ link, onUpdate }) {
  const [domain, setDomain] = useState(link?.customDomain || '');
  const [verifying, setVerifying] = useState(false);
  const [verification, setVerification] = useState(null);
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (link?.customDomain) {
      setDomain(link.customDomain);
      checkVerificationStatus();
    }
  }, [link]);

  const requestVerification = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      // ✅ FIXED: Remove /api prefix (api.js already has it)
      const { data } = await api.post(`/domains/${link.shortCode}/domain/verify-request`, {
        domain: domain.toLowerCase().trim()
      });

      setVerification(data.verification);
      setShowInstructions(true);
      
      alert('Verification token generated! Please add the DNS records.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request verification');
    } finally {
      setVerifying(false);
    }
  };

  const checkVerificationStatus = async () => {
    setVerifying(true);
    setError('');

    try {
      // ✅ FIXED: Remove /api prefix
      const { data } = await api.post(`/domains/${link.shortCode}/domain/verify-check`);

      if (data.success) {
        setVerification({
          ...data.verification,
          verified: true
        });
        alert('Domain verified successfully! 🎉');
        if (onUpdate) onUpdate();
      } else {
        setVerification(data.verification);
        setError('Verification pending. Please ensure DNS records are correct.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const removeDomain = async () => {
    if (!confirm('Remove custom domain? This will revert to the default domain.')) {
      return;
    }

    try {
      // ✅ FIXED: Remove /api prefix
      await api.delete(`/domains/${link.shortCode}/domain`);
      setDomain('');
      setVerification(null);
      setShowInstructions(false);
      alert('Custom domain removed');
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove domain');
    }
  };

  const checkSSL = async () => {
    try {
      // ✅ FIXED: Remove /api prefix
      const { data } = await api.get(`/domains/${link.shortCode}/domain/ssl-status`);
      alert(data.ssl.enabled ? 'SSL is active ✅' : 'SSL is being issued... Check back in a few hours.');
    } catch (err) {
      alert('Failed to check SSL status');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Custom Domain
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Use your own domain for branded short links
          </p>
        </div>
      </div>

      {/* Domain Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Domain
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="links.yourdomain.com"
              disabled={verification?.verified}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {verification?.verified ? (
              <button
                onClick={removeDomain}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={requestVerification}
                disabled={verifying || !domain}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifying ? 'Processing...' : 'Setup'}
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Verification Status */}
        {verification && (
          <div className={`p-4 rounded-lg border ${
            verification.verified
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
          }`}>
            <div className="flex items-start gap-3">
              {verification.verified ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <Loader className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5 animate-spin" />
              )}
              <div className="flex-1">
                <p className={`font-semibold mb-1 ${
                  verification.verified
                    ? 'text-green-900 dark:text-green-100'
                    : 'text-yellow-900 dark:text-yellow-100'
                }`}>
                  {verification.verified ? '✅ Domain Verified!' : '⏳ Verification Pending'}
                </p>
                {verification.verified ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Your custom domain is active! Links will now use: <br />
                      <code className="px-2 py-1 bg-green-100 dark:bg-green-900/40 rounded mt-1 inline-block">
                        https://{domain}/{link.shortCode}
                      </code>
                    </p>
                    
                    {/* SSL Status */}
                    <button
                      onClick={checkSSL}
                      className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 hover:underline"
                    >
                      <Shield className="w-4 h-4" />
                      Check SSL Status
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      DNS records not detected yet. Please add the records below and click "Verify".
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={checkVerificationStatus}
                        disabled={verifying}
                        className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-lg font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50"
                      >
                        {verifying ? 'Checking...' : 'Verify Now'}
                      </button>
                      <button
                        onClick={() => setShowInstructions(!showInstructions)}
                        className="px-3 py-1.5 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 text-sm rounded-lg font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors"
                      >
                        {showInstructions ? 'Hide' : 'Show'} Instructions
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DNS Instructions */}
        {showInstructions && verification?.methods && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                DNS Configuration
              </h4>
              {/* ✅ FIXED: Use API_URL from config */}
              <a
                href={`${API_URL}/domains/setup-guide`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Full Guide
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add these DNS records to your domain provider:
            </p>

            {verification.methods.map((method, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {method.type} Record
                  </span>
                  {method.instructions.purpose && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {method.instructions.purpose}
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">Type:</span>
                      <p className="font-mono text-gray-900 dark:text-white">
                        {method.instructions.recordType}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">Host:</span>
                      <p className="font-mono text-gray-900 dark:text-white break-all">
                        {method.instructions.host}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">Value:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded text-xs break-all">
                        {method.instructions.value}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(method.instructions.value);
                          alert('Copied!');
                        }}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <CopyIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Provider-specific guides */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              <p className="font-semibold mb-2">Popular DNS Providers:</p>
              <div className="grid grid-cols-2 gap-2">
                <div>• Cloudflare: DNS → Records</div>
                <div>• Namecheap: Advanced DNS</div>
                <div>• GoDaddy: DNS Management</div>
                <div>• Google Domains: DNS Settings</div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 dark:text-blue-200">
                DNS propagation can take 5-48 hours. SSL certificates are issued automatically after verification.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Helper component for Copy icon
function CopyIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}