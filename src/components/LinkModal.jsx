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

      {/* Modal */}
      <div className="fixed inset-0 sm:p-4 flex items-end sm:items-center justify-center z-50">
        <div className="bg-gray-900 w-full h-full sm:h-auto sm:max-w-3xl sm:rounded-2xl shadow-2xl flex flex-col border-0 sm:border border-gray-800">

          {/* Header - Fixed at top */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
            <h2 id="link-modal-title" className="text-lg font-bold text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span>{editingLink ? 'Edit Link' : 'Create Link'}</span>
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 min-h-[44px] min-w-[44px]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs - Equal width for all tabs */}
          <div className="bg-gray-900 border-b border-gray-800 shrink-0">
            <div className="grid grid-cols-5 w-full">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex flex-col items-center justify-center gap-1
                      px-2 py-2.5 text-[10px] sm:text-xs font-medium 
                      transition-all duration-200 border-b-2 min-h-[50px]
                      ${isActive
                        ? 'text-blue-400 border-blue-500 bg-blue-500/10'
                        : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-800/50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate w-full text-center">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content - Scrollable */}
          <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-900 custom-scrollbar">
              <div className="px-4 py-4 space-y-4">

                {/* Basic Tab */}
                {activeTab === 'basic' && (
                  <BasicTab
                    linkData={linkData}
                    setLinkData={setLinkData}
                    editingLink={editingLink}
                    errors={errors}
                  />
                )}

                {/* Advanced Tab */}
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
                  <TargetingTab
                    linkData={linkData}
                    setLinkData={setLinkData}
                    errors={errors}
                    addGeoRule={addGeoRule}
                    removeGeoRule={removeGeoRule}
                    updateGeoRule={updateGeoRule}
                  />
                )}

                {/* Tracking Tab */}
                {activeTab === 'tracking' && (
                  <TrackingTab
                    linkData={linkData}
                    addPixel={addPixel}
                    removePixel={removePixel}
                    updatePixel={updatePixel}
                    errors={errors}
                  />
                )}

                {/* Custom Domains Tab */}
                {activeTab === 'domains' && (
                  <CustomDomain
                    linkData={linkData}
                    setLinkData={setLinkData}
                    errors={errors}
                  />
                )}

              </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="px-4 py-3 bg-gray-900 border-t border-gray-800 shrink-0">
              <LoadingButton
                type="submit"
                loading={submitting}
                className="w-full px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 min-h-[48px]"
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