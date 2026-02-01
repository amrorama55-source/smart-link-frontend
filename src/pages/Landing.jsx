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

/* 
  ========================================
  FULL DEMO MODAL (The "Video" Experience)
  ========================================
*/
function DemoModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);

  // Auto-advance steps
  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setStep((s) => (s + 1) % 4); // Now 4 Steps
      }, 6000); // Increased to 6s per step for more details
      return () => clearInterval(timer);
    } else {
      setStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-6xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col md:flex-row h-[90vh] md:h-auto md:aspect-[16/9]"
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Explained Steps */}
        <div className="w-full md:w-1/3 bg-gray-800 p-8 border-r border-gray-700 flex flex-col justify-center overflow-y-auto">
          <h3 className="text-2xl font-bold text-white mb-8">Product Tour</h3>
          <div className="space-y-4">
            {[
              { title: "Create Smart Links", desc: "Paste URL, customize alias, and add tags.", icon: Link2, color: 'blue' },
              { title: "Smart Targeting", desc: "Route users by Device (iOS/Android) or Location.", icon: Target, color: 'red' },
              { title: "Build Bio Page", desc: "Drag & drop links, choose themes, and publish.", icon: Layout, color: 'purple' },
              { title: "Track Analytics", desc: "Real-time insights on clicks, location, and OS.", icon: BarChart3, color: 'green' }
            ].map((s, i) => (
              <div key={i} className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-500 cursor-pointer ${step === i ? `bg-${s.color}-600/20 border border-${s.color}-500/50` : 'opacity-40 hover:opacity-60'}`} onClick={() => setStep(i)}>
                <div className={`w-10 h-10 rounded-full bg-${s.color}-600 flex items-center justify-center text-white font-bold flex-shrink-0 mt-1`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">{s.title}</p>
                  <p className="text-sm text-gray-400 leading-snug">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: The Animation (The "Video") */}
        <div className="w-full md:w-2/3 bg-gray-950 p-8 relative overflow-hidden flex items-center justify-center">
          <div className="absolute top-4 right-4 z-10">
            <button onClick={onClose} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full max-w-md h-full flex items-center justify-center relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full"></div>

            <AnimatePresence mode="wait">
              {/* Scene 1: Shorten */}
              {step === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl p-6 shadow-xl w-full relative z-10"
                >
                  <p className="text-gray-500 mb-4 text-xs font-bold tracking-widest uppercase">1. Paste & Create</p>
                  <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">Destination URL</span>
                    </div>
                    <div className="bg-white border rounded px-2 py-1 text-gray-800 text-sm overflow-hidden">
                      https://myshop.com/products/super-sale-2026/ref=twitter
                    </div>
                  </div>

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-2 items-center mb-4"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Custom Alias:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm font-bold">summer-sale</span>
                  </motion.div>

                  <motion.button
                    animate={{ scale: [1, 0.95, 1] }}
                    transition={{ delay: 1.5, bg: "blue" }}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold"
                  >
                    Create Smart Link
                  </motion.button>
                </motion.div>
              )}

              {/* Scene 2: Targeting (NEW) */}
              {step === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl p-6 shadow-xl w-full relative z-10"
                >
                  <p className="text-red-500 mb-4 text-xs font-bold tracking-widest uppercase">2. Add Targeting Rules</p>

                  <div className="space-y-3">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="bg-black text-white p-2 rounded-lg"><Smartphone className="w-4 h-4" /></div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">Device: iOS</p>
                        <p className="text-xs text-gray-500">Redirect to App Store</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="bg-green-600 text-white p-2 rounded-lg"><Smartphone className="w-4 h-4" /></div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">Device: Android</p>
                        <p className="text-xs text-gray-500">Redirect to Play Store</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.3 }}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="bg-blue-600 text-white p-2 rounded-lg"><Globe className="w-4 h-4" /></div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">Location: France</p>
                        <p className="text-xs text-gray-500">Redirect to /fr-fr</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Scene 3: Bio Page */}
              {step === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-800 text-center w-full relative z-10"
                >
                  <p className="text-purple-400 mb-4 text-xs font-bold tracking-widest uppercase">3. Design Bio Page</p>
                  <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-lg"></div>
                  <h4 className="text-white font-bold text-xl mb-1">Sarah Creator</h4>
                  <p className="text-gray-400 text-sm mb-6">@sarah_designs</p>

                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.2 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 bg-white/10 rounded-lg text-white font-medium flex items-center justify-between cursor-grab active:cursor-grabbing border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded bg-white/20"></div>
                          <span>My Link #{i}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-50" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Scene 4: Analytics */}
              {step === 3 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl p-6 shadow-xl w-full relative z-10"
                >
                  <p className="text-green-600 mb-4 text-xs font-bold tracking-widest uppercase">4. Analyze Results</p>
                  <div className="flex justify-between items-end h-32 gap-2 px-2 pb-4 border-b border-gray-200">
                    {[30, 50, 40, 70, 90, 60, 80, 95, 85].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05 }}
                        className="flex-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-sm"
                      ></motion.div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900">12.5k</p>
                      <p className="text-xs text-gray-500 uppercase font-bold">Total Clicks</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">iOS</p>
                      <p className="text-xs text-gray-500 uppercase font-bold">Top Device</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-100 ease-linear" style={{ width: `${((step + 1) / 4) * 100}%` }}></div>
        </div>
      </motion.div>
    </motion.div>
  );
}


/* 
  ========================================
  Dedicated "How It Works" Section (Inline "Video")
  ========================================
*/
function HowItWorksSection() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { title: "Create Smart Links", desc: "Paste URL, customize alias, and add tags.", icon: Link2, color: 'blue' },
    { title: "Smart Targeting", desc: "Route users by Device (iOS/Android) or Location.", icon: Target, color: 'red' },
    { title: "Build Bio Page", desc: "Drag & drop links, choose themes, and publish.", icon: Layout, color: 'purple' },
    { title: "Track Analytics", desc: "Real-time insights on clicks, location, and OS.", icon: BarChart3, color: 'green' }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-gray-800/30 scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            Everything You Need,
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
              In One Platform
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Take a tour of how Smart Link helps you manage and optimize your digital presence.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row min-h-[600px]">
          {/* Left: Steps Selection */}
          <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-900/50 p-8 border-r border-gray-100 dark:border-gray-800 flex flex-col justify-center">
            <div className="space-y-4">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-500 cursor-pointer ${step === i ? `bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 scale-[1.02]` : 'opacity-40 hover:opacity-60'}`}
                  onClick={() => setStep(i)}
                >
                  <div className={`w-10 h-10 rounded-full bg-${s.color}-600 flex items-center justify-center text-white font-bold flex-shrink-0 mt-1 shadow-lg`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{s.title}</p>
                    <p className="text-sm text-gray-50 dark:text-gray-400 leading-snug">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: The "video" Animation */}
          <div className="w-full md:w-2/3 bg-gray-950 p-8 relative overflow-hidden flex items-center justify-center min-h-[400px]">
            <div className="w-full max-w-md relative z-10">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full -z-10"></div>

              <AnimatePresence mode="wait">
                {/* Scene 1: Shorten */}
                {step === 0 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="bg-white rounded-xl p-6 shadow-2xl w-full"
                  >
                    <p className="text-gray-500 mb-4 text-xs font-bold tracking-widest uppercase">1. Paste & Create</p>
                    <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Link2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Destination URL</span>
                      </div>
                      <div className="bg-white border rounded px-2 py-1 text-gray-800 text-sm overflow-hidden">
                        https://myshop.com/products/super-sale-2026/ref=twitter
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-4">
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Custom Alias:</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm font-bold">summer-sale</span>
                    </div>
                    <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg">
                      Create Smart Link
                    </button>
                  </motion.div>
                )}

                {/* Scene 2: Targeting */}
                {step === 1 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="bg-white rounded-xl p-6 shadow-2xl w-full"
                  >
                    <p className="text-red-500 mb-4 text-xs font-bold tracking-widest uppercase">2. Add Targeting Rules</p>
                    <div className="space-y-3">
                      {[
                        { icon: Smartphone, bg: 'black', title: 'Device: iOS', desc: 'Redirect to App Store' },
                        { icon: Smartphone, bg: 'green-600', title: 'Device: Android', desc: 'Redirect to Play Store' },
                        { icon: Globe, bg: 'blue-600', title: 'Location: France', desc: 'Redirect to /fr-fr' }
                      ].map((rule, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className={`bg-${rule.bg} text-white p-2 rounded-lg`}><rule.icon className="w-4 h-4" /></div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-800">{rule.title}</p>
                            <p className="text-xs text-gray-500">{rule.desc}</p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Scene 3: Bio Page */}
                {step === 2 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="bg-gray-900 rounded-xl p-6 shadow-2xl border border-gray-800 text-center w-full"
                  >
                    <p className="text-purple-400 mb-4 text-xs font-bold tracking-widest uppercase">3. Design Bio Page</p>
                    <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-lg"></div>
                    <h4 className="text-white font-bold text-xl mb-1">Sarah Creator</h4>
                    <p className="text-gray-400 text-sm mb-6">@sarah_designs</p>
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="p-3 bg-white/10 rounded-lg text-white font-medium flex items-center justify-between border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-white/20"></div>
                            <span>My Product #{i}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-50" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Scene 4: Analytics */}
                {step === 3 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="bg-white rounded-xl p-6 shadow-2xl w-full"
                  >
                    <p className="text-green-600 mb-4 text-xs font-bold tracking-widest uppercase">4. Analyze Results</p>
                    <div className="flex justify-between items-end h-32 gap-2 px-2 pb-4 border-b border-gray-200">
                      {[30, 50, 40, 70, 90, 60, 80, 95, 85].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          className="flex-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-sm"
                        ></motion.div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-gray-900">12.5k</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Total Clicks</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600">iOS</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Top Device</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-100 ease-linear" style={{ width: `${((step + 1) / 4) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 
  ========================================
  FAQ Section (SEO Magnet)
  ========================================
*/
function FAQSection() {
  const faqs = [
    {
      question: "How to create a free link in bio?",
      answer: "Simply sign up for a free account, paste your long URLs, and customize your bio page. You can go live in less than 2 minutes."
    },
    {
      question: "What is the best alternative to Linktree for free?",
      answer: "Smart Link offers advanced features like Device Targeting and detailed analytics for free, making it the most powerful free Linktree alternative for creators."
    },
    {
      question: "Can I track my link clicks for free?",
      answer: "Yes! Smart Link provides real-time analytics for all your links and bio pages, including device, location, and click-through data—all 100% free."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white dark:bg-gray-900 scroll-mt-20 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know about Smart Link.
          </p>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

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
      // Throttle or debouncing scroll state updates can help, but for just one boolean it's usually fine.
      // However, we can use requestAnimationFrame for better performance.
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

      {/* DEMO MODAL */}
      <AnimatePresence>
        {demoOpen && <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />}
      </AnimatePresence>

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

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {['Features', 'How It Works', 'Pricing'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                </a>
              ))}

              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                aria-label="Toggle dark mode"
              >
                <AnimatePresence mode="wait">
                  {darkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ scale: 0, rotate: 90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
                Login
              </Link>

              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all"
                >
                  Get Started Free
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
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
                <div className="flex flex-col gap-3 px-4 py-4">
                  {['Features', 'How It Works', 'Pricing'].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-gray-700 dark:text-gray-200"
                    >
                      {item}
                    </a>
                  ))}
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 font-semibold text-center text-gray-900 dark:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-center hover:opacity-90"
                  >
                    Get Started Free
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 -z-10"></div>
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="text-center lg:text-left"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6 hover:shadow-md transition-shadow cursor-default">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">Simpler. Smarter. Faster.</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 tracking-tight">
                Free Smart Link & Bio Page
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mt-2 pb-2">
                  Tool for Creators
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Shorten links, track analytics, and build your bio page in minutes—100% Free.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10 text-left bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 inline-block backdrop-blur-sm w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Paste Link</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 hidden sm:block" />
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 sm:hidden ml-4"></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">2</div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Customize</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 hidden sm:block" />
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 sm:hidden ml-4"></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">3</div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Analyze</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2"
                  >
                    Start for Free
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <motion.button
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold text-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  How It Works
                </motion.button>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-800 dark:text-gray-200 font-medium">
                {['No credit card required', 'Free forever plan', 'Setup in 2 minutes'].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {text}
                  </div>
                ))}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-8 flex items-center justify-center lg:justify-start gap-3 text-sm text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800/50 inline-flex"
              >
                <Users className="w-5 h-5 text-blue-500" />
                <span>Join our first 10+ creators who started using Smart Link this week</span>
              </motion.div>
            </motion.div>

            {/* Right Visual - Live Product Demo */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <ProductDemo />

              {/* Floating Elements */}
              <motion.div
                animate={floatAnimation}
                className="absolute -top-6 -right-6 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl flex items-center justify-center rotate-6 ring-4 ring-white dark:ring-gray-900 z-10"
              >
                <QrCode className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </motion.div>
              <motion.div
                animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 1.5 } }}
                className="absolute -bottom-6 -left-6 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl flex items-center justify-center -rotate-6 ring-4 ring-white dark:ring-gray-900 z-10"
              >
                <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 border-y border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-8">
            Trusted by creators and teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-xl"><Globe className="w-6 h-6" /> GlobalInc</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Zap className="w-6 h-6" /> FlashTeam</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Shield className="w-6 h-6" /> SecureNet</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Target className="w-6 h-6" /> GoalGetters</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <HowItWorksSection />

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              Powerful Tools for
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                Modern Creators
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage your links, track your audience, and grow your brand online.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Link2,
                title: 'Beautiful Bio Pages',
                description: 'Create stunning link-in-bio pages that showcase all your content. Customizable themes to match your brand.',
                color: 'blue'
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Track clicks, geographic data, and devices. Get real-time insights into your audience behavior.',
                color: 'purple'
              },
              {
                icon: Smartphone,
                title: 'Redirect users based on their device',
                description: 'Smart routing sends mobile users to app stores and desktop users to your website automatically. A premium feature, free forever on Smart Link.',
                color: 'green'
              },
              {
                icon: QrCode,
                title: 'Custom QR Codes',
                description: 'Generate branded QR codes for your links. Perfect for physical marketing and print materials.',
                color: 'pink'
              },
              {
                icon: Shield,
                title: 'Password Protection',
                description: 'Secure your sensitive links with passwords to control who has access to your content.',
                color: 'red'
              },
              {
                icon: Code,
                title: 'Custom Domains',
                description: 'Connect your own domain to build trust and brand recognition with every link you share.',
                color: 'orange'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group p-8 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-16 text-gray-900 dark:text-white">
            Loved by Thousands
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Smart Link completely changed how I track my marketing campaigns. The analytics are a game-changer.",
                author: "Sarah J.",
                role: "Digital Marketer"
              },
              {
                quote: "I love how easy it is to customize my bio page. It looks exactly like my brand!",
                author: "Mike T.",
                role: "Content Creator"
              },
              {
                quote: "The ability to password protect links and use custom domains makes this perfect for our agency.",
                author: "Elena R.",
                role: "Agency Owner"
              }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl relative"
              >
                <Quote className="w-10 h-10 text-blue-100 dark:text-blue-900/30 absolute top-6 right-6" />
                <div className="flex gap-1 mb-4 text-yellow-400">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{t.author}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              Simple Pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Start for free, upgrade when you need more power.
            </p>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                features: ['Unlimited Links', 'Basic Analytics', 'Standard Bio Page', 'QR Codes'],
                cta: 'Get Started',
                primary: false
              },
              {
                name: 'Pro',
                price: '$15',
                period: '/mo',
                features: ['Everything in Free', 'Advanced Analytics', 'Custom QR Codes', 'Password Protection', 'Link Scheduling'],
                cta: 'Start Pro Trial',
                primary: true
              },
              {
                name: 'Business',
                price: '$49',
                period: '/mo',
                features: ['Everything in Pro', 'Custom Domains', 'Team Collaboration', 'API Access', 'Priority Support'],
                cta: 'Contact Sales',
                primary: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-3xl flex flex-col ${plan.primary
                  ? 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-2xl scale-100 lg:scale-105 z-10'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg border border-gray-100 dark:border-gray-700'
                  }`}
              >
                {plan.primary && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.primary ? 'text-white' : ''}`}>{plan.name}</h3>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.period && <span className={`text-lg ${plan.primary ? 'text-blue-100' : 'text-gray-500'}`}>{plan.period}</span>}
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.primary ? 'text-blue-200' : 'text-green-500'}`} />
                      <span className={`${plan.primary ? 'text-blue-50' : 'text-gray-600 dark:text-gray-300'} text-sm sm:text-base`}>
                        {feature.includes('Advanced') || feature.includes('Domain') || feature.includes('Priority') ? <strong>{feature}</strong> : feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="block mt-auto">
                  <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.primary
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}>
                    {plan.cta}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 dark:bg-blue-900">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90"></div>
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-8"
          >
            Ready to link smarter?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
          >
            Join over 10,000+ creators and businesses who use Smart Link to optimize their online presence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/register">
              <button className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all">
                Get Started Now - It's Free
              </button>
            </Link>
          </motion.div>
          <p className="mt-6 text-blue-200 text-sm font-medium">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <FAQSection />

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 pt-20 pb-10 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <Link2 className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Smart Link</span>
              </Link>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                The advanced link management platform for modern creators.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Product</h4>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400">
                <li><Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link></li>
                <li><Link to="/register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Resources</h4>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400">
                <li><Link to="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</Link></li>
                <li><a href="mailto:support@smartlink.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400">
                <li><Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © 2026 Smart Link. All rights reserved.
            </p>
            <div className="flex gap-6">
              {/* Social icons could go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}