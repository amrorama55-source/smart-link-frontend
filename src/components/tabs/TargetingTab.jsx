import { Plus, Trash2, Globe2, Smartphone, Calendar, AlertCircle, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

// ✅ قائمة دول شاملة مع أعلام - EXPANDED
const countries = [
  // North America
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'North America' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'North America' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'North America' },
  
  // Europe - Western
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Europe' },
  { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'Europe' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'Europe' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', region: 'Europe' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', region: 'Europe' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', region: 'Europe' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', region: 'Europe' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', region: 'Europe' },
  
  // Europe - Northern
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', region: 'Europe' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', region: 'Europe' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', region: 'Europe' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', region: 'Europe' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', region: 'Europe' },
  
  // Europe - Eastern
  { code: 'PL', name: 'Poland', flag: '🇵🇱', region: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', region: 'Europe' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', region: 'Europe' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', region: 'Europe' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', region: 'Europe' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', region: 'Europe' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', region: 'Europe' },
  
  // Europe - Southern
  { code: 'GR', name: 'Greece', flag: '🇬🇷', region: 'Europe' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', region: 'Europe' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', region: 'Europe' },
  
  // South America
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'South America' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'South America' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', region: 'South America' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'South America' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', region: 'South America' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', region: 'South America' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', region: 'South America' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', region: 'South America' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', region: 'South America' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', region: 'South America' },
  
  // Asia - East
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'Asia' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'Asia' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'Asia' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', region: 'Asia' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', region: 'Asia' },
  
  // Asia - Southeast
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'Asia' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', region: 'Asia' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', region: 'Asia' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', region: 'Asia' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', region: 'Asia' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', region: 'Asia' },
  
  // Asia - South
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Asia' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', region: 'Asia' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', region: 'Asia' },
  
  // Middle East
  { code: 'AE', name: 'UAE', flag: '🇦🇪', region: 'Middle East' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', region: 'Middle East' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', region: 'Middle East' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', region: 'Middle East' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', region: 'Middle East' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', region: 'Middle East' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', region: 'Middle East' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', region: 'Middle East' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾', region: 'Middle East' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪', region: 'Middle East' },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸', region: 'Middle East' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', region: 'Middle East' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', region: 'Middle East' },
  
  // Africa - North
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'Africa' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', region: 'Africa' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', region: 'Africa' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', region: 'Africa' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾', region: 'Africa' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', region: 'Africa' },
  
  // Africa - Sub-Saharan
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'Africa' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'Africa' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'Africa' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', region: 'Africa' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', region: 'Africa' },
  
  // Oceania
  { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'Oceania' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania' }
].sort((a, b) => a.name.localeCompare(b.name));

// ✅ Component for Country Selection - FIXED UI
function CountrySelector({ selectedCountries, onChange, ruleIndex }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCountry = (countryCode) => {
    const newSelected = selectedCountries.includes(countryCode)
      ? selectedCountries.filter(c => c !== countryCode)
      : [...selectedCountries, countryCode];
    onChange(newSelected);
  };

  const getCountryName = (code) => {
    const country = countries.find(c => c.code === code);
    return country ? `${country.flag} ${country.name}` : code;
  };

  return (
    <div className="relative">
      {/* Selected Countries */}
      {selectedCountries.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedCountries.map(code => (
            <span
              key={code}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium"
            >
              {getCountryName(code)}
              <button
                type="button"
                onClick={() => toggleCountry(code)}
                className="hover:text-blue-900 dark:hover:text-blue-200 ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input - FIXED */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="🔍 Search countries..."
          className="w-full px-4 py-3 pr-24 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-400"
        />
        
        {/* Counter Badge - FIXED POSITION */}
        {selectedCountries.length > 0 && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
            {selectedCountries.length}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl max-h-72 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              <>
                {/* Group by region */}
                {['North America', 'Europe', 'South America', 'Asia', 'Middle East', 'Africa', 'Oceania'].map(region => {
                  const regionCountries = filteredCountries.filter(c => c.region === region);
                  if (regionCountries.length === 0) return null;
                  
                  return (
                    <div key={region}>
                      <div className="sticky top-0 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          {region}
                        </span>
                      </div>
                      {regionCountries.map(country => {
                        const isSelected = selectedCountries.includes(country.code);
                        return (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => toggleCountry(country.code)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                              isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="text-xl">{country.flag}</span>
                              <span className="text-gray-900 dark:text-white font-medium">{country.name}</span>
                              <span className="text-gray-500 dark:text-gray-400 text-xs">({country.code})</span>
                            </span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                No countries found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function TargetingTab({ 
  linkData, 
  setLinkData, 
  errors, 
  addGeoRule, 
  removeGeoRule, 
  updateGeoRule 
}) {
  const [showDeviceSchedule, setShowDeviceSchedule] = useState(false);

  // ✅ CRITICAL FIX: Handle undefined linkData
  if (!linkData) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ======================================== */}
      {/* GEOTARGETING */}
      {/* ======================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Globe2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Geotargeting</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Redirect users based on their country</p>
            </div>
          </div>
          <button
            type="button"
            onClick={addGeoRule}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>

        <div className="space-y-4">
          {(linkData.geoRules || []).map((rule, idx) => (
            <div key={idx} className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Globe2 className="w-4 h-4" />
                  Rule #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeGeoRule(idx)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition"
                  title="Remove rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Country Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Target Countries
                  </label>
                  <CountrySelector
                    selectedCountries={rule.countries || []}
                    onChange={(countries) => updateGeoRule(idx, 'countries', countries)}
                    ruleIndex={idx}
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Select one or more countries to redirect
                  </p>
                </div>

                {/* Target URL */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Redirect URL
                  </label>
                  <input
                    type="url"
                    value={rule.targetUrl || ''}
                    onChange={(e) => updateGeoRule(idx, 'targetUrl', e.target.value)}
                    placeholder="https://example.com/country-specific"
                    autoComplete="off"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Priority (Optional)
                  </label>
                  <input
                    type="number"
                    value={rule.priority || 0}
                    onChange={(e) => updateGeoRule(idx, 'priority', parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className="w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Higher priority rules are checked first (0-100)
                  </p>
                </div>
              </div>
            </div>
          ))}

          {(!linkData.geoRules || linkData.geoRules.length === 0) && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <Globe2 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                No geo-targeting rules yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Add rules to redirect users based on their country
              </p>
            </div>
          )}

          {errors.geoRules && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errors.geoRules}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: collapsible "Device & schedule" so Targeting tab is short */}
      <div className="sm:block">
        <button
          type="button"
          onClick={() => setShowDeviceSchedule(!showDeviceSchedule)}
          className="sm:hidden w-full flex items-center justify-between p-3 min-h-[48px] bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all touch-manipulation"
          aria-expanded={showDeviceSchedule}
        >
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {showDeviceSchedule ? 'Hide device & schedule' : 'Device & schedule (optional)'}
          </span>
          {showDeviceSchedule ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>
        <div className={`${showDeviceSchedule ? 'block' : 'hidden'} sm:block`}>
      {/* ======================================== */}
      {/* DEVICE TARGETING */}
      {/* ======================================== */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Device Targeting</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Redirect based on device type</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
              📱 Mobile URL
            </label>
            <input
              type="url"
              value={linkData.deviceRules?.mobile || ''}
              onChange={(e) => setLinkData({
                ...linkData,
                deviceRules: {...(linkData.deviceRules || {}), mobile: e.target.value}
              })}
              placeholder="https://m.example.com"
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
              💻 Desktop URL
            </label>
            <input
              type="url"
              value={linkData.deviceRules?.desktop || ''}
              onChange={(e) => setLinkData({
                ...linkData,
                deviceRules: {...(linkData.deviceRules || {}), desktop: e.target.value}
              })}
              placeholder="https://www.example.com"
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
              📱 Tablet URL
            </label>
            <input
              type="url"
              value={linkData.deviceRules?.tablet || ''}
              onChange={(e) => setLinkData({
                ...linkData,
                deviceRules: {...(linkData.deviceRules || {}), tablet: e.target.value}
              })}
              placeholder="https://tablet.example.com"
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* ======================================== */}
      {/* LINK SCHEDULING */}
      {/* ======================================== */}
      <div>
        <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800/30 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Link Scheduling</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Set active time period</p>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={linkData.schedule?.enabled || false}
              onChange={(e) => setLinkData({
                ...linkData,
                schedule: {...(linkData.schedule || {}), enabled: e.target.checked}
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
          </label>
        </div>

        {linkData.schedule?.enabled && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  🕐 Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={linkData.schedule?.startDate || ''}
                  onChange={(e) => setLinkData({
                    ...linkData,
                    schedule: {...(linkData.schedule || {}), startDate: e.target.value}
                  })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  🕐 End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={linkData.schedule?.endDate || ''}
                  onChange={(e) => setLinkData({
                    ...linkData,
                    schedule: {...(linkData.schedule || {}), endDate: e.target.value}
                  })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                🔗 Redirect After Expiry (Optional)
              </label>
              <input
                type="url"
                value={linkData.schedule?.redirectAfterExpiry || ''}
                onChange={(e) => setLinkData({
                  ...linkData,
                  schedule: {...(linkData.schedule || {}), redirectAfterExpiry: e.target.value}
                })}
                placeholder="https://example.com/expired"
                autoComplete="off"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Where to redirect users after the link expires
              </p>
            </div>

            {errors.schedule && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.schedule}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

        </div>
      </div>
      
    </div>
  );
}