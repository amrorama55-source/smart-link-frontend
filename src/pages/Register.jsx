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
    else if (formData.password.length < 6) errs.password = 'Minimum 6 characters';
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
          success('🎉 Your 7-day Business Elite trial is now active! No credit card needed.', {
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
    <div className={`min-h-screen ${isDark
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
      : 'bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100'
      } flex items-center justify-center p-4`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Link
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          } rounded-3xl shadow-2xl border overflow-hidden`}>

          {/* Trial Banner */}
          {isTrial && (
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 text-white text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="font-black text-lg">7-Day Business Elite Trial</span>
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <p className="text-purple-100 text-sm">Create your account to activate — no credit card needed</p>
            </div>
          )}

          <div className="p-8">
            <h1 className={`text-2xl font-extrabold mb-1 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {isTrial ? 'Create your account' : 'Get started for free'}
            </h1>
            <p className={`text-sm text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {isTrial
                ? 'Your trial activates automatically after signup'
                : 'Join 10,000+ creators using Smart Link'}
            </p>

            {/* Google Signup */}
            <div className="mb-6">
              <button
                onClick={handleGoogleSignup}
                type="button"
                className={`w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-xl transition-colors ${isDark
                  ? 'border-gray-600 hover:bg-gray-700 text-white'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.6-.3-2.3H12v4.4h6.1c-.3 1.5-1.2 2.8-2.6 3.6v3h4.2c2.4-2.2 3.8-5.4 3.8-9.7z" />
                  <path fill="#34A853" d="M12 23c3.2 0 5.9-1 7.9-2.7l-4.2-3c-1.1.7-2.5 1.1-3.7 1.1-2.8 0-5.1-1.9-5.9-4.4H2.6v2.8C4.6 20.7 8 23 12 23z" />
                  <path fill="#FBBC05" d="M6.1 14.7c-.3-1-.3-2.1 0-3.1V8.8H2.6c-.7 1.3-1 2.7-1 4.2s.3 2.9 1 4.2l3.5-2.5z" />
                  <path fill="#EA4335" d="M12 4.6c1.8 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 8 0 4.6 2.3 2.6 5.8l3.5 2.8c.8-2.5 3.1-4.4 5.9-4.4z" />
                </svg>
                <span className="font-medium">Continue with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                  Or sign up with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {error && (
                <div className={`border rounded-xl p-4 text-sm ${isDark ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  autoComplete="name"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-sm transition-colors min-h-[48px] focus:outline-none ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
                    } ${errors.name ? 'border-red-400' : ''}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-sm transition-colors min-h-[48px] focus:outline-none ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
                    } ${errors.email ? 'border-red-400' : ''}`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-sm transition-colors min-h-[48px] focus:outline-none ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
                      } ${errors.password ? 'border-red-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength.strength
                            ? passwordStrength.color
                            : isDark ? 'bg-gray-700' : 'bg-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Password strength: <span className="font-medium">{passwordStrength.label}</span>
                    </p>
                  </div>
                )}
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-sm transition-colors min-h-[48px] focus:outline-none ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
                      } ${errors.confirm ? 'border-red-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
              </div>

              {/* Trial Features Preview */}
              {isTrial && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                  <p className="text-xs font-black text-purple-700 dark:text-purple-300 uppercase tracking-widest mb-3">
                    🎯 You'll get instant access to:
                  </p>
                  <div className="space-y-2">
                    {[
                      'Unlimited Smart Links',
                      'Custom Domains',
                      'A/B Testing & Smart Targeting',
                      'Full API Access',
                      'Advanced Analytics Suite'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className={`w-full min-h-[52px] py-3.5 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${isTrial
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30'
                  }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isTrial ? '🚀 Create Account & Start Trial' : 'Create Free Account'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  className={`font-bold hover:underline underline-offset-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                >
                  Sign in
                </Link>
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
                <Shield className="w-3.5 h-3.5" />
                <span>No credit card required · Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`}
          >
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}