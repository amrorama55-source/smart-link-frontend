import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles, ArrowRight, CheckCircle, Shield, Globe, Zap, Target,
  Star, TrendingUp, MousePointerClick, BarChart3, QrCode, Lock
} from 'lucide-react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import { nichesData } from '../utils/nichesData';

export default function NicheLanding({ nicheKey }) {
  const { darkMode } = useTheme();

  // Get data for this niche
  const data = nichesData[nicheKey];

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [nicheKey]);

  if (!data) {
    return <Navigate to="/" replace />;
  }

  const containerVariants = { 
    hidden: { opacity: 0 }, 
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } } 
  };
  const itemVariants = { 
    hidden: { y: 24, opacity: 0 }, 
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } 
  };
  const floatAnimation = { 
    y: [0, -10, 0], 
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } 
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-white font-sans transition-colors duration-300 overflow-x-hidden">
      <SEO
        title={`${data.title} ${data.gradientText} | Smart Link`}
        description={data.subtitle}
      />

      {/* Global Site Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-16 sm:pt-44 sm:pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-32 left-1/4 w-[350px] h-[350px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="text-center lg:text-left">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-4 h-4" /> {data.badgeText}
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.08] tracking-tight mb-6">
                <span className="text-gray-900 dark:text-white">{data.title}</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  {data.gradientText}
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                {data.subtitle}
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link to="/register" className="w-full sm:w-auto">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-3">
                    {data.ctaText} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link to="/pricing" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm">
                    View Pricing
                  </button>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                {['No credit card required', 'Free 14-day trial', 'Setup in 2 minutes'].map((text, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Interactive Dashboard Preview */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative hidden sm:block">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                
                {/* Live Campaign Analytics Card Mockup */}
                <div className="relative bg-gray-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-800 space-y-6">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs font-mono text-gray-400 ml-2">Live Campaign Tracking</span>
                    </div>
                    <span className="px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span> Real-time
                    </span>
                  </div>

                  {/* Stat Cards Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-black/50 p-3 rounded-xl border border-gray-800">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Total Clicks</div>
                      <div className="text-lg font-black text-white mt-0.5">142,890</div>
                      <div className="text-[10px] text-green-400 font-bold">↑ +18.4%</div>
                    </div>
                    <div className="bg-black/50 p-3 rounded-xl border border-gray-800">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Bot Blocked</div>
                      <div className="text-lg font-black text-red-400 mt-0.5">14,210</div>
                      <div className="text-[10px] text-gray-400">9.9% filtered</div>
                    </div>
                    <div className="bg-black/50 p-3 rounded-xl border border-gray-800">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Conversions</div>
                      <div className="text-lg font-black text-blue-400 mt-0.5">4,892</div>
                      <div className="text-[10px] text-green-400 font-bold">3.42% CR</div>
                    </div>
                  </div>

                  {/* A/B Testing Variant Split Preview */}
                  <div className="bg-black/40 p-4 rounded-xl border border-gray-800 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-300">A/B Smart Traffic Distribution</span>
                      <span className="text-blue-400">Auto-Optimized</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Variant A (Offer Land 1)</span>
                        <span className="text-green-400 font-bold">64% Traffic (Highest CR)</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full w-[64%]"></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Variant B (Offer Land 2)</span>
                        <span className="text-gray-400">36% Traffic</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gray-600 h-full rounded-full w-[36%]"></div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Security Pill */}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800">
                    <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-green-400" /> Datacenter Shield Active</span>
                    <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-blue-400" /> Geo Rules Active</span>
                  </div>
                </div>
              </div>

              <motion.div animate={floatAnimation} className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center rotate-6 ring-4 ring-white dark:ring-gray-950 z-10">
                <QrCode className="w-10 h-10 text-white" />
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Social Proof & Trust Badges */}
      <section className="py-10 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-1 mb-2 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white">
            Trusted by 12,000+ marketers, agencies & growth teams worldwide
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Over 2.8M links tracked and protected every single day
          </p>
        </div>
      </section>

      {/* Targeted Features Section */}
      <section className="py-24 bg-slate-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-4">Tailored Solution</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
              Purpose-Built for <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{data.gradientText}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {data.features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div key={index} className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl hover:border-blue-500/40 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                    <FeatureIcon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl sm:text-6xl font-black mb-6 leading-tight">Ready to scale your ROI?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium">
            Join thousands of {data.gradientText.toLowerCase()} using Smart Link to optimize campaign performance and stop ad budget leaks.
          </p>
          <Link to="/register">
            <button className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto">
              Get Started for Free <ArrowRight className="w-6 h-6" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 py-10 border-t border-gray-200 dark:border-gray-800 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
          <p>© 2026 Smart Link Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
            <Link to="/privacy" className="hover:text-blue-500 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-blue-500 transition-colors">Terms</Link>
            <Link to="/pricing" className="hover:text-blue-500 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
