import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SEO from '../components/SEO';
import {
  Shield, Zap, Target, Globe, Lock,
  TrendingUp, ArrowRight, CheckCircle, X, Check,
  Link2, ChevronDown, Sun, Moon,
  DollarSign, Bot, Clock, Link2Off,
} from 'lucide-react';

const painPoints = [
  { icon: DollarSign, text: 'Paying $149+/mo for Voluum but only using a fraction of features?' },
  { icon: Bot, text: 'Bot traffic eating your ad budget and polluting conversion data?' },
  { icon: Clock, text: 'Affiliate networks delaying click reports by hours or days?' },
  { icon: Link2Off, text: 'Ugly affiliate URLs destroying your click-through rates?' },
];

const features = [
  { 
    icon: Shield, 
    title: 'Auto-Shield Bot Protection', 
    description: 'Block VPN, datacenter, and botnet clicks automatically. Keep your conversion analytics clean so you optimize on real human traffic.', 
    stat: 'Datacenter & VPN Blocking', 
    color: 'red' 
  },
  { 
    icon: Globe, 
    title: 'Geo & Device Targeting', 
    description: 'Route US clicks to US offers, UK clicks to UK offers. Set rules by country, city, OS, or language to maximize your EPC.', 
    stat: 'Country & Device Level', 
    color: 'blue' 
  },
  { 
    icon: TrendingUp, 
    title: 'Real-Time Click Intelligence', 
    description: 'See every click the second it happens. No delayed network reports. Kill underperforming traffic sources instantly.', 
    stat: 'Instant Latency Routing', 
    color: 'green' 
  },
  { 
    icon: Zap, 
    title: 'A/B Split Testing', 
    description: 'Send 50% traffic to offer A, 50% to offer B. Track conversions automatically and scale the winner without touching code.', 
    stat: 'Automatic Variant Split', 
    color: 'yellow' 
  },
  { 
    icon: Lock, 
    title: 'Link Cloaking & Protection', 
    description: 'Turn long, ugly affiliate URLs into clean, branded links. Protect your commission sources and boost click-through rates.', 
    stat: 'Clean Branded Redirects', 
    color: 'purple' 
  },
  { 
    icon: Target, 
    title: 'Retargeting Pixels', 
    description: 'Fire Facebook, Google, and TikTok pixels directly from your short links. Build warm custom audiences effortlessly.', 
    stat: 'FB, Google & TikTok Support', 
    color: 'orange' 
  },
];

const comparison = [
  { feature: 'Monthly Price', smartlink: 'From $29/mo', voluum: '$149/mo', redtrack: '$149/mo' },
  { feature: 'Bot Protection', smartlink: true, voluum: true, redtrack: false },
  { feature: 'Link Cloaking', smartlink: true, voluum: false, redtrack: true },
  { feature: 'Retargeting Pixels', smartlink: true, voluum: false, redtrack: false },
  { feature: 'Bio Page Builder', smartlink: true, voluum: false, redtrack: false },
  { feature: 'Geo Targeting', smartlink: true, voluum: true, redtrack: true },
  { feature: 'A/B Testing', smartlink: true, voluum: true, redtrack: true },
  { feature: 'Language Routing', smartlink: true, voluum: false, redtrack: false },
  { feature: 'City-Level Targeting', smartlink: true, voluum: true, redtrack: false },
  { feature: 'Custom Domains', smartlink: true, voluum: true, redtrack: true },
];

const faqs = [
  {
    q: 'How is Smart Link different from Voluum or RedTrack?',
    a: 'Smart Link offers core tracking features (geo-targeting, A/B testing, bot protection, custom domains) starting at $29/mo instead of $149/mo. We also include link cloaking and bio pages built-in.'
  },
  {
    q: 'Does it work with networks like ClickBank, MaxBounty, and CJ?',
    a: 'Yes. Smart Link works with any affiliate network. Simply point your smart link to your offer URL and start routing and tracking.'
  },
  {
    q: 'How does the bot protection work?',
    a: 'Our Auto-Shield engine automatically identifies traffic coming from datacenters (AWS, DigitalOcean, Hetzner), known VPN proxies, and automated scrapers, keeping your analytics clean.'
  },
  {
    q: 'Can I use my own custom domain?',
    a: 'Yes, custom domain mapping is supported on paid plans (e.g. go.yourbrand.com).'
  },
  {
    q: 'Can I upgrade or cancel anytime?',
    a: 'Absolutely. You can change your plan or cancel subscription at any time directly from your account settings.'
  }
];

const colorMap = {
  red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-600 dark:text-red-400', icon: 'text-red-600 dark:text-red-400' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-600 dark:text-blue-400', icon: 'text-blue-600 dark:text-blue-400' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-600 dark:text-green-400', icon: 'text-green-600 dark:text-green-400' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-600 dark:text-yellow-400', icon: 'text-yellow-600 dark:text-yellow-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-600 dark:text-purple-400', icon: 'text-purple-600 dark:text-purple-400' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-600 dark:text-orange-400', icon: 'text-orange-600 dark:text-orange-400' },
};

