import { useEffect, useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import {
  Activity, Clock, Globe, Smartphone,
  TrendingUp, Eye, ExternalLink, BarChart3
} from 'lucide-react';
import { getLinks, getAnalytics } from '../services/api';

// Import view components
import OverviewView from '../analytics/OverviewView';
import TimeView from '../analytics/TimeView';
import LocationView from '../analytics/LocationView';
import DeviceView from '../analytics/DeviceView';

// Import utilities
import { processAnalyticsData } from '../utils/analyticsProcessor';

export default function Analytics() {
  const [links, setLinks] = useState([]);
  const [selectedLink, setSelectedLink] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [view, setView] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    loadLinks();
  }, []);

  useEffect(() => {
    if (selectedLink) {
      loadAnalytics();
    }
  }, [selectedLink]);

  const loadLinks = async () => {
    try {
      const res = await getLinks(1, 100);
      setLinks(res.links || []);
      if (res.links?.length) {
        setSelectedLink(res.links[0].shortCode);
      }
    } catch (error) {
      console.error('Failed to load links:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await getAnalytics(selectedLink);
      setAnalytics(res.analytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setAnalytics(null);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Process analytics data using utility function
  const processed = useMemo(() => {
    if (!analytics) return null;
    return processAnalyticsData(analytics);
  }, [analytics]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  // No links state
  if (!links.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">No links yet</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Create a link to see analytics</p>
          </div>
        </div>
      </div>
    );
  }

  // Main view tabs
  const viewTabs = [
    { key: 'overview', label: 'Overview', icon: Activity, shortLabel: 'Stats' },
    { key: 'time', label: 'Time Analysis', icon: Clock, shortLabel: 'Time' },
    { key: 'location', label: 'Geographic', icon: Globe, shortLabel: 'Geo' },
    { key: 'device', label: 'Tech Stack', icon: Smartphone, shortLabel: 'Tech' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">

        {/* Header - Responsive */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Comprehensive insights into your links
          </p>
        </div>

        {/* Link Selector - Mobile Optimized */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
            Select Link
          </label>
          <select
            value={selectedLink}
            onChange={e => setSelectedLink(e.target.value)}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all min-h-[48px]"
          >
            {links.map(l => (
              <option key={l.shortCode} value={l.shortCode}>
                {l.title || l.shortCode} ({l.totalClicks || 0} clicks)
              </option>
            ))}
          </select>
        </div>

        {/* View Tabs - Dropdown on Mobile, Buttons on Desktop */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4 sm:mb-6">

          {/* Mobile: Dropdown (< 640px) */}
          <div className="sm:hidden p-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">View Report</label>
            <div className="relative">
              <select
                value={view}
                onChange={e => setView(e.target.value)}
                className="w-full pl-4 pr-10 py-3 text-base rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-bold"
              >
                {viewTabs.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center gap-1.5 mt-3">
              {viewTabs.map(({ key }) => (
                <div
                  key={key}
                  className={`h-1 rounded-full transition-all duration-300 ${view === key
                      ? 'w-8 bg-blue-600'
                      : 'w-1 bg-gray-300 dark:bg-gray-600'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop: Horizontal Buttons (≥ 640px) */}
          <div className="hidden sm:block p-3 sm:p-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 pb-1">
              {viewTabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className={`
                    min-w-[140px] px-4 py-2.5
                    rounded-lg font-semibold text-sm
                    flex items-center justify-center gap-2
                    whitespace-nowrap flex-shrink-0
                    transition-all duration-200
                    border-2
                    ${view === key
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {analyticsLoading && (
          <div className="flex justify-center items-center py-12 sm:py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading analytics data...</p>
            </div>
          </div>
        )}

        {/* Content Views */}
        {!analyticsLoading && processed && (
          <div className="space-y-4 sm:space-y-6">
            {view === 'overview' && <OverviewView data={processed} analytics={analytics} />}
            {view === 'time' && <TimeView data={processed} />}
            {view === 'location' && <LocationView data={processed} />}
            {view === 'device' && <DeviceView data={processed} />}
          </div>
        )}

        {/* No Data State - Responsive */}
        {!analyticsLoading && !processed && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">No data yet</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Share your link to collect analytics
            </p>
          </div>
        )}
      </div>
    </div>
  );
}