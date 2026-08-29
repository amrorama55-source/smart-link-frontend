import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PLANS } from '../utils/plans';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Shield, Zap, Target, Globe, BarChart3, ChevronRight, CheckCircle, 
  Menu, X, Moon, Sun, ArrowRight, MousePointerClick, TrendingUp, AlertTriangle,
  Link2, Layout, Star, Clock, Lock, Copy, CheckCircle2, Loader2
} from 'lucide-react';
import SEO from '../components/SEO';
import VideoDemo from '../components/VideoDemo';
import InteractiveDemo from '../components/InteractiveDemo';

// Creative Organic Shape Component
const OrganicShape = ({ className, color }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill={color} d="M42.7,-62.9C54.4,-53.8,62.4,-39.9,68.1,-25.1C73.8,-10.3,77.2,5.5,74.1,20.4C71,35.3,61.4,49.2,48.5,58.3C35.6,67.4,19.3,71.7,2.8,67.8C-13.7,63.9,-30.4,51.8,-43.3,40.1C-56.2,28.4,-65.4,17.1,-69.1,3.4C-72.8,-10.3,-71.1,-26.4,-62.4,-39.2C-53.7,-52,-38,-61.5,-23.4,-65.8C-8.8,-70.1,4.7,-69.2,18.5,-66.1C32.3,-63.1,46.3,-58.1,42.7,-62.9Z" transform="translate(100 100)" />
  </svg>
);

// 2. Hero Shortener Hook Component
function HeroShortener() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShorten = (e) => {
    e.preventDefault();
    if (!url) return;
    setStatus('loading');
    
    // Simulate API delay
    setTimeout(() => {
      const randomStr = Math.random().toString(36).substring(2, 7);
      setShortUrl(`by-smartlink.com/${randomStr}`);
      setStatus('success');
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto w-full relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 text-center">Your link is protected and live!</h3>
        <p className="text-gray-500 mb-6 font-medium text-center">Copy your new smart link. To see who clicks it and block bots, create your free account.</p>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 dark:bg-gray-950 p-3 rounded-2xl border border-gray-200 dark:border-gray-800 mb-6">
          <div className="flex-1 font-mono text-lg font-bold text-blue-600 dark:text-blue-400 truncate px-4">
            {shortUrl}
          </div>
          <button onClick={copyToClipboard} className="w-full sm:w-auto px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <Link to={`/register?redirect=dashboard&url=${encodeURIComponent(url)}`}>
          <button className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-black text-lg shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
            Claim My Link & View Analytics <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
        <p className="text-xs text-center text-gray-400 font-bold uppercase tracking-wider mt-4">No credit card required</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleShorten} className="relative max-w-2xl mx-auto w-full">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex flex-col sm:flex-row items-center bg-white dark:bg-gray-900 rounded-[2rem] p-2 border border-gray-200 dark:border-gray-800 shadow-2xl">
          <div className="flex items-center pl-6 pr-4 py-4 w-full sm:w-auto flex-1">
            <Link2 className="w-6 h-6 text-gray-400 mr-3 shrink-0" />
            <input 
              type="url" 
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long link here..." 
              className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white text-lg font-medium placeholder-gray-400"
              disabled={status === 'loading'}
            />
          </div>
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="w-full sm:w-auto px-8 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[1.5rem] font-black text-lg hover:scale-105 transition-all shadow-lg shadow-black/10 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 m-1"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" /> Shortening...
              </>
            ) : (
              <>
                Shorten & Protect <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-gray-500">
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> 14-Day Free Trial</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Blocks bots instantly</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Deep analytics</span>
      </div>
    </form>
  );
}

// 3. ROI Calculator Component
function ROICalculator() {
  const [adSpend, setAdSpend] = useState(2500);
  const botRate = 0.34; // 34% based on the subtext
  
  const wastedSpend = adSpend * botRate;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">How Much Are You Losing Right Now?</h3>
      <p className="text-gray-500 text-sm mb-8">Move the slider to see how much bot traffic is eating your budget.</p>
      
      <div className="space-y-6 mb-8 relative z-10">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Monthly Ad Spend</label>
            <span className="text-lg font-bold text-blue-600">${adSpend.toLocaleString()}</span>
          </div>
          <input type="range" min="500" max="10000" step="100" value={adSpend} onChange={(e) => setAdSpend(Number(e.target.value))} className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>
      
      <div className="bg-slate-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 relative z-10 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-500 font-medium text-sm">Estimated Bot Traffic</span>
          <span className="text-gray-900 dark:text-white font-bold">34%</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-500 font-medium text-sm">Wasted Budget</span>
          <span className="text-red-500 font-bold text-lg">${wastedSpend.toLocaleString()}/mo</span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-gray-900 dark:text-white font-black text-lg">What Smart Link Saves You</span>
          <span className="text-green-500 font-black text-3xl">${wastedSpend.toLocaleString()}</span>
        </div>
      </div>

      <Link to="/register" className="block mt-6">
        <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-red-500/30">
          Stop Losing ${wastedSpend.toLocaleString()} Every Month &rarr;
        </button>
      </Link>
    </div>
  );
}

// 9. FAQ Section Component
function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const faqs = [
    { q: "Why do I need Smart Link if I already have a link shortener?", a: "Traditional shorteners just count clicks. Smart Link goes deeper by tracking OS data, geolocation, and applying our Ad-Fraud shield to block bots, exposing the true intent behind your traffic." },
    { q: "How does the Ad-Fraud Datacenter Shield work?", a: "We automatically detect and block clicks originating from VPNs, AWS, DigitalOcean, and known botnets. This stops you from paying for fake clicks and keeps your retargeting pixel data 100% pure." },
    { q: "How does A/B Testing work?", a: "Set your destination variants (e.g. 50% to Page A, 50% to Page B), and our engine automatically routes the traffic. You can then view the analytics to see which page converts better." },
    { q: "Can I use my own custom domain?", a: "Absolutely. You can connect your own domain (e.g., links.yourbrand.com) on the Pro and Business plans to maintain full brand consistency." },
    { q: "How do I start tracking?", a: "Simply sign up, paste your URLs, and generate your links. The dashboard will instantly start populating with deep analytics." },
    { q: "What is the best alternative to ClickMagick in 2026?", a: "Smart Link is the best ClickMagick alternative in 2026, offering enterprise-grade bot protection, sub-ID tracking, and A/B testing with a free core tier, saving you $99/mo." },
    { q: "How to block bot traffic from Facebook and Google ads?", a: "You can block bot traffic by using an affiliate tracking platform with a Datacenter Shield. Smart Link automatically detects and blocks scrapers and VPN traffic, ensuring your pixels only fire for real humans." },
    { q: "How to track affiliate links without a website?", a: "You don't need a website to track affiliate links. You can use Smart Link to create a free Link-in-Bio page, add your tracked affiliate links to it, and share that single bio link on your social media profiles." },
    { q: "Is Linktree good for affiliate marketing?", a: "Linktree is basic and lacks deep analytics. For serious affiliate marketing, you need a platform like Smart Link that provides granular tracking (OS, device, geo), bot protection, and direct A/B testing within your bio page." },
    { q: "How to route traffic based on country and device?", a: "Using the Smart Link routing engine, you can set rules to redirect users from the US to Offer A, and users from the UK to Offer B, all under a single tracking link. You can also route based on iOS vs Android." }
  ];

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-gray-950 scroll-mt-20 border-t border-gray-200 dark:border-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">Everything you need to know about Smart Link.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
              <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg flex-1 pr-4">{faq.q}</h3>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openFAQ === i ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {openFAQ === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-6 pt-0 text-gray-600 dark:text-gray-400 text-base font-medium leading-relaxed border-t border-gray-200 dark:border-gray-800 mx-6">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const { user } = useAuth();

  const SUCCESS_URL = 'https://www.by-smartlink.com/success';

  const navigate = useNavigate();
  const handleStartTrial = () => {
    navigate('/register?trial=true');
  };

  const buildCheckoutUrl = (baseUrl, userId) => {
    if (!baseUrl) return null;
    const url = new URL(baseUrl);
    if (userId) url.searchParams.set('checkout[custom][user_id]', userId);
    url.searchParams.set('checkout[success_url]', SUCCESS_URL);
    return url.toString();
  };

  const handleCheckout = (plan, yearly) => {
    if (plan.id === 'free') { navigate('/register'); return; }
    if (plan.id === 'trial') { navigate('/register?trial=true'); return; }
    if (!user) { navigate('/register?redirect=pricing'); return; }
    const rawUrl = yearly ? plan.checkoutUrl.yearly : plan.checkoutUrl.monthly;
    const checkoutUrl = buildCheckoutUrl(rawUrl, user?._id || user?.id);
    if (!checkoutUrl) { alert('Checkout link not available'); return; }
    window.location.href = checkoutUrl;
  };

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 20); };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <SEO
        title="Smart Link — The Best Affiliate Tracking Software (ClickMagick Alternative)"
        description="Looking for the best affiliate tracking software? Smart Link is the #1 ClickMagick alternative for media buyers. Block bots and track affiliate links accurately."
      />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo-v1.svg" alt="Smart Link" className="w-8 h-8" />
              <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Smart Link.</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-wider">Features</a>
              <a href="#roi" className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-wider">ROI</a>
              <a href="#compare" className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-wider">Compare</a>
              <a href="#pricing" className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-wider">Pricing</a>
              <Link to="/blog" className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-wider">Blog</Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/ar" className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors flex items-center gap-1" title="العربية">
                <Globe className="w-4 h-4" /> العربية
              </Link>
              <button onClick={toggleDarkMode} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link to="/login" className="text-sm font-bold text-gray-900 dark:text-white px-4 py-2 hover:opacity-70 transition-opacity">Login</Link>
              <Link to="/register" className="text-sm font-bold px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"> 
                Start Tracking Free 
              </Link>
            </div>
            
            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-4">
              <Link to="/ar" className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors flex items-center gap-1">
                <Globe className="w-4 h-4" /> ع
              </Link>
              <button onClick={toggleDarkMode} className="p-2 text-gray-500">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-900 dark:text-white p-2">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
                <div className="flex flex-col gap-4 p-4">
                  <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wider">Features</a>
                  <a href="#roi" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wider">ROI</a>
                  <a href="#compare" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wider">Compare</a>
                  <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wider">Pricing</a>
                  <Link to="/ar" onClick={() => setMobileMenuOpen(false)} className="text-gray-500 font-sans font-bold flex items-center gap-1">
                    <Globe className="w-4 h-4" /> العربية
                  </Link>
                  <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                  <Link to="/login" className="text-gray-900 dark:text-white font-bold text-center py-2">Login</Link>
                  <Link to="/register" className="text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-colors">Start Tracking Free</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* 1. Hero Section — جديد كلياً */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <OrganicShape className="absolute -top-40 -right-40 w-[800px] h-[800px] opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-lighten blur-3xl animate-blob" color="#3b82f6" />
          <OrganicShape className="absolute top-40 -left-20 w-[600px] h-[600px] opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-lighten blur-3xl animate-blob animation-delay-2000" color="#8b5cf6" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-20 opacity-50"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-bold mb-8 uppercase tracking-widest">
              <Target className="w-4 h-4" /> #1 Affiliate Marketing Tracking Platform
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.05] tracking-tight mb-8">
              Your Traffic Is Leaking Money.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                We Show You Where.
              </span>
            </h1>
            
            <h2 className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
              Looking for a modern <strong className="text-gray-900 dark:text-white">ClickMagick alternative</strong>? Smart Link is the ultimate <strong className="text-gray-900 dark:text-white">affiliate tracking software</strong>. Stop losing budget to bot traffic and route clicks accurately.
            </h2>
            
            <div className="mb-16">
              <HeroShortener />
            </div>
            
            <div className="relative hidden sm:block mt-12">
              <VideoDemo />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Pain Points Section — جديد */}
      <section className="py-24 bg-white dark:bg-gray-900 relative border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Sound Familiar?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-red-50 dark:bg-gray-800 p-8 rounded-3xl border border-red-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">"I'm getting clicks but no conversions"</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400 font-medium"><ArrowRight className="w-5 h-5 text-red-500 shrink-0" /> You're probably getting bot traffic</li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400 font-medium"><ArrowRight className="w-5 h-5 text-green-500 shrink-0" /> Smart Link filters it automatically</li>
              </ul>
            </div>
            
            {/* Card 2 */}
            <div className="bg-orange-50 dark:bg-gray-800 p-8 rounded-3xl border border-orange-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">"My US offer isn't converting"</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400 font-medium"><ArrowRight className="w-5 h-5 text-orange-500 shrink-0" /> 60% of your traffic might be from the wrong country</li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400 font-medium"><ArrowRight className="w-5 h-5 text-green-500 shrink-0" /> Geo Targeting fixes this instantly</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-blue-50 dark:bg-gray-800 p-8 rounded-3xl border border-blue-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">"I'm paying for 3 different tools"</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400 font-medium"><ArrowRight className="w-5 h-5 text-blue-500 shrink-0" /> ClickMagick + Voluum + Linktree</li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400 font-medium"><ArrowRight className="w-5 h-5 text-green-500 shrink-0" /> Smart Link replaces all 3</li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400 font-medium"><ArrowRight className="w-5 h-5 text-green-500 shrink-0" /> For free</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Stats Section — جديد */}
      <section className="py-16 bg-gray-900 dark:bg-black text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-3"><Shield className="w-8 h-8 text-red-500" /></div>
              <p className="text-4xl font-black mb-1">3.6M+</p>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Bot Clicks Blocked</p>
            </div>
            <div>
              <div className="flex justify-center mb-3"><Globe className="w-8 h-8 text-blue-500" /></div>
              <p className="text-4xl font-black mb-1">180+</p>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Countries Targeted</p>
            </div>
            <div>
              <div className="flex justify-center mb-3"><TrendingUp className="w-8 h-8 text-green-500" /></div>
              <p className="text-4xl font-black mb-1">$2.3M+</p>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Ad Budget Protected</p>
            </div>
            <div>
              <div className="flex justify-center mb-3"><Clock className="w-8 h-8 text-purple-500" /></div>
              <p className="text-4xl font-black mb-1">2 min</p>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Avg Setup Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section — Enterprise Bento Grid Layout */}
      <section id="features" className="py-32 bg-slate-50 dark:bg-gray-950 relative border-t border-gray-200 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              Infrastructure Grade
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
              Engineered For High-Volume Traffic.
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
              Replaces standalone shorteners, cloakers, and analytics suites with one high-speed unified platform.
            </p>
          </div>
          
          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento 1: Large Featured Card - Bot Shield (Spans 2 cols) */}
            <div className="md:col-span-2 group p-8 sm:p-10 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-white rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                    <Shield className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> Datacenter Shield Active
                  </span>
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">Enterprise Bot & VPN Filtering</h3>
                <p className="text-gray-300 text-base font-medium leading-relaxed max-w-xl mb-8">
                  Automatically intercept and isolate traffic from AWS, DigitalOcean, proxy VPNs, and malicious scrapers before they burn your ad budget or pollute your pixels.
                </p>
              </div>

              {/* Visual Preview Box */}
              <div className="bg-black/40 border border-gray-800 rounded-2xl p-4 font-mono text-xs text-gray-300 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-gray-800 text-gray-400">
                  <span>INSPECTED REQUEST</span>
                  <span>STATUS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">IP 54.210.xx.xx (AWS EC2 US-East)</span>
                  <span className="text-red-400 font-bold">⛔ BLOCKED (Datacenter)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">IP 172.56.xx.xx (T-Mobile Mobile)</span>
                  <span className="text-green-400 font-bold">✅ PASSED (Human)</span>
                </div>
              </div>
            </div>

            {/* Bento 2: Geo Targeting (1 col) */}
            <div className="group p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col justify-between hover:border-blue-500/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Precision Geo Routing</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-relaxed mb-6">
                  Route US visitors to high-payout Offer A, UK to Offer B, and fallback international traffic automatically.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300">🇺🇸 US → Offer A</span>
                <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300">🇬🇧 UK → Offer B</span>
                <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300">🌍 Global → Landed</span>
              </div>
            </div>

            {/* Bento 3: A/B Testing Auto Optimization (1 col) */}
            <div className="group p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col justify-between hover:border-yellow-500/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Statistical A/B Testing</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-relaxed mb-6">
                  Split traffic dynamically between up to 5 landers. Auto-shift weight to the statistical winner.
                </p>
              </div>
              <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs font-bold">
                <div className="flex justify-between text-gray-500">
                  <span>Variant A (Winner)</span>
                  <span className="text-green-500">68% traffic</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full w-[68%]"></div>
                </div>
              </div>
            </div>

            {/* Bento 4: Pixel Protection & Retargeting (Spans 2 cols) */}
            <div className="md:col-span-2 group p-8 sm:p-10 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-8 hover:border-purple-500/40 transition-colors">
              <div className="max-w-md">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                  <MousePointerClick className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Clean Retargeting Pixel Guard</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-relaxed">
                  Fire Meta, Google, TikTok, and Twitter pixels only after human verification. Prevent bot fires from corrupting lookalike audience models.
                </p>
              </div>
              <div className="w-full sm:w-64 bg-slate-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pixel Sync Status</div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span>Meta Pixel</span>
                  <span className="text-green-500">Verified Fire</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span>Google Ads Conversion</span>
                  <span className="text-green-500">Verified Fire</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span>TikTok Pixel</span>
                  <span className="text-green-500">Verified Fire</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 3. ROI Calculator + Section */}
      <section id="roi" className="py-32 bg-slate-50 dark:bg-gray-950 relative border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
                Your budget is bleeding. <br/><span className="text-red-500">Stop the bleeding.</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 font-medium leading-relaxed">
                If you are running paid ads without protection, click-fraud is eating your budget. Our Ad-Fraud Shield detects and blocks datacenter and VPN traffic instantly.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Block AWS, Google Cloud, DigitalOcean IPs",
                  "Prevent Competitor Scrapers from exhausting budget",
                  "Keep Pixel Data 100% pure for lookalike audiences"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-gray-900 dark:text-gray-300">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <ROICalculator />
            
          </div>
        </div>
      </section>

      {/* 5. Comparison Section — جديد */}
      <section id="compare" className="py-32 bg-slate-50 dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Why Serious Marketers Switch to Smart Link</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">One platform. Zero excuses.</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <th className="p-6 text-lg font-bold text-gray-900 dark:text-white">Feature</th>
                    <th className="p-6 text-lg font-bold text-gray-500 text-center border-l border-gray-200 dark:border-gray-800">ClickMagick</th>
                    <th className="p-6 text-lg font-bold text-gray-500 text-center border-l border-gray-200 dark:border-gray-800">Voluum</th>
                    <th className="p-6 text-xl font-black text-blue-600 dark:text-blue-400 text-center border-l-2 border-blue-500 bg-blue-50 dark:bg-blue-900/10">Smart Link</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300 font-medium">
                  {[
                    { name: 'Bot Protection', cm: '✅', vol: '✅', sl: '✅' },
                    { name: 'Geo Targeting', cm: '✅', vol: '✅', sl: '✅' },
                    { name: 'A/B Testing', cm: '✅', vol: '✅', sl: '✅' },
                    { name: 'Bio Pages', cm: '❌', vol: '❌', sl: '✅' },
                    { name: 'Creator Monetize', cm: '❌', vol: '❌', sl: '✅' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-200 dark:border-gray-800/50">
                      <td className="p-6">{row.name}</td>
                      <td className="p-6 text-center text-xl border-l border-gray-200 dark:border-gray-800">{row.cm}</td>
                      <td className="p-6 text-center text-xl border-l border-gray-200 dark:border-gray-800">{row.vol}</td>
                      <td className="p-6 text-center text-xl border-l-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/5">{row.sl}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <td className="p-6 font-black text-gray-900 dark:text-white">Starting Price</td>
                    <td className="p-6 text-center font-bold text-gray-500 border-l border-gray-200 dark:border-gray-800">$99/mo</td>
                    <td className="p-6 text-center font-bold text-gray-500 border-l border-gray-200 dark:border-gray-800">$149/mo</td>
                    <td className="p-6 text-center font-black text-2xl text-blue-600 dark:text-blue-400 border-l-2 border-blue-500 bg-blue-50 dark:bg-blue-900/10">$29/mo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials — معاد كتابتها */}
      <section className="py-24 bg-slate-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
             {[
              { quote: "Tested SmartLink today, quick honest review. Setup was simple, the dashboard is clean, and everythin...", author: "Karl Beismann", role: "@karlbeis", link: "https://x.com/karlbeis" },
              { quote: "Makes sharing one link for multiple destinations feel easy and tidy, that’s useful for campaigns or social bios.", author: "Vineer", role: "@vineerpasam", link: "https://x.com/vineerpasam" },
              { quote: "It's a solid tool for creators and businesses who want real data instead of guesses. Clean dashboard and real-time link tracking. Good for link-in-bio pages and short links.", author: "Chandan H", role: "@_Chandan_17", link: "https://x.com/_Chandan_17" }
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 text-left hover:shadow-xl transition-shadow flex flex-col">
                <div className="flex gap-1 mb-6 text-yellow-500">{[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}</div>
                <p className="text-lg text-gray-800 dark:text-gray-200 mb-8 font-bold leading-relaxed flex-1">"{t.quote}"</p>
                <div>
                  <p className="font-black text-gray-900 dark:text-white text-sm">{t.author}</p>
                  <a href={t.link} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline tracking-wider uppercase">{t.role}</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 bg-slate-50 dark:bg-gray-950 relative border-t border-gray-200 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-6">Simple, Scalable Pricing.</h2>
            <div className="flex items-center justify-center p-1.5 bg-gray-200/50 dark:bg-gray-800/50 rounded-full mx-auto w-fit mt-8 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  !isYearly 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                  isYearly 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Yearly <span className={isYearly ? 'text-blue-600 dark:text-blue-400' : 'text-blue-500 dark:text-blue-500'}>· Save 25%</span>
              </button>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div key={plan.id} className={`relative p-10 rounded-[2.5rem] flex flex-col ${plan.id === 'business' ? 'bg-gray-900 dark:bg-gray-800 text-white shadow-2xl scale-100 lg:scale-105 z-10 border border-gray-800 dark:border-gray-700' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800'}`}>
                {plan.id === 'business' && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">The Ultimate Choice</div>}
                
                <h3 className={`text-2xl font-black mb-2 uppercase ${plan.id !== 'business' && 'text-gray-900 dark:text-white'}`}>{plan.name}</h3>
                <p className={`text-sm font-medium mb-8 ${plan.id === 'business' ? 'text-gray-400' : 'text-gray-500'}`}>{plan.description}</p>
                
                <div className="mb-8 flex items-end gap-1">
                  <span className={`text-5xl font-black tracking-tighter ${plan.id !== 'business' && 'text-gray-900 dark:text-white'}`}>{isYearly ? plan.price.yearly : plan.price.monthly}</span>
                  <span className={`font-bold pb-1 ${plan.id === 'business' ? 'text-gray-400' : 'text-gray-500'}`}>/mo</span>
                </div>
                
                <ul className="space-y-5 mb-10 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.id === 'business' ? 'text-blue-400' : 'text-gray-900 dark:text-white'}`} />
                      <span className={`text-sm font-medium ${plan.id === 'business' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                
                <button onClick={() => handleCheckout(plan, isYearly)} className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${plan.id === 'business' ? 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25' : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* 8. Final CTA — جديد */}
      <section className="py-32 bg-slate-50 dark:bg-gray-950 relative overflow-hidden border-t border-gray-200 dark:border-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gray-900 dark:bg-black rounded-[3rem] p-12 sm:p-20 text-center border border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 tracking-tight leading-[1.1]">
                Your competitors already know where their traffic converts. <br className="hidden sm:block" />
                <span className="text-blue-400">Do you?</span>
              </h2>
              <Link to="/register">
                <button className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 rounded-full font-black text-xl sm:text-2xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                  Find Out Free — No Card Needed &rarr;
                </button>
              </Link>
              <div className="mt-10 inline-block bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Replaces</p>
                <p className="text-base sm:text-lg text-white font-bold">ClickMagick ($99) + Voluum ($149) + Linktree Pro ($24)</p>
                <p className="text-green-400 font-black text-xl sm:text-2xl mt-2">= $272/mo saved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-gray-950 pt-16 pb-8 border-t border-gray-200 dark:border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <img src="/logo-v1.svg" alt="Smart Link" className="w-10 h-10" />
                <span className="text-2xl font-black text-gray-900 dark:text-white">Smart Link</span>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm font-medium">The ultimate tracking infrastructure for Media Buyers & Affiliates. Block bots, route traffic, maximize ROI.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                <li><Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link></li>
                <li><a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Solutions</h3>
              <ul className="space-y-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                <li><Link to="/for-marketers" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">For Marketers</Link></li>
                <li><Link to="/for-affiliates" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">For Affiliates</Link></li>
                <li><a href="https://smart-link-api.lemonsqueezy.com/affiliates" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 dark:hover:text-green-400 transition-colors text-green-600 dark:text-green-400 font-bold">Earn Money (Affiliates)</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Free Tools</h3>
              <ul className="space-y-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                <li><Link to="/tools" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold text-blue-600 dark:text-blue-400">All Free Tools</Link></li>
                <li><Link to="/tools/qr-code-generator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">QR Code Generator</Link></li>
                <li><Link to="/tools/utm-builder" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">UTM Builder</Link></li>
                <li><Link to="/tools/meta-tag-generator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Meta Tag Generator</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Resources</h3>
              <ul className="space-y-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                <li><Link to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold text-blue-600 dark:text-blue-400">📝 Blog</Link></li>
                <li><a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</a></li>
                <li><a href="mailto:support@by-smartlink.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                <li><Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-bold text-gray-500">© 2026 Smart Link. Engineered for ROI.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.uneed.best/tool/smart-link" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                <img src="https://www.uneed.best/EMBED3.png" alt="Uneed Embed Badge" className="h-8" />
              </a>
              <a href="https://pitchwall.co/product/by-smartlink?utm_source=badge" style={{display: "inline-flex"}} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                <img src="https://pitchwall.co/images/listed/pitchwall-light.png" width="180" height="60" alt="Listed on PitchWall" className="h-8 w-auto" />
              </a>
              <a href="https://peerpush.com/p/smart-link-clbl" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <img src="https://peerpush.com/p/smart-link-clbl/badge.png" alt="Smart Link on PeerPush" className="h-8 w-auto" />
              </a>
              <a href="https://startupbase.io/products/smart-link?utm_source=startupbase&utm_medium=badge&utm_campaign=launch-badge-dark" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <img src="https://statics.startupbase.io/site/badges/launched-on-sb-dark.svg" alt="Launched on StartupBase" className="h-8 w-auto" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}