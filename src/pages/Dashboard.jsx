import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDashboardStats } from '../services/api';
import Navbar from '../components/Navbar';
import { SHORT_URL_BASE } from '../config';
import {
  Link2,
  MousePointerClick,
  Eye,
  Calendar,
  Copy,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Globe,
  Smartphone,
  ExternalLink,
  Zap,
  Target
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, code) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate trends
  const getTrend = (current, previous) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0
    };
  };

  const clicksTrend = stats?.clickTrend || 'stable';

  const statCards = [
    { 
      title: 'Total Links', 
      value: stats?.totalLinks || 0, 
      icon: Link2,
      color: 'blue',
      trend: null
    },
    { 
      title: 'Total Clicks', 
      value: stats?.totalClicks || 0, 
      icon: MousePointerClick,
      color: 'green',
      trend: clicksTrend
    },
    { 
      title: 'Active Links', 
      value: stats?.activeLinks || 0, 
      icon: Eye,
      color: 'purple',
      trend: null
    },
    { 
      title: 'Clicks Today', 
      value: stats?.clicksToday || 0, 
      icon: Calendar,
      color: 'orange',
      trend: null
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-500 dark:bg-blue-600',
    green: 'bg-green-500 dark:bg-green-600',
    purple: 'bg-purple-500 dark:bg-purple-600',
    orange: 'bg-orange-500 dark:bg-orange-600'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's your performance overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i} 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      stat.trend === 'up' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : stat.trend === 'down'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                      {stat.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                      {stat.trend === 'up' ? '+' : stat.trend === 'down' ? '-' : ''}
                      {stat.trend !== 'stable' && '10%'}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Unique Visitors */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Unique Visitors</span>
            </div>
            <p className="text-3xl font-bold">{stats?.totalUniqueVisitors?.toLocaleString() || 0}</p>
            <p className="text-xs opacity-75 mt-1">All time</p>
          </div>

          {/* Top Country */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Top Country</span>
            </div>
            <p className="text-2xl font-bold">
              {stats?.topCountries?.[0]?.country || 'N/A'}
            </p>
            <p className="text-xs opacity-75 mt-1">
              {stats?.topCountries?.[0]?.count || 0} clicks
            </p>
          </div>

          {/* Mobile Traffic */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Mobile Traffic</span>
            </div>
            <p className="text-3xl font-bold">
              {stats?.averageClicksPerLink?.toFixed(1) || 0}
            </p>
            <p className="text-xs opacity-75 mt-1">Avg clicks per link</p>
          </div>
        </div>

        {/* Top Performing Links */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Top Performing Links
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your most clicked links
                </p>
              </div>
              <button
                onClick={() => navigate('/links')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                View All
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {stats?.topLinks?.length ? (
            <div className="p-6">
              <div className="space-y-4">
                {stats.topLinks.map((link, index) => (
                  <div
                    key={link.shortCode}
                    className="group relative p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-300"
                  >
                    {/* Rank Badge */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                      #{index + 1}
                    </div>

                    <div className="flex justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          {link.title || 'Untitled Link'}
                          {link.abTest?.enabled && (
                            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              A/B Test
                            </span>
                          )}
                        </h3>

                        {/* Short URL */}
                        <div className="flex items-center gap-2 mb-2">
                          <a
                            href={`${SHORT_URL_BASE}/${link.shortCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline flex items-center gap-1"
                          >
                            {SHORT_URL_BASE}/{link.shortCode}
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <button
                            onClick={() => copyToClipboard(`${SHORT_URL_BASE}/${link.shortCode}`, link.shortCode)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                          >
                            {copiedCode === link.shortCode ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        </div>

                        {/* Original URL */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-3">
                          {link.originalUrl}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/analytics?link=${link.shortCode}`)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1"
                          >
                            <BarChart3 className="w-4 h-4" />
                            View Analytics
                          </button>
                          <button
                            onClick={() => navigate('/links')}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:underline flex items-center gap-1"
                          >
                            <Zap className="w-4 h-4" />
                            Manage
                          </button>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                          <MousePointerClick className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {link.totalClicks.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">total clicks</p>
                        {link.clickRate && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-semibold">
                            {link.clickRate.toFixed(1)}% CTR
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Link2 className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No links yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first smart link to start tracking performance
              </p>
              <button
                onClick={() => navigate('/links')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <Link2 className="w-5 h-5" />
                Create Your First Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
