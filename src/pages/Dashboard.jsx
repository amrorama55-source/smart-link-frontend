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
    <div className="min-h-[100dvh] bg-gray-50 dark:bg-gray-900">

        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Links', value: stats?.totalLinks || 0, icon: Link2 },
    { title: 'Total Clicks', value: stats?.totalClicks || 0, icon: MousePointerClick },
    { title: 'Active Links', value: stats?.activeLinks || 0, icon: Eye },
    { title: 'Clicks Today', value: stats?.clicksToday || 0, icon: Calendar }
  ];

  return (
  <div className="min-h-[100dvh] bg-gray-50 dark:bg-gray-900">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's your overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value.toLocaleString()}</p>
                  </div>
                  <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Links */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Performing Links</h2>
            <button
              onClick={() => navigate('/links')}
              className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
            >
              View All →
            </button>
          </div>

          {stats?.topLinks?.length ? (
            <div className="space-y-4">
              {stats.topLinks.map((link, index) => (
                <div
                  key={link.shortCode}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate text-gray-900 dark:text-white">
                        {link.title || 'Untitled Link'}
                      </h3>

                      {/* Short URL */}
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={`${SHORT_URL_BASE}/${link.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 text-sm truncate hover:underline"
                        >
                          {SHORT_URL_BASE}/{link.shortCode}
                        </a>

                        <button
                          onClick={() =>
                            copyToClipboard(
                              `${SHORT_URL_BASE}/${link.shortCode}`,
                              link.shortCode
                            )
                          }
                        >
                          {copiedCode === link.shortCode ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </div>

                      {/* Original URL */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                        {link.originalUrl}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {link.totalClicks.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">clicks</p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-3 text-xs">
                    <Link
                      to={`/analytics/${link.shortCode}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Analytics
                    </Link>
                    <Link
                      to="/links"
                      className="text-gray-600 dark:text-gray-400 hover:underline"
                    >
                      Manage Links
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="mb-4">No links created yet</p>
              <button
                onClick={() => navigate('/links')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Create Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

