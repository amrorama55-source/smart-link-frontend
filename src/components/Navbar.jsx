import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Link2,
  LogOut,
  LayoutDashboard,
  Link as LinkIcon,
  BarChart3,
  User
} from 'lucide-react';
import EmailVerificationBanner from './EmailVerificationBanner';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <EmailVerificationBanner />

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Smart Link</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>

              <Link
                to="/links"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/links')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LinkIcon className="w-5 h-5" />
                <span className="font-medium">Links</span>
              </Link>

              <Link
                to="/analytics"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/analytics')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Analytics</span>
              </Link>

              <Link
                to="/bio"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/bio')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Bio</span>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.plan} Plan
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex justify-around py-2">
            <Link
              to="/dashboard"
              className={`flex flex-col items-center px-3 py-2 rounded-lg ${
                isActive('/dashboard')
                  ? 'text-blue-600'
                  : 'text-gray-600'
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
                isActive('/analytics')
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs mt-1">Analytics</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
