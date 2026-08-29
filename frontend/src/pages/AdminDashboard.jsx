import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastProvider';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, Shield, Link2, MousePointerClick, Search, Filter,
  CheckCircle, Ban, AlertTriangle, RefreshCw, Crown, ChevronLeft, ChevronRight, Lock, KeyRound, Mail, Send,
  TrendingUp, Download, Eye, BarChart2, FileText, X, Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Email Campaign Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('🚀 Important Update: New Features Added to Smart Link!');
  const [emailBody, setEmailBody] = useState(`Hi {{name}}! 👋\n\nWe've recently upgraded Smart Link with faster redirect speeds, new Bio Page themes, and advanced Bot Protection analytics.\n\nLog in to your account today to check your links and explore the new features:\nhttps://www.by-smartlink.com/login\n\nBest regards,\nThe Smart Link Team`);
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleSendBroadcast = async (testOnly = false) => {
    try {
      setSendingEmail(true);
      const { data } = await api.post('/admin/broadcast-email', {
        subject: emailSubject,
        bodyHtml: emailBody.replace(/\n/g, '<br/>'),
        testOnly
      });
      if (testOnly) {
        success(data.message || 'Test email sent to your inbox!');
      } else {
        success(data.message || 'Broadcast campaign completed!');
        setShowEmailModal(false);
      }
    } catch (err) {
      error(err.response?.data?.error || 'Failed to send broadcast email');
    } finally {
      setSendingEmail(false);
    }
  };

  // ─── New Features State ───────────────────────────────────────
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'growth' | 'top' | 'logs'
  const [growthStats, setGrowthStats] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);

  // Plan change modal
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planModalUser, setPlanModalUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [changingPlan, setChangingPlan] = useState(false);

  // User links modal
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [linksModalUser, setLinksModalUser] = useState(null);
  const [userLinks, setUserLinks] = useState([]);
  const [linksLoading, setLinksLoading] = useState(false);

  const handleChangePlan = async () => {
    if (!planModalUser) return;
    try {
      setChangingPlan(true);
      const { data } = await api.patch(`/admin/users/${planModalUser._id}/plan`, { plan: selectedPlan });
      if (data.success) {
        success(`✅ Plan updated to "${selectedPlan}" for ${planModalUser.email}`);
        setShowPlanModal(false);
        setPlanModalUser(null);
        loadUsers();
      }
    } catch (err) {
      error(err.response?.data?.error || 'Failed to change plan');
    } finally {
      setChangingPlan(false);
    }
  };

  const handleViewLinks = async (u) => {
    setLinksModalUser(u);
    setShowLinksModal(true);
    setLinksLoading(true);
    setUserLinks([]);
    try {
      const { data } = await api.get(`/admin/users/${u._id}/links`);
      setUserLinks(data.links || []);
    } catch (err) {
      error('Failed to load user links');
    } finally {
      setLinksLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExportingCSV(true);
      const response = await api.get('/admin/export/users', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `smart-link-users-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      success('✅ CSV exported successfully!');
    } catch (err) {
      error('Failed to export CSV');
    } finally {
      setExportingCSV(false);
    }
  };

  const loadGrowthStats = async () => {
    try {
      const { data } = await api.get('/admin/growth-stats');
      setGrowthStats(data);
    } catch (err) {
      console.error('Growth stats error:', err);
    }
  };

  const loadTopUsers = async () => {
    try {
      const { data } = await api.get('/admin/top-users');
      setTopUsers(data.topUsers || []);
    } catch (err) {
      console.error('Top users error:', err);
    }
  };

  const loadAuditLogs = async () => {
    setLogsLoading(true);
    try {
      const { data } = await api.get('/admin/audit-logs');
      setAuditLogs(data.logs || []);
    } catch (err) {
      console.error('Audit logs error:', err);
    } finally {
      setLogsLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────

  const [page, setPage] = useState(1);

  // Ban Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [showBanModal, setShowBanModal] = useState(false);

  const [isForbidden, setIsForbidden] = useState(false);


  useEffect(() => {
    loadAdminStats();
  }, []);

  useEffect(() => {
    if (!isForbidden) {
      loadUsers();
    }
  }, [page, planFilter, statusFilter, isForbidden]);

  const loadAdminStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      if (data && (data.success || data.stats)) {
        setStats(data.stats);
        setIsForbidden(false);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setIsForbidden(true);
      } else {
        error(err.response?.data?.message || 'Access restricted to administrators');
      }
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 15,
        ...(search && { search }),
        ...(planFilter && { plan: planFilter }),
        ...(statusFilter && { status: statusFilter })
      });

      const { data } = await api.get(`/admin/users?${params.toString()}`);
      if (data && (data.success || data.users)) {
        setUsers(data.users || []);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setIsForbidden(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const handleBanUser = async () => {
    if (!selectedUser) return;
    try {
      const { data } = await api.post(`/admin/users/${selectedUser._id}/ban`, {
        reason: banReason || 'Violation of terms'
      });
      if (data.success) {
        success(`User ${selectedUser.email} has been banned.`);
        setShowBanModal(false);
        setSelectedUser(null);
        setBanReason('');
        loadUsers();
        loadAdminStats();
      }
    } catch (err) {
      error(err.response?.data?.error || 'Failed to ban user');
    }
  };

  const handleUnbanUser = async (u) => {
    if (!window.confirm(`Are you sure you want to lift the ban for ${u.email}?`)) return;
    try {
      const { data } = await api.post(`/admin/users/${u._id}/unban`);
      if (data.success) {
        success(`User ${u.email} has been unbanned.`);
        loadUsers();
        loadAdminStats();
      }
    } catch (err) {
      error(err.response?.data?.error || 'Failed to unban user');
    }
  };

  if (isForbidden || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-white font-sans">
        <Navbar />
        <div className="max-w-md mx-auto pt-40 px-4 text-center">
          <div className="w-20 h-20 bg-purple-500/10 text-purple-500 rounded-3xl border border-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black mb-3">Admin Panel Authentication</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">
            Please sign in with your system administrator account (e.g. <strong className="text-gray-900 dark:text-white">smartlinkpro10@gmail.com</strong>) to access this panel.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/login?redirect=/admin')}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" /> Sign In as Admin
            </button>
            <Link to="/dashboard">
              <button className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                Return to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-white font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-4 h-4" /> System Administration
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowEmailModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
            >
              <Mail className="w-4 h-4" /> Send Email Campaign
            </button>
            <button
              onClick={handleExportCSV}
              disabled={exportingCSV}
              className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-green-600/20 transition-all disabled:opacity-60"
            >
              {exportingCSV ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export CSV
            </button>
            <button
              onClick={() => { loadAdminStats(); loadUsers(); }}
              className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" /> Refresh Data
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-1.5 w-fit shadow-sm flex-wrap">
          {[
            { id: 'users', label: 'Users', icon: Users, onClick: () => {} },
            { id: 'growth', label: 'Growth', icon: TrendingUp, onClick: loadGrowthStats },
            { id: 'top', label: 'Top Users', icon: BarChart2, onClick: loadTopUsers },
            { id: 'logs', label: 'Audit Logs', icon: Activity, onClick: loadAuditLogs },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); tab.onClick(); }}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>


        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalUsers}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Registered accounts</div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Links</span>
                <Link2 className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalLinks}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active shortlinks</div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Clicks</span>
                <MousePointerClick className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalClicks ? stats.totalClicks.toLocaleString() : 0}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tracked redirections</div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Banned Users</span>
                <Ban className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-3xl font-black text-red-600 dark:text-red-400">{stats.bannedUsers}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Blocked accounts</div>
            </div>
          </div>
        )}

        {/* User Management Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user by email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
              />
            </form>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={planFilter}
                  onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="">All Plans</option>
                  <option value="free">Free</option>
                  <option value="starter">Starter</option>
                  <option value="trial">Trial</option>
                  <option value="pro">Pro</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold"
              >
                <option value="">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="banned">Banned Only</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                  <th className="p-4 sm:p-5">User</th>
                  <th className="p-4 sm:p-5">Plan</th>
                  <th className="p-4 sm:p-5">Role</th>
                  <th className="p-4 sm:p-5">Joined</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm font-medium">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">Loading users data...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">No users found matching your filters.</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="p-4 sm:p-5">
                        <div className="font-bold text-gray-900 dark:text-white">{u.name || 'Unnamed'}</div>
                        <div className="text-xs font-mono text-gray-500 dark:text-gray-400">{u.email}</div>
                      </td>
                      <td className="p-4 sm:p-5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          u.plan === 'business' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400' :
                          u.plan === 'pro' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                          u.plan === 'starter' ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' :
                          'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}>
                          {u.plan}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5">
                        {u.email === 'smartlinkpro10@gmail.com' || u.role === 'admin' || u.isAdmin || u.displayRole === 'admin' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-500">
                            <Crown className="w-3.5 h-3.5" /> Admin
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-gray-400">User</span>
                        )}
                      </td>

                      <td className="p-4 sm:p-5 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 sm:p-5">
                        {u.isBanned ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-500 border border-red-500/30">
                            Banned
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-500 border border-green-500/30">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 sm:p-5 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* View Links */}
                          <button
                            onClick={() => handleViewLinks(u)}
                            title="View user's links"
                            className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {/* Change Plan */}
                          {u.role !== 'admin' && !u.isAdmin && (
                            <button
                              onClick={() => { setPlanModalUser(u); setSelectedPlan(u.plan || 'free'); setShowPlanModal(true); }}
                              title="Change plan"
                              className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold transition-colors"
                            >
                              <TrendingUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {/* Ban / Unban */}
                          {u.role === 'admin' || u.isAdmin ? (
                            <span className="text-xs text-gray-400 italic">Protected</span>
                          ) : u.isBanned ? (
                            <button
                              onClick={() => handleUnbanUser(u)}
                              className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg text-xs font-bold transition-colors"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              onClick={() => { setSelectedUser(u); setShowBanModal(true); }}
                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition-colors"
                            >
                              Ban User
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
              <div>Showing page {pagination.page} of {pagination.pages}</div>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 border border-gray-200 dark:border-gray-800 rounded-lg disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= pagination.pages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 border border-gray-200 dark:border-gray-800 rounded-lg disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── Growth Stats Tab ────────────────────────────────── */}
        {activeTab === 'growth' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl p-6 mt-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-500/10 rounded-2xl text-green-500"><TrendingUp className="w-5 h-5" /></div>
              <div>
                <h2 className="text-xl font-black">Growth Statistics</h2>
                <p className="text-xs text-gray-500">New users & links — last 30 days</p>
              </div>
            </div>
            {!growthStats ? (
              <div className="text-center py-12 text-gray-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
                <p>Loading growth data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Users growth */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" />New Users</h3>
                  {growthStats.usersGrowth?.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No new users in the last 30 days</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {growthStats.usersGrowth?.map(d => (
                        <div key={d._id} className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{d._id}</span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${Math.min(d.count * 20, 120)}px` }} />
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 w-6">{d.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Links growth */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2"><Link2 className="w-4 h-4 text-purple-500" />New Links</h3>
                  {growthStats.linksGrowth?.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No new links in the last 30 days</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {growthStats.linksGrowth?.map(d => (
                        <div key={d._id} className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{d._id}</span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${Math.min(d.count * 20, 120)}px` }} />
                            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 w-6">{d.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Top Users Tab ────────────────────────────────────── */}
        {activeTab === 'top' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl p-6 mt-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500"><BarChart2 className="w-5 h-5" /></div>
              <div>
                <h2 className="text-xl font-black">Top Active Users</h2>
                <p className="text-xs text-gray-500">Ranked by number of links created</p>
              </div>
            </div>
            {topUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
                <p>Loading top users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-950 text-gray-500 text-xs font-bold uppercase border-b border-gray-200 dark:border-gray-800">
                      <th className="p-4">#</th>
                      <th className="p-4">User</th>
                      <th className="p-4">Plan</th>
                      <th className="p-4">Links</th>
                      <th className="p-4">Clicks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                    {topUsers.map((u, i) => (
                      <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-4 font-black text-gray-400">#{i + 1}</td>
                        <td className="p-4">
                          <div className="font-bold">{u.name || 'Unnamed'}</div>
                          <div className="text-xs text-gray-500 font-mono">{u.email}</div>
                        </td>
                        <td className="p-4"><span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800">{u.plan || 'free'}</span></td>
                        <td className="p-4 font-black text-blue-600 dark:text-blue-400">{u.linkCount}</td>
                        <td className="p-4 font-black text-green-600 dark:text-green-400">{u.totalClicks?.toLocaleString() || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Audit Logs Tab ───────────────────────────────────── */}
        {activeTab === 'logs' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl p-6 mt-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-500/10 rounded-2xl text-red-500"><Activity className="w-5 h-5" /></div>
              <div>
                <h2 className="text-xl font-black">Security Audit Logs</h2>
                <p className="text-xs text-gray-500">Last 100 admin actions across the platform</p>
              </div>
            </div>
            {logsLoading ? (
              <div className="text-center py-12 text-gray-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
                <p>Loading audit logs...</p>
              </div>
            ) : auditLogs.length === 0 ? (
              <p className="text-center text-gray-400 py-12">No audit logs found.</p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {auditLogs.map((log, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-purple-600 dark:text-purple-400 text-xs">{log.action}</span>
                        <span className="text-xs text-gray-400">{log.userId?.email || 'Unknown'}</span>
                        <span className="text-xs text-gray-300 dark:text-gray-600">{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 truncate">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ban Reason Modal */}
        {showBanModal && selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4 text-red-500">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ban User Account</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to ban <strong className="text-gray-900 dark:text-white">{selectedUser.email}</strong>? They will be immediately blocked from logging in.
              </p>
              
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Ban Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Phishing links, Terms of Service violation"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setShowBanModal(false); setSelectedUser(null); setBanReason(''); }}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBanUser}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-600/30"
                >
                  Confirm Ban
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Broadcast Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-6 text-purple-600 dark:text-purple-400">
                <div className="p-3 bg-purple-500/10 rounded-2xl">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Broadcast Email Campaign</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Send an email message to all {stats?.totalUsers || ''} registered users</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Subject Line</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Enter email subject..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email Body (Supports HTML & {'{{name}}'})</label>
                  <textarea
                    rows={8}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Write your email message here..."
                  />
                </div>

                <div className="p-3 bg-purple-500/10 rounded-xl text-xs text-purple-600 dark:text-purple-300 font-medium">
                  💡 Tip: You can test the email by sending a copy to your admin inbox first.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={sendingEmail}
                  onClick={() => handleSendBroadcast(true)}
                  className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Test Email
                </button>
                <button
                  type="button"
                  disabled={sendingEmail}
                  onClick={() => handleSendBroadcast(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {sendingEmail ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sendingEmail ? 'Sending...' : 'Send Broadcast to All'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Change Plan Modal ─────────────────────────────────── */}
        {showPlanModal && planModalUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-indigo-500">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Change Plan</h3>
                </div>
                <button onClick={() => setShowPlanModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Changing plan for: <strong className="text-gray-800 dark:text-white">{planModalUser.email}</strong></p>
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">New Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  {['free', 'starter', 'trial', 'pro', 'business'].map(p => (
                    <button
                      key={p}
                      onClick={() => setSelectedPlan(p)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold capitalize border-2 transition-all ${
                        selectedPlan === p
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowPlanModal(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold">Cancel</button>
                <button
                  onClick={handleChangePlan}
                  disabled={changingPlan}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {changingPlan ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {changingPlan ? 'Updating...' : `Set to ${selectedPlan}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── View User Links Modal ─────────────────────────────── */}
        {showLinksModal && linksModalUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-blue-500">
                  <Link2 className="w-5 h-5" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">User Links</h3>
                    <p className="text-xs text-gray-500">{linksModalUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setShowLinksModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              {linksLoading ? (
                <div className="text-center py-10 text-gray-400"><RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" /><p className="text-sm">Loading links...</p></div>
              ) : userLinks.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm">This user has no links yet.</p>
              ) : (
                <div className="space-y-2">
                  {userLinks.map(link => (
                    <div key={link._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{link.title || link.shortCode}</div>
                        <div className="text-xs font-mono text-gray-500 truncate">{link.originalUrl}</div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${link.isActive ? 'bg-green-500/10 text-green-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                          {link.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{link.totalClicks || 0} clicks</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
