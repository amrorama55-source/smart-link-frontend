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
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {editingLink ? 'Edit Smart Link' : 'Create New Smart Link'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {editingLink ? 'Update your link with advanced features' : 'Create a powerful smart link with targeting and analytics'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors touch-target"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 touch-target ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* BASIC TAB */}
          {activeTab === 'basic' && (
            <BasicTab
              linkData={linkData}
              setLinkData={setLinkData}
              editingLink={editingLink}
              errors={errors}
            />
          )}

          {/* ADVANCED TAB - A/B Testing */}
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

          {/* TARGETING TAB */}
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

          {/* TRACKING TAB */}
          {activeTab === 'tracking' && (
            <TrackingTab
              linkData={linkData}
              setLinkData={setLinkData}
              addPixel={addPixel}
              removePixel={removePixel}
              updatePixel={updatePixel}
            />
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-semibold shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed touch-target"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              loading={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl touch-target"
            >
              {editingLink ? 'Update Link' : 'Create Link'}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}