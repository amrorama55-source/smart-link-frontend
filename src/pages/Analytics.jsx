import { useEffect, useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
  RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';
import { 
  Activity, Clock, Globe, Smartphone, 
  MousePointerClick, Users, TrendingUp, 
  MapPin, Eye, Target
} from 'lucide-react';
import { getLinks, getAnalytics } from '../services/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

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
      console.log('Analytics Response:', res.analytics); // للتحقق من البيانات
      setAnalytics(res.analytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setAnalytics(null);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const processed = useMemo(() => {
    if (!analytics) return null;

    return {
      timeSeries: analytics.clicksByDate?.map(item => ({
        date: item.label,
        clicks: item.count
      })) || [],

      clicksByHour: analytics.clicksByHour?.map(item => ({
        hour: item.label,
        clicks: item.count
      })) || [],

      clicksByDay: analytics.clicksByDayOfWeek?.map(item => ({
        day: item.label,
        clicks: item.count
      })) || [],

      cities: analytics.clicksByCity?.slice(0, 10).map(item => ({
        name: item.label,
        count: item.count,
        percentage: ((item.count / (analytics.totalClicks || 1)) * 100).toFixed(1)
      })) || [],

      devices: analytics.clicksByDevice?.map(item => ({
        name: item.label,
        count: item.count,
        percentage: ((item.count / (analytics.totalClicks || 1)) * 100).toFixed(1)
      })) || [],

      countries: analytics.clicksByCountry?.map(item => ({
        name: item.label,
        code: item.country,
        count: item.count,
        percentage: ((item.count / (analytics.totalClicks || 1)) * 100).toFixed(1)
      })) || [],

      browsers: analytics.clicksByBrowser?.slice(0, 5).map(item => ({
        name: item.label,
        count: item.count,
        percentage: ((item.count / (analytics.totalClicks || 1)) * 100).toFixed(1)
      })) || [],

      os: analytics.clicksByOS?.slice(0, 5).map(item => ({
        name: item.label,
        count: item.count,
        percentage: ((item.count / (analytics.totalClicks || 1)) * 100).toFixed(1)
      })) || [],

      referrers: analytics.topReferrers?.slice(0, 5).map(item => ({
        name: item.label,
        count: item.count
      })) || [],

      engagement: [
        { 
          metric: 'Clicks', 
          value: Math.min(100, (analytics.totalClicks || 0) / 10) 
        },
        { 
          metric: 'Unique', 
          value: analytics.uniqueVisitors 
            ? ((analytics.uniqueVisitors / analytics.totalClicks) * 100) 
            : 0 
        },
        { 
          metric: 'Mobile', 
          value: parseFloat(analytics.mobilePercentage || 0) 
        },
        { 
          metric: 'Quality', 
          value: analytics.botClicks 
            ? (100 - ((analytics.botClicks / analytics.totalClicks) * 100)) 
            : 100 
        },
        { 
          metric: 'Return', 
          value: analytics.returningVisitors && analytics.uniqueVisitors
            ? ((analytics.returningVisitors / analytics.uniqueVisitors) * 100) 
            : 0 
        }
      ],

      stats: {
        totalClicks: analytics.totalClicks || 0,
        uniqueVisitors: analytics.uniqueVisitors || 0,
        returningVisitors: analytics.returningVisitors || 0,
        countries: analytics.clicksByCountry?.length || 0,
        mobilePercentage: analytics.mobilePercentage || 0
      }
    };
  }, [analytics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (!links.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No links yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Create a link to see analytics</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive insights into your links
          </p>
        </div>

        {/* Link Selector */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Link
          </label>
          <select
            value={selectedLink}
            onChange={e => setSelectedLink(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {links.map(l => (
              <option key={l.shortCode} value={l.shortCode}>
                {l.title || l.shortCode} ({l.totalClicks || 0} clicks)
                {l.abTest?.enabled ? ' - A/B Test' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* View Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview', icon: Activity },
              { key: 'time', label: 'Time Analysis', icon: Clock },
              { key: 'location', label: 'Geographic', icon: Globe },
              { key: 'device', label: 'Tech Stack', icon: Smartphone }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 font-medium whitespace-nowrap transition-all ${
                  view === key 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {analyticsLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        )}

        {/* Content */}
        {!analyticsLoading && processed && (
          <>
            {view === 'overview' && <Overview data={processed} analytics={analytics} />}
            {view === 'time' && <TimeView data={processed} />}
            {view === 'location' && <LocationView data={processed} />}
            {view === 'device' && <DeviceView data={processed} />}
          </>
        )}

        {!analyticsLoading && !processed && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
            <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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

/* ==================== OVERVIEW ==================== */
const Overview = ({ data, analytics }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={MousePointerClick} title="Total Clicks" value={data.stats.totalClicks.toLocaleString()} color="blue" />
      <StatCard icon={Users} title="Unique Visitors" value={data.stats.uniqueVisitors.toLocaleString()} subtitle={`${data.stats.returningVisitors} returning`} color="green" />
      <StatCard icon={Globe} title="Countries" value={data.stats.countries} subtitle="Global reach" color="purple" />
      <StatCard icon={Smartphone} title="Mobile Traffic" value={`${data.stats.mobilePercentage}%`} color="orange" />
    </div>

    {/* FIXED: A/B Testing Section - Always show if enabled */}
    {analytics?.abTest?.enabled && <ABTestingSection abTest={analytics.abTest} />}

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TimeSeries data={data.timeSeries} />
      <EngagementRadar data={data.engagement} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TopCountries countries={data.countries} />
      <DevicePie devices={data.devices} />
    </div>
  </div>
);

const StatCard = ({ icon: Icon, title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon size={24} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

const TimeSeries = ({ data }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Clicks Over Time</h3>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} className="fill-gray-600 dark:fill-gray-400" />
        <YAxis tick={{ fontSize: 12 }} className="fill-gray-600 dark:fill-gray-400" />
        <Tooltip contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: 'var(--tooltip-border)' }} />
        <Area type="monotone" dataKey="clicks" stroke="#2563eb" strokeWidth={2} fill="url(#blueGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const EngagementRadar = ({ data }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Engagement Metrics</h3>
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid className="stroke-gray-200 dark:stroke-gray-700" />
        <PolarAngleAxis dataKey="metric" className="fill-gray-600 dark:fill-gray-400" />
        <PolarRadiusAxis angle={90} domain={[0, 100]} />
        <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

const TopCountries = ({ countries }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Countries</h3>
    <div className="space-y-3 max-h-[350px] overflow-y-auto">
      {countries.slice(0, 10).map((country, idx) => (
        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-gray-400 dark:text-gray-500">#{idx + 1}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{country.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${country.percentage}%` }} />
            </div>
            <span className="text-sm font-bold text-blue-600 w-12 text-right">{country.count}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DevicePie = ({ devices }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Device Breakdown</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={devices} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={(entry) => `${entry.name}: ${entry.count}`}>
          {devices.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

/* ==================== TIME VIEW ==================== */
const TimeView = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <HourlyChart data={data.clicksByHour} />
      <DayOfWeekChart data={data.clicksByDay} />
    </div>
  </div>
);

const HourlyChart = ({ data }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Clicks by Hour</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis dataKey="hour" tick={{ fontSize: 10 }} className="fill-gray-600 dark:fill-gray-400" />
        <YAxis className="fill-gray-600 dark:fill-gray-400" />
        <Tooltip />
        <Bar dataKey="clicks" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const DayOfWeekChart = ({ data }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Clicks by Day of Week</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis dataKey="day" className="fill-gray-600 dark:fill-gray-400" />
        <YAxis className="fill-gray-600 dark:fill-gray-400" />
        <Tooltip />
        <Bar dataKey="clicks" fill="#10b981" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

/* ==================== LOCATION VIEW ==================== */
const LocationView = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CountriesList countries={data.countries} />
      <CitiesList cities={data.cities} />
    </div>
  </div>
);

const CountriesList = ({ countries }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Countries</h3>
    <div className="space-y-3 max-h-[400px] overflow-y-auto">
      {countries.map((country, idx) => (
        <div key={idx}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-900 dark:text-gray-200">{country.name}</span>
            <span className="text-gray-500 dark:text-gray-400">{country.count} ({country.percentage}%)</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="h-2 rounded-full bg-blue-600" style={{ width: `${country.percentage}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CitiesList = ({ cities }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Cities</h3>
    <div className="space-y-3">
      {cities.map((city, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 dark:from-purple-900/30 to-transparent rounded-lg">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-purple-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-200">{city.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{city.percentage}% of traffic</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-purple-600">{city.count}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ==================== DEVICE VIEW ==================== */
const DeviceView = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <DeviceDonut devices={data.devices} />
      <BrowserBars browsers={data.browsers} />
      <OSBars os={data.os} />
    </div>
    <ReferrersChart referrers={data.referrers} />
  </div>
);

const DeviceDonut = ({ devices }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Devices</h3>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={devices} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5}>
          {devices.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const BrowserBars = ({ browsers }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Browsers</h3>
    <div className="space-y-3">
      {browsers.map((browser, idx) => (
        <div key={idx}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-900 dark:text-gray-200">{browser.name}</span>
            <span className="text-gray-500 dark:text-gray-400">{browser.count}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="h-2 rounded-full" style={{ width: `${browser.percentage}%`, backgroundColor: COLORS[idx % COLORS.length] }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const OSBars = ({ os }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Operating Systems</h3>
    <div className="space-y-3">
      {os.map((item, idx) => (
        <div key={idx}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-900 dark:text-gray-200">{item.name}</span>
            <span className="text-gray-500 dark:text-gray-400">{item.count}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="h-2 rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: COLORS[idx % COLORS.length] }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ReferrersChart = ({ referrers }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Referrers</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={referrers} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis type="number" className="fill-gray-600 dark:fill-gray-400" />
        <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} className="fill-gray-600 dark:fill-gray-400" />
        <Tooltip />
        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

/* ==================== A/B TESTING SECTION - FIXED ==================== */
const ABTestingSection = ({ abTest }) => {
  // FIXED: Check if A/B test is enabled properly
  if (!abTest || !abTest.enabled) {
    return null;
  }

  console.log('A/B Test Data:', abTest); // للتحقق من البيانات

  // FIXED: Handle variants array properly
  const variants = abTest.variants || [];
  
  // FIXED: Calculate total test clicks properly
  const totalTestClicks = abTest.totalTestClicks || 
    variants.reduce((sum, v) => sum + (v.clicksInRange || 0), 0);
  
  // FIXED: Sort and prepare variants with proper percentage calculation
  const processedVariants = variants.map((variant, index) => {
    const clicksInRange = variant.clicksInRange || 0;
    const percentage = totalTestClicks > 0 
      ? ((clicksInRange / totalTestClicks) * 100).toFixed(1)
      : '0.0';
    
    return {
      ...variant,
      index,
      clicksInRange,
      percentage,
      name: variant.name || `Variant ${String.fromCharCode(65 + index)}`
    };
  });

  const sortedVariants = [...processedVariants].sort((a, b) => 
    (b.clicksInRange || 0) - (a.clicksInRange || 0)
  );
  
  const winner = sortedVariants[0];
  const hasWinner = winner && (winner.clicksInRange || 0) > 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">A/B Test Results</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Split Method: <span className="font-semibold capitalize">{abTest.splitMethod || 'weighted'}</span>
            <span className="ml-3">• Total Test Clicks: <span className="font-bold">{totalTestClicks}</span></span>
          </p>
        </div>
        <span className="px-4 py-2 rounded-full text-sm font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
          ● Active
        </span>
      </div>

      {/* Winner Badge */}
      {hasWinner && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="font-bold text-yellow-700 dark:text-yellow-400">
              🏆 Current Leader: {winner.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {winner.clicksInRange} clicks ({winner.percentage}% of test traffic)
            </p>
          </div>
        </div>
      )}

      {/* FIXED: Always show variants if they exist */}
      {processedVariants.length > 0 ? (
        <>
          {/* Variants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {processedVariants.map((variant, index) => {
              const isWinner = hasWinner && variant.index === winner.index;

              return (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800/80 border ${isWinner ? 'ring-2 ring-yellow-400 dark:ring-yellow-500/50' : ''} border-gray-200 dark:border-gray-700 rounded-xl p-5 relative overflow-hidden transition-all hover:shadow-lg`}
                >
                  {isWinner && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 text-xs font-bold rounded bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400">
                        👑 Winner
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
                      {variant.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{variant.url}</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Clicks in Range</span>
                        <span className="font-bold text-lg text-gray-900 dark:text-white">{variant.clicksInRange}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${isWinner ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(100, parseFloat(variant.percentage))}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Split Weight</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{variant.weight}%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{variant.totalClicks || 0}</span>
                    </div>
                  </div>

                  <div className="text-center py-2 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                    <span className={`text-2xl font-bold ${isWinner ? 'text-green-500' : 'text-blue-600 dark:text-blue-400'}`}>
                      {variant.percentage}%
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">of test traffic</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart */}
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={processedVariants}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} className="fill-gray-600 dark:fill-gray-400" />
                <YAxis className="fill-gray-600 dark:fill-gray-400" />
                <Tooltip />
                <Legend />
                <Bar dataKey="clicksInRange" name="Clicks in Range" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="totalClicks" name="Total Clicks" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        /* No Variants Message */
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">A/B Test is enabled but no variants configured</p>
          <p className="text-sm">Edit your link to add test variants</p>
        </div>
      )}

      {/* No Data Yet Message */}
      {totalTestClicks === 0 && processedVariants.length > 0 && (
        <div className="mt-6 text-center py-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
          <Target className="w-10 h-10 mx-auto mb-2 text-blue-600 dark:text-blue-400 opacity-50" />
          <p className="font-medium text-blue-900 dark:text-blue-100">No test data yet</p>
          <p className="text-sm text-blue-700 dark:text-blue-300">Share your link to start collecting A/B test results</p>
        </div>
      )}
    </div>
  );
};