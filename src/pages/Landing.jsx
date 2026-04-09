import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PLANS } from '../utils/plans';
import { useAuth } from '../context/AuthContext';
import {
  Link2, Menu, X, Moon, Sun, ChevronRight,
  BarChart3, Globe, Smartphone, Target, TrendingUp,
  Eye, MousePointerClick, Calendar, Zap, Shield,
  QrCode, CheckCircle, ArrowRight, Sparkles,
  Users, Clock, Lock, Code, Star, Quote, Copy, Play, Layout, Settings
} from 'lucide-react';

/* ========================================
   Live Product Demo Component (Hero Visual)
   ======================================== */
function ProductDemo() {
  return (
    <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 aspect-[16/10]">
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
      <div className="p-6 h-full relative font-sans">
        <div className="flex justify-between items-center mb-8">
          <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="w-8 h-8 rounded-full bg-purple-500"></div>
          </div>
        </div>
        <div className="space-y-4 max-w-lg mx-auto">
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
          <motion.div
            animate={{ scale: [1, 0.98, 1] }}
            transition={{ duration: 0.5, delay: 1.5, repeat: Infinity, repeatDelay: 6 }}
            className="w-full h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
          >
            Shorten Link
          </motion.div>
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
        <motion.div
          initial={{ x: 300, y: 300 }}
          animate={{ x: [300, 150, 150, 400], y: [300, 100, 160, 400], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 4 }}
          className="absolute z-50 pointer-events-none"
        >
          <MousePointerClick className="w-6 h-6 text-black fill-white dark:text-white dark:fill-black drop-shadow-xl" />
        </motion.div>
      </div>
    </div>
  );
}

/* ========================================
   FULL DEMO MODAL
   ======================================== */
function DemoModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => { setStep((s) => (s + 1) % 4); }, 6000);
      return () => clearInterval(timer);
    } else { setStep(0); }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-6xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col md:flex-row h-[90vh] md:h-auto md:aspect-[16/9]"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full md:w-1/3 bg-gray-800 p-8 border-r border-gray-700 flex flex-col justify-center overflow-y-auto">
          <h3 className="text-2xl font-bold text-white mb-8">Product Tour</h3>
          <div className="space-y-4">
            {[
              { title: "Create Smart Links", desc: "Paste URL, customize alias, and add tags.", icon: Link2, color: 'blue' },
              { title: "Smart Targeting", desc: "Route users by Device (iOS/Android) or Location.", icon: Target, color: 'red' },
              { title: "Build Bio Page", desc: "Drag & drop links, choose themes, and publish.", icon: Layout, color: 'purple' },
              { title: "Track Analytics", desc: "Real-time insights on clicks, location, and OS.", icon: BarChart3, color: 'green' }
            ].map((s, i) => (
              <div key={i}
                className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-500 cursor-pointer ${step === i ? `bg-${s.color}-600/20 border border-${s.color}-500/50` : 'opacity-40 hover:opacity-60'}`}
                onClick={() => setStep(i)}
              >
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
        <div className="w-full md:w-2/3 bg-gray-950 p-8 relative overflow-hidden flex items-center justify-center">
          <div className="absolute top-4 right-4 z-10">
            <button onClick={onClose} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 text-white transition-colors" aria-label="Close modal">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="w-full max-w-md h-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full"></div>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-xl p-6 shadow-xl w-full relative z-10">
                  <p className="text-gray-500 mb-4 text-xs font-bold tracking-widest uppercase">1. Paste & Create</p>
                  <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200 mb-4">
                    <div className="flex items-center gap-2 mb-2"><Link2 className="w-4 h-4 text-gray-400" /><span className="text-sm font-medium text-gray-600">Destination URL</span></div>
                    <div className="bg-white border rounded px-2 py-1 text-gray-800 text-sm overflow-hidden">https://myshop.com/products/super-sale-2026/ref=twitter</div>
                  </div>
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-2 items-center mb-4">
                    <Settings className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">Custom Alias:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm font-bold">summer-sale</span>
                  </motion.div>
                  <motion.button animate={{ scale: [1, 0.95, 1] }} transition={{ delay: 1.5 }} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold">Create Smart Link</motion.button>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-xl p-6 shadow-xl w-full relative z-10">
                  <p className="text-red-500 mb-4 text-xs font-bold tracking-widest uppercase">2. Add Targeting Rules</p>
                  <div className="space-y-3">
                    {[
                      { icon: Smartphone, bg: 'bg-black', title: 'Device: iOS', desc: 'Redirect to App Store' },
                      { icon: Smartphone, bg: 'bg-green-600', title: 'Device: Android', desc: 'Redirect to Play Store' },
                      { icon: Globe, bg: 'bg-blue-600', title: 'Location: France', desc: 'Redirect to /fr-fr' }
                    ].map((rule, idx) => (
                      <motion.div key={idx} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.3 + 0.3 }} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div className={`${rule.bg} text-white p-2 rounded-lg`}><rule.icon className="w-4 h-4" /></div>
                        <div className="flex-1"><p className="text-sm font-bold text-gray-800">{rule.title}</p><p className="text-xs text-gray-500">{rule.desc}</p></div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-800 text-center w-full relative z-10">
                  <p className="text-purple-400 mb-4 text-xs font-bold tracking-widest uppercase">3. Design Bio Page</p>
                  <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-lg"></div>
                  <h4 className="text-white font-bold text-xl mb-1">Sarah Creator</h4>
                  <p className="text-gray-400 text-sm mb-6">@sarah_designs</p>
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.2 }} className="p-3 bg-white/10 rounded-lg text-white font-medium flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-3"><div className="w-6 h-6 rounded bg-white/20"></div><span>My Link #{i}</span></div>
                        <ArrowRight className="w-4 h-4 opacity-50" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-xl p-6 shadow-xl w-full relative z-10">
                  <p className="text-green-600 mb-4 text-xs font-bold tracking-widest uppercase">4. Analyze Results</p>
                  <div className="flex justify-between items-end h-32 gap-2 px-2 pb-4 border-b border-gray-200">
                    {[30, 50, 40, 70, 90, 60, 80, 95, 85].map((h, i) => (
                      <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.05 }} className="flex-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-sm"></motion.div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-gray-900">12.5k</p><p className="text-xs text-gray-500 uppercase font-bold">Total Clicks</p></div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-blue-600">iOS</p><p className="text-xs text-gray-500 uppercase font-bold">Top Device</p></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-100 ease-linear" style={{ width: `${((step + 1) / 4) * 100}%` }}></div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ========================================
   How It Works Section
   ======================================== */
function HowItWorksSection() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => { setStep((s) => (s + 1) % 4); }, 6000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { title: "Create Smart Links", desc: "Paste URL, customize alias, and add tags.", icon: Link2, color: 'blue' },
    { title: "Smart Targeting", desc: "Route users by Device (iOS/Android) or Location.", icon: Target, color: 'red' },
    { title: "Build Bio Page", desc: "Drag & drop links, choose themes, and publish.", icon: Layout, color: 'purple' },
    { title: "Track Analytics", desc: "Real-time insights on clicks, location, and OS.", icon: BarChart3, color: 'green' }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-800/30 scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Everything You Need,
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">In One Platform</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Take a tour of how Smart Link helps you manage and optimize your digital presence.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row min-h-[600px]">
          <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 border-r border-gray-100 dark:border-gray-800 flex flex-col justify-center">
            <div className="space-y-3 sm:space-y-4">
              {steps.map((s, i) => (
                <div key={i}
                  className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-500 cursor-pointer ${step === i ? 'bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 scale-100 sm:scale-[1.02]' : 'opacity-40 hover:opacity-60'}`}
                  onClick={() => setStep(i)}
                >
                  <div className={`w-10 h-10 rounded-full bg-${s.color}-600 flex items-center justify-center text-white font-bold flex-shrink-0 mt-1 shadow-lg`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">{s.title}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-snug">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-2/3 bg-gray-950 p-6 sm:p-8 relative overflow-hidden flex items-center justify-center min-h-[400px]">
            <div className="w-full max-w-md relative z-10">
              <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full -z-10"></div>
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="bg-white rounded-xl p-6 shadow-2xl w-full">
                    <p className="text-gray-500 mb-4 text-xs font-bold tracking-widest uppercase">1. Paste & Create</p>
                    <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200 mb-4">
                      <div className="flex items-center gap-2 mb-2"><Link2 className="w-4 h-4 text-gray-400" /><span className="text-sm font-medium text-gray-600">Destination URL</span></div>
                      <div className="bg-white border rounded px-2 py-1 text-gray-800 text-sm overflow-hidden">https://myshop.com/products/super-sale-2026/ref=twitter</div>
                    </div>
                    <div className="flex gap-2 items-center mb-4">
                      <Settings className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">Custom Alias:</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm font-bold">summer-sale</span>
                    </div>
                    <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg">Create Smart Link</button>
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="bg-white rounded-xl p-6 shadow-2xl w-full">
                    <p className="text-red-500 mb-4 text-xs font-bold tracking-widest uppercase">2. Add Targeting Rules</p>
                    <div className="space-y-3">
                      {[
                        { icon: Smartphone, bg: 'bg-black', title: 'Device: iOS', desc: 'Redirect to App Store' },
                        { icon: Smartphone, bg: 'bg-green-600', title: 'Device: Android', desc: 'Redirect to Play Store' },
                        { icon: Globe, bg: 'bg-blue-600', title: 'Location: France', desc: 'Redirect to /fr-fr' }
                      ].map((rule, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className={`${rule.bg} text-white p-2 rounded-lg`}><rule.icon className="w-4 h-4" /></div>
                          <div className="flex-1"><p className="text-sm font-bold text-gray-800">{rule.title}</p><p className="text-xs text-gray-500">{rule.desc}</p></div>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="bg-gray-900 rounded-xl p-6 shadow-2xl border border-gray-800 text-center w-full">
                    <p className="text-purple-400 mb-4 text-xs font-bold tracking-widest uppercase">3. Design Bio Page</p>
                    <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-lg"></div>
                    <h4 className="text-white font-bold text-xl mb-1">Sarah Creator</h4>
                    <p className="text-gray-400 text-sm mb-6">@sarah_designs</p>
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="p-3 bg-white/10 rounded-lg text-white font-medium flex items-center justify-between border border-white/5">
                          <div className="flex items-center gap-3"><div className="w-6 h-6 rounded bg-white/20"></div><span>My Product #{i}</span></div>
                          <ArrowRight className="w-4 h-4 opacity-50" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="bg-white rounded-xl p-6 shadow-2xl w-full">
                    <p className="text-green-600 mb-4 text-xs font-bold tracking-widest uppercase">4. Analyze Results</p>
                    <div className="flex justify-between items-end h-32 gap-2 px-2 pb-4 border-b border-gray-200">
                      {[30, 50, 40, 70, 90, 60, 80, 95, 85].map((h, i) => (
                        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="flex-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-sm"></motion.div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-gray-900">12.5k</p><p className="text-xs text-gray-500 uppercase font-bold">Total Clicks</p></div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-blue-600">iOS</p><p className="text-xs text-gray-500 uppercase font-bold">Top Device</p></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-100 ease-linear" style={{ width: `${((step + 1) / 4) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================================
   FAQ Section
   ======================================== */
function FAQSection() {
  const faqs = [
    { question: "How to create a free link in bio?", answer: "Simply sign up for a free account, paste your long URLs, and customize your bio page. You can go live in less than 2 minutes." },
    { question: "What is the best alternative to Linktree for free?", answer: "Smart Link offers advanced features like Device Targeting and detailed analytics for free, making it the most powerful free Linktree alternative for creators." },
    { question: "Can I track my link clicks for free?", answer: "Yes! Smart Link provides real-time analytics for all your links and bio pages, including device, location, and click-through data—all 100% free." }
  ];
  return (
    <section id="faq" className="py-16 sm:py-24 bg-white dark:bg-gray-900 scroll-mt-20 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">Everything you need to know about Smart Link.</p>
        </div>
        <div className="space-y-4 sm:space-y-6">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-5 sm:p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/faq" className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-2">
            View all frequently asked questions <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ========================================
   About Us Section
   ======================================== */
function AboutUsSection() {
  return (
    <section id="about-us" className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-800/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
              Our Mission: Empowering<span className="block text-blue-600 mt-2">Founders & Creators</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
              Smart Link was born from a simple idea: professional-grade marketing tools shouldn't be locked behind expensive subscriptions for those just starting out.
            </p>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
              Whether you are a SaaS founder launching your first product, a marketer optimizing campaigns, or a creator building your brand, we provide the analytics and targeting tools you need to succeed—100% free.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  'https://randomuser.me/api/portraits/men/32.jpg',
                  'https://randomuser.me/api/portraits/men/44.jpg',
                  'https://randomuser.me/api/portraits/men/67.jpg',
                  'https://randomuser.me/api/portraits/men/85.jpg'
                ].map((src, i) => (
                  <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    <img
                      src={src}
                      alt="Team Member"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Built with ❤️ by a global team of specialists.</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 relative">
            <div className="absolute -top-6 -right-6 p-4 bg-green-500 text-white rounded-2xl shadow-lg rotate-12"><Sparkles className="w-6 h-6" /></div>
            <div className="space-y-4 sm:space-y-6">
              {[
                { icon: Shield, color: 'blue', title: 'Privacy First', desc: "We don't track your users personally. Only clean, actionable data." },
                { icon: Zap, color: 'purple', title: 'Performance DNA', desc: 'Lightweight links that load in milliseconds across the globe.' },
                { icon: Lock, color: 'green', title: 'Secure & Reliable', desc: '99.9% uptime with enterprise-grade security for every link.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center text-${item.color}-600 flex-shrink-0`}>
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ========================================
   MAIN LANDING PAGE
   ======================================== */
export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const { user } = useAuth();

  // ✅ handleStartTrial — يفتح صفحة التسجيل مع تفعيل Trial تلقائي
  const handleStartTrial = () => {
    window.location.href = '/register?trial=true';
  };

  const SUCCESS_URL = 'https://www.smart-link.website/success';

  const buildCheckoutUrl = (baseUrl, userId) => {
    if (!baseUrl) return null;
    const url = new URL(baseUrl);
    if (userId) url.searchParams.set('checkout[custom][user_id]', userId);
    url.searchParams.set('checkout[success_url]', SUCCESS_URL);
    return url.toString();
  };

  const handleCheckout = (plan, yearly) => {
    if (plan.id === 'free') {
      window.location.href = '/register';
      return;
    }
    if (plan.id === 'trial') {
      window.location.href = '/register?trial=true';
      return;
    }

    // ✅ MUST BE LOGGED IN TO BUY A PAID PLAN
    if (!user) {
      window.location.href = '/register?redirect=pricing';
      return;
    }

    const rawUrl = yearly ? plan.checkoutUrl.yearly : plan.checkoutUrl.monthly;
    const checkoutUrl = buildCheckoutUrl(rawUrl, user?._id || user?.id);
    if (!checkoutUrl) {
      alert('Checkout link not available');
      return;
    }
    window.location.href = checkoutUrl;
  };

  useEffect(() => {
    if (darkMode) { document.documentElement.classList.add('dark'); }
    else { document.documentElement.classList.remove('dark'); }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      window.requestAnimationFrame
        ? window.requestAnimationFrame(() => setScrolled(window.scrollY > 20))
        : setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } };
  const floatAnimation = { y: [0, -10, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden font-sans">

      {/* DEMO MODAL */}
      <AnimatePresence>
        {demoOpen && <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />}
      </AnimatePresence>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex flex-col ${scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-800/50' : 'bg-transparent'}`}
      >
        {/* SOURCE CODE BANNER FOR X VISITORS */}
        <div className="bg-gradient-to-r relative from-indigo-600 via-blue-600 to-indigo-600 text-white px-4 py-2 text-center text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-2 sm:gap-4 flex-wrap w-full shadow-md z-50">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-sm sm:text-base animate-pulse">🚀</span>
            <span dir="rtl">هل أنت مطور أو رائد أعمال؟ امتلك الكود المصدري الكامل لهذه المنصة (MERN Stack) بـ 99$ فقط!</span>
          </div>
          <a
            href="https://smart-link-api.lemonsqueezy.com/checkout/buy/a88b4574-96d2-4686-9228-e170848c0f57"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-600 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold hover:bg-gray-100 hover:scale-105 transition-transform shadow-sm flex items-center gap-1 ml-2"
            dir="rtl"
          >
            اضغط هنا للشراء <ArrowRight className="w-3 h-3 rotate-180" />
          </a>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.7 }} className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                <Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Smart Link</span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {['Features', 'How It Works', 'Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                </a>
              ))}
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center" aria-label="Toggle dark mode">
                <AnimatePresence mode="wait">
                  {darkMode
                    ? <motion.div key="sun" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} transition={{ duration: 0.2 }}><Sun className="w-5 h-5" /></motion.div>
                    : <motion.div key="moon" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }} transition={{ duration: 0.2 }}><Moon className="w-5 h-5" /></motion.div>
                  }
                </AnimatePresence>
              </button>
              <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">Login</Link>
              <Link to="/register">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all">
                  Get Started Free
                </motion.button>
              </Link>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={() => setDarkMode(!darkMode)} className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center touch-manipulation" aria-label="Toggle dark mode">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center touch-manipulation" aria-label="Toggle mobile menu">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
                <div className="flex flex-col gap-2 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                  {['Features', 'How It Works', 'Pricing'].map((item) => (
                    <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setMobileMenuOpen(false)} className="min-h-[48px] flex items-center px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-gray-700 dark:text-gray-200 touch-manipulation">{item}</a>
                  ))}
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="min-h-[48px] flex items-center justify-center px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 font-semibold text-gray-900 dark:text-white touch-manipulation">Login</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="min-h-[48px] flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:opacity-90 touch-manipulation">Get Started Free</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 -z-10"></div>
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="text-center lg:text-left">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 hover:shadow-md transition-shadow cursor-default">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" /><span className="font-semibold">Growth Tool for Founders</span>
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 sm:mb-6 tracking-tight">
                <span className="block">Free Smart Link</span>
                <span className="block">&amp; Bio Page</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mt-1 sm:mt-2">Tool for Creators</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-sm sm:text-base lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0">
                The best free Bio Page tool and URL shortener for Creators, SaaS Founders, and Marketers. Track analytics, smart targeting, and A/B testing—all in one place.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-10 text-left bg-white/50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 inline-block backdrop-blur-sm w-full sm:w-auto">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">1</div>
                  <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">Paste Link</span>
                </div>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hidden sm:block" />
                <div className="w-px h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 sm:hidden ml-3.5"></div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">2</div>
                  <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">Customize</span>
                </div>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hidden sm:block" />
                <div className="w-px h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 sm:hidden ml-3.5"></div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">3</div>
                  <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">Analyze</span>
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-10 px-4 sm:px-0">
                <Link to="/register" className="w-full sm:w-auto">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-base sm:text-lg shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 touch-manipulation">
                    Start for Free <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </Link>
                <motion.button
                  onClick={() => { const el = document.getElementById('how-it-works'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold text-base sm:text-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 group touch-manipulation"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-current ml-0.5" />
                  </div>
                  How It Works
                </motion.button>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-medium px-2">
                {['No credit card', 'Free forever', 'Setup in 2 min'].map((text, i) => (
                  <div key={i} className="flex items-center gap-1.5 sm:gap-2 bg-white/50 dark:bg-gray-800/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" /><span className="whitespace-nowrap">{text}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={itemVariants} className="mt-6 sm:mt-8 flex items-center justify-center lg:justify-start gap-2 sm:gap-3 text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-3 sm:px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800/50 inline-flex">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" /><span>Join 10+ founders using Smart Link</span>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative hidden sm:block">
              <ProductDemo />
              <motion.div animate={floatAnimation} className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl flex items-center justify-center rotate-6 ring-4 ring-white dark:ring-gray-900 z-10">
                <QrCode className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </motion.div>
              <motion.div animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 1.5 } }} className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl flex items-center justify-center -rotate-6 ring-4 ring-white dark:ring-gray-900 z-10">
                <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-8 sm:py-12 border-y border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6 sm:mb-8">Trusted by founders, marketers, and teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-base sm:text-xl"><Globe className="w-5 h-5 sm:w-6 sm:h-6" /> GlobalInc</div>
            <div className="flex items-center gap-2 font-bold text-base sm:text-xl"><Zap className="w-5 h-5 sm:w-6 sm:h-6" /> FlashTeam</div>
            <div className="flex items-center gap-2 font-bold text-base sm:text-xl"><Shield className="w-5 h-5 sm:w-6 sm:h-6" /> SecureNet</div>
            <div className="flex items-center gap-2 font-bold text-base sm:text-xl"><Target className="w-5 h-5 sm:w-6 sm:h-6" /> GoalGetters</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorksSection />

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="text-center mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Powerful Tools for<span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">Founders & Marketers</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">Everything you need to manage your links, track your audience, and grow your brand online.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Link2, title: 'High-Conversion Bio Pages', description: 'Create stunning bio pages that showcase your SaaS or personal brand. Professional themes designed for maximum marketing ROI.', color: 'blue' },
              { icon: Shield, title: 'Enterprise Bot Filtering', description: 'Built-in advanced algorithms filter out API scrapers, VPNs, and Datacenters. ensuring your analytics are 100% real human traffic.', color: 'red' },
              { icon: BarChart3, title: 'Advanced Analytics & Funnels', description: 'Track clicks, geographic data, and OS-level metrics. Visualize drop-offs with beautiful conversion funnels.', color: 'purple' },
              { icon: Smartphone, title: 'Deep Link OS Targeting', description: 'Route iOS users to the App Store, Android users to Google Play, or fallback to the web—instantly and automatically.', color: 'green' },
              { icon: Zap, title: 'Zero-Latency Geo-Routing', description: 'Redirect users based on their country or language with 0ms latency using our ultra-fast local edge database.', color: 'orange' },
              { icon: Code, title: 'Developer API', description: 'Integrate Smart Link directly into your SaaS product workflow with our robust and easy-to-use API.', color: 'indigo' }
            ].map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }} className="group p-6 sm:p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 sm:w-7 sm:h-7 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-12 sm:mb-16 text-gray-900 dark:text-white">Loved by Thousands</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { quote: "Tested SmartLink today, quick honest review. Setup was simple, the dashboard is clean, and everythin...", author: "Karl Beismann", role: "@karlbeis" },
              { quote: "Makes sharing one link for multiple destinations feel easy and tidy, that’s useful for campaigns or social bios.", author: "Vineer", role: "@vineerpasam" },
              { quote: "It's a solid tool for creators and businesses who want real data instead of guesses. Clean dashboard and real-time link tracking. Good for link-in-bio pages and short links.", author: "Chandan H", role: "@_Chandan_17" }
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-xl relative">
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-blue-100 dark:text-blue-900/30 absolute top-4 sm:top-6 right-4 sm:right-6" />
                <div className="flex gap-1 mb-3 sm:mb-4 text-yellow-500">{[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />)}</div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 italic">"{t.quote}"</p>
                <div><p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{t.author}</p><p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">{t.role}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-32 bg-white dark:bg-gray-900 scroll-mt-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 sm:mb-24">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-bold mb-6">
              <Zap className="w-4 h-4" /><span>Investment for Growth</span>
            </motion.div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
              Flexible Plans for <span className="text-blue-600">Every Stage</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">Start for free, upgrade as you grow. No hidden fees, cancel anytime.</p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm font-bold ${!isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Monthly</span>
              <button onClick={() => setIsYearly(!isYearly)} className="relative w-14 h-8 bg-gray-200 dark:bg-gray-800 rounded-full p-1 transition-colors hover:bg-gray-300 dark:hover:bg-gray-700 active:scale-95">
                <motion.div animate={{ x: isYearly ? 24 : 0 }} className="w-6 h-6 bg-blue-600 rounded-full shadow-md" />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Yearly</span>
                <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ring-1 ring-green-600/20">Save 25%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {PLANS.map((plan, index) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }}
                className={`relative p-8 sm:p-10 rounded-[2.5rem] flex flex-col transition-all duration-300 ${plan.popular ? 'bg-gray-900 dark:bg-gray-800 text-white shadow-[0_30px_60px_-15px_rgba(37,99,235,0.3)] scale-100 lg:scale-105 z-10 border-4 border-blue-500' : 'bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white shadow-xl border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm'}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest shadow-xl ring-4 ring-white dark:ring-gray-900">Most Popular</div>
                )}
                <div className="mb-8">
                  <h3 className={`text-2xl font-black mb-2 uppercase tracking-tight ${plan.popular ? 'text-blue-400' : 'text-blue-600'}`}>{plan.name}</h3>
                  <p className={`text-sm font-medium ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>{plan.description}</p>
                </div>
                <div className="mb-10 flex items-baseline gap-1">
                  <span className="text-5xl sm:text-6xl font-black tracking-tighter">{isYearly ? plan.price.yearly : plan.price.monthly}</span>
                  <span className={`text-lg font-bold ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>/mo</span>
                </div>
                <div className={`h-px w-full mb-10 ${plan.popular ? 'bg-gray-700' : 'bg-gray-100 dark:bg-gray-700'}`}></div>
                <ul className="space-y-5 mb-12 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.popular ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className={`text-sm sm:text-base font-semibold leading-snug ${plan.popular ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <motion.button onClick={() => handleCheckout(plan, isYearly)} whileTap={{ scale: 0.95 }}
                  className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-2 mt-auto ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-500/40' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90'}`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                {/* ✅ Trial button — Business plan فقط */}
                {plan.trialAvailable && (
                  <motion.button
                    onClick={handleStartTrial}
                    whileTap={{ scale: 0.97 }}
                    className="mt-4 w-full py-3.5 rounded-2xl font-bold text-sm transition-all border-2 border-purple-400 dark:border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    🎯 Try free for {plan.trialDays} days — no credit card
                  </motion.button>
                )}

                {plan.id !== 'free' && (
                  <p className={`text-center mt-4 text-[10px] font-bold uppercase tracking-widest ${plan.popular ? 'text-gray-500' : 'text-gray-400'}`}>✨ Cancel anytime, no questions asked</p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Have questions about our plans?
              <Link to="/faq" className="text-blue-600 dark:text-blue-400 font-bold ml-1 hover:underline underline-offset-4">Check our FAQ</Link>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 dark:bg-blue-900">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 text-white">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 sm:mb-8">Ready to link smarter?</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: 0.1 }} className="text-base sm:text-xl text-blue-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            Join over 10,000+ creators and businesses who use Smart Link to optimize their online presence.
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: 0.2 }}>
            <Link to="/register">
              <button className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-blue-600 rounded-xl sm:rounded-2xl font-bold text-base sm:text-xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all min-h-[48px]">Get Started Now - It's Free</button>
            </Link>
          </motion.div>
          <p className="mt-4 sm:mt-6 text-blue-200 text-xs sm:text-sm font-medium">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* About Us */}
      <AboutUsSection />

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 pt-12 sm:pt-20 pb-8 sm:pb-10 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white"><Link2 className="w-5 h-5" /></div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Smart Link</span>
              </Link>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">The advanced link management platform for modern creators.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-sm sm:text-base">Product</h3>
              <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <li><Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link></li>
                <li><Link to="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-sm sm:text-base">Resources</h3>
              <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <li><Link to="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</Link></li>
                <li><Link to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link></li>
                <li><Link to="/strategy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Strategy</Link></li>
                <li><a href="mailto:smartlinkpro10@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-sm sm:text-base">Legal</h3>
              <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <li><Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm text-center md:text-left">© 2026 Smart Link. All rights reserved.</p>
            <div className="flex items-center">
              <a href="https://www.saashub.com/smart-link-pro?utm_source=badge&utm_campaign=badge&utm_content=smart-link-pro&badge_variant=color&badge_kind=approved" target="_blank" rel="noreferrer">
                <img src="https://cdn-b.saashub.com/img/badges/approved-color.png?v=1" alt="Smart Link Pro badge" style={{ maxWidth: '150px' }} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}