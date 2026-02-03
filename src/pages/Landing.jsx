import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, Menu, X, Moon, Sun, ChevronRight,
  BarChart3, Globe, Smartphone, Target, TrendingUp,
  Eye, MousePointerClick, Calendar, Zap, Shield,
  QrCode, CheckCircle, ArrowRight, Sparkles,
  Users, Clock, Lock, Code, Star, Quote, Copy, Play, Layout, Settings
} from 'lucide-react';

/* 
  ========================================
  Live Product Demo Component (Hero Visual)
  ========================================
*/
function ProductDemo() {
  return (
    <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 aspect-[16/10]">
      {/* Browser Bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="ml-4 flex-1 bg-white dark:bg-gray-800 rounded-md h-6 flex items-center px-3 text-xs text-blue-500 font-medium shadow-sm">
          sp.link/dashboard
        </div>
      </div>

      {/* App Interface Container */}
      <div className="p-6 h-full relative font-sans">

        {/* Header Mock */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="w-8 h-8 rounded-full bg-purple-500"></div>
          </div>
        </div>

        {/* Action Area */}
        <div className="space-y-4 max-w-lg mx-auto">
          {/* Input Box Animation */}
          <motion.div
            initial={{ borderColor: 'transparent' }}
            animate={{
              borderColor: ['#e5e7eb', '#3b82f6', '#e5e7eb'],
              boxShadow: ['none', '0 0 0 2px rgba(59, 130, 246, 0.2)', 'none']
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="bg-gray-50 dark:bg-gray-900 border-2 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 w-full">
              <Link2 className="w-5 h-5 text-gray-400" />
              <motion.div className="h-6 flex items-center overflow-hidden">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3.5, ease: "linear" }}
                  className="whitespace-nowrap overflow-hidden border-r-2 border-blue-500 text-gray-600 dark:text-gray-300 text-sm"
                >
                  https://very-long-url.com/campaign/summer-sale-2026
                </motion.span>
              </motion.div>
            </div>
          </motion.div>

          {/* Button Click Animation */}
          <motion.div
            animate={{ scale: [1, 0.98, 1] }}
            transition={{ duration: 0.5, delay: 1.5, repeat: Infinity, repeatDelay: 6 }}
            className="w-full h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
          >
            Shorten Link
          </motion.div>

          {/* Result Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            transition={{ duration: 0.5, delay: 2, repeat: Infinity, repeatDelay: 4.5 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-xs text-green-700 dark:text-green-300 font-medium">Link Created!</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">sp.link/summer26</p>
              </div>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Copy className="w-4 h-4 text-gray-500" />
            </div>
          </motion.div>
        </div>

        {/* Cursor Animation */}
        <motion.div
          initial={{ x: 300, y: 300 }}
          animate={{
            x: [300, 150, 150, 400],
            y: [300, 100, 160, 400],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 4 }}
          className="absolute z-50 pointer-events-none"
        >
          <MousePointerClick className="w-6 h-6 text-black fill-white dark:text-white dark:fill-black drop-shadow-xl" />
        </motion.div>

      </div>
    </div>
  );
}

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (!window.requestAnimationFrame) {
        setScrolled(window.scrollY > 20);
        return;
      }
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden font-sans">

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-800/50'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.7 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform"
              >
                <Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Smart Link
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link to="/login" className="text-gray-700 dark:text-gray-300 font-semibold">
                Login
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg"
                >
                  Get Started Free
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden"
              >
                <div className="flex flex-col gap-2 px-4 py-4">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[48px] flex items-center justify-center px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[48px] flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold"
                  >
                    Get Started Free
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section - FIXED FOR MOBILE */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left Content - FIXED */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="text-center lg:text-left"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-semibold">Growth Tool for Founders</span>
              </motion.div>

              {/* FIXED: Mobile-optimized heading */}
              <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 sm:mb-6 tracking-tight">
                <span className="block">Free Smart Link</span>
                <span className="block">&amp; Bio Page</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mt-1 sm:mt-2">
                  Tool for Creators
                </span>
              </motion.h1>

              {/* FIXED: Mobile-optimized description */}
              <motion.p variants={itemVariants} className="text-sm sm:text-base lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0">
                The best free Bio Page tool and URL shortener for Creators, SaaS Founders, and Marketers. Track analytics, smart targeting, and A/B testing.
              </motion.p>

              {/* FIXED: Mobile-optimized buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-10 px-4 sm:px-0">
                <Link to="/register" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-base sm:text-lg shadow-xl flex items-center justify-center gap-2"
                  >
                    Start for Free
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </Link>
              </motion.div>

              {/* FIXED: Mobile-optimized features */}
              <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-medium px-2">
                {['No credit card', 'Free forever', 'Setup in 2 min'].map((text, i) => (
                  <div key={i} className="flex items-center gap-1.5 sm:gap-2 bg-white/50 dark:bg-gray-800/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    <span className="whitespace-nowrap">{text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Visual - Hidden on small mobile */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden sm:block"
            >
              <ProductDemo />

              {/* Floating Elements */}
              <motion.div
                animate={floatAnimation}
                className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl flex items-center justify-center rotate-6 ring-4 ring-white dark:ring-gray-900 z-10"
              >
                <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
              <motion.div
                animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 1.5 } }}
                className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl flex items-center justify-center -rotate-6 ring-4 ring-white dark:ring-gray-900 z-10"
              >
                <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-20"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Powerful Tools for
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                Founders & Marketers
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Everything you need to manage your links and grow your brand.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Link2,
                title: 'Bio Pages',
                description: 'Create stunning bio pages for your brand.',
                color: 'blue'
              },
              {
                icon: TrendingUp,
                title: 'A/B Testing',
                description: 'Split traffic to optimize conversion.',
                color: 'orange'
              },
              {
                icon: BarChart3,
                title: 'Analytics',
                description: 'Track clicks and audience behavior.',
                color: 'purple'
              },
              {
                icon: Smartphone,
                title: 'Device Targeting',
                description: 'Route users by device type.',
                color: 'green'
              },
              {
                icon: QrCode,
                title: 'QR Codes',
                description: 'Generate branded QR codes.',
                color: 'pink'
              },
              {
                icon: Code,
                title: 'Developer API',
                description: 'Integrate into your workflow.',
                color: 'indigo'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 sm:p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}>
                  <feature.icon className={`w-6 h-6 sm:w-7 sm:h-7 text-${feature.color}-600`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 sm:mb-8"
          >
            Ready to link smarter?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base sm:text-xl text-blue-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-4"
          >
            Join creators and businesses using Smart Link.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/register">
              <button className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-blue-600 rounded-xl sm:rounded-2xl font-bold text-base sm:text-xl shadow-2xl hover:scale-105 transition-all min-h-[48px]">
                Get Started Now - It's Free
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 pt-12 sm:pt-20 pb-8 sm:pb-10 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Smart Link</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2026 Smart Link. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}