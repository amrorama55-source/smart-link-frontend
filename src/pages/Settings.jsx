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

    setLoading(true);
    try {
      await api.delete('/api/settings/account', {
        data: {
          password: deletePassword,
          confirmDelete: true
        }
      });
      alert('Account deleted successfully');
      logout();
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete account');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'password', label: 'Security & Password', icon: Lock },
    { id: 'sessions', label: 'Active Sessions', icon: Monitor },
    { id: 'subscription', label: 'Subscription & Billing', icon: CreditCard },
    { id: 'security', label: 'Account Security', icon: Shield }
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Changing your email will require verification
                    </p>
                  </div>

                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <h2 className="text-xl font-bold text-gray-900">Security & Password</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{loading ? 'Changing...' : 'Change Password'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <h2 className="text-xl font-bold text-gray-900">Active Sessions</h2>
                  </div>
                  <button
                    onClick={handleRevokeAllSessions}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Revoke All Other Sessions
                  </button>
                </div>

                <div className="space-y-3">
                  {sessions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No active sessions</p>
                  ) : (
                    sessions.map((session, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          {session.device === 'Mobile' ? (
                            <Smartphone className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Monitor className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {session.browser} on {session.os}
                            </p>
                            <p className="text-sm text-gray-500">
                              {session.device} • {session.ip} • {session.location}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Last active: {new Date(session.lastActivity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.isActive && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Active
                            </span>
                          )}
                          {index !== 0 && (
                            <button
                              onClick={() => handleRevokeSession(session.token)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
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

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <h2 className="text-xl font-bold text-gray-900">Subscription & Billing</h2>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Current Plan: <span className="font-semibold text-gray-900 capitalize">{selectedPlan}</span>
                  </p>
                  
                  {subscription?.subscription?.status && (
                    <div className="p-4 bg-blue-50 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">
                        Status: <span className="font-semibold capitalize">{subscription.subscription.status}</span>
                      </p>
                      {subscription.subscription.currentPeriodEnd && (
                        <p className="text-sm text-gray-600 mt-1">
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
                      className={`p-6 rounded-lg border-2 ${
                        selectedPlan === plan.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                        {selectedPlan === plan.id && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <p className="text-3xl font-bold text-gray-900 mb-4">{plan.price}<span className="text-sm text-gray-500">/mo</span></p>
                      <ul className="space-y-2 mb-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {selectedPlan !== plan.id && (
                        <button
                          onClick={() => handleChangePlan(plan.id)}
                          disabled={loading}
                          className="w-full btn-primary"
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

            {/* Account Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Logout Section */}
                <div className="card">
                  <div className="flex items-center gap-3 mb-6">
                    <LogOut className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <h2 className="text-xl font-bold text-gray-900">Sign Out</h2>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-4">
                      Sign out from your account. You will need to sign in again to access your account.
                    </p>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to sign out?')) {
                          logout();
                          navigate('/login');
                        }
                      }}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>

                {/* Delete Account Section */}
                <div className="card border-2 border-red-200">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <h2 className="text-xl font-bold text-red-900">Delete Account</h2>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="font-semibold text-red-900 mb-2">Permanent Account Deletion</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                      This will permanently delete all your links, analytics data, and account information.
                    </p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="btn-danger flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>

                {/* Delete Modal */}
                {showDeleteModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                      <h3 className="text-xl font-bold text-red-900 mb-4">Delete Account</h3>
                      <p className="text-gray-600 mb-4">
                        This action cannot be undone. All your data will be permanently deleted.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type DELETE to confirm
                          </label>
                          <input
                            type="text"
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="DELETE"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter your password
                          </label>
                          <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Your password"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={handleDeleteAccount}
                            disabled={loading || deleteConfirm !== 'DELETE'}
                            className="flex-1 btn-danger"
                          >
                            {loading ? 'Deleting...' : 'Delete Account'}
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteModal(false);
                              setDeleteConfirm('');
                              setDeletePassword('');
                            }}
                            className="flex-1 btn-secondary"
                          >
                            Cancel
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

