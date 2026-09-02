import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastProvider';
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
  CheckCircle, Sparkles, Shield, Zap, Link2
} from 'lucide-react';
import api from '../services/api';
import { API_URL } from '../config';

export default function Register() {
  const [searchParams] = useSearchParams();
  const isTrial = searchParams.get('trial') === 'true';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  // Dark Mode detection
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

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };
  const passwordStrength = getPasswordStrength(formData.password);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email address';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 8) errs.password = 'Minimum 8 characters';
    if (formData.password !== formData.confirmPassword) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    setError('');

    try {
      // 1. Register via AuthContext
      const regData = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // 3. If trial=true → activate trial
      if (isTrial) {
        try {
          await api.post('/trial/start');
          success('🎉 Your 14-day Starter trial is now active! No credit card needed.', {
            duration: 7000,
          });
        } catch (trialErr) {
          console.warn('Trial activation failed:', trialErr);
          success('✅ Account created! You can activate your free trial from the Pricing page.', {
            duration: 5000,
          });
        }
      } else {
        success('✅ Account created successfully! Welcome to Smart Link.', { duration: 4000 });
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Registration error:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.';
      toastError ? toastError(msg) : setError(msg);
      if (msg.toLowerCase().includes('email')) {
        setErrors({ email: 'This email is already registered' });
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: احفظ pendingTrial قبل تحويل المستخدم لـ Google OAuth
  // بعد العودة من Google، loginWithToken في AuthContext يقرأ هذه القيمة ويفعّل التجربة تلقائياً
  const handleGoogleSignup = () => {
    if (isTrial) {
      localStorage.setItem('pendingTrial', 'true');
    }
    const fullUrl = `${API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`}/auth/google`;
    window.location.href = fullUrl;
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDark ? 'bg-[#0B0F19] text-gray-100' : 'bg-[#FAF9F5] text-gray-900'
    }`}>
      {/* ─── LEFT COLUMN: The Friendly Signup Form ─── */}
      <div className="w-full lg:w-[50%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative z-10 overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              Smart<span className="text-violet-600 dark:text-violet-400">Link</span>
            </span>
          </Link>
          <Link
            to="/login"
            className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            Already a member? <span className="font-bold text-violet-600 dark:text-violet-400 underline underline-offset-4">Sign in</span>
          </Link>
        </div>

        {/* Center Content Form */}
        <div className="max-w-md w-full mx-auto my-auto">
          {/* Trial Tag if active */}
          {isTrial && (
            <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-between shadow-lg shadow-violet-600/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="text-xs font-black uppercase tracking-wider">14-Day Free Pro Trial</span>
              </div>
              <span className="text-[11px] font-medium opacity-80">No credit card</span>
            </div>
          )}

          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
              {isTrial ? 'Claim your free trial ✨' : 'Create your Smart Link 🚀'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              One smart link to connect your audience, track clicks, and grow your revenue.
            </p>
          </div>

          {/* Google Signup Button */}
          <button
            onClick={handleGoogleSignup}
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

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            <span className={`absolute px-3 text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'bg-[#0B0F19] text-gray-500' : 'bg-[#FAF9F5] text-gray-400'
            }`}>
              or sign up with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General Error */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600 dark:text-gray-400">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                autoComplete="name"
                className={`w-full px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-200 outline-none ${
                  isDark
                    ? 'bg-gray-900/60 border-gray-800 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10 shadow-sm'
                } ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600 dark:text-gray-400">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className={`w-full px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-200 outline-none ${
                  isDark
                    ? 'bg-gray-900/60 border-gray-800 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10 shadow-sm'
                } ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600 dark:text-gray-400">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3.5 pr-12 rounded-2xl border text-sm font-medium transition-all duration-200 outline-none ${
                    isDark
                      ? 'bg-gray-900/60 border-gray-800 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10 shadow-sm'
                  } ${errors.password ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          lvl <= passwordStrength.strength ? passwordStrength.color : isDark ? 'bg-gray-800' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-semibold text-gray-500">
                    Strength: <span className="font-bold">{passwordStrength.label}</span>
                  </p>
                </div>
              )}
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-600 dark:text-gray-400">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3.5 pr-12 rounded-2xl border text-sm font-medium transition-all duration-200 outline-none ${
                    isDark
                      ? 'bg-gray-900/60 border-gray-800 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10 shadow-sm'
                  } ${errors.confirm ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 hover:opacity-95 shadow-lg shadow-violet-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <span>{isTrial ? 'Claim 14-Day Free Trial →' : 'Create Free Smart Link →'}</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-gray-400">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>No credit card required · Free plan forever · Instant setup</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>

      {/* ─── RIGHT COLUMN: The Warm, Human Visual Showcase (Desktop) ─── */}
      <div className="hidden lg:flex lg:w-[50%] bg-gradient-to-br from-[#1E1238] via-[#120B24] to-[#0A0515] p-12 relative overflow-hidden items-center justify-center">
        {/* Soft Ambient Light Glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-fuchsia-600/25 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-lg w-full">
          {/* Floating Feature Card Top */}
          <div className="mb-6 p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 text-white shadow-2xl flex items-center justify-between transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300 font-bold">
                🎯
              </div>
              <div>
                <p className="text-[11px] text-white/60 font-semibold uppercase tracking-wider">Automated Geo-Routing</p>
                <p className="text-sm font-black">Route traffic by country & device</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">Active</span>
          </div>

          {/* Floating Phone Visual (Human Bio Showcase) */}
          <div className="mx-auto w-[310px] rounded-[3rem] bg-gradient-to-b from-gray-900 to-black p-3.5 border-4 border-white/20 shadow-2xl shadow-violet-950/80 relative">
            {/* Dynamic Island */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-violet-600/80 ml-auto mr-3"></div>
            </div>

            {/* Inner Screen */}
            <div className="rounded-[2.4rem] bg-gradient-to-b from-[#1C172E] via-[#151026] to-[#0D0A1A] p-6 pt-12 text-center text-white min-h-[440px] flex flex-col justify-between">
              <div>
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-500 mx-auto mb-3 shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Alex"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <h3 className="font-extrabold text-base tracking-tight">Alex Rivera</h3>
                <p className="text-xs text-white/60 font-medium">Digital Creator & Educator</p>
              </div>

              {/* Sample Organic Link Buttons */}
              <div className="space-y-2.5 my-4">
                <div className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold transition-colors">
                  📚 Read Free 2026 Growth Playbook
                </div>
                <div className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold transition-colors">
                  🎙️ Listen to Weekly Masterclass
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-xs font-black shadow-md">
                  🚀 Join 1-on-1 Mentorship (3 Spots)
                </div>
              </div>

              <div className="text-[10px] text-white/40 tracking-widest font-bold uppercase">
                by-smartlink.com/alex
              </div>
            </div>
          </div>

          {/* Social Proof Badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-white/70 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>10,000+ Creators</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400"></span>
              <span>100% Free Plan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Instant AI Pages</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}