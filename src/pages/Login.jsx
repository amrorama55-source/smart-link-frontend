import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, Mail, CheckCircle } from 'lucide-react';
import PasswordInput from '../components/PasswordInput';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ إضافة: قراءة حالة Dark Mode
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowVerificationPrompt(false);

    try {
      console.log('🔐 Attempting login with email:', email);
      
      // ✅ استدعاء login من AuthContext
      await login({ email, password });
      
      console.log('✅ Login successful, redirecting to dashboard');
      navigate('/dashboard');
      
    } catch (err) {
      console.error('❌ Login error:', err);
      console.error('❌ Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      
      // Show verification prompt if error mentions verification
      if (errorMessage.toLowerCase().includes('verify') || 
          errorMessage.toLowerCase().includes('verification') ||
          errorMessage.toLowerCase().includes('email not verified')) {
        setShowVerificationPrompt(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setResendLoading(true);
    setError('');
    setResendSuccess(false);

    try {
      console.log('📧 Resending verification email to:', email);
      
      const { data } = await axios.post(
        `${API_URL}/api/auth/resend-verification-public`,
        { email: email.toLowerCase().trim() }
      );

      console.log('✅ Verification email sent:', data);
      
      setResendSuccess(true);
      setError('');
      
      // Show success message for 5 seconds
      setTimeout(() => {
        setResendSuccess(false);
        setShowVerificationPrompt(false);
      }, 5000);

    } catch (err) {
      console.error('❌ Resend verification error:', err);
      setError(err.response?.data?.error || 'Failed to send verification email');
      setResendSuccess(false);
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('🔵 Redirecting to Google OAuth');
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    } flex items-center justify-center p-4`}>
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 ${
            isDark ? 'bg-blue-500' : 'bg-blue-600'
          } rounded-2xl mb-4 shadow-lg`}>
            <Link2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Smart Link API
          </h1>
          <p className={`mt-2 text-sm sm:text-base ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Sign in to your account
          </p>
        </div>

        {/* Form Card */}
        <div className={`${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white'
        } rounded-2xl shadow-xl p-6 sm:p-8 border`}>
          
          {/* Google Login Button */}
          <div className="mb-6">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg transition-colors ${
                isDark
                  ? 'border-gray-600 hover:bg-gray-700 text-white'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {/* Google Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.6-.3-2.3H12v4.4h6.1c-.3 1.5-1.2 2.8-2.6 3.6v3h4.2c2.4-2.2 3.8-5.4 3.8-9.7z"/>
                <path fill="#34A853" d="M12 23c3.2 0 5.9-1 7.9-2.7l-4.2-3c-1.1.7-2.5 1.1-3.7 1.1-2.8 0-5.1-1.9-5.9-4.4H2.6v2.8C4.6 20.7 8 23 12 23z"/>
                <path fill="#FBBC05" d="M6.1 14.7c-.3-1-.3-2.1 0-3.1V8.8H2.6c-.7 1.3-1 2.7-1 4.2s.3 2.9 1 4.2l3.5-2.5z"/>
                <path fill="#EA4335" d="M12 4.6c1.8 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 8 0 4.6 2.3 2.6 5.8l3.5 2.8c.8-2.5 3.1-4.4 5.9-4.4z"/>
              </svg>
              <span className="font-medium">Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${
                isDark ? 'border-gray-700' : 'border-gray-300'
              }`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${
                isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
              }`}>
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className={`border rounded-lg p-4 ${
                isDark 
                  ? 'bg-red-900/30 border-red-800 text-red-300' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {resendSuccess && (
              <div className={`border rounded-lg p-4 ${
                isDark
                  ? 'bg-green-900/30 border-green-800 text-green-300'
                  : 'bg-green-50 border-green-200 text-green-800'
              }`}>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Verification email sent!</p>
                    <p className="text-sm mt-1">
                      Please check your inbox and click the verification link.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Prompt */}
            {showVerificationPrompt && !resendSuccess && (
              <div className={`border rounded-lg p-4 ${
                isDark
                  ? 'bg-yellow-900/30 border-yellow-800'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-start gap-3">
                  <Mail className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                  }`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium mb-2 ${
                      isDark ? 'text-yellow-300' : 'text-yellow-800'
                    }`}>
                      Email verification required
                    </p>
                    <p className={`text-sm mb-3 ${
                      isDark ? 'text-yellow-400' : 'text-yellow-700'
                    }`}>
                      Didn't receive the verification email?
                    </p>
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resendLoading}
                      className={`text-sm font-medium underline disabled:opacity-50 ${
                        isDark 
                          ? 'text-yellow-400 hover:text-yellow-300' 
                          : 'text-yellow-700 hover:text-yellow-800'
                      }`}
                    >
                      {resendLoading ? 'Sending...' : 'Resend verification email'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
                } focus:ring-2 focus:outline-none`}
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className={`text-sm font-medium ${
                    isDark 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Forgot password?
                </Link>
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
                } focus:ring-2 focus:outline-none`}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Don't have an account?{' '}
              <Link
                to="/register"
                className={`font-medium ${
                  isDark 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className={`text-sm ${
              isDark 
                ? 'text-gray-400 hover:text-gray-300' 
                : 'text-gray-600 hover:text-gray-700'
            } transition-colors`}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}