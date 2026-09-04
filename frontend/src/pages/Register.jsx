import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastProvider';
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
  CheckCircle, Check, Shield, Zap, Link2, User
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
    <div className="min-h-screen flex bg-[#0B0F19] text-gray-100 relative overflow-hidden">
      {/* ─── LEFT COLUMN: Floating Glassmorphism Signup Form ─── */}
      <div
        className="w-full lg:w-[50%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative z-10 overflow-y-auto bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg/abstract_amber_glow.jpg')" }}
      >
        {/* Dark overlay for rich depth */}
        <div className="absolute inset-0 bg-[#0B0F19]/75 backdrop-blur-md pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-200">
              <Link2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Smart<span className="text-blue-400">Link</span>
            </span>
          </Link>
          <Link
            to="/login"
            className="text-xs sm:text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Already a member? <span className="font-bold text-amber-400 underline underline-offset-4">Sign in</span>
          </Link>
        </div>

        {/* Center Floating Glassmorphism Form Card */}
        <div className="max-w-md w-full mx-auto my-auto relative z-10">
          <div className="bg-[#0B0F19]/80 backdrop-blur-2xl border border-white/10 rounded-[2.2rem] p-7 sm:p-9 shadow-2xl shadow-black/80 relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Trial Tag if active */}
            {isTrial && (
              <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-between shadow-lg shadow-orange-500/20">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider">14-Day Free Pro Trial</span>
                </div>
                <span className="text-[11px] font-medium opacity-90">No credit card</span>
              </div>
            )}

            <div className="mb-6">
              <h1 className="text-3xl font-black tracking-tight text-white mb-1.5">
                {isTrial ? 'Start your free trial' : 'Create your account'}
              </h1>
              <p className="text-xs text-gray-400">
                One smart link to connect your audience, track clicks, and grow your revenue.
              </p>
            </div>

            {/* Google Signup Button */}
            <button
              onClick={handleGoogleSignup}
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

            {/* Split Divider — FIXED: NO LINE OVER TEXT */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 border-t border-white/10" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                or sign up with email
              </span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-gray-400">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    autoComplete="name"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-xs font-medium bg-black/50 border-white/10 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all ${errors.name ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-gray-400">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-xs font-medium bg-black/50 border-white/10 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-gray-400">
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
                    className={`w-full px-4 py-3.5 pr-12 rounded-xl border text-xs font-medium bg-black/50 border-white/10 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            lvl <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-800'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] font-semibold text-gray-500">
                      Strength: <span className="font-bold text-gray-300">{passwordStrength.label}</span>
                    </p>
                  </div>
                )}
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-gray-400">
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
                    className={`w-full px-4 py-3.5 pr-12 rounded-xl border text-xs font-medium bg-black/50 border-white/10 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all ${errors.confirm ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 shadow-lg shadow-orange-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>{isTrial ? 'Claim 14-Day Free Trial →' : 'Create Free Smart Link →'}</span>
                  </>
                )}
              </motion.button>
            </form>

            <div className="flex items-center justify-center gap-1.5 mt-5 text-[11px] text-gray-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>No credit card required · Free plan forever · Instant setup</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-gray-500 mt-6 relative z-10">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>


      {/* ─── RIGHT COLUMN: Immersive Creator Showcase ─── */}
      <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden items-stretch">
        {/* Full-bleed background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/creators/creator_yellow_genz.jpg')" }}
        />
        {/* Deep overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20" />
        {/* Left-edge fade to blend with form */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0B0F19] to-transparent" />

        {/* Subtle glow */}
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12 w-full">

          {/* Top — stat pill */}
          <div className="flex justify-end">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-lg">
              <span className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0" />
              <span className="text-xs font-bold tracking-wide">10,000+ creators growing their audience</span>
            </div>
          </div>

          {/* Bottom Grouped Showcase Container — FIXED: NO OVERLAPPING WITH FACE OR TEXT */}
          <div className="mt-auto space-y-4">
            {/* Creator Social Proof Glass Card */}
            <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 shadow-2xl">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2.5">Recently joined creators</p>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { img: '/images/creators/creator_neon_cyber.jpg', name: 'Alex M.', clicks: '12K/mo' },
                  { img: '/images/creators/creator_red_artist.jpg', name: 'Lina K.', clicks: '38K/mo' },
                  { img: '/images/creators/creator_smile_warm.jpg', name: 'Maya R.', clicks: '91K/mo' },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-colors min-w-0"
                  >
                    <img src={c.img} alt={c.name} className="w-8 h-8 rounded-full object-cover object-top flex-shrink-0 ring-2 ring-white/20" />
                    <div className="min-w-0">
                      <p className="text-white text-xs font-bold truncate leading-tight">{c.name}</p>
                      <p className="text-white/50 text-[9px] font-medium truncate">{c.clicks}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial quote — FIXED: GENEROUS SPACING BETWEEN QUOTE AND AVATAR */}
            <div className="p-4.5 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/15 shadow-2xl">
              <p className="text-white/90 text-xs font-medium italic leading-relaxed mb-3.5">
                "I replaced 6 different tools with SmartLink. My link-in-bio now earns more than my merch store."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <img
                  src="/images/creators/creator_yellow_genz.jpg"
                  alt="Creator"
                  className="w-8 h-8 rounded-full object-cover object-top ring-2 ring-amber-400/60 flex-shrink-0"
                />
                <div>
                  <p className="text-white text-xs font-extrabold leading-tight">Zoe K.</p>
                  <p className="text-white/50 text-[9px] font-medium">Gen-Z Creator · 92K followers</p>
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
                Everything in one<br />
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  smart link.
                </span>
              </h2>
              <p className="text-white/50 text-xs mt-1 font-medium">
                Bio page, link tracking, payments, and analytics — all free to start.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}