import React, { useState } from 'react';
import { Globe, Smartphone, Laptop, Tablet, Calendar, Plus, Trash2, Search, X } from 'lucide-react';

// قائمة الدول الشاملة
const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾' },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' }
];

// Country Picker Component
const CountryPicker = ({ selectedCountries, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(search.toLowerCase()) ||
    country.code.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCountry = (countryCode) => {
    const newSelection = selectedCountries.includes(countryCode)
      ? selectedCountries.filter(c => c !== countryCode)
      : [...selectedCountries, countryCode];
    onChange(newSelection);
  };

  const removeCountry = (countryCode) => {
    onChange(selectedCountries.filter(c => c !== countryCode));
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Target Countries
      </label>

      {/* Selected Countries */}
      <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 border border-gray-300 rounded-lg bg-gray-50">
        {selectedCountries.length === 0 ? (
          <span className="text-gray-400 text-sm">No countries selected</span>
        ) : (
          selectedCountries.map(code => {
            const country = COUNTRIES.find(c => c.code === code);
            return country ? (
              <span
                key={code}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
              >
                <span>{country.flag}</span>
                <span>{country.name}</span>
                <button
                  type="button"
                  onClick={() => removeCountry(code)}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : null;
          })
        )}
      </div>

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between"
      >
        <span className="text-gray-700">
          {selectedCountries.length > 0
            ? `${selectedCountries.length} countries selected`
            : 'Select countries'}
        </span>
        <Globe className="w-4 h-4 text-gray-400" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Country List */}
          <div className="overflow-y-auto max-h-60">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No countries found
              </div>
            ) : (
              filteredCountries.map(country => (
                <label
                  key={country.code}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCountries.includes(country.code)}
                    onChange={() => toggleCountry(country.code)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm text-gray-700 flex-1">{country.name}</span>
                  <span className="text-xs text-gray-400">{country.code}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Main TargetingTab Component
const TargetingTab = ({ linkData, setLinkData, errors }) => {
  // Geo Rules Management
  const addGeoRule = () => {
    const newRule = {
      countries: [],
      targetUrl: '',
      priority: (linkData.geoRules?.length || 0) + 1
    };

    setLinkData({
      ...linkData,
      geoRules: [...(linkData.geoRules || []), newRule]
    });
  };

  const updateGeoRule = (index, field, value) => {
    const updatedRules = [...(linkData.geoRules || [])];
    updatedRules[index] = {
      ...updatedRules[index],
      [field]: value
    };

    setLinkData({
      ...linkData,
      geoRules: updatedRules
    });
  };

  const removeGeoRule = (index) => {
    setLinkData({
      ...linkData,
      geoRules: linkData.geoRules.filter((_, i) => i !== index)
    });
  };

  // Device Rules Management
  const updateDeviceRule = (device, url) => {
    setLinkData({
      ...linkData,
      deviceRules: {
        ...(linkData.deviceRules || {}),
        [device]: url
      }
    });
  };

  // Schedule Management
  const updateSchedule = (field, value) => {
    setLinkData({
      ...linkData,
      schedule: {
        ...(linkData.schedule || { enabled: false }),
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Geographic Targeting */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Geographic Targeting
            </h3>
          </div>
          <button
            type="button"
            onClick={addGeoRule}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Redirect visitors to different URLs based on their country
        </p>

        {(!linkData.geoRules || linkData.geoRules.length === 0) ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            No geo-targeting rules configured
          </div>
        ) : (
          <div className="space-y-4">
            {linkData.geoRules.map((rule, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Rule #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeGeoRule(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <CountryPicker
                    selectedCountries={rule.countries || []}
                    onChange={(countries) => updateGeoRule(index, 'countries', countries)}
                    error={errors?.[`geoRules.${index}.countries`]}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target URL
                    </label>
                    <input
                      type="url"
                      value={rule.targetUrl || ''}
                      onChange={(e) => updateGeoRule(index, 'targetUrl', e.target.value)}
                      placeholder="https://example.com/country-page"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors?.[`geoRules.${index}.targetUrl`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`geoRules.${index}.targetUrl`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <input
                      type="number"
                      value={rule.priority || 0}
                      onChange={(e) => updateGeoRule(index, 'priority', parseInt(e.target.value))}
                      min="0"
                      className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Higher priority rules are matched first
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Device Targeting */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Device Targeting
          </h3>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Redirect visitors to different URLs based on their device type
        </p>

        <div className="space-y-4">
          {/* Mobile */}
          <div className="flex items-center gap-4">
            <Smartphone className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile URL
              </label>
              <input
                type="url"
                value={linkData.deviceRules?.mobile || ''}
                onChange={(e) => updateDeviceRule('mobile', e.target.value)}
                placeholder="https://m.example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Desktop */}
          <div className="flex items-center gap-4">
            <Laptop className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Desktop URL
              </label>
              <input
                type="url"
                value={linkData.deviceRules?.desktop || ''}
                onChange={(e) => updateDeviceRule('desktop', e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tablet */}
          <div className="flex items-center gap-4">
            <Tablet className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tablet URL
              </label>
              <input
                type="url"
                value={linkData.deviceRules?.tablet || ''}
                onChange={(e) => updateDeviceRule('tablet', e.target.value)}
                placeholder="https://tablet.example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Link Scheduling */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Link Scheduling
          </h3>
        </div>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={linkData.schedule?.enabled || false}
            onChange={(e) => updateSchedule('enabled', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            Enable link scheduling
          </span>
        </label>

        {linkData.schedule?.enabled && (
          <div className="space-y-4 pl-6 border-l-2 border-blue-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={linkData.schedule?.startDate || ''}
                onChange={(e) => updateSchedule('startDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="datetime-local"
                value={linkData.schedule?.endDate || ''}
                onChange={(e) => updateSchedule('endDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redirect After Expiry
              </label>
              <input
                type="url"
                value={linkData.schedule?.redirectAfterExpiry || ''}
                onChange={(e) => updateSchedule('redirectAfterExpiry', e.target.value)}
                placeholder="https://example.com/expired"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Where to redirect after the link expires
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TargetingTab;