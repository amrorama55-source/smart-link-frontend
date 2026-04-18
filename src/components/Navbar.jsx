import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PLANS } from '../utils/plans';
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
  Mail,
  Sparkles,
  Clock,
  ArrowUpRight,
  Crown
} from 'lucide-react';
import EmailVerificationBanner from './EmailVerificationBanner';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    setShowProfileMenu(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const currentPlanId = user?.plan || 'free';

  // If trial has expired client-side, treat as free for display
  const trialExpired = currentPlanId === 'trial' &&
    user?.trialEndsAt && new Date() > new Date(user.trialEndsAt);
  const effectivePlanId = trialExpired ? 'free' : currentPlanId;

  // For trial, show 'Business Elite' label (not a separate PLANS entry to avoid pricing page issues)
  const getPlanDisplayName = (planId) => {
    if (planId === 'trial') return 'Business Elite';
    return PLANS.find(p => p.id === planId)?.name || 'Starter';
  };
  const planDisplayName = getPlanDisplayName(effectivePlanId);

  const getTrialDaysLeft = () => {
    if (!user?.trialEndsAt || currentPlanId !== 'trial' || trialExpired) return null;
    const diff = new Date(user.trialEndsAt) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };
  const trialDaysLeft = getTrialDaysLeft();

  return (
    <>
      <EmailVerificationBanner />

      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 safe-top shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/logo-v1.svg" alt="Smart Link Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                Smart Link
              </span>
            </Link>

            {/* Middle Section: Trial Status (Desktop) */}
            <div className="hidden md:flex items-center">
              {trialDaysLeft !== null && (
                <Link
                  to="/pricing"
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full border border-blue-100 dark:border-blue-800"
                >
                  Trial: {trialDaysLeft} days left
                </Link>
              )}
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <div className="hidden sm:block text-right mr-1">
                    <p className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                      {user?.name || 'Account'}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <ChevronDown className={`w-3 h-3 text-gray-400 mr-1 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Solid Dropdown */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-6 border-b border-gray-100 dark:border-gray-800 text-center flex flex-col items-center">
                        <p className="font-extrabold text-2xl text-gray-900 dark:text-white mb-2 tracking-tight">{user?.name || 'User'}</p>
                        <div className="flex items-center justify-center gap-2 mb-6">
                          <p className="text-[15px] font-medium text-gray-500 dark:text-gray-400">{user?.email}</p>
                          <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        </div>

                        <div className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 shadow-sm">
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-widest uppercase">
                            {planDisplayName}{currentPlanId === 'trial' && !trialExpired ? ' (Trial)' : ''}
                          </span>
                          {effectivePlanId === 'business' || effectivePlanId === 'admin' || effectivePlanId === 'pro' || effectivePlanId === 'trial' ? (
                            <Crown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          ) : null}
                        </div>
                      </div>

                      <div className="p-2">
                        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                          <LayoutDashboard className="w-4 h-4" />
                          <span className="text-sm">Dashboard</span>
                        </Link>
                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                          <UserCircle className="w-4 h-4" />
                          <span className="text-sm">Profile</span>
                        </Link>
                        <Link to="/profile?tab=settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                          <Settings className="w-4 h-4" />
                          <span className="text-sm">Settings</span>
                        </Link>
                      </div>

                      <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                        {(user?.plan === 'free' || user?.plan === 'trial') && (
                          <Link to="/pricing" className="flex items-center justify-between p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all mb-1 shadow-md">
                            <span className="text-xs font-bold">Upgrade Now</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => { if (confirm('Sign out?')) logout(); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-bold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Bottom Tabs Section - Solid */}
          <div className="flex gap-2 py-2 overflow-x-auto scrollbar-hide border-t border-gray-50 dark:border-gray-800/50">
            {[
              { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { to: '/links', icon: LinkIcon, label: 'Links' },
              { to: '/analytics', icon: BarChart3, label: 'Analytics' },
              { to: '/bio', icon: User, label: 'Bio' },
              { to: '/profile', icon: UserCircle, label: 'Profile' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all flex-shrink-0 font-bold text-xs uppercase tracking-wide ${isActive(item.to)
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}