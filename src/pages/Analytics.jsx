import { useState, useEffect } from 'react';
import { getLinks, getAnalytics } from '../services/api';
import Navbar from '../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MousePointerClick, Globe, Smartphone } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Analytics() {
  const [links, setLinks] = useState([]);
  const [selectedLink, setSelectedLink] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLinks();
  }, []);

  useEffect(() => {
    if (selectedLink) {
      loadAnalytics(selectedLink);
    }
  }, [selectedLink]);

  const loadLinks = async () => {
    try {
      const data = await getLinks(1, 100);
      setLinks(data.links);
      if (data.links.length > 0) {
        setSelectedLink(data.links[0].shortCode);
      }
    } catch (error) {
      console.error('Failed to load links:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async (shortCode) => {
    try {
      const data = await getAnalytics(shortCode);
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No analytics yet</h3>
            <p className="text-gray-600">Create some links to see analytics</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedLinkData = links.find(l => l.shortCode === selectedLink);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Track your link performance</p>
        </div>

        {/* Link Selector */}
        <div className="card mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Link
          </label>
          <select
            value={selectedLink}
            onChange={(e) => setSelectedLink(e.target.value)}
            className="input-field"
          >
            {links.map((link) => (
              <option key={link.shortCode} value={link.shortCode}>
                {link.title || link.shortUrl} ({link.totalClicks} clicks)
              </option>
            ))}
          </select>
        </div>

        {analytics && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {analytics.totalClicks}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <MousePointerClick className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Original URL</p>
                    <p className="text-sm text-gray-900 mt-2 truncate max-w-[200px]">
                      {selectedLinkData?.originalUrl}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
                    <Globe className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Clicked</p>
                    <p className="text-sm text-gray-900 mt-2">
                      {analytics.lastClickedAt 
                        ? new Date(analytics.lastClickedAt).toLocaleDateString()
                        : 'Never'
                      }
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            {analytics.totalClicks > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Clicks by Date */}
                {analytics.clicksByDate.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Clicks Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.clicksByDate}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Clicks by Device */}
                {analytics.clicksByDevice.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Device Types</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analytics.clicksByDevice}
                          dataKey="count"
                          nameKey="label"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {analytics.clicksByDevice.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Clicks by Browser */}
                {analytics.clicksByBrowser.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Browsers</h3>
                    <div className="space-y-3">
                      {analytics.clicksByBrowser.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{item.label}</span>
                            <span className="text-gray-600">{item.count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(item.count / analytics.totalClicks) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clicks by OS */}
                {analytics.clicksByOS.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Operating Systems</h3>
                    <div className="space-y-3">
                      {analytics.clicksByOS.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{item.label}</span>
                            <span className="text-gray-600">{item.count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${(item.count / analytics.totalClicks) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Referrers */}
                {analytics.topReferrers.length > 0 && (
                  <div className="card lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Top Referrers</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Source</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700">Clicks</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700">Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.topReferrers.map((item, index) => (
                            <tr key={index} className="border-b border-gray-100">
                              <td className="py-3 px-4 text-gray-900">{item.label}</td>
                              <td className="py-3 px-4 text-right text-gray-900">{item.count}</td>
                              <td className="py-3 px-4 text-right text-gray-600">
                                {((item.count / analytics.totalClicks) * 100).toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center py-12">
                <MousePointerClick className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No clicks yet</h3>
                <p className="text-gray-600">Share your link to start collecting data</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}