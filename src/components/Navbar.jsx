import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, LayoutDashboard, Link as LinkIcon, BarChart3, User, Settings } from 'lucide-react';
import EmailVerificationBanner from './EmailVerificationBanner';

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <EmailVerificationBanner />
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Smart Link</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all ${
                  isActive('/dashboard')
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">Dashboard</span>
              </Link>

              <Link
                to="/links"
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all ${
                  isActive('/links')
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <LinkIcon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">Links</span>
              </Link>

              <Link
                to="/analytics"
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all ${
                  isActive('/analytics')
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">Analytics</span>
              </Link>

              <Link
                to="/bio"
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all ${
                  isActive('/bio')
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <User className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">Bio</span>
              </Link>

              <Link
                to="/settings"
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all ${
                  isActive('/settings')
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">Settings</span>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize font-medium">{user?.plan} Plan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex justify-around py-2">
            <Link
              to="/dashboard"
              className={`flex flex-col items-center px-3 py-2 rounded-lg ${
                isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>

            <Link
              to="/links"
              className={`flex flex-col items-center px-3 py-2 rounded-lg ${
                isActive('/links') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <LinkIcon className="w-5 h-5" />
              <span className="text-xs mt-1">Links</span>
            </Link>

            <Link
              to="/analytics"
              className={`flex flex-col items-center px-3 py-2 rounded-lg ${
                isActive('/analytics') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs mt-1">Analytics</span>
            </Link>

            <Link
              to="/bio"
              className={`flex flex-col items-center px-3 py-2 rounded-lg ${
                isActive('/bio') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs mt-1">Bio</span>
            </Link>

            <Link
              to="/settings"
              className={`flex flex-col items-center px-3 py-2 rounded-lg ${
                isActive('/settings') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs mt-1">Settings</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
