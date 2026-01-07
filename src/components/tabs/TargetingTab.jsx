import { Plus, Trash2, Globe2, Smartphone, Calendar, AlertCircle } from 'lucide-react';

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AE', name: 'UAE' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'EG', name: 'Egypt' },
  { code: 'JO', name: 'Jordan' }
];

export default function TargetingTab({ 
  linkData, 
  setLinkData, 
  errors, 
  addGeoRule, 
  removeGeoRule, 
  updateGeoRule 
}) {
  return (
    <div className="space-y-6">
      
      {/* Geotargeting */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Globe2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Geotargeting</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Redirect based on country</p>
            </div>
          </div>
          <button
            type="button"
            onClick={addGeoRule}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition flex items-center gap-1 touch-target"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>

        <div className="space-y-3">
          {linkData.geoRules.map((rule, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Rule {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeGeoRule(idx)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                    Countries
                  </label>
                  <select
                    multiple
                    value={rule.countries}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      updateGeoRule(idx, 'countries', selected);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    size="4"
                  >
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Hold Ctrl/Cmd to select multiple
                  </p>
                </div>

                <input
                  type="url"
                  value={rule.targetUrl}
                  onChange={(e) => updateGeoRule(idx, 'targetUrl', e.target.value)}
                  placeholder="https://example.com/country-specific"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                />
              </div>
            </div>
          ))}

          {linkData.geoRules.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              No geo rules yet. Add one to redirect users based on their country.
            </div>
          )}

          {errors.geoRules && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.geoRules}
            </p>
          )}
        </div>
      </div>

      {/* Device Targeting */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Device Targeting</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Redirect based on device type</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Mobile URL
            </label>
            <input
              type="url"
              value={linkData.deviceRules.mobile}
              onChange={(e) => setLinkData({
                ...linkData,
                deviceRules: {...linkData.deviceRules, mobile: e.target.value}
              })}
              placeholder="https://m.example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Desktop URL
            </label>
            <input
              type="url"
              value={linkData.deviceRules.desktop}
              onChange={(e) => setLinkData({
                ...linkData,
                deviceRules: {...linkData.deviceRules, desktop: e.target.value}
              })}
              placeholder="https://www.example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Tablet URL
            </label>
            <input
              type="url"
              value={linkData.deviceRules.tablet}
              onChange={(e) => setLinkData({
                ...linkData,
                deviceRules: {...linkData.deviceRules, tablet: e.target.value}
              })}
              placeholder="https://tablet.example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Link Scheduling */}
      <div>
        <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800/30 mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Link Scheduling</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Set active time period</p>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={linkData.schedule.enabled}
              onChange={(e) => setLinkData({
                ...linkData,
                schedule: {...linkData.schedule, enabled: e.target.checked}
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
          </label>
        </div>

        {linkData.schedule.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={linkData.schedule.startDate}
                  onChange={(e) => setLinkData({
                    ...linkData,
                    schedule: {...linkData.schedule, startDate: e.target.value}
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={linkData.schedule.endDate}
                  onChange={(e) => setLinkData({
                    ...linkData,
                    schedule: {...linkData.schedule, endDate: e.target.value}
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Redirect After Expiry
              </label>
              <input
                type="url"
                value={linkData.schedule.redirectAfterExpiry}
                onChange={(e) => setLinkData({
                  ...linkData,
                  schedule: {...linkData.schedule, redirectAfterExpiry: e.target.value}
                })}
                placeholder="https://example.com/expired"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Optional: Where to redirect users after the link expires
              </p>
            </div>

            {errors.schedule && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.schedule}
              </p>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
}