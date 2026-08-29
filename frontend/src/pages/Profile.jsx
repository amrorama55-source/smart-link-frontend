import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  User, Mail, Calendar, Crown, Link2, MousePointerClick,
  Globe, TrendingUp, Award, Settings, Camera,
  CheckCircle, Shield, Zap, Star, Code2, ExternalLink
} from 'lucide-react';
import { getProfile, getDashboardStats } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PLANS } from '../utils/plans';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0, countries: 0, clicksThisMonth: 0 });
  const [loading, setLoading] = useState(true);

  const getInitial = () => {
    if (profile?.name?.trim()) return profile.name.trim().charAt(0).toUpperCase();
    if (profile?.email?.trim()) return profile.email.trim().charAt(0).toUpperCase();
    return 'U';
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const data = await getProfile();
      const userProfile = data.user || data;
      setProfile(userProfile);
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

  const planBadges = {
    free: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', icon: User },
    trial: { color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Zap },
    pro: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Zap },
    business: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: Crown }
  };

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
  const trialExpired = currentPlan === 'trial' &&
    profile?.trialEndsAt && new Date() > new Date(profile.trialEndsAt);
  const effectivePlan = trialExpired ? 'free' : currentPlan;

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

        {/* Premium Header */}
        <div className="relative rounded-[2.5rem] p-8 sm:p-12 mb-10 overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-indigo-700/90 to-purple-800/90 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 backdrop-blur-3xl"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl group-hover:bg-blue-400/30 transition-all duration-700"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-700"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] bg-white/10 backdrop-blur-2xl flex items-center justify-center text-white font-black text-5xl shadow-2xl ring-1 ring-white/30 overflow-hidden">
              {profile?.avatar || profile?.bioPage?.avatar ? (
                <img src={profile.avatar || profile.bioPage.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{getInitial()}</span>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">{profile?.name || 'User'}</h1>
                <div className={`w-fit mx-auto md:mx-0 px-4 py-1.5 rounded-full ${safePlanBadge.color} backdrop-blur-xl border border-white/20 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2`}>
                  <PlanIcon className="w-4 h-4" />
                  {planDisplayName}{currentPlan === 'trial' && !trialExpired ? ' Trial' : ''}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/80">
                <div className="flex items-center justify-center md:justify-start gap-3 bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md border border-white/10">
                  <div className="p-2 bg-blue-500/20 rounded-xl"><Mail className="w-4 h-4" /></div>
                  <span className="font-medium truncate">{profile?.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3 bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md border border-white/10">
                  <div className="p-2 bg-purple-500/20 rounded-xl"><Calendar className="w-4 h-4" /></div>
                  <span className="font-medium">Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '...'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-bold text-sm border border-white/20 backdrop-blur-md transition-all hover:scale-105"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard icon={Link2} label="Total Links" value={stats?.totalLinks || 0} color="blue" />
              <StatCard icon={MousePointerClick} label="Total Clicks" value={stats?.totalClicks || 0} color="indigo" />
              <StatCard icon={Globe} label="Geo Reach" value={stats?.countries || 0} color="purple" />
              <StatCard icon={TrendingUp} label="This Month" value={stats?.clicksThisMonth || 0} color="emerald" />
            </div>

            {/* Achievements */}
            <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl border border-white/20 dark:border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-yellow-500/10 rounded-2xl"><Award className="w-8 h-8 text-yellow-500" /></div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Achievements</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 1, name: 'First Link', description: 'Created your first link', icon: '🎉', unlocked: (stats?.totalLinks || 0) >= 1 },
                  { id: 2, name: '100 Clicks', description: 'Reached 100 total clicks', icon: '💯', unlocked: (stats?.totalClicks || 0) >= 100 },
                  { id: 3, name: 'Global Reach', description: 'Clicks from 10+ countries', icon: '🌍', unlocked: (stats?.countries || 0) >= 10 },
                  { id: 4, name: 'Power User', description: 'Created 50+ links', icon: '⚡', unlocked: (stats?.totalLinks || 0) >= 50 },
                  { id: 5, name: 'Viral Hit', description: '1000+ total clicks', icon: '🚀', unlocked: (stats?.totalClicks || 0) >= 1000 },
                  { id: 6, name: 'Early Adopter', description: 'Joined the community', icon: '🏆', unlocked: true }
                ].map((a) => (
                  <div key={a.id} className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 ${a.unlocked ? 'border-yellow-400/50 bg-yellow-400/5 shadow-lg' : 'border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-gray-900/50 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'}`}>
                    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">{a.icon}</div>
                    <h3 className="font-black text-gray-900 dark:text-white mb-1">{a.name}</h3>
                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{a.description}</p>
                    {a.unlocked && <div className="absolute top-4 right-4"><CheckCircle className="w-5 h-5 text-yellow-500" /></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Link2, label: 'My Links', desc: 'Manage all your short links', color: 'blue', path: '/links' },
                { icon: TrendingUp, label: 'Analytics', desc: 'View detailed click data', color: 'indigo', path: '/analytics' },
                { icon: User, label: 'Bio Page', desc: 'Edit your public bio link', color: 'purple', path: '/bio' },
                { icon: Code2, label: 'API Access', desc: 'Manage your API keys', color: 'green', path: '/settings?tab=developer' },
              ].map((action) => (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className={`group flex items-center gap-4 p-6 bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-white/5 hover:border-${action.color}-500/30 transition-all hover:scale-[1.02] text-left`}
                >
                  <div className={`p-3 bg-${action.color}-500/10 rounded-xl group-hover:bg-${action.color}-500/20 transition-colors flex-shrink-0`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white">{action.label}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{action.desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Account Status */}
            <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/20 dark:border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" /> Account Status
              </h3>
              <div className="space-y-4">
                {[
                  { icon: CheckCircle, label: 'Identity Verified', status: true, color: 'text-emerald-500' },
                  { icon: Star, label: 'API Access', status: effectivePlan !== 'free', color: 'text-blue-500' },
                  { icon: Zap, label: 'Priority Support', status: effectivePlan === 'business' || (currentPlan === 'trial' && !trialExpired), color: 'text-indigo-500' },
                  { icon: Crown, label: 'Premium Tokens', status: effectivePlan === 'business' || (currentPlan === 'trial' && !trialExpired), color: 'text-purple-500' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-gray-700 dark:text-gray-300">{item.label}</span>
                    </div>
                    {item.status ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <div className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-[10px] font-black uppercase text-gray-500">Locked</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Settings CTA */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-xl font-black">Account Settings</h3>
                <p className="text-white/70 text-sm font-medium leading-relaxed">Manage your password, subscription, API keys, and security.</p>
                <div className="space-y-3">
                  <button onClick={() => navigate('/settings')} className="w-full px-6 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
                    <Settings className="w-4 h-4" /> Open Settings
                  </button>
                  <button onClick={() => navigate('/pricing')} className="w-full px-6 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-black text-sm backdrop-blur-md transition-all flex items-center justify-center gap-3">
                    <Crown className="w-4 h-4" /> Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-[0.15em]">{label}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      </div>
    </div>
  );
};
