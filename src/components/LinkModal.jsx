import { useEffect } from 'react';
import LoadingButton from '../components/LoadingButton';
import {
  Link2, Plus, Trash2, X, Target, Globe2, Calendar,
  Smartphone, TrendingUp, Zap, Shield, AlertCircle, Globe, ChevronDown, Crown, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Import tab components
import BasicTab from './tabs/BasicTab';
import AdvancedTab from './tabs/AdvancedTab';
import TargetingTab from './tabs/TargetingTab';
import TrackingTab from './tabs/TrackingTab';
import CustomDomain from './tabs/CustomDomain';

export default function LinkModal({
  show, onClose, linkData, setLinkData, editingLink,
  activeTab, setActiveTab, showAdvancedFeatures, setShowAdvancedFeatures,
  handleSubmit, submitting, errors,
  addVariant, removeVariant, updateVariant,
  addGeoRule, removeGeoRule, updateGeoRule,
  addPixel, removePixel, updatePixel
}) {
  useEffect(() => {
    if (show) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [show]);

  if (!show) return null;

  const { user } = useAuth();

  const userPlan = user?.plan || 'free';
  const trialEndsAt = user?.trialEndsAt ? new Date(user.trialEndsAt) : null;
  const isTrialActive = userPlan === 'trial' && trialEndsAt && trialEndsAt > new Date();

  const hasProAccess = ['pro', 'business', 'admin'].includes(userPlan) || isTrialActive;
  const hasBusinessAccess = ['business', 'admin'].includes(userPlan) || isTrialActive;

  const tabs = [
    { id: 'basic', label: 'Basic', icon: Link2, premium: false },
    { id: 'advanced', label: 'Advanced', icon: Target, premium: true, required: 'Pro' },
    { id: 'targeting', label: 'Targeting', icon: Smartphone, premium: true, required: 'Pro' },
    { id: 'tracking', label: 'Tracking', icon: TrendingUp, premium: true, required: 'Business' },
    { id: 'domains', label: 'Domain', icon: Globe, premium: true, required: 'Pro' }
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="link-modal-title">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal: full-screen on mobile, centered on desktop */}
      <div className="fixed inset-0 sm:inset-0 sm:p-4 flex items-end sm:items-center justify-center z-[10000] sm:bg-black/40">
        <div className="bg-white dark:bg-gray-900 w-full sm:max-w-3xl sm:rounded-2xl shadow-2xl flex flex-col border-0 sm:border border-gray-200 dark:border-gray-800 overflow-hidden max-h-[92vh] safe-bottom">

          {/* Header — Sticky & Always Visible */}
          <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800/50 shrink-0 safe-top">
            <h2 id="link-modal-title" className="text-base sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 truncate min-w-0">
              <Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />
              <span className="truncate">{editingLink ? 'Edit Link' : 'Create Link'}</span>
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 p-2.5 rounded-xl text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Tabs - موحدة بنفس الحجم لجميع الأجهزة */}
          <div className="bg-white dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800/50 shrink-0">
            {/* Mobile & Desktop: horizontal scroll with equal width tabs */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-0 p-0 min-w-full">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const isLocked = tab.premium && (tab.required === 'Business' ? !hasBusinessAccess : !hasProAccess);

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex-1 min-w-0 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 
                        px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold 
                        transition-all duration-200 border-b-2 touch-manipulation relative
                        ${isActive
                          ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500'
                          : 'bg-transparent text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/40 hover:text-gray-600 dark:hover:text-gray-200 border-transparent'
                        }
                      `}
                      style={{ minWidth: '20%' }} // Each tab takes 20% on larger screens
                    >
                      <Icon className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate text-center sm:text-left">{tab.label}</span>
                      {isLocked && (
                        <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 absolute top-1 right-1 sm:static sm:ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content - Fixed height for all tabs with scroll */}
          <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div
              className="overflow-y-auto overflow-x-hidden overscroll-contain bg-white dark:bg-gray-900 custom-scrollbar"
              style={{
                height: 'calc(92vh - 250px)',
                minHeight: '300px',
                maxHeight: '600px'
              }}
            >
              <div className="px-4 sm:px-6 py-4">

                {/* Basic Tab */}
                {activeTab === 'basic' && (
                  <div className="min-h-full">
                    <BasicTab
                      linkData={linkData}
                      setLinkData={setLinkData}
                      editingLink={editingLink}
                      errors={errors}
                    />
                  </div>
                )}

                {/* Advanced Tab */}
                {activeTab === 'advanced' && (
                  <div className="min-h-full">
                    {!hasProAccess ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                          <Crown className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Unlock A/B Testing</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mb-6">
                          Test multiple destination URLs for a single link and optimize your conversion rates.
                        </p>
                        <a href="/pricing" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all">
                          Upgrade to Pro
                        </a>
                      </div>
                    ) : (
                      <AdvancedTab
                        linkData={linkData}
                        setLinkData={setLinkData}
                        errors={errors}
                        addVariant={addVariant}
                        removeVariant={removeVariant}
                        updateVariant={updateVariant}
                      />
                    )}
                  </div>
                )}

                {/* Targeting Tab */}
                {activeTab === 'targeting' && (
                  <div className="min-h-full">
                    {!hasProAccess ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                          <Target className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Smart Targeting</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mb-6">
                          Direct users based on their device, country, or schedule to maximize relevance.
                        </p>
                        <a href="/pricing" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all">
                          Upgrade to Pro
                        </a>
                      </div>
                    ) : (
                      <TargetingTab
                        linkData={linkData}
                        setLinkData={setLinkData}
                        errors={errors}
                        addGeoRule={addGeoRule}
                        removeGeoRule={removeGeoRule}
                        updateGeoRule={updateGeoRule}
                      />
                    )}
                  </div>
                )}

                {/* Tracking Tab */}
                {activeTab === 'tracking' && (
                  <div className="min-h-full">
                    {!hasBusinessAccess ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
                          <TrendingUp className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Retargeting Pixels</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mb-6">
                          Track users with Facebook, Google, and LinkedIn pixels for powerful retargeting campaigns.
                        </p>
                        <a href="/pricing" className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all">
                          Upgrade to Business
                        </a>
                      </div>
                    ) : (
                      <TrackingTab
                        linkData={linkData}
                        addPixel={addPixel}
                        removePixel={removePixel}
                        updatePixel={updatePixel}
                        errors={errors}
                      />
                    )}
                  </div>
                )}

                {/* Custom Domains Tab */}
                {activeTab === 'domains' && (
                  <div className="min-h-full">
                    {!hasProAccess ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                          <Globe className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Custom Domains</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mb-6">
                          Use your own domain for short links to increase trust and professional branding.
                        </p>
                        <a href="/pricing" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all">
                          Upgrade to Pro
                        </a>
                      </div>
                    ) : (
                      <CustomDomain
                        linkData={linkData}
                        setLinkData={setLinkData}
                        errors={errors}
                      />
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Footer — Create link full width */}
            <div className="px-4 sm:px-6 py-4 pb-[env(safe-area-inset-bottom)] sm:pb-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800/50 shrink-0 space-y-3">
              {/* Inline submit error — always visible inside the modal, no z-index dependency */}
              {errors._submit && (
                <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-300 leading-snug">
                      {errors._submit}
                    </p>
                    {/* Show upgrade CTA if the error looks like a plan restriction */}
                    {(errors._submit.toLowerCase().includes('plan') ||
                      errors._submit.toLowerCase().includes('upgrade') ||
                      errors._submit.toLowerCase().includes('limit') ||
                      errors._submit.toLowerCase().includes('trial')) && (
                        <a
                          href="/pricing"
                          className="inline-flex items-center gap-1 mt-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Crown className="w-3 h-3" />
                          View upgrade options →
                        </a>
                      )}
                  </div>
                </div>
              )}

              <LoadingButton
                type="submit"
                loading={submitting}
                className="w-full min-h-[48px] touch-manipulation"
              >
                {editingLink ? 'Save changes' : 'Create link'}
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}