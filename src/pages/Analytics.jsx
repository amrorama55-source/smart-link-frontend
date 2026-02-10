import { useEffect, useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import {
  Activity, Clock, Globe, Smartphone,
  TrendingUp, Eye, ExternalLink, BarChart3, Download
} from 'lucide-react';
import { getLinks, getAnalytics } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Import view components
import OverviewView from '../analytics/OverviewView';
import TimeView from '../analytics/TimeView';
import LocationView from '../analytics/LocationView';
import DeviceView from '../analytics/DeviceView';

// Import utilities
import { processAnalyticsData } from '../utils/analyticsProcessor';

export default function Analytics() {
  const { user } = useAuth();
  const { addToast } = useToast();
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

  const handleExportCSV = () => {
    if (!analytics || !processed) return;

    // Check plan (Business only for export)
    if (user?.plan !== 'business' && user?.plan !== 'admin') {
      addToast('CSV Export is a Business Elite feature. Upgrade to unlock!', 'warning');
      return;
    }

    try {
      const rows = [
        ['Metric', 'Label', 'Value', 'Percentage'],
        ['Summary', 'Total Clicks', processed.stats.totalClicks, ''],
        ['Summary', 'Unique Visitors', processed.stats.uniqueVisitors, ''],
        ['Summary', 'Returning Visitors', processed.stats.returningVisitors, ''],
        [],
        ['Category', 'Country', 'Clicks', 'Percentage'],
        ...processed.countries.map(c => ['Location', c.name, c.count, c.percentage + '%']),
        [],
        ['Category', 'Device', 'Clicks', 'Percentage'],
        ...processed.devices.map(d => ['Device', d.name, d.count, d.percentage + '%']),
        [],
        ['Category', 'Browser', 'Clicks', 'Percentage'],
        ...processed.browsers.map(b => ['Browser', b.name, b.count, b.percentage + '%']),
        [],
        ['Category', 'OS', 'Clicks', 'Percentage'],
        ...processed.os.map(o => ['Operating System', o.name, o.count, o.percentage + '%']),
      ];

      const csvContent = "data:text/csv;charset=utf-8,"
        + rows.map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `analytics_${selectedLink}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast('Analytics exported successfully!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      addToast('Failed to export data', 'error');
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  // No links state
  if (!links.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 text-center">
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-7 h-7 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No links yet</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create a link to see clicks and insights here.</p>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
              Analytics
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              See how your links are performing
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={!processed || analyticsLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Link Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Select Link
          </label>
          <select
            value={selectedLink}
            onChange={e => setSelectedLink(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
          >
            {links.map(l => (
              <option key={l.shortCode} value={l.shortCode}>
                {l.title || l.shortCode} ({l.totalClicks || 0} clicks)
              </option>
            ))}
          </select>
        </div>

        {/* View Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 p-2">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {viewTabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${view === key
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {analyticsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-500 font-medium">Crunching your data...</p>
          </div>
        ) : processed ? (
          <div className="space-y-6">
            {view === 'overview' && <OverviewView data={processed} analytics={analytics} />}
            {view === 'time' && <TimeView data={processed} />}
            {view === 'location' && <LocationView data={processed} />}
            {view === 'device' && <DeviceView data={processed} />}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No activity recorded</h3>
            <p className="text-gray-500">Share your link to start collecting analytics data.</p>
          </div>
        )}
      </div>
    </div>
  );
}