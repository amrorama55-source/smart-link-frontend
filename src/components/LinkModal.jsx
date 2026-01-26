import { SHORT_URL_BASE } from '../config';
import LoadingButton from '../components/LoadingButton';
import {
  Link2, Plus, Trash2, X, Target, Globe2, Calendar,
  Smartphone, TrendingUp, Zap, Shield, AlertCircle, Globe
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container - Full Screen on Mobile, Centered on Desktop */}
      <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div 
          className="relative w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-3xl bg-gray-900 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border sm:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header - Compact & Clean */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700 bg-gray-900 sticky top-0 z-10">
            <h2 className="text-base sm:text-xl font-semibold text-white">
              {editingLink ? 'Edit Link' : 'Create Link'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs - Dropdown on Mobile, Pills on Desktop */}
          <div className="px-4 sm:px-6 py-3 bg-gray-800/50 border-b border-gray-700 sticky top-[52px] sm:top-[60px] z-10">
            
            {/* Mobile: Dropdown Selector */}
            <div className="sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.25em 1.25em',
                  paddingRight: '2rem'
                }}
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
              
              {/* Progress Dots */}
              <div className="flex justify-center gap-1 mt-2.5">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'w-6 bg-blue-500' 
                        : 'w-1 bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop: Horizontal Pills - Compact */}
            <div className="hidden sm:flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pb-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 
                      px-3 py-2 
                      rounded-lg 
                      text-xs font-medium 
                      whitespace-nowrap
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain bg-gray-900">
            <div className="p-4 sm:p-6">
            
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

          {/* Footer - Sticky Bottom */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gray-800/50 border-t border-gray-700 sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
            >
              Cancel
            </button>
            <LoadingButton
              type="button"
              onClick={handleFormSubmit}
              loading={submitting}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
            >
              {editingLink ? 'Update Link' : 'Create Link'}
            </LoadingButton>
          </div>

        </div>
      </div>
    </div>
  );
}