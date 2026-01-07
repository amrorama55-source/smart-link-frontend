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
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No links yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Create a link to see analytics</p>
          </div>
        </div>
      </div>
    );
  }

  // Main view tabs
  const viewTabs = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'time', label: 'Time Analysis', icon: Clock },
    { key: 'location', label: 'Geographic', icon: Globe },
    { key: 'device', label: 'Tech Stack', icon: Smartphone }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive insights into your links
          </p>
        </div>

        {/* Link Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Select Link
          </label>
          <div className="flex items-center gap-4">
            <select
              value={selectedLink}
              onChange={e => setSelectedLink(e.target.value)}
              className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
            >
              {links.map(l => (
                <option key={l.shortCode} value={l.shortCode}>
                  {l.title || l.shortCode} ({l.totalClicks || 0} clicks)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-8">
          <div className="flex gap-2 overflow-x-auto">
            {viewTabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`px-4 sm:px-6 py-3 rounded-lg flex items-center gap-2 font-medium whitespace-nowrap transition-all ${
                  view === key 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {analyticsLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics data...</p>
            </div>
          </div>
        )}

        {/* Content Views */}
        {!analyticsLoading && processed && (
          <>
            {view === 'overview' && <OverviewView data={processed} analytics={analytics} />}
            {view === 'time' && <TimeView data={processed} />}
            {view === 'location' && <LocationView data={processed} />}
            {view === 'device' && <DeviceView data={processed} />}
          </>
        )}

        {/* No Data State */}
        {!analyticsLoading && !processed && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No data yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Share your link to collect analytics
            </p>
          </div>
        )}
      </div>
    </div>
  );
}