export default function AffiliatesLanding() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-white font-sans transition-colors duration-300 overflow-x-hidden">
      <SEO
        title="Smart Link for Affiliate Marketers — $29/mo vs Voluum $149/mo"
        description="Geo-targeting, A/B testing, bot protection, and link cloaking for affiliate marketers."
      />

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 shadow-sm dark:shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-gray-900 dark:text-white text-lg tracking-tight">Smart Link</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#compare" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">vs Voluum</a>
            <Link to="/pricing" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to={user ? '/dashboard' : '/register'}>
              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-black hover:opacity-90 transition-all shadow-lg shadow-blue-600/30">
                {user ? 'Dashboard' : 'Get Started'}
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-4 sm:px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Target className="w-3.5 h-3.5" /> For Affiliate Marketers
            </span>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl font-black leading-tight tracking-tight mb-6">
            <span className="text-gray-900 dark:text-white">Smart Link Tracking</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Built for Real Marketers</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto mb-4">
            Geo-targeting, A/B split testing, bot protection, link cloaking, and retargeting pixels.
          </motion.p>
          <motion.p variants={itemVariants} className="text-lg text-gray-500 dark:text-gray-400 mb-10">
            <span className="text-red-500 dark:text-red-400 font-bold line-through">Voluum: $149/mo</span>
            {'  ·  '}
            <span className="text-green-600 dark:text-green-400 font-black text-xl">Smart Link: $29/mo</span>
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2">
                Start Tracking <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/pricing">
              <button className="px-8 py-4 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 text-gray-900 dark:text-white rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-white/10 shadow-sm dark:shadow-none transition-all">
                See Pricing
              </button>
            </Link>
          </motion.div>
          <motion.p variants={itemVariants} className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            No long-term commitments &bull; Transparent pricing &bull; Setup in 60 seconds
          </motion.p>
        </motion.div>
      </section>

      {/* PAIN POINTS */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Sound Familiar?</h2>
            <p className="text-gray-600 dark:text-gray-400">Common struggles affiliate marketers face daily.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {painPoints.map((item, i) => {
              const IconComp = item.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4 p-5 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30">

                  <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <p className="text-gray-800 dark:text-gray-300 font-semibold text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <p className="text-green-600 dark:text-green-400 font-black text-lg">Smart Link solves all of this. Starting at $29/mo.</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-4 sm:px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-4">Everything You Need</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">Built for Marketers,<br />Not Enterprise Bloat.</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">Every feature is designed around how affiliate campaigns actually run.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const c = colorMap[f.color];
              const Icon = f.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-500/40 transition-all shadow-md group">
                  <div className={`w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${c.icon}`} />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{f.description}</p>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${c.bg} ${c.text} border ${c.border}`}>
                    <CheckCircle className="w-3 h-3" />
                    {f.stat}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section id="compare" className="py-20 px-4 sm:px-6 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 mb-4">Side-by-Side</span>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3">Smart Link vs Voluum vs RedTrack</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Same essential power. Transparent pricing.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="p-5 text-left text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 min-w-[160px]">Feature</th>
                  <th className="p-5 text-center bg-blue-50 dark:bg-blue-950/40 border-x border-blue-200 dark:border-blue-900/50 min-w-[140px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-blue-600 dark:text-blue-400 font-black">Smart Link</span>
                      <span className="text-gray-900 dark:text-white font-black text-xl">$29<span className="text-xs font-normal text-gray-500 dark:text-gray-400">/mo</span></span>
                      <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">BEST VALUE</span>
                    </div>
                  </th>
                  <th className="p-5 text-center bg-gray-50 dark:bg-gray-950 min-w-[130px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-gray-700 dark:text-gray-300 font-bold">Voluum</span>
                      <span className="text-gray-900 dark:text-white font-black text-xl">$149<span className="text-xs font-normal text-gray-400">/mo</span></span>
                    </div>
                  </th>
                  <th className="p-5 text-center bg-gray-50 dark:bg-gray-950 min-w-[130px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-gray-700 dark:text-gray-300 font-bold">RedTrack</span>
                      <span className="text-gray-900 dark:text-white font-black text-xl">$149<span className="text-xs font-normal text-gray-400">/mo</span></span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-950/50'}`}>
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-gray-200">{row.feature}</td>
                    <td className="p-4 text-center bg-blue-50/50 dark:bg-blue-950/20 border-x border-blue-200 dark:border-blue-900/30">
                      {typeof row.smartlink === 'boolean' ? (row.smartlink ? <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-500 dark:text-red-400 mx-auto" />) : <span className="font-black text-blue-600 dark:text-blue-400">{row.smartlink}</span>}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.voluum === 'boolean' ? (row.voluum ? <Check className="w-5 h-5 text-gray-500 dark:text-gray-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />) : <span className="font-bold text-gray-700 dark:text-gray-300">{row.voluum}</span>}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.redtrack === 'boolean' ? (row.redtrack ? <Check className="w-5 h-5 text-gray-500 dark:text-gray-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />) : <span className="font-bold text-gray-700 dark:text-gray-300">{row.redtrack}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 text-center">
            <Link to="/register">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-blue-600/30">
                Switch to Smart Link &bull; Save up to $120/mo
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-600 dark:text-gray-300">Everything you need to know about Smart Link.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-colors shadow-sm">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left gap-4">
                  <span className="font-bold text-gray-900 dark:text-white text-base">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <p className="px-6 pb-6 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* FINAL CTA */}
      <section className="py-24 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Stop Overpaying.<br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Start Tracking Efficiently.</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">Take control of your affiliate links and keep your ad budget focused on real humans.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-xl hover:opacity-90 transition-all shadow-2xl shadow-blue-600/40 flex items-center gap-3">
                Get Started Now <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
            <Link to="/pricing">
              <button className="px-10 py-5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 text-gray-900 dark:text-white rounded-2xl font-bold text-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm dark:shadow-none">View Pricing</button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Starter plan from $29/mo &bull; Pro Affiliate from $79/mo</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 dark:border-white/10 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Link2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-900 dark:text-white">Smart Link</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link to="/pricing" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link>
            <Link to="/faq" className="hover:text-gray-900 dark:hover:text-white transition-colors">FAQ</Link>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-600">&copy; 2026 Smart Link. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
