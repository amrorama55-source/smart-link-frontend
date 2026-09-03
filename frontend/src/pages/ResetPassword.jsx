import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Link2, CheckCircle, Lock, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const fullUrl = `${API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`}/auth/reset-password`;
      await axios.post(fullUrl, {
        token,
        password: formData.password
      });
      setSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between items-center p-4 sm:p-6 bg-cover bg-center relative overflow-hidden bg-[#0B0F19] text-gray-100"
      style={{ backgroundImage: "url('/images/bg/abstract_teal_glow.jpg')" }}
    >
      {/* Dark overlay for rich depth */}
      <div className="absolute inset-0 bg-[#0B0F19]/75 backdrop-blur-md pointer-events-none" />

      {/* Top Header Logo */}
      <div className="relative z-10 pt-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform duration-200">
            <Link2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Smart<span className="text-violet-400">Link</span>
          </span>
        </Link>
      </div>

      {/* Center Floating Glass Card */}
      <div className="max-w-md w-full mx-auto my-auto relative z-10 py-8">
        <div className="bg-[#0B0F19]/80 backdrop-blur-2xl border border-white/10 rounded-[2.2rem] p-7 sm:p-10 shadow-2xl shadow-black/80 relative overflow-hidden">
          {/* Ambient inner glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

          {success ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">Password Reset!</h1>
              <p className="text-xs text-gray-400 leading-relaxed">
                Your password has been reset successfully. Redirecting you to login...
              </p>
              <Link
                to="/login"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 shadow-lg inline-block text-center mt-2"
              >
                Go to Login →
              </Link>
            </div>
          ) : !token ? (
            <div className="text-center space-y-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-left">
                <p className="font-bold text-sm mb-1">Invalid Reset Link</p>
                <p className="opacity-90">This reset link is invalid or has expired. Please request a new one.</p>
              </div>
              <Link
                to="/forgot-password"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Request New Link</span>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mx-auto mb-4 text-violet-400 shadow-inner">
                  <Lock className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight mb-1.5">Reset Password</h1>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Enter your new password below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-gray-400">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3.5 rounded-xl border text-xs font-medium bg-black/50 border-white/10 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-gray-400">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3.5 rounded-xl border text-xs font-medium bg-black/50 border-white/10 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 hover:opacity-95 shadow-lg shadow-violet-600/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <span>Reset Password →</span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pb-4 text-center text-[11px] text-gray-500">
        Protected by enterprise security &amp; bot detection.
      </div>
    </div>
  );
}