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
    <div className="min-h-screen flex bg-[#0B0F19] text-gray-100 relative overflow-hidden">
      {/* ─── LEFT COLUMN: Floating Glassmorphism Form ─── */}
      <div className="w-full lg:w-[48%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg/abstract_teal_glow.jpg')" }}>
        {/* Dark overlay for rich depth */}
        <div className="absolute inset-0 bg-[#0B0F19]/70 backdrop-blur-md pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center justify-between relative z-10">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform duration-200">
              <Link2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Smart<span className="text-violet-400">Link</span>
            </span>
          </Link>
          <Link
            to="/register"
            className="text-xs sm:text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Don't have an account? <span className="font-bold text-violet-400 underline underline-offset-4">Join free</span>
          </Link>
        </div>

        {/* Floating Glassmorphism Form Card (Inspired by Image 3) */}
        <div className="max-w-md w-full mx-auto my-auto relative z-10">
          <div className="bg-[#0B0F19]/80 backdrop-blur-2xl border border-white/10 rounded-[2.2rem] p-7 sm:p-9 shadow-2xl shadow-black/80 relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

            <div className="mb-7">
              <h1 className="text-3xl font-black tracking-tight text-white mb-1.5">
                Welcome <span className="text-amber-200/90 font-serif italic">Back</span> 👋
              </h1>
              <p className="text-xs text-gray-400">
                Sign in to continue your link-in-bio & creator dashboard journey.
              </p>
            </div>

            {/* Social Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full py-3.5 px-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-200 bg-white/10 hover:bg-white/15 border border-white/15 text-white active:scale-[0.99] shadow-sm mb-5"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.6-.3-2.3H12v4.4h6.1c-.3 1.5-1.2 2.8-2.6 3.6v3h4.2c2.4-2.2 3.8-5.4 3.8-9.7z" />
                <path fill="#34A853" d="M12 23c3.2 0 5.9-1 7.9-2.7l-4.2-3c-1.1.7-2.5 1.1-3.7 1.1-2.8 0-5.1-1.9-5.9-4.4H2.6v2.8C4.6 20.7 8 23 12 23z" />
                <path fill="#FBBC05" d="M6.1 14.7c-.3-1-.3-2.1 0-3.1V8.8H2.6c-.7 1.3-1 2.7-1 4.2s.3 2.9 1 4.2l3.5-2.5z" />
                <path fill="#EA4335" d="M12 4.6c1.8 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 8 0 4.6 2.3 2.6 5.8l3.5 2.8c.8-2.5 3.1-4.4 5.9-4.4z" />
              </svg>
              <span className="text-xs font-bold">Continue with Google</span>
            </button>

            {/* Clean Organic Split Divider — FIXED: NO LINE OVER TEXT */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 border-t border-white/10" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                or sign in with email
              </span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {resendSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Verification email sent! Check your inbox.</span>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-gray-400">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-xs font-medium bg-black/50 border-white/10 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-semibold text-violet-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border text-xs font-medium bg-black/50 border-white/10 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 hover:opacity-95 shadow-lg shadow-violet-600/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In to Dashboard →</span>
                )}
              </button>

              {/* Verification Prompt */}
              {showVerificationPrompt && (
                <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-xs text-amber-300 font-medium mb-1.5">
                    Didn't receive the confirmation email?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="text-xs font-bold text-amber-300 underline hover:no-underline"
                  >
                    {resendLoading ? 'Sending...' : 'Click here to resend verification link'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-gray-500 relative z-10">
          Protected by enterprise security &amp; bot detection. By signing in, you agree to our Terms.
        </div>
      </div>

      {/* ─── RIGHT COLUMN: Immersive Creator Showcase ─── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden items-stretch">
        {/* Full-bleed background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/creators/creator_red_artist.jpg')" }}
        />
        {/* Deep overlay for rich dark gradient & readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30" />
        {/* Left-side edge fade */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0B0F19] to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between h-full p-10 lg:p-12 w-full">

          {/* Top — floating stat pill */}
          <div className="flex justify-end">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white shadow-xl">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
              <span className="text-xs font-bold tracking-wide">42.8% higher conversions vs standard links</span>
            </div>
          </div>

          {/* Bottom Grouped Showcase Container — FIXED: NO OVERLAPPING WITH FACE OR TEXT */}
          <div className="mt-auto space-y-4">
            {/* Creator Social Proof Glass Card */}
            <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 shadow-2xl">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2.5">Creators using SmartLink</p>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { img: '/images/creators/creator_neon_cyber.jpg', name: 'Alex M.', followers: '180K' },
                  { img: '/images/creators/creator_yellow_genz.jpg', name: 'Zoe K.', followers: '92K' },
                  { img: '/images/creators/creator_smile_warm.jpg', name: 'Maya R.', followers: '440K' },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-colors min-w-0"
                  >
                    <img src={c.img} alt={c.name} className="w-8 h-8 rounded-full object-cover object-top flex-shrink-0 ring-2 ring-white/20" />
                    <div className="min-w-0">
                      <p className="text-white text-xs font-bold truncate leading-tight">{c.name}</p>
                      <p className="text-white/50 text-[9px] font-medium truncate">{c.followers}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial quote — FIXED: GENEROUS SPACING BETWEEN QUOTE AND AVATAR */}
            <div className="p-4.5 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/15 shadow-2xl">
              <p className="text-white/90 text-xs font-medium italic leading-relaxed mb-3.5">
                "Smart Link turned my bio into a full storefront. I went from 2% to 18% click-through in one week."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <img
                  src="/images/creators/creator_neon_cyber.jpg"
                  alt="Creator"
                  className="w-8 h-8 rounded-full object-cover object-top ring-2 ring-violet-500/60 flex-shrink-0"
                />
                <div>
                  <p className="text-white text-xs font-extrabold leading-tight">Alex M.</p>
                  <p className="text-white/50 text-[9px] font-medium">Content Creator · 180K followers</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-xs">★</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Main CTA tagline */}
            <div>
              <h2 className="text-white text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Your audience is<br />
                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  one link away.
                </span>
              </h2>
              <p className="text-white/50 text-xs mt-1 font-medium">
                Join 12,000+ creators already earning with their SmartLink.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}