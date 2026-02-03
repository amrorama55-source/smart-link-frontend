import { useEffect } from 'react';
import LoadingButton from '../components/LoadingButton';
import {
  Link2, Plus, Trash2, X, Target, Globe2, Calendar,
  Smartphone, TrendingUp, Zap, Shield, AlertCircle, Globe, ChevronDown
} from 'lucide-react';

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

  const tabs = [
    { id: 'basic', label: 'Basic', icon: Link2 },
    { id: 'advanced', label: 'Advanced', icon: Target },
    { id: 'targeting', label: 'Targeting', icon: Smartphone },
    { id: 'tracking', label: 'Tracking', icon: TrendingUp },
    { id: 'domains', label: 'Domain', icon: Globe }
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
      <div className="fixed inset-0 sm:inset-0 sm:p-4 flex items-end sm:items-center justify-center z-50 sm:bg-black/40">
        <div className="bg-gray-900 w-full sm:max-w-3xl sm:rounded-2xl shadow-2xl flex flex-col border-0 sm:border border-gray-800 overflow-hidden max-h-[92vh] safe-bottom">

          {/* Header — Sticky & Always Visible */}
          <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-gray-900 border-b border-gray-800/50 shrink-0 safe-top">
            <h2 id="link-modal-title" className="text-base sm:text-xl font-bold text-white flex items-center gap-2 truncate min-w-0">
              <Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />
              <span className="truncate">{editingLink ? 'Edit Link' : 'Create Link'}</span>
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Tabs - موحدة بنفس الحجم لجميع الأجهزة */}
          <div className="bg-gray-900/80 border-b border-gray-800/50 shrink-0">
            {/* Mobile & Desktop: horizontal scroll with equal width tabs */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-0 p-0 min-w-full">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex-1 min-w-0 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 
                        px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold 
                        transition-all duration-200 border-b-2 touch-manipulation
                        ${isActive
                          ? 'bg-blue-600/10 text-blue-400 border-blue-500'
                          : 'bg-transparent text-gray-400 hover:bg-gray-800/40 hover:text-gray-200 border-transparent'
                        }
                      `}
                      style={{ minWidth: '20%' }} // Each tab takes 20% on larger screens
                    >
                      <Icon className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate text-center sm:text-left">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content - Fixed height for all tabs with scroll */}
          <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Fixed height scrollable area - SAME FOR ALL TABS */}
            <div 
              className="overflow-y-auto overflow-x-hidden overscroll-contain bg-gray-900 custom-scrollbar"
              style={{ 
                height: 'calc(92vh - 250px)',
                minHeight: '400px',
                maxHeight: '600px'
              }}
            >
              <div className="px-4 sm:px-6 py-4 min-h-full">

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
                    <AdvancedTab
                      linkData={linkData}
                      setLinkData={setLinkData}
                      errors={errors}
                      addVariant={addVariant}
                      removeVariant={removeVariant}
                      updateVariant={updateVariant}
                    />
                  </div>
                )}

                {/* Targeting Tab */}
                {activeTab === 'targeting' && (
                  <div className="min-h-full">
                    <TargetingTab
                      linkData={linkData}
                      setLinkData={setLinkData}
                      errors={errors}
                      addGeoRule={addGeoRule}
                      removeGeoRule={removeGeoRule}
                      updateGeoRule={updateGeoRule}
                    />
                  </div>
                )}

                {/* Tracking Tab */}
                {activeTab === 'tracking' && (
                  <div className="min-h-full">
                    <TrackingTab
                      linkData={linkData}
                      addPixel={addPixel}
                      removePixel={removePixel}
                      updatePixel={updatePixel}
                      errors={errors}
                    />
                  </div>
                )}

                {/* Custom Domains Tab */}
                {activeTab === 'domains' && (
                  <div className="min-h-full">
                    <CustomDomain
                      linkData={linkData}
                      setLinkData={setLinkData}
                      errors={errors}
                    />
                  </div>
                )}

              </div>
            </div>

            {/* Footer — Create link full width */}
            <div className="px-4 sm:px-6 py-4 pb-[env(safe-area-inset-bottom)] sm:pb-4 bg-gray-900 border-t border-gray-800/50 shrink-0">
              <LoadingButton
                type="submit"
                loading={submitting}
                className="w-full px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 active:scale-[0.98] min-h-[48px] touch-manipulation"
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