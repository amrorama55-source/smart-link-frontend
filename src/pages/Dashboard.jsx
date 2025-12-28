import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDashboardStats } from '../services/api';
import Navbar from '../components/Navbar';
import {
  TrendingUp,
  Link2,
  MousePointerClick,
  Eye,
  Calendar,
  ExternalLink,
  BarChart3,
  Copy,
  CheckCircle
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
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Clicks',
      value: stats?.totalClicks || 0,
      icon: MousePointerClick,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Active Links',
      value: stats?.activeLinks || 0,
      icon: Eye,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Clicks Today',
      value: stats?.clicksToday || 0,
      icon: Calendar,
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
          <p className="text-gray-600 mt-2">
            Welcome back! Here's your overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-4 rounded-xl`}>
                    <Icon className={`w-7 h-7 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Performing Links */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Top Performing Links
            </h2>
            <button
              onClick={() => navigate('/links')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View All
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {stats?.topLinks && stats.topLinks.length > 0 ? (
            <div className="space-y-4">
              {stats.topLinks.map((link, index) => (
                <div
                  key={link.shortCode}
                  className="group p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-blue-50 text-blue-600">
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {link.title || 'Untitled Link'}
                        </h3>

                        <div className="flex items-center gap-2 mb-2">
                          <a
                            href={`${window.location.origin}/${link.shortCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1 truncate"
                          >
                            {window.location.origin}/{link.shortCode}
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <button
                            onClick={() =>
                              copyToClipboard(
                                `${window.location.origin}/${link.shortCode}`,
                                link.shortCode
                              )
                            }
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {copiedCode === link.shortCode ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        </div>

                        <p className="text-xs text-gray-500 truncate">
                          → {link.originalUrl}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {link.totalClicks.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">clicks</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t flex gap-4">
                    <Link
                      to={`/analytics/${link.shortCode}`}
                      className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-1"
                    >
                      <BarChart3 className="w-3 h-3" />
                      View Analytics
                    </Link>

                    <Link
                      to="/links"
                      className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-1"
                    >
                      Manage Links
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Link2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No links yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first short link to get started
              </p>
              <button
                onClick={() => navigate('/links')}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Link2 className="w-4 h-4" />
                Create Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
