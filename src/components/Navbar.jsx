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
  SlidersHorizontal,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Crown,
  Zap
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
    `flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2.5 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all font-medium min-h-[44px] min-w-[60px] sm:min-w-auto ${isActive(path)
      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    }`;

  const planBadges = {
    free: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', icon: User },
    pro: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Zap },
    business: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: Crown }
  };

  const currentPlan = user?.plan || 'free';
  const PlanIcon = planBadges[currentPlan]?.icon || User;

  return (
    <>
      <EmailVerificationBanner />

      {/* Main Navbar — clean, consistent with app */}
      <nav className="bg-white/95 dark:bg-gray-900/95 border-b border-gray-100 dark:border-gray-800 backdrop-blur-sm sticky top-0 z-50 safe-top">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">

          {/* Top Row - Logo */}
          <div className="flex justify-between items-center h-14 sm:h-16 border-b border-gray-200 dark:border-gray-800 sm:border-0">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity min-h-[44px] -ml-1 pl-1"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-base sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                Smart Link
              </span>
            </Link>

            {/* Profile Button - All Devices */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 min-h-[44px]"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {(user?.name || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                </div>

                <div className="text-left min-w-0 hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight truncate max-w-[120px]">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5 capitalize">
                    {currentPlan} Plan
                  </p>
                </div>

                <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 flex-shrink-0 hidden sm:block ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-[min(100vw-2rem,16rem)] sm:w-72 max-h-[min(70vh,22rem)] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 scrollbar-hide">
                  <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-0.5 shadow-lg flex-shrink-0">
                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                          <span className="text-base sm:text-lg font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {(user?.name || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                        <div className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${planBadges[currentPlan]?.color}`}>
                          <PlanIcon className="w-3.5 h-3.5" />
                          <span className="capitalize">{currentPlan} Plan</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2 px-2">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-150 group min-h-[48px]"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                        <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">My Profile</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">View and edit profile</p>
                      </div>
                    </Link>

                    <Link
                      to="/profile?tab=settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-150 group"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors flex-shrink-0">
                        <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">Settings</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Account preferences</p>
                      </div>
                    </Link>

                    <button
                      onClick={() => {
                        toggleDarkMode();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-150 group"
                    >
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex-shrink-0 ${darkMode ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-indigo-50 dark:bg-indigo-900/20'} flex items-center justify-center group-hover:bg-opacity-80 transition-colors`}>
                        {darkMode ? (
                          <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-semibold">{darkMode ? 'Light' : 'Dark'} Mode</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Switch theme</p>
                      </div>
                    </button>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 p-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to sign out?')) {
                          logout();
                        }
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 group min-h-[48px] text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                        <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-semibold">Sign Out</p>
                        <p className="text-xs text-red-500 dark:text-red-400">Logout from account</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row - Navigation Tabs (Horizontal Scroll) */}
          <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-1 pt-1 scrollbar-hide -mx-2 px-2">
            <Link to="/dashboard" className={navItemClass('/dashboard')}>
              <LayoutDashboard className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm whitespace-nowrap">Dashboard</span>
            </Link>
            <Link to="/links" className={navItemClass('/links')}>
              <LinkIcon className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm whitespace-nowrap">Links</span>
            </Link>
            <Link to="/analytics" className={navItemClass('/analytics')}>
              <BarChart3 className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm whitespace-nowrap">Analytics</span>
            </Link>
            <Link to="/bio" className={navItemClass('/bio')}>
              <User className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm whitespace-nowrap">Bio</span>
            </Link>
            <Link to="/profile" className={navItemClass('/profile')}>
              <UserCircle className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm whitespace-nowrap">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}