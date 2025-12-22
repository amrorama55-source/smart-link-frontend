import { useState } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowVerificationPrompt(false);

    try {
      const response = await login({ email, password });
      
      // Check if email is verified
      if (response?.user?.isEmailVerified === false) {
        setShowVerificationPrompt(true);
        setError('Please verify your email address to continue.');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      
      // Show verification prompt if error mentions verification
      if (errorMessage.toLowerCase().includes('verify') || 
          errorMessage.toLowerCase().includes('verification')) {
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
      const { data } = await axios.post(
        `${API_URL}/api/auth/resend-verification-public`,
        { email: email.toLowerCase().trim() }
      );

      setResendSuccess(true);
      setError('');
      
      // Show success message
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Link2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Link API</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {resendSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
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
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800 font-medium mb-2">
                      Email verification required
                    </p>
                    <p className="text-sm text-yellow-700 mb-3">
                      Didn't receive the verification email?
                    </p>
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resendLoading}
                      className="text-sm font-medium text-yellow-700 hover:text-yellow-800 underline disabled:opacity-50"
                    >
                      {resendLoading ? 'Sending...' : 'Resend verification email'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="block text-sm font-medium text-gray-700">
                  Password
                </span>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <PasswordInput
                label={null}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}