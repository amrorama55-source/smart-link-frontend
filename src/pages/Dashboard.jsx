import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../services/api';
import Navbar from '../components/Navbar';
import { TrendingUp, Link2, MousePointerClick, Eye, Calendar } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Links',
      value: stats?.totalLinks || 0,
      icon: Link2,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Clicks',
      value: stats?.totalClicks || 0,
      icon: MousePointerClick,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Active Links',
      value: stats?.activeLinks || 0,
      icon: Eye,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Clicks Today',
      value: stats?.clicksToday || 0,
      icon: Calendar,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-4 rounded-xl flex-shrink-0`}>
                    <Icon className={`w-7 h-7 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Links */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Performing Links</h2>
            <button
              onClick={() => navigate('/links')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All →
            </button>
          </div>

          {stats?.topLinks && stats.topLinks.length > 0 ? (
            <div className="space-y-4">
              {stats.topLinks.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {link.title || 'Untitled'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{link.shortUrl}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {link.totalClicks}
                    </p>
                    <p className="text-xs text-gray-500">clicks</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No links yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first short link to get started
              </p>
              <button
                onClick={() => navigate('/links')}
                className="btn-primary"
              >
                Create Link
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600 mb-2">This Week</h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.clicksThisWeek || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total clicks</p>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-600 mb-2">This Month</h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.clicksThisMonth || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total clicks</p>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Average</h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.totalLinks > 0 
                ? Math.round(stats.totalClicks / stats.totalLinks)
                : 0
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">Clicks per link</p>
          </div>
        </div>
      </div>
    </div>
  );
}