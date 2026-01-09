// src/components/TargetingTab.jsx
import React, { useState } from 'react';
import { Globe, Smartphone, Laptop, Tablet, Calendar, Plus, Trash2, ChevronDown } from 'lucide-react';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SG', name: 'Singapore' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'EG', name: 'Egypt' },
  { code: 'AE', name: 'UAE' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'IL', name: 'Israel' },
  { code: 'TR', name: 'Turkey' },
  { code: 'JO', name: 'Jordan' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'QA', name: 'Qatar' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'OM', name: 'Oman' },
  { code: 'MA', name: 'Morocco' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'TN', name: 'Tunisia' }
];

const TargetingTab = ({ linkData, setLinkData, errors }) => {
  const [openRuleIndex, setOpenRuleIndex] = useState(null);

  const addGeoRule = () => {
    setLinkData({
      ...linkData,
      geoRules: [
        ...(linkData.geoRules || []),
        { countries: [], targetUrl: '', priority: (linkData.geoRules?.length || 0) + 1 }
      ]
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

  const toggleCountry = (ruleIndex, countryCode) => {
    const rule = linkData.geoRules[ruleIndex];
    const currentCountries = rule.countries || [];
    
    const newCountries = currentCountries.includes(countryCode)
      ? currentCountries.filter(c => c !== countryCode)
      : [...currentCountries, countryCode];
    
    updateGeoRule(ruleIndex, 'countries', newCountries);
  };

  const updateDeviceRule = (device, url) => {
    setLinkData({
      ...linkData,
      deviceRules: {
        ...(linkData.deviceRules || {}),
        [device]: url
      }
    });
  };

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
    <div className="space-y-5">
      
      {/* Geographic Targeting */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Geographic Targeting
            </h3>
          </div>
          <button
            type="button"
            onClick={addGeoRule}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>

        {(!linkData.geoRules || linkData.geoRules.length === 0) ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
            No geo-targeting rules configured
          </div>
        ) : (
          <div className="space-y-3">
            {linkData.geoRules.map((rule, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rule #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeGeoRule(index)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  
                  {/* Countries Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Countries
                    </label>
                    
                    {/* Selected Countries Tags */}
                    {rule.countries && rule.countries.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {rule.countries.map(code => {
                          const country = COUNTRIES.find(c => c.code === code);
                          return country ? (
                            <span
                              key={code}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white rounded-md text-sm font-medium"
                            >
                              {country.code}
                              <button
                                type="button"
                                onClick={() => toggleCountry(index, code)}
                                className="hover:text-gray-200 font-bold"
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}

                    {/* Dropdown Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenRuleIndex(openRuleIndex === index ? null : index)}
                        className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white hover:border-blue-500 dark:hover:border-blue-400 flex items-center justify-between text-sm transition-all shadow-sm hover:shadow-md font-medium"
                      >
                        <span className="text-gray-800 dark:text-gray-100">
                          {rule.countries?.length > 0
                            ? `${rule.countries.length} countries selected`
                            : 'Select countries'}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform ${openRuleIndex === index ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Menu */}
                      {openRuleIndex === index && (
                        <>
                          {/* Overlay to close dropdown */}
                          <div 
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenRuleIndex(null)}
                          />
                          {/* Dropdown */}
                          <div className="absolute z-20 w-full mt-2 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                            {COUNTRIES.map(country => (
                              <label
                                key={country.code}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                              >
                                <input
                                  type="checkbox"
                                  checked={rule.countries?.includes(country.code) || false}
                                  onChange={() => toggleCountry(index, country.code)}
                                  className="w-5 h-5 text-blue-600 border-gray-400 dark:border-gray-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-sm flex-1 text-gray-900 dark:text-white font-medium">{country.name}</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{country.code}</span>
                              </label>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Target URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target URL
                    </label>
                    <input
                      type="url"
                      value={rule.targetUrl || ''}
                      onChange={(e) => updateGeoRule(index, 'targetUrl', e.target.value)}
                      placeholder="https://example.com/country-specific"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm font-medium"
                    />
                    {errors?.[`geoRules.${index}.targetUrl`] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors[`geoRules.${index}.targetUrl`]}
                      </p>
                    )}
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <input
                      type="number"
                      value={rule.priority || 0}
                      onChange={(e) => updateGeoRule(index, 'priority', parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-32 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm font-medium"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Device Targeting
          </h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Redirect visitors to different URLs based on their device type
        </p>

        <div className="space-y-3">
          {/* Mobile */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-24">
              <Smartphone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Mobile</span>
            </div>
            <input
              type="url"
              value={linkData.deviceRules?.mobile || ''}
              onChange={(e) => updateDeviceRule('mobile', e.target.value)}
              placeholder="https://m.example.com"
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm font-medium"
            />
          </div>

          {/* Desktop */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-24">
              <Laptop className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Desktop</span>
            </div>
            <input
              type="url"
              value={linkData.deviceRules?.desktop || ''}
              onChange={(e) => updateDeviceRule('desktop', e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm font-medium"
            />
          </div>

          {/* Tablet */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-24">
              <Tablet className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Tablet</span>
            </div>
            <input
              type="url"
              value={linkData.deviceRules?.tablet || ''}
              onChange={(e) => updateDeviceRule('tablet', e.target.value)}
              placeholder="https://tablet.example.com"
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Link Scheduling */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Link Scheduling
          </h3>
        </div>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={linkData.schedule?.enabled || false}
            onChange={(e) => updateSchedule('enabled', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-500 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Enable link scheduling
          </span>
        </label>

        {linkData.schedule?.enabled && (
          <div className="space-y-3 pl-6 border-l-2 border-blue-500">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={linkData.schedule?.startDate || ''}
                onChange={(e) => updateSchedule('startDate', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="datetime-local"
                value={linkData.schedule?.endDate || ''}
                onChange={(e) => updateSchedule('endDate', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Redirect After Expiry
              </label>
              <input
                type="url"
                value={linkData.schedule?.redirectAfterExpiry || ''}
                onChange={(e) => updateSchedule('redirectAfterExpiry', e.target.value)}
                placeholder="https://example.com/expired"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm font-medium"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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