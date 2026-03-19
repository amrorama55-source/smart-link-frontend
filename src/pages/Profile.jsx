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
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0, countries: 0, clicksThisMonth: 0 });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [profileData, setProfileData] = useState({ name: '', bio: '', website: '', location: '', email: '', avatar: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [subscription, setSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [isYearly, setIsYearly] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessions, setSessions] = useState([]);

  const getInitial = () => {
    if (profileData.name?.trim()) return profileData.name.trim().charAt(0).toUpperCase();
    if (profile?.name?.trim()) return profile.name.trim().charAt(0).toUpperCase();
    if (profile?.email?.trim()) return profile.email.trim().charAt(0).toUpperCase();
    return 'U';
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'settings') setActiveTab('settings');
    loadProfileData();
  }, [searchParams]);

  const loadProfileData = async () => {
    try {
      const data = await getProfile();
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
      } catch { }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
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
          if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } }
          else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
          canvas.width = width; canvas.height = height;
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
    if (file.size > 5 * 1024 * 1024) { alert('Image too large (Max 5MB)'); return; }
    try {
      const compressedBase64 = await compressImage(file);
      setProfileData(prev => ({ ...prev, avatar: compressedBase64 }));
      await updateProfile({ ...profileData, avatar: compressedBase64 });
      loadProfileData();
    } catch (error) { alert('Failed to process image'); }
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
    } finally { setLoading(false); }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) { alert('New passwords do not match'); return; }
    if (passwordData.newPassword.length < 6) { alert('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await changePassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      alert('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to change password');
    } finally { setLoading(false); }
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
    } finally { setLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') { alert('Please type DELETE to confirm'); return; }
    if (!deletePassword) { alert('Please enter your password'); return; }
    if (!confirm('⚠️ FINAL WARNING: This will permanently delete your account and all data. Are you absolutely sure?')) return;
    setLoading(true);
    try {
      await deleteAccount({ password: deletePassword, confirmDelete: true });
      alert('Account deleted successfully. You will be logged out now.');
      logout();
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeleteConfirm('');
      setDeletePassword('');
    }
  };

  const planBadges = {
    free: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', icon: User },
    trial: { color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Zap },
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

  const currentPlan = profile?.plan || 'free';

  // Check if trial has expired (same logic as backend)
  const trialExpired = currentPlan === 'trial' &&
    profile?.trialEndsAt && new Date() > new Date(profile.trialEndsAt);

  // Use effective plan for display: if trial expired, show as free
  const effectivePlan = trialExpired ? 'free' : currentPlan;

  // Get display name without a PLANS entry for trial (to avoid pricing page side effects)
  const getPlanDisplayName = (planId) => {
    if (planId === 'trial') return 'Business Elite';
    return PLANS.find(p => p.id === planId)?.name || 'Starter';
  };
  const planDisplayName = getPlanDisplayName(effectivePlan);

  const safePlanBadge = planBadges[effectivePlan] || planBadges.free;
  const PlanIcon = safePlanBadge.icon;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation - Glassmorphism style */}
        <div className="mb-8 flex p-1.5 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/5 w-fit shadow-inner">
          {['profile', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 whitespace-nowrap capitalize flex items-center gap-2 ${activeTab === tab
                ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xl scale-105'
                : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
            >
              {tab === 'profile' ? <User className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
              {tab}
            </button>
          ))}
        </div>

        {/* ====== PROFILE TAB ====== */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Premium Header Card */}
            <div className="relative rounded-[2.5rem] p-8 sm:p-12 mb-10 overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 group">
              {/* Animated Background Gradients */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-indigo-700/90 to-purple-800/90 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 backdrop-blur-3xl"></div>
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl group-hover:bg-blue-400/30 transition-all duration-700"></div>
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-700"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                {/* Avatar Section */}
                <div className="relative">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] bg-white/10 backdrop-blur-2xl flex items-center justify-center text-white font-black text-5xl shadow-2xl ring-1 ring-white/30 overflow-hidden group-hover:ring-white/50 transition-all">
                    {profile?.avatar || profile?.bioPage?.avatar ? (
                      <img src={profile.avatar || profile.bioPage.avatar} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <span>{getInitial()}</span>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-[#6366f1] dark:border-[#1e293b] hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Camera className="w-5 h-5 text-blue-600 dark:text-white" />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>

                {/* Info Section */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-sm">
                      {profile?.name || 'User'}
                    </h1>
                    <div className={`w-fit mx-auto md:mx-0 px-4 py-1.5 rounded-full ${safePlanBadge.color} backdrop-blur-xl border border-white/20 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg`}>
                      <PlanIcon className="w-4 h-4" />
                      {planDisplayName}{currentPlan === 'trial' && !trialExpired ? ' Trial' : ''}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/80">
                    <div className="flex items-center justify-center md:justify-start gap-3 bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                      <div className="p-2 bg-blue-500/20 rounded-xl"><Mail className="w-4 h-4" /></div>
                      <span className="font-medium truncate">{profile?.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-3 bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                      <div className="p-2 bg-purple-500/20 rounded-xl"><Calendar className="w-4 h-4" /></div>
                      <span className="font-medium">Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '...'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-[2rem] p-8 sm:p-10 shadow-xl border border-white/20 dark:border-white/5">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 pb-10 border-b border-gray-100 dark:border-white/5">
                    <div className="space-y-4 text-center sm:text-left">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-[0.2em]">Full Name</label>
                        {editMode ? (
                          <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="text-3xl font-bold w-full px-6 py-4 border-2 border-blue-100 dark:border-blue-900/30 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                        ) : (
                          <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">{profile?.name || 'User'}</h2>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                      disabled={loading}
                      className={`px-8 py-4 rounded-2xl font-black transition-all duration-300 flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 ${editMode ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'} disabled:opacity-50`}
                    >
                      {editMode ? (<><Save className="w-5 h-5" /><span>Save profile</span></>) : (<><Edit2 className="w-5 h-5" /><span>Edit profile</span></>)}
                    </button>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-[0.2em]">Professional Bio</label>
                      {editMode ? (
                        <textarea value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} rows="4" className="w-full px-6 py-4 border-2 border-blue-100 dark:border-blue-900/30 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white resize-none focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" placeholder="Tell the world who you are..." />
                      ) : (
                        <div className="relative p-6 bg-blue-50/30 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/20">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium italic">
                            "{profile?.bioPage?.bio || profile?.bio || 'No bio provided yet. Click edit to add one!'}"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Website</label>
                        {editMode ? (
                          <input type="url" value={profileData.website} onChange={(e) => setProfileData({ ...profileData, website: e.target.value })} className="w-full px-6 py-4 border-2 border-gray-100 dark:border-white/5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors" placeholder="https://..." />
                        ) : (
                          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                            <Globe className="w-4 h-4" />
                            <a href={profile?.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{profile?.website || 'Not linked'}</a>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Location</label>
                        {editMode ? (
                          <input type="text" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} className="w-full px-6 py-4 border-2 border-gray-100 dark:border-white/5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors" placeholder="e.g. London, UK" />
                        ) : (
                          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-bold bg-gray-50 dark:bg-gray-900/30 px-4 py-3 rounded-xl border border-gray-100 dark:border-white/5">
                            <Monitor className="w-4 h-4" />
                            <span>{profile?.location || 'Remote'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid - Glassmorphism */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard icon={Link2} label="Total Links" value={stats?.totalLinks || 0} color="blue" />
                  <StatCard icon={MousePointerClick} label="Total Clicks" value={stats?.totalClicks || 0} color="indigo" />
                  <StatCard icon={Globe} label="Geo Reach" value={stats?.countries || 0} color="purple" />
                  <StatCard icon={TrendingUp} label="Monthly growth" value={stats?.clicksThisMonth || 0} color="emerald" />
                </div>

                {/* Achievements */}
                <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl border border-white/20 dark:border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-yellow-500/10 rounded-2xl">
                        <Award className="w-8 h-8 text-yellow-500" />
                      </div>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white">Achievements</h2>
                    </div>
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
                      <div key={achievement.id} className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 ${achievement.unlocked ? 'border-yellow-400/50 bg-yellow-400/5 shadow-lg shadow-yellow-400/5' : 'border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-gray-900/50 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'}`}>
                        <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{achievement.icon}</div>
                        <h3 className="font-black text-gray-900 dark:text-white mb-1">{achievement.name}</h3>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{achievement.description}</p>
                        {achievement.unlocked && (
                          <div className="absolute top-4 right-4 animate-bounce">
                            <CheckCircle className="w-5 h-5 text-yellow-500" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Account Status Card */}
                <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/20 dark:border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                    Account Status
                  </h3>

                  <div className="space-y-6">
                    {[
                      { icon: CheckCircle, label: 'Identity Verified', status: true, color: 'text-emerald-500' },
                      { icon: Star, label: 'API Access', status: effectivePlan !== 'free', color: 'text-blue-500' },
                      { icon: Zap, label: 'Priority Support', status: effectivePlan === 'business' || (effectivePlan === 'trial' && !trialExpired), color: 'text-indigo-500' },
                      { icon: Crown, label: 'Premium Tokens', status: effectivePlan === 'business' || (effectivePlan === 'trial' && !trialExpired), color: 'text-purple-500' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-white/5 group hover:border-blue-500/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm ${item.color}`}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-black text-gray-700 dark:text-gray-300">{item.label}</span>
                        </div>
                        {item.status ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          </div>
                        ) : (
                          <div className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-[10px] font-black uppercase text-gray-500">Locked</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-xl font-black mb-2">Need help?</h3>
                    <p className="text-white/70 text-sm font-medium leading-relaxed">
                      Our support team is available 24/7 for Business Elite members.
                    </p>
                    <div className="space-y-3">
                      <button onClick={() => navigate('/links')} className="w-full px-6 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
                        <Link2 className="w-4 h-4" />
                        Explore links
                      </button>
                      <button onClick={() => navigate('/analytics')} className="w-full px-6 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-black text-sm backdrop-blur-md transition-all flex items-center justify-center gap-3">
                        <TrendingUp className="w-4 h-4" />
                        Deep analytics
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====== SETTINGS TAB ====== */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Security Section */}
            <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 shadow-xl border border-white/20 dark:border-white/5">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">Security Vault</h2>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Manage your credentials</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { key: 'currentPassword', label: 'Current Key', field: 'current' },
                  { key: 'newPassword', label: 'New Authentication Key', field: 'new' },
                  { key: 'confirmPassword', label: 'Verify New Key', field: 'confirm' }
                ].map(({ key, label, field }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-[0.2em]">{label}</label>
                    <div className="relative group">
                      <input
                        type={showPasswords[field] ? 'text' : 'password'}
                        value={passwordData[key]}
                        onChange={(e) => setPasswordData({ ...passwordData, [key]: e.target.value })}
                        className="w-full px-6 py-4 border-2 border-gray-100 dark:border-white/5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-all font-mono"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] })} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors">
                        {showPasswords[field] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={handleChangePassword} disabled={loading} className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-3">
                  <Shield className="w-5 h-5" />
                  <span>{loading ? 'Processing...' : 'Update credentials'}</span>
                </button>
              </div>
            </div>

            {/* Customization Section */}
            <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/20 dark:border-white/5">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-2xl">
                    {darkMode ? <Sun className="w-8 h-8 text-purple-600" /> : <Moon className="w-8 h-8 text-purple-600" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Interface Theme</h2>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Personalize your view</p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="p-1 px-5 py-3 bg-gray-100 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-white/5 flex items-center gap-3 hover:scale-105 transition-all"
                >
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-sm font-black text-gray-700 dark:text-white uppercase tracking-wider">{darkMode ? 'Dark' : 'Light'}</span>
                </button>
              </div>
            </div>

            {/* Session Management */}
            <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/20 dark:border-white/5">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-2xl">
                    <LogOut className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Session Control</h2>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Manage your active logins</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { if (confirm('Are you sure you want to sign out?')) { logout(); navigate('/login'); } }}
                className="group px-8 py-4 border-2 border-red-100 dark:border-red-900/30 text-red-600 rounded-2xl font-black hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center gap-3"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Terminate current session</span>
              </button>
            </div>

            {/* Account Danger Zone */}
            <div className="relative group rounded-[2.5rem] p-1 shadow-2xl overflow-hidden bg-gradient-to-br from-red-500/20 to-orange-500/20">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl rounded-[2.4rem] p-8 sm:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-600/10 rounded-2xl">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-black text-red-600">Danger Zone</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed max-w-xl">
                  Deleting your account will permanently wipe all your short links, tracking pixels, and analytics history. This process is irreversible.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black shadow-lg shadow-red-600/20 transition-all hover:scale-105 flex items-center gap-3"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Request Account Deletion</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 sm:p-10 max-w-md w-full shadow-[0_0_100px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/5 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Delete Account</h3>
              </div>

              <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed">
                This is a <span className="text-red-600 font-black italic underline decoration-wavy">destructive</span> action. All data will be wiped across our globally distributed servers.
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Confirm Verification Text</label>
                  <input type="text" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} className="w-full px-6 py-4 border-2 border-red-50 dark:border-red-900/10 rounded-2xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white outline-none focus:border-red-500 transition-colors" placeholder="Type 'DELETE' to proceed" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Master Password</label>
                  <input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} className="w-full px-6 py-4 border-2 border-red-50 dark:border-red-900/10 rounded-2xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white outline-none focus:border-red-500 transition-colors" placeholder="••••••••" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); setDeletePassword(''); }} className="flex-1 px-6 py-4 rounded-2xl font-black border-2 border-gray-100 dark:border-white/5 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleDeleteAccount} disabled={loading || deleteConfirm !== 'DELETE'} className="flex-[2] px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black shadow-xl shadow-red-600/20 disabled:opacity-50 transition-all">
                    {loading ? 'Processing...' : 'Delete Everything'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-500/10 border-blue-200/50 dark:border-blue-500/20',
    indigo: 'text-indigo-600 bg-indigo-500/10 border-indigo-200/50 dark:border-indigo-500/20',
    purple: 'text-purple-600 bg-purple-500/10 border-purple-200/50 dark:border-purple-500/20',
    emerald: 'text-emerald-600 bg-emerald-500/10 border-emerald-200/50 dark:border-emerald-500/20'
  };

  return (
    <div className="relative group bg-white/70 dark:bg-gray-800/40 backdrop-blur-md rounded-[2rem] p-6 shadow-lg border border-white/20 dark:border-white/5 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -mr-10 -mt-10"></div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-[0.15em] leading-none">{label}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
      <div className="mt-4 h-1.5 w-full bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${color.includes('blue') ? 'bg-blue-500' : color.includes('indigo') ? 'bg-indigo-500' : color.includes('purple') ? 'bg-purple-500' : 'bg-emerald-500'}`} style={{ width: '65%' }}></div>
      </div>
    </div>
  );
};
