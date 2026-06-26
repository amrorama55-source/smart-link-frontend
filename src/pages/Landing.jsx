import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PLANS } from '../utils/plans';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Shield, Zap, Target, Globe, BarChart3, ChevronRight, CheckCircle, 
  Menu, X, Moon, Sun, ArrowRight, MousePointerClick, TrendingUp, AlertTriangle,
  Link2, Layout, Star, Clock, Lock
} from 'lucide-react';
import SEO from '../components/SEO';
import VideoDemo from '../components/VideoDemo';

// Creative Organic Shape Component
const OrganicShape = ({ className, color }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill={color} d="M42.7,-62.9C54.4,-53.8,62.4,-39.9,68.1,-25.1C73.8,-10.3,77.2,5.5,74.1,20.4C71,35.3,61.4,49.2,48.5,58.3C35.6,67.4,19.3,71.7,2.8,67.8C-13.7,63.9,-30.4,51.8,-43.3,40.1C-56.2,28.4,-65.4,17.1,-69.1,3.4C-72.8,-10.3,-71.1,-26.4,-62.4,-39.2C-53.7,-52,-38,-61.5,-23.4,-65.8C-8.8,-70.1,4.7,-69.2,18.5,-66.1C32.3,-63.1,46.3,-58.1,42.7,-62.9Z" transform="translate(100 100)" />
  </svg>
);

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
    { q: "How do I start tracking?", a: "Simply sign up, paste your URLs, and generate your links. The dashboard will instantly start populating with deep analytics." }
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
        title="Smart Link — Built for Affiliate Marketers & Media Buyers"
        description="Stop wasting money on bots. Route traffic accurately, A/B test landing pages, and shield your ROI with the ultimate tracking infrastructure."
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
              <button onClick={toggleDarkMode} className="p-2 text-gray-500">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-900 dark:text-white p-2">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
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
              <Target className="w-4 h-4" /> Built for Affiliate Marketers & Media Buyers
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.05] tracking-tight mb-8">
              Your Traffic Is Leaking Money.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                We Show You Where.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
              The average affiliate loses 34% of their budget to bot traffic, wrong GEOs, and blind clicks. Smart Link shows you exactly what's happening — and fixes it in one click.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <button className="w-full sm:w-auto px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3">
                  Protect My Traffic Free <ArrowRight className="w-6 h-6" />
                </button>
              </Link>
            </div>
            <p className="mt-6 text-sm font-bold text-gray-500 mb-16">Replacing ClickMagick + Voluum + Linktree for serious marketers</p>
            
            <div className="relative hidden sm:block">
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

      {/* 4. Features Section — معاد ترتيبها */}
      <section id="features" className="py-32 bg-slate-50 dark:bg-gray-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-6">Built For Performance.</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Bot Protection", desc: "We blocked $2.3M in fake clicks last month. Stop paying for datacenter and VPN traffic.", icon: Shield, color: "text-red-500", bg: "bg-red-500/10" },
              { title: "Geo Targeting", desc: "Send US traffic to Offer A, EU traffic to Offer B. One link. Zero waste.", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
              { title: "Deep Analytics", desc: "Not just clicks. Real intelligence on OS, browsers, and referrers.", icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10" },
              { title: "A/B Testing", desc: "Let data pick your winner. Not your gut. Auto-route traffic to the highest converting page.", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
              { title: "Pixel Protection", desc: "Your Meta Pixel is being stolen by bot fires. We stop it and only fire on verified humans.", icon: MousePointerClick, color: "text-pink-500", bg: "bg-pink-500/10" },
              { title: "Bio Pages", desc: "For creators who monetize their audience. Drag & drop landing pages in seconds.", icon: Layout, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            ].map((f, i) => (
              <div key={i} className="group p-8 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6`}>
                  <f.icon className={`w-7 h-7 ${f.color}`} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
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
                    <td className="p-6 text-center font-black text-2xl text-green-500 border-l-2 border-blue-500 bg-blue-50 dark:bg-blue-900/10">FREE</td>
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
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
              <a href="https://fazier.com/launches/www.by-smartlink.com" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                <img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light" width="120" alt="Fazier badge" className="h-8 w-auto" />
              </a>
              <a href="https://peerpush.com/p/smart-link-clbl" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <img src="https://peerpush.com/p/smart-link-clbl/badge.png" alt="Smart Link on PeerPush" className="h-8 w-auto" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}