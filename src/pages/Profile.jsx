import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  User, Mail, Calendar, Crown, Link2, MousePointerClick, 
  Globe, TrendingUp, Award, Settings, Edit2, Camera,
  CheckCircle, Shield, Zap, Star, Lock, CreditCard,
  Trash2, LogOut, Monitor, Smartphone, Eye, EyeOff,
  AlertTriangle, Save, Sun, Moon
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  // Profile data
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    website: '',
    location: '',
    email: ''
  });

  // Password data
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

  // Subscription
  const [subscription, setSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('free');

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Sessions
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'settings') {
      setActiveTab('settings');
    }
    loadProfileData();
  }, [searchParams]);

  const loadProfileData = async () => {
    try {
      const [profileRes, statsRes] = await Promise.all([
        api.get('/api/profile'),
        api.get('/api/profile/stats')
      ]);

      setProfile(profileRes.data);
      setStats(statsRes.data);
      setSelectedPlan(profileRes.data.plan || 'free');
      
      setProfileData({
        name: profileRes.data.name || '',
        bio: profileRes.data.bio || '',
        website: profileRes.data.website || '',
        location: profileRes.data.location || '',
        email: profileRes.data.email || ''
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
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

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await api.put('/api/profile', profileData);
      alert('Profile updated successfully!');
      setEditMode(false);
      loadProfileData();
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

  const handleChangePlan = async (plan) => {
    if (!confirm(`Are you sure you want to ${plan === 'free' ? 'downgrade' : 'upgrade'} to ${plan} plan?`)) return;

    setLoading(true);
    try {
      await api.put('/api/settings/subscription', { plan });
      alert('Plan updated successfully!');
      setSelectedPlan(plan);
      loadProfileData();
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
      await api.delete('/api/settings/account', {
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

  const planBadges = {
    free: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', icon: User },
    pro: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Zap },
    business: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: Crown }
  };

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

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  const currentPlan = profile?.plan || 'free';
  const PlanIcon = planBadges[currentPlan]?.icon || User;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <>
            {/* Header with Cover */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl h-32 sm:h-48 mb-16 sm:mb-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              
              {/* Profile Picture */}
              <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-xl">
                    <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-600" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition shadow-lg">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      {editMode ? (
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="text-2xl font-bold mb-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {profile?.name || 'User'}
                        </h1>
                      )}
                      
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{profile?.email}</span>
                      </div>

                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${planBadges[currentPlan]?.color} font-semibold text-sm`}>
                        <PlanIcon className="w-4 h-4" />
                        <span className="capitalize">{currentPlan} Plan</span>
                      </div>
                    </div>

                    <button
                      onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      {editMode ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Save</span>
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bio */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    {editMode ? (
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile?.bio || 'No bio yet. Click Edit to add one!'}
                      </p>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website
                      </label>
                      {editMode ? (
                        <input
                          type="url"
                          value={profileData.website}
                          onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="https://example.com"
                        />
                      ) : (
                        <p className="text-blue-600 dark:text-blue-400">
                          {profile?.website || 'Not set'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="City, Country"
                        />
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                          {profile?.location || 'Not set'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {new Date(profile?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={Link2} label="Total Links" value={stats?.totalLinks || 0} color="blue" />
                  <StatCard icon={MousePointerClick} label="Total Clicks" value={stats?.totalClicks || 0} color="green" />
                  <StatCard icon={Globe} label="Countries" value={stats?.countries || 0} color="purple" />
                  <StatCard icon={TrendingUp} label="This Month" value={stats?.clicksThisMonth || 0} color="orange" />
                </div>

                {/* Achievements */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <Award className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { id: 1, name: 'First Link', description: 'Created your first link', icon: '🎉', unlocked: true },
                      { id: 2, name: '100 Clicks', description: 'Reached 100 total clicks', icon: '💯', unlocked: stats?.totalClicks >= 100 },
                      { id: 3, name: 'Global Reach', description: 'Clicks from 10+ countries', icon: '🌍', unlocked: stats?.countries >= 10 },
                      { id: 4, name: 'Power User', description: 'Created 50+ links', icon: '⚡', unlocked: stats?.totalLinks >= 50 },
                      { id: 5, name: 'Viral Hit', description: 'Single link with 1000+ clicks', icon: '🚀', unlocked: false },
                      { id: 6, name: 'Early Adopter', description: 'Joined in first year', icon: '🏆', unlocked: true }
                    ].map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          achievement.unlocked
                            ? 'border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 opacity-60'
                        }`}
                      >
                        <div className="text-3xl mb-2">{achievement.icon}</div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{achievement.name}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                        {achievement.unlocked && (
                          <CheckCircle className="w-4 h-4 text-yellow-500 mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/links')}
                      className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Link2 className="w-4 h-4" />
                      <span>Create New Link</span>
                    </button>
                    <button
                      onClick={() => navigate('/analytics')}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>View Analytics</span>
                    </button>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Account Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Verified Email</span>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">API Access</span>
                      </div>
                      {currentPlan !== 'free' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <span className="text-xs text-gray-500">Upgrade</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-purple-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Premium Features</span>
                      </div>
                      {currentPlan === 'business' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <span className="text-xs text-gray-500">Upgrade</span>
                      )}
                    </div>
                  </div>

                  {currentPlan === 'free' && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => setActiveTab('settings')}
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Upgrade Plan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Email & Password */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security & Password</h2>
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
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
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
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
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
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{loading ? 'Changing...' : 'Change Password'}</span>
                </button>
              </div>
            </div>

            {/* Subscription */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Subscription Plan</h2>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Current Plan: <span className="font-semibold text-gray-900 dark:text-white capitalize">{selectedPlan}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-6 rounded-lg border-2 ${
                      selectedPlan === plan.id
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                      {selectedPlan === plan.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {plan.price}<span className="text-sm text-gray-500 dark:text-gray-400">/mo</span>
                    </p>
                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {selectedPlan !== plan.id && (
                      <button
                        onClick={() => handleChangePlan(plan.id)}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
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

            {/* Theme Toggle */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Sun className="w-6 h-6 text-blue-600 dark:text-blue-400" /> : <Moon className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Theme</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {darkMode ? (
                    <>
                      <Sun className="w-4 h-4" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sign Out */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <LogOut className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sign Out</h2>
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
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Delete Account */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 border-red-200 dark:border-red-900/50">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <h2 className="text-xl font-bold text-red-900 dark:text-red-400">Delete Account</h2>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2">Permanent Account Deletion</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  Once you delete your account, there is no going back. This will permanently delete all your links, analytics data, and account information.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-2xl">
                  <h3 className="text-xl font-bold text-red-900 dark:text-red-400 mb-4">Delete Account</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
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
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Your password"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={loading || deleteConfirm !== 'DELETE'}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Deleting...' : 'Delete Account'}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteModal(false);
                          setDeleteConfirm('');
                          setDeletePassword('');
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
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
  );
}

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
    </div>
  );
};