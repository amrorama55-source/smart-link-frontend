import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  User, Lock, CreditCard, Trash2, LogOut, Monitor, 
  Smartphone, Globe, Shield, CheckCircle, XCircle,
  Save, Eye, EyeOff, AlertTriangle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Subscription state
  const [subscription, setSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('free');
  
  // Delete account state
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadProfile();
    loadSessions();
    loadSubscription();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await api.get('/api/settings/profile');
      setProfileData({
        name: data.user.name,
        email: data.user.email
      });
      setSelectedPlan(data.user.plan);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const loadSessions = async () => {
    try {
      const { data } = await api.get('/api/settings/sessions');
      setSessions(data.sessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const loadSubscription = async () => {
    try {
      const { data } = await api.get('/api/settings/subscription');
      setSubscription(data);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await api.put('/api/settings/profile', profileData);
      alert('Profile updated successfully!');
      loadProfile();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/settings/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (token) => {
    if (!confirm('Are you sure you want to revoke this session?')) return;

    try {
      await api.delete(`/api/settings/sessions/${token}`);
      loadSessions();
      alert('Session revoked successfully');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to revoke session');
    }
  };

  const handleRevokeAllSessions = async () => {
    if (!confirm('Are you sure you want to revoke all other sessions? You will be logged out from all other devices.')) return;

    try {
      await api.post('/api/settings/sessions/revoke-all');
      loadSessions();
      alert('All other sessions revoked successfully');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to revoke sessions');
    }
  };

  const handleChangePlan = async (plan) => {
    if (!confirm(`Are you sure you want to ${plan === 'free' ? 'downgrade' : 'upgrade'} to ${plan} plan?`)) return;

    setLoading(true);
    try {
      await api.put('/api/settings/subscription', { plan });
      alert('Plan updated successfully!');
      setSelectedPlan(plan);
      loadSubscription();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }

    if (!deletePassword) {
      alert('Please enter your password');
      return;
    }

    const confirmed = confirm('⚠️ FINAL WARNING: This will permanently delete your account and all data. Are you absolutely sure?');
    if (!confirmed) return;

    setLoading(true);
    
    try {
      const response = await api.delete('/api/settings/account', {
        data: {
          password: deletePassword,
          confirmDelete: true
        }
      });
      
      alert('Account deleted successfully. You will be logged out now.');
      logout();
      navigate('/login');
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete account. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeleteConfirm('');
      setDeletePassword('');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User, shortLabel: 'Profile' },
    { id: 'password', label: 'Security & Password', icon: Lock, shortLabel: 'Password' },
    { id: 'sessions', label: 'Active Sessions', icon: Monitor, shortLabel: 'Sessions' },
    { id: 'subscription', label: 'Subscription & Billing', icon: CreditCard, shortLabel: 'Billing' },
    { id: 'security', label: 'Account Security', icon: Shield, shortLabel: 'Security' }
  ];

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      features: ['1,000 links/month', '100 API requests/day', 'Basic Analytics']
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$15',
      features: ['10,000 links/month', '1,000 API requests/day', 'Password Protection', 'Advanced Analytics']
    },
    {
      id: 'business',
      name: 'Business',
      price: '$49',
      features: ['Unlimited links', 'Unlimited API requests', 'Custom Domains', 'Team Collaboration']
    }
  ];

  return (
    <div className="min-h-[100dvh] bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        
        {/* Header - RESPONSIVE */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Sidebar - Dropdown on Mobile, Sidebar on Desktop */}
          <div className="lg:col-span-1">
            
            {/* Mobile: Dropdown (< 1024px) */}
            <div className="lg:hidden bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm mb-4">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-4 py-3 text-sm font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[48px]"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop: Sidebar (≥ 1024px) */}
            <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all text-sm ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            
            {/* Profile Tab - RESPONSIVE */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base min-h-[48px]"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base min-h-[48px]"
                      placeholder="your@email.com"
                    />
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Changing your email will require verification
                    </p>
                  </div>

                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="w-full sm:w-auto min-h-[48px] px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Password Tab - RESPONSIVE */}
            {activeTab === 'password' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Security & Password</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base min-h-[48px]"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base min-h-[48px]"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base min-h-[48px]"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="w-full sm:w-auto min-h-[48px] px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{loading ? 'Changing...' : 'Change Password'}</span>
                  </button>
                </div>
              </div>
            )}

                 {/* Sessions Tab - RESPONSIVE */}
            {activeTab === 'sessions' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Active Sessions</h2>
                  </div>
                  <button
                    onClick={handleRevokeAllSessions}
                    className="text-xs sm:text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                  >
                    Revoke All Other Sessions
                  </button>
                </div>

                <div className="space-y-3">
                  {sessions.length === 0 ? (
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center py-8">No active sessions</p>
                  ) : (
                    sessions.map((session, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                          {session.device === 'Mobile' ? (
                            <Smartphone className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Monitor className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                              {session.browser} on {session.os}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {session.device} • {session.ip} • {session.location}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Last active: {new Date(session.lastActivity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 justify-end sm:justify-start">
                          {session.isActive && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full font-medium">
                              Active
                            </span>
                          )}
                          {index !== 0 && (
                            <button
                              onClick={() => handleRevokeSession(session.token)}
                              className="min-h-[36px] px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Subscription Tab - RESPONSIVE */}
            {activeTab === 'subscription' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Subscription & Billing</h2>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Current Plan: <span className="font-semibold text-gray-900 dark:text-white capitalize">{selectedPlan}</span>
                  </p>
                  
                  {subscription?.subscription?.status && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Status: <span className="font-semibold capitalize">{subscription.subscription.status}</span>
                      </p>
                      {subscription.subscription.currentPeriodEnd && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Renews on: {new Date(subscription.subscription.currentPeriodEnd).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-4 sm:p-5 md:p-6 rounded-lg border-2 ${
                        selectedPlan === plan.id
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                        {selectedPlan === plan.id && (
                          <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {plan.price}
                        <span className="text-sm text-gray-500 dark:text-gray-400">/mo</span>
                      </p>
                      <ul className="space-y-2 mb-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {selectedPlan !== plan.id && (
                        <button
                          onClick={() => handleChangePlan(plan.id)}
                          disabled={loading}
                          className="w-full min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {selectedPlan === 'free' && plan.id !== 'free' ? 'Upgrade' : 
                           selectedPlan !== 'free' && plan.id === 'free' ? 'Downgrade' : 
                           'Switch Plan'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account Security Tab - RESPONSIVE */}
            {activeTab === 'security' && (
              <div className="space-y-4 sm:space-y-6">
                
                {/* Logout Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Sign Out</h2>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Sign out from your account. You will need to sign in again to access your account.
                    </p>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to sign out?')) {
                          logout();
                          navigate('/login');
                        }
                      }}
                      className="w-full sm:w-auto min-h-[48px] px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>

                {/* Delete Account Section - RESPONSIVE */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm border-2 border-red-200 dark:border-red-900/50">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <h2 className="text-lg sm:text-xl font-bold text-red-900 dark:text-red-400">Delete Account</h2>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <h3 className="text-sm sm:text-base font-semibold text-red-900 dark:text-red-300 mb-2">
                      Permanent Account Deletion
                    </h3>
                    <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                      This will permanently delete all your links, analytics data, and account information.
                    </p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="min-h-[44px] px-4 sm:px-5 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>

                {/* Delete Modal - RESPONSIVE */}
                {showDeleteModal && (
                  <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 sm:p-6 max-w-md w-full shadow-2xl">
                      <h3 className="text-lg sm:text-xl font-bold text-red-900 dark:text-red-400 mb-4">
                        Delete Account
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                        This action cannot be undone. All your data will be permanently deleted.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type DELETE to confirm
                          </label>
                          <input
                            type="text"
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base min-h-[48px]"
                            placeholder="DELETE"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Enter your password
                          </label>
                          <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base min-h-[48px]"
                            placeholder="Your password"
                          />
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row gap-3">
                          <button
                            onClick={() => {
                              setShowDeleteModal(false);
                              setDeleteConfirm('');
                              setDeletePassword('');
                            }}
                            className="flex-1 min-h-[48px] px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleDeleteAccount}
                            disabled={loading || deleteConfirm !== 'DELETE'}
                            className="flex-1 min-h-[48px] px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            {loading ? 'Deleting...' : 'Delete Account'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}