import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  User, Mail, Calendar, Crown, Link2, MousePointerClick,
  Globe, TrendingUp, Award, Settings, Edit2, Camera,
  CheckCircle, Shield, Zap, Star, Lock, CreditCard,
  Trash2, LogOut, Monitor, Smartphone, Eye, EyeOff,
  AlertTriangle, Save, Sun, Moon
} from 'lucide-react';
import {
  getProfile,
  getDashboardStats,
  updateProfile,
  changePassword,
  updateSubscription,
  deleteAccount,
  getSessions
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PLANS } from '../utils/plans';

export default function Profile() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    countries: 0,
    clicksThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Profile data
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    website: '',
    location: '',
    email: '',
    avatar: ''
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
  const [isYearly, setIsYearly] = useState(false);

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Sessions
  const [sessions, setSessions] = useState([]);

  // Helper function to get initial from name
  const getInitial = () => {
    if (profileData.name && profileData.name.trim()) {
      return profileData.name.trim().charAt(0).toUpperCase();
    }
    if (profile?.name && profile.name.trim()) {
      return profile.name.trim().charAt(0).toUpperCase();
    }
    if (profile?.email && profile.email.trim()) {
      return profile.email.trim().charAt(0).toUpperCase();
    }
    return 'U'; // Default to 'U' for User
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'settings') {
      setActiveTab('settings');
    }
    loadProfileData();
  }, [searchParams]);

  const loadProfileData = async () => {
    try {
      // Load profile data
      const data = await getProfile();

      // Handle nested user object structure
      const userProfile = data.user || data;

      setProfile(userProfile);
      setSelectedPlan(userProfile.plan || 'free');

      setProfileData({
        name: userProfile.name || '',
        bio: userProfile.bioPage?.bio || userProfile.bio || '',
        website: userProfile.website || '',
        location: userProfile.location || '',
        email: userProfile.email || '',
        avatar: userProfile.avatar || userProfile.bioPage?.avatar || ''
      });

      // Load stats
      try {
        const statsRes = await getDashboardStats();
        if (statsRes.success && statsRes.stats) {
          setStats({
            totalLinks: statsRes.stats.totalLinks || 0,
            totalClicks: statsRes.stats.totalClicks || 0,
            countries: statsRes.stats.topCountries?.length || 0,
            clicksThisMonth: statsRes.stats.clicksThisMonth || 0
          });
        }
      } catch (statsError) {
        console.warn('Stats endpoint not available:', statsError);
        // Keep default stats values
      }

    } catch (error) {
      console.error('Failed to load profile:', error);
      alert('Failed to load profile data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const { sessions } = await getSessions();
      setSessions(sessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const fileInputRef = useRef(null);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 500;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image too large (Max 5MB)');
      return;
    }
    try {
      const compressedBase64 = await compressImage(file);
      setProfileData(prev => ({ ...prev, avatar: compressedBase64 }));
      await updateProfile({ ...profileData, avatar: compressedBase64 });
      loadProfileData();
    } catch (error) {
      console.error("Image compression failed", error);
      alert("Failed to process image");
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfile(profileData);
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
      await changePassword({
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
      await updateSubscription(plan);
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
      await deleteAccount({
        password: deletePassword,
        confirmDelete: true
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

  const plans = PLANS;

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

  // Safe access to current plan
  const currentPlan = profile?.plan || 'free';
  const safePlanBadge = planBadges[currentPlan] || planBadges.free;
  const PlanIcon = safePlanBadge.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'profile'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'settings'
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
            {/* Header with Cover - CLEAN VERSION */}
            <div className="relative rounded-2xl h-32 sm:h-40 mb-8 overflow-hidden shadow-2xl group border border-gray-200 dark:border-gray-700">
              {/* Simplified Background */}
              <div className="absolute inset-0 bg-gray-900 border-b border-gray-800">
                {/* Very subtle decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>
              </div>
              <div className="absolute inset-0 bg-black/10"></div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center sm:justify-start sm:px-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Profile Avatar In Header */}
                  <div className="relative group/avatar">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-4xl shadow-2xl ring-4 ring-white/30 overflow-hidden transition-transform duration-500 group-hover/avatar:scale-105 group-hover/avatar:rotate-3">
                      {profile?.avatar || profile?.bioPage?.avatar ? (
                        <img
                          src={profile.avatar || profile.bioPage.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{getInitial()}</span>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-indigo-600 shadow-xl"></div>
                  </div>

                  <div className="text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
                      {profile?.name || 'User'}
                    </h1>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-white/90 mt-2 text-sm sm:text-base drop-shadow">
                      <Mail className="w-4 h-4" />
                      <span>{profile?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 sm:mt-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700/50">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
                    <div className="flex-1 space-y-2">
                      {editMode ? (
                        <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="text-3xl font-bold w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Your Name" />
                      ) : (
                        <div className="flex flex-wrap items-center gap-3">
                          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{profile?.name || 'User'}</h1>
                          <div className={`px-3 py-1 rounded-full ${safePlanBadge.color} font-bold text-xs uppercase tracking-wider flex items-center gap-1.5`}><PlanIcon className="w-3.5 h-3.5" />{currentPlan}</div>
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg"><Mail className="w-4 h-4" /><span>{profile?.email}</span></div>
                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg"><Calendar className="w-4 h-4" /><span>Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '...'}</span></div>
                      </div>
                    </div>
                    <button onClick={() => editMode ? handleSaveProfile() : setEditMode(true)} disabled={loading} className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg ${editMode ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/20' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'} disabled:opacity-50 active:scale-95`}>{editMode ? (<><CheckCircle className="w-5 h-5" /><span>Save Changes</span></>) : (<><Edit2 className="w-5 h-5" /><span>Edit Profile</span></>)}</button>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest">Biography</label>
                    <div className="relative group">
                      {editMode ? (<textarea value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} rows="4" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all resize-none" placeholder="Tell us about yourself..." />) : (<p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg italic">"{profile?.bioPage?.bio || profile?.bio || 'You haven\'t added a bio yet. Click Edit to tell your story!'}"</p>)}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
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
                      <span>Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'}</span>
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
                      { id: 2, name: '100 Clicks', description: 'Reached 100 total clicks', icon: '💯', unlocked: (stats?.totalClicks || 0) >= 100 },
                      { id: 3, name: 'Global Reach', description: 'Clicks from 10+ countries', icon: '🌍', unlocked: (stats?.countries || 0) >= 10 },
                      { id: 4, name: 'Power User', description: 'Created 50+ links', icon: '⚡', unlocked: (stats?.totalLinks || 0) >= 50 },
                      { id: 5, name: 'Viral Hit', description: 'Single link with 1000+ clicks', icon: '🚀', unlocked: false },
                      { id: 6, name: 'Early Adopter', description: 'Joined in first year', icon: '🏆', unlocked: true }
                    ].map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 transition-all ${achievement.unlocked
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
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 dark:border-gray-700/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <CreditCard className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Subscription Plan</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your subscription and billing cycle</p>
                  </div>
                </div>

                {/* Billing Toggle */}
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <span className={`text-sm font-bold transition-colors ${!isYearly ? 'text-blue-600' : 'text-gray-400'}`}>Monthly</span>
                  <button
                    onClick={() => setIsYearly(!isYearly)}
                    className="relative w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors hover:bg-gray-300 active:scale-95"
                  >
                    <div
                      className={`w-6 h-6 bg-blue-600 rounded-full shadow-md transition-transform duration-300 ${isYearly ? 'translate-x-6' : 'translate-x-0'}`}
                    />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold transition-colors ${isYearly ? 'text-blue-600' : 'text-gray-400'}`}>Yearly</span>
                    <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ring-1 ring-green-600/20">
                      Save 25%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className={`relative p-8 rounded-[2rem] flex flex-col transition-all duration-300 border-2 ${selectedPlan === plan.id
                      ? 'bg-white dark:bg-gray-800 border-blue-600 shadow-xl scale-100'
                      : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md'
                      }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                        Recommended
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className={`text-lg font-bold mb-1 uppercase tracking-tight ${selectedPlan === plan.id ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                        {plan.name}
                      </h3>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-8 flex items-baseline gap-1">
                      <span className={`text-4xl font-black tracking-tighter ${selectedPlan === plan.id ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
                        {isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="text-sm font-bold text-gray-500">/mo</span>
                    </div>

                    <div className={`h-px w-full mb-8 ${selectedPlan === plan.id ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-800'}`}></div>

                    <ul className="space-y-4 mb-10 flex-1">
                      {plan.features.slice(0, 5).map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selectedPlan === plan.id ? 'text-blue-600' : 'text-gray-400'}`} />
                          <span className={`text-xs font-medium leading-snug ${selectedPlan === plan.id ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {selectedPlan === plan.id ? (
                      <div className="w-full py-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl font-bold text-center text-xs uppercase tracking-widest text-gray-400 border border-gray-100 dark:border-gray-700">
                        Active Now
                      </div>
                    ) : (
                      <button
                        onClick={() => handleChangePlan(plan.id)}
                        disabled={loading}
                        className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${plan.id === 'free'
                          ? 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/10'
                          }`}
                      >
                        {plan.id === 'free' ? 'Back to Free' : 'Choose Plan'}
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