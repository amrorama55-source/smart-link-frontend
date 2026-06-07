import { useState, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Link2, Menu, X, Moon, Sun, ChevronRight,
  ArrowRight, CheckCircle, Play, Sparkles, QrCode, BarChart3
} from 'lucide-react';
import SEO from '../components/SEO';
import { nichesData } from '../utils/nichesData';

// TrustBox logic is handled inline in the component

export default function NicheLanding({ nicheKey }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Get data for this niche
  const data = nichesData[nicheKey];
  const trustBoxRef = useRef(null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [nicheKey]);

  // Initialize Trustpilot widget
  useEffect(() => {
    const loadWidget = () => {
      if (window.Trustpilot && trustBoxRef.current) {
        window.Trustpilot.loadFromElement(trustBoxRef.current, true);
      }
    };
    loadWidget();
    const timeout = setTimeout(loadWidget, 1500);
    return () => clearTimeout(timeout);
  }, [nicheKey]);

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

  if (!data) {
    return <Navigate to="/" replace />;
  }

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } };
  const floatAnimation = { y: [0, -10, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden font-sans">
      <SEO
        title={`${data.title} ${data.gradientText} | Smart Link`}
        description={data.subtitle}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex flex-col ${scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-800/50' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.7 }}
                className="w-10 h-10 sm:w-12 sm:h-12 transform group-hover:scale-110 transition-transform"
              >
                <img src="/logo-v1.svg" alt="Smart Link Logo" className="w-full h-full object-contain" />
              </motion.div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Smart Link</span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="text-center lg:text-left">
              <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4 sm:mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-semibold">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />{data.badgeText}
                </span>
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 sm:mb-6 tracking-tight">
                <span className="block">{data.title}</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mt-1 sm:mt-2">{data.gradientText}</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-sm sm:text-base lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0">
                {data.subtitle}
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-10 px-4 sm:px-0">
                <Link to="/register" className="w-full sm:w-auto">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-base sm:text-lg shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 touch-manipulation">
                    {data.ctaText} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-medium px-2">
                {['No credit card', 'Free forever', 'Setup in 2 min'].map((text, i) => (
                  <div key={i} className="flex items-center gap-1.5 sm:gap-2 bg-white/50 dark:bg-gray-800/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" /><span className="whitespace-nowrap">{text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative hidden sm:block">
              {/* Reuse Video Demo Logic */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 aspect-video">
                  <video src={data.heroVideo} poster="/og-image.png" autoPlay muted loop playsInline className="w-full h-full object-cover" />
                </div>
              </div>
              <motion.div animate={floatAnimation} className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl flex items-center justify-center rotate-6 ring-4 ring-white dark:ring-gray-900 z-10">
                <QrCode className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TrustPilot */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/30">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Trusted by professionals worldwide</p>
            {/* Trustpilot Widget */}
             <div className="flex justify-center w-full">
               <div
                  ref={trustBoxRef}
                  className="trustpilot-widget bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-sm mx-auto flex items-center justify-center min-h-[120px] transition-all hover:shadow-2xl"
                  data-locale="en-US"
                  data-template-id="53aa8807dec7e10d38f59f32"
                  data-businessunit-id="69f7390bebbd3c000d06bf18"
                  data-style-height="150px"
                  data-style-width="100%"
                  data-theme={darkMode ? "dark" : "light"}
                  data-token="b67fd1c8-4724-4922-ae25-038862ea786a"
                >
                 <a href="https://www.trustpilot.com/review/by-smartlink.com" target="_blank" rel="noopener noreferrer">Trustpilot</a>
               </div>
            </div>
         </div>
      </section>

      {/* Targeted Features Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="text-center mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Purpose-Built for <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{data.gradientText}</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {data.features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }} className="group p-6 sm:p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 sm:w-7 sm:h-7 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 dark:bg-blue-900"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-gray-900 dark:to-indigo-950 mix-blend-multiply"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">Ready to scale your results?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Join thousands of {data.gradientText.toLowerCase()} using Smart Link to optimize their digital presence.</p>
          <Link to="/register">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-white dark:bg-gray-950 py-12 border-t border-gray-100 dark:border-gray-800 text-center">
        <p className="text-gray-500 dark:text-gray-400 font-medium">© 2026 Smart Link Platform. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-4 text-sm text-gray-500">
           <Link to="/" className="hover:text-blue-500">Home</Link>
           <Link to="/privacy" className="hover:text-blue-500">Privacy</Link>
           <Link to="/terms" className="hover:text-blue-500">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
