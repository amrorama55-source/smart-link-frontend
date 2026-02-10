import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Link2,
  LayoutDashboard,
  Link as LinkIcon,
  BarChart3,
  User,
  UserCircle,
  Settings,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Crown,
  Zap,
  Mail,
  ChevronRight,
  Shield,
  Sparkles
} from 'lucide-react';
import EmailVerificationBanner from './EmailVerificationBanner';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close profile menu when location changes
  useEffect(() => {
    setShowProfileMenu(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navItemClass = (path) =>
    `flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2.5 px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all font-medium min-h-[44px] min-w-[60px] sm:min-w-auto ${isActive(path)
      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    }`;

  const planBadges = {
    free: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', icon: User },
    pro: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Zap },
    business: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: Crown }
  };

  // Ultra-safe fallback
  const currentPlan = user?.plan || 'free';
  const safePlan = planBadges[currentPlan] || planBadges.free;
  const PlanIcon = safePlan.icon;
  const planColor = safePlan.color;

  return (
    <>
      <EmailVerificationBanner />

      {/* Main Navbar */}
      <nav className="bg-white/95 dark:bg-gray-900/95 border-b border-gray-100 dark:border-gray-800 backdrop-blur-sm sticky top-0 z-50 safe-top">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">

          {/* Top Row - Logo & Profile */}
          <div className="flex justify-between items-center h-14 sm:h-16 border-b border-gray-200 dark:border-gray-800 sm:border-0">
            {/* Logo */}
            <Link
              to="/dashboard"
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity min-h-[44px] -ml-1 pl-1 group"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                <Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                Smart Link
              </span>
            </Link>

            {/* Profile Button */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-2xl transition-all duration-300 min-h-[44px] ${showProfileMenu
                  ? 'bg-blue-50 dark:bg-blue-900/40 shadow-inner'
                  : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/80'
                  }`}
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${user?.plan === 'business'
                    ? 'from-purple-500 via-pink-500 to-purple-600'
                    : user?.plan === 'pro'
                      ? 'from-blue-500 to-indigo-600'
                      : 'from-gray-400 to-gray-600'
                    } p-[2px] shadow-md transition-transform duration-300 ${showProfileMenu ? 'scale-105' : ''}`}>
                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs sm:text-sm font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {(user?.name || 'U').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Online Status */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"></div>
                </div>

                <div className="text-left min-w-0 hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate max-w-[120px]">
                    {user?.name || 'User'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      {currentPlan}
                    </span>
                    {user?.plan === 'business' && <Crown className="w-3 h-3 text-purple-500" />}
                    {user?.plan === 'pro' && <Zap className="w-3 h-3 text-blue-500" />}
                  </div>
                </div>

                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 hidden sm:block ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Enhanced Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 z-50 overflow-hidden animate-slideDown">
                  {/* Header Section with Managed Gradient */}
                  <div className={`px-6 py-8 ${user?.plan === 'business'
                    ? 'bg-gray-900 border-b border-purple-500/20'
                    : user?.plan === 'pro'
                      ? 'bg-gray-900 border-b border-blue-500/20'
                      : 'bg-gray-900 border-b border-gray-800'
                    } relative overflow-hidden`}>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full -ml-12 -mb-12 blur-xl"></div>

                    <div className="relative flex flex-col items-center text-center">
                      {/* Avatar */}
                      <div className="relative mb-4 group">
                        <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-bold text-3xl shadow-2xl ring-4 ring-white/20 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 overflow-hidden">
                          {user?.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span>{(user?.name || 'U').charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-indigo-600 shadow-xl"></div>
                      </div>

                      {/* User Details */}
                      <div className="w-full px-2">
                        <h3 className="text-xl font-black text-white mb-1 truncate tracking-tight">
                          {user?.name || 'User'}
                        </h3>
                        <div className="flex items-center justify-center gap-1.5 opacity-80 mb-4">
                          <Mail className="w-3.5 h-3.5 text-white/70" />
                          <p className="text-xs text-white/90 font-medium truncate max-w-[180px]">
                            {user?.email}
                          </p>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                          <Crown className="w-3 h-3 text-white/70" />
                          <span className="text-[9px] font-bold text-white uppercase tracking-widest opacity-80">
                            {user?.plan || 'free'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    {/* My Profile */}
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 flex items-center justify-center transition-colors flex-shrink-0">
                        <UserCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          My Profile
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          View and edit profile
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </Link>

                    {/* Settings */}
                    <Link
                      to="/profile?tab=settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 flex items-center justify-center transition-colors flex-shrink-0">
                        <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Settings
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Account preferences
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </Link>

                    {/* Divider */}
                    <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>

                    {/* Theme Toggle */}
                    <button
                      onClick={() => {
                        toggleDarkMode();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center transition-colors flex-shrink-0">
                        {darkMode ? (
                          <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Switch theme
                        </p>
                      </div>
                    </button>

                    {/* Upgrade Plan (only for free users) */}
                    {user?.plan === 'free' && (
                      <>
                        <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
                        <Link
                          to="/pricing"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 group shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-bold text-white">
                              Upgrade Plan
                            </p>
                            <p className="text-xs text-white/90">
                              Unlock premium features
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white flex-shrink-0" />
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Sign Out Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to sign out?')) {
                          logout();
                        }
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-900/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                        <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                          Sign Out
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Logout from account
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Verified Account</span>
                      </div>
                      <span className="text-gray-400 dark:text-gray-500">v2.1.0</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row - Navigation Tabs */}
          <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-1 pt-1 scrollbar-hide -mx-2 px-2">
            <Link to="/dashboard" className={navItemClass('/dashboard')}>
              <LayoutDashboard className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm whitespace-nowrap font-semibold">Dashboard</span>
            </Link>
            <Link to="/links" className={navItemClass('/links')}>
              <LinkIcon className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm whitespace-nowrap font-semibold">Links</span>
            </Link>
            <Link to="/analytics" className={navItemClass('/analytics')}>
              <BarChart3 className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm whitespace-nowrap font-semibold">Analytics</span>
            </Link>
            <Link to="/bio" className={navItemClass('/bio')}>
              <User className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm whitespace-nowrap font-semibold">Bio</span>
            </Link>
            <Link to="/profile" className={navItemClass('/profile')}>
              <UserCircle className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm whitespace-nowrap font-semibold">Profile</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
