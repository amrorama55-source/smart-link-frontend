import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Link2, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { API_URL } from '../config';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fullUrl = `${API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`}/auth/forgot-password`;
      await axios.post(fullUrl, { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email');
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
              <h1 className="text-2xl font-black text-white tracking-tight">Check Your Email</h1>
              <p className="text-xs text-gray-400 leading-relaxed">
                If an account exists with <strong className="text-white">{email}</strong>, you will receive a password reset link in your inbox.
              </p>
              <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300 text-left space-y-1">
                <p>📧 Check your inbox and spam folder for the link.</p>
                <p className="opacity-80">The link will expire in 1 hour.</p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-violet-400 hover:text-white transition-colors pt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mx-auto mb-4 text-violet-400 shadow-inner">
                  <Mail className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight mb-1.5">Forgot Password?</h1>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Enter your registered email address to receive a password reset link.
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
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-xs font-medium bg-black/50 border-white/10 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 hover:opacity-95 shadow-lg shadow-violet-600/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <span>Send Reset Link →</span>
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