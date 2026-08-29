import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, X, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastProvider';

// Feature gates - which plans have access to which features
export const FEATURE_GATES = {
  free: ['create_link', 'basic_analytics', 'bio_page', 'static_qr', 'utm_builder', 'password_protection'],
  pro: [
    'custom_domain',
    'ab_testing',
    'smart_targeting',
    'advanced_analytics',
    'dynamic_qr',
  ],
  business: [
    'tracking_pixels',
    'api_access',
    'white_label',
    'conversion_tracking',
    'dedicated_support'
  ]
};

export const FEATURE_LABELS = {
  custom_domain: 'Custom Domains',
  ab_testing: 'A/B Testing',
  smart_targeting: 'Smart Targeting',
  advanced_analytics: 'Advanced Analytics',
  dynamic_qr: 'Dynamic QR Codes',
  tracking_pixels: 'Tracking Pixels',
  api_access: 'API Access',
  white_label: 'White-label Support',
  conversion_tracking: 'Conversion Tracking',
  dedicated_support: 'Dedicated Support Manager'
};

export default function UpgradeNudge({
  feature,
  title,
  message,
  onClose,
  onUpgrade,
  onTryFree
}) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
          {title || '🔒 Premium Feature'}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {message || `Upgrade to unlock ${FEATURE_LABELS[feature] || 'this feature'}`}
        </p>

        <div className="space-y-3">
          <button
            onClick={onUpgrade || (() => navigate('/pricing'))}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Upgrade Now
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTryFree || (() => navigate('/pricing'))}
            className="w-full py-3 border-2 border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Try Business Free for 7 Days
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for checking feature access
export function useCheckFeature() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { info, warning } = useToast();

  const checkFeature = React.useCallback((feature, showNudge = true) => {
    if (!user) return { allowed: false, reason: 'not_logged_in' };

    const plan = user.plan || 'free';

    if (FEATURE_GATES.free.includes(feature)) return { allowed: true };

    // Trial & Business = full access
    if (plan === 'trial' || plan === 'business') return { allowed: true };

    if (plan === 'pro') {
      if (FEATURE_GATES.pro.includes(feature)) return { allowed: true };
      if (FEATURE_GATES.business.includes(feature)) {
        if (showNudge) {
          warning(`🔒 ${FEATURE_LABELS[feature]} requires BUSINESS plan`, {
            duration: 4000,
            action: { label: 'Upgrade', onClick: () => navigate('/pricing') }
          });
        }
        return { allowed: false, reason: 'requires_business' };
      }
    }

    if (showNudge) {
      info(`🔒 ${FEATURE_LABELS[feature]} requires a paid plan`, {
        duration: 4000,
        action: { label: 'View Plans', onClick: () => navigate('/pricing') }
      });
    }

    return { allowed: false, reason: 'requires_pro' };
  }, [user, navigate, info, warning]);

  return { checkFeature };
}

// Hook for showing upgrade nudges on specific actions
export function useUpgradeNudge() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { info } = useToast();

  const showNudge = React.useCallback((feature) => {
    if (!user) { navigate('/login'); return false; }

    const plan = user.plan || 'free';

    // business, pro, trial = allow
    if (plan === 'business' || plan === 'pro' || plan === 'trial') return true;

    if (FEATURE_GATES.business.includes(feature)) {
      info('🔒 This feature requires BUSINESS plan', {
        duration: 4000,
        action: { label: 'Upgrade', onClick: () => navigate('/pricing') }
      });
      return false;
    }

    if (FEATURE_GATES.pro.includes(feature)) {
      info('🔒 This feature requires PRO plan', {
        duration: 4000,
        action: { label: 'Upgrade', onClick: () => navigate('/pricing') }
      });
      return false;
    }

    return true;
  }, [user, navigate, info]);

  return { showNudge };
}
