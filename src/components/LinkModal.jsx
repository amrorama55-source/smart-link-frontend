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
    { id: 'domains', label: 'Custom Domain', icon: Globe }
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
        <div className="bg-gray-900 w-full sm:max-w-3xl sm:rounded-2xl shadow-2xl flex flex-col border-0 sm:border border-gray-800 overflow-hidden h-[88dvh] sm:h-auto sm:max-h-[85vh] safe-bottom">

          {/* Header — X always visible, one place to close */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-gray-900 border-b border-gray-800/50 shrink-0 safe-top">
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

          {/* Tabs: dropdown on mobile (all options visible), chips on desktop */}
          <div className="bg-gray-900/80 border-b border-gray-800/50 shrink-0">
            {/* Mobile: single dropdown - no hidden options */}
            <div className="sm:hidden p-3">
              <label className="sr-only">Section</label>
              <div className="relative">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 text-base font-semibold rounded-xl border-2 border-gray-700 bg-gray-800 text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[48px]"
                  aria-label="Choose section"
                >
                  {tabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>{tab.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden="true" />
              </div>
            </div>
            {/* Desktop: horizontal chips */}
            <div className="hidden sm:block">
              <div className="flex gap-2 p-3 sm:p-4 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200
                        min-h-[40px]
                        ${isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500'
                          : 'bg-gray-800/40 text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-gray-700/50'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content - scrollable form so Enter key submits (no page navigation) */}
          <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain bg-gray-900 min-h-0 relative">
              {/* Mobile: sticky close bar so X is always visible when scrolling long Basic/Targeting */}
              <div className="sticky top-0 z-20 flex justify-end px-2 py-2 sm:hidden bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 -mb-px">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="px-4 sm:px-6 py-4">

                {/* Basic Tab */}
                {activeTab === 'basic' && (
                  <div className="h-[500px] overflow-y-auto pr-2 -mr-2">
                    <BasicTab
                      linkData={linkData}
                      setLinkData={setLinkData}
                      editingLink={editingLink}
                      errors={errors}
                    />
                  </div>
                )}

                {/* Advanced Tab - flexible height */}
                {activeTab === 'advanced' && (
                  <AdvancedTab
                    linkData={linkData}
                    setLinkData={setLinkData}
                    errors={errors}
                    addVariant={addVariant}
                    removeVariant={removeVariant}
                    updateVariant={updateVariant}
                  />
                )}

                {/* Targeting Tab */}
                {activeTab === 'targeting' && (
                  <div className="h-[500px] overflow-y-auto pr-2 -mr-2">
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
                  <div className="h-[500px] overflow-y-auto pr-2 -mr-2">
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
                  <div className="h-[500px] overflow-y-auto pr-2 -mr-2">
                    <CustomDomain
                      linkData={linkData}
                      setLinkData={setLinkData}
                      errors={errors}
                    />
                  </div>
                )}

              </div>
            </div>

            {/* Footer — Cancel and Create link equal width */}
            <div className="grid grid-cols-2 gap-3 px-4 sm:px-6 py-4 pb-[env(safe-area-inset-bottom)] sm:pb-4 bg-gray-900 border-t border-gray-800/50 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="w-full px-4 py-3 text-sm font-semibold text-gray-400 bg-gray-800/80 hover:bg-gray-800 hover:text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700/50 hover:border-gray-600 min-h-[48px] touch-manipulation"
              >
                Cancel
              </button>
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
