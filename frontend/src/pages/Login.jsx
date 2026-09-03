import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, Mail, CheckCircle } from 'lucide-react';
import PasswordInput from '../components/PasswordInput';
import axios from 'axios';
import { API_URL } from '../config';

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
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

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

      console.log('✅ Login successful, redirecting to:', redirectTarget);
      navigate(redirectTarget);


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
        `${API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`}/auth/resend-verification-public`,
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
    window.location.href = `${API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`}/auth/google`;
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDark ? 'bg-[#0B0F19] text-gray-100' : 'bg-[#FAF9F5] text-gray-900'
    }`}>
      {/* ─── LEFT COLUMN: The Friendly, Human Form ─── */}
      <div className="w-full lg:w-[48%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative z-10">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform duration-200">
              <Link2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              Smart<span className="text-violet-600 dark:text-violet-400">Link</span>
            </span>
          </Link>
          <Link
            to="/register"
            className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            Don't have an account? <span className="font-bold text-violet-600 dark:text-violet-400 underline underline-offset-4">Join free</span>
          </Link>
        </div>

        {/* Center Content Form */}
        <div className="max-w-md w-full mx-auto my-8 sm:my-12">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
              Welcome back <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Pick up right where you left off. Your audience is waiting.
            </p>
          </div>

          {/* Social Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className={`w-full py-3.5 px-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-200 shadow-sm border ${
              isDark
                ? 'bg-gray-800/80 hover:bg-gray-800 border-gray-700/80 text-white hover:border-gray-600 hover:shadow-md'
                : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800 hover:border-gray-300 hover:shadow-md'
            } active:scale-[0.99]`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.6-.3-2.3H12v4.4h6.1c-.3 1.5-1.2 2.8-2.6 3.6v3h4.2c2.4-2.2 3.8-5.4 3.8-9.7z" />
              <path fill="#34A853" d="M12 23c3.2 0 5.9-1 7.9-2.7l-4.2-3c-1.1.7-2.5 1.1-3.7 1.1-2.8 0-5.1-1.9-5.9-4.4H2.6v2.8C4.6 20.7 8 23 12 23z" />
              <path fill="#FBBC05" d="M6.1 14.7c-.3-1-.3-2.1 0-3.1V8.8H2.6c-.7 1.3-1 2.7-1 4.2s.3 2.9 1 4.2l3.5-2.5z" />
              <path fill="#EA4335" d="M12 4.6c1.8 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 8 0 4.6 2.3 2.6 5.8l3.5 2.8c.8-2.5 3.1-4.4 5.9-4.4z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Clean Organic Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            <span className={`absolute px-3 text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'bg-[#0B0F19] text-gray-500' : 'bg-[#FAF9F5] text-gray-400'
            }`}>
              or sign in with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {resendSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>Verification email sent! Check your inbox.</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600 dark:text-gray-400">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-200 outline-none ${
                  isDark
                    ? 'bg-gray-900/60 border-gray-800 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10 shadow-sm'
                }`}
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`w-full px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-200 outline-none ${
                  isDark
                    ? 'bg-gray-900/60 border-gray-800 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10 shadow-sm'
                }`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 hover:opacity-95 shadow-lg shadow-violet-600/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In to Dashboard →</span>
              )}
            </button>

            {/* Verification Prompt */}
            {showVerificationPrompt && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-2">
                  Didn't receive the confirmation email?
                </p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="text-xs font-bold text-amber-700 dark:text-amber-300 underline hover:no-underline"
                >
                  {resendLoading ? 'Sending...' : 'Click here to resend verification link'}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-600">
          Protected by enterprise security &amp; bot detection. By signing in, you agree to our Terms.
        </div>
      </div>

      {/* ─── RIGHT COLUMN: Immersive Creator Showcase ─── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden items-stretch">
        {/* Full-bleed background image — the dramatic red/neon creator */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/creators/creator_red_artist.jpg')" }}
        />
        {/* Deep overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        {/* Left-side edge fade for seamless blend with form */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0B0F19] to-transparent" />

        {/* Subtle ambient glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Content — pinned to bottom-left */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12 w-full">

          {/* Top — floating stat pill */}
          <div className="flex justify-end">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-lg">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
              <span className="text-xs font-bold tracking-wide">42.8% higher conversions vs standard links</span>
            </div>
          </div>

          {/* Middle — Creator stacked mini-cards */}
          <div className="flex flex-col gap-3">
            {/* Scrolling creator proof row */}
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Creators using SmartLink</p>
            <div className="flex items-center gap-3">
              {[
                { img: '/images/creators/creator_neon_cyber.jpg', name: 'Alex M.', handle: '@alexmcreates', followers: '180K' },
                { img: '/images/creators/creator_yellow_genz.jpg', name: 'Zoe K.', handle: '@zoekstyle', followers: '92K' },
                { img: '/images/creators/creator_smile_warm.jpg', name: 'Maya R.', handle: '@mayar', followers: '440K' },
              ].map((c, i) => (
                <div
                  key={i}
                  className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors"
                >
                  <img src={c.img} alt={c.name} className="w-9 h-9 rounded-full object-cover object-top flex-shrink-0 ring-2 ring-white/20" />
                  <div className="min-w-0">
                    <p className="text-white text-xs font-bold truncate">{c.name}</p>
                    <p className="text-white/50 text-[10px] font-medium">{c.followers} followers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — Main headline + quote */}
          <div>
            {/* Testimonial quote */}
            <div className="mb-5 p-4 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10">
              <p className="text-white/90 text-sm font-medium italic leading-relaxed">
                "Smart Link turned my bio into a full storefront. I went from 2% to 18% click-through in one week."
              </p>
              <div className="flex items-center gap-2.5 mt-3">
                <img
                  src="/images/creators/creator_neon_cyber.jpg"
                  alt="Creator"
                  className="w-8 h-8 rounded-full object-cover object-top ring-2 ring-violet-500/60"
                />
                <div>
                  <p className="text-white text-xs font-extrabold">Alex M.</p>
                  <p className="text-white/50 text-[10px]">Content Creator · 180K followers</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-xs">★</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Main CTA tagline */}
            <h2 className="text-white text-3xl font-black tracking-tight leading-tight">
              Your audience is<br />
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                one link away.
              </span>
            </h2>
            <p className="text-white/50 text-sm mt-2 font-medium">
              Join 12,000+ creators already earning with their SmartLink.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}