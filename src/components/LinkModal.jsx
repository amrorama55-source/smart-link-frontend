import { SHORT_URL_BASE } from '../config';
import LoadingButton from '../components/LoadingButton';
import {
  Link2, Plus, Trash2, X, Target, Globe2, Calendar,
  Smartphone, TrendingUp, Zap, Shield, AlertCircle
} from 'lucide-react';

// Import tab components
import BasicTab from './tabs/BasicTab';
import AdvancedTab from './tabs/AdvancedTab';
import TargetingTab from './tabs/TargetingTab';
import TrackingTab from './tabs/TrackingTab';

export default function LinkModal({ 
  show, onClose, linkData, setLinkData, editingLink, 
  activeTab, setActiveTab, showAdvancedFeatures, setShowAdvancedFeatures,
  handleSubmit, submitting, errors,
  addVariant, removeVariant, updateVariant,
  addGeoRule, removeGeoRule, updateGeoRule,
  addPixel, removePixel, updatePixel
}) {
  if (!show) return null;

  const tabs = [
    { id: 'basic', label: 'Basic', icon: Link2 },
    { id: 'advanced', label: 'Advanced', icon: Target },
    { id: 'targeting', label: 'Targeting', icon: Globe2 },
    { id: 'tracking', label: 'Tracking', icon: TrendingUp }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container - FULLY RESPONSIVE */}
      <div className="fixed inset-0 flex items-start sm:items-center justify-center p-0 sm:p-4">
        <div 
          className="relative w-full h-full sm:h-auto sm:max-h-[95vh] sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[75%] sm:max-w-4xl bg-white dark:bg-gray-800 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden safe-top safe-bottom"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header - STICKY ON MOBILE */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 md:px-8 py-4 sm:py-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 pr-2">
                  {editingLink ? 'Edit Smart Link' : 'Create New Smart Link'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pr-2">
                  {editingLink ? 'Update your link settings' : 'Create a powerful smart link with targeting and analytics'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px]"
                aria-label="Close"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Tabs - HORIZONTAL SCROLL ON MOBILE */}
          <div className="sticky top-[88px] sm:top-[96px] z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 md:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-shrink-0 min-w-[100px] sm:min-w-[120px] min-h-[44px]
                      px-3 sm:px-4 py-2.5 rounded-lg font-medium 
                      whitespace-nowrap transition-all 
                      flex items-center justify-center gap-2
                      text-sm sm:text-base
                      ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-md scale-105'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content - SCROLLABLE */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
              
              {/* ============================================ */}
              {/* BASIC TAB */}
              {/* ============================================ */}
              {activeTab === 'basic' && (
                <BasicTab
                  linkData={linkData}
                  setLinkData={setLinkData}
                  editingLink={editingLink}
                  errors={errors}
                />
              )}

              {/* ============================================ */}
              {/* ADVANCED TAB - A/B Testing */}
              {/* ============================================ */}
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

              {/* ============================================ */}
              {/* TARGETING TAB - FIXED */}
              {/* ============================================ */}
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

              {/* ============================================ */}
              {/* TRACKING TAB - FIXED */}
              {/* ============================================ */}
             {activeTab === 'tracking' && (
  <TrackingTab
    linkData={linkData}           // ✅ CRITICAL: Must pass linkData
    addPixel={addPixel}            // ✅ CRITICAL: Must pass function
    removePixel={removePixel}      // ✅ CRITICAL: Must pass function
    updatePixel={updatePixel}      // ✅ CRITICAL: Must pass function
    errors={errors}                // ✅ CRITICAL: Must pass errors
  />
)}

              {/* Action Buttons - STICKY FOOTER */}
              <div className="sticky bottom-0 -mx-4 sm:-mx-6 md:-mx-8 -mb-4 sm:-mb-6 md:-mb-8 mt-6 sm:mt-8 px-4 sm:px-6 md:px-8 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    Cancel
                  </button>
                  <LoadingButton
                    type="submit"
                    loading={submitting}
                    className="w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingLink ? 'Update Link' : 'Create Link'}
                  </LoadingButton>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}