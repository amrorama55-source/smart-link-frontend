import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SEO from '../components/SEO';
import {
  Shield, Zap, Target, Globe, Lock,
  TrendingUp, ArrowRight, CheckCircle, X, Check,
  Menu, Moon, Sun, Link2, Star, ChevronDown,
  MousePointerClick,
} from 'lucide-react';

const painPoints = [
  { emoji: '??', text: 'Paying $89+/mo for Voluum but only using 20% of features?' },
  { emoji: '??', text: 'Bot traffic eating your budget and polluting your conversion data?' },
  { emoji: '??', text: 'Affiliate networks delaying click reports by hours or even days?' },
  { emoji: '??', text: 'Ugly affiliate URLs with ?aff_id=xyz123 killing your CTR?' },
];

const features = [
  { icon: Shield, title: 'Auto-Shield Bot Protection', description: 'Automatically block VPN, datacenter, and botnet clicks. Keep your data 100% clean so you optimize on real humans only.', stat: '34% avg bots blocked', color: 'red' },
  { icon: Globe, title: 'Geo & Device Targeting', description: 'Route US clicks to US offers, UK clicks to UK offers. Set rules by country, city, OS, or language to maximize your EPC.', stat: 'Country, City & ISP level', color: 'blue' },
  { icon: TrendingUp, title: 'Real-Time Click Intelligence', description: 'See every click the second it happens. No delayed network reports. Kill bad traffic sources before you blow your budget.', stat: '< 1 second latency', color: 'green' },
  { icon: Zap, title: 'A/B Split Testing', description: 'Send 50% to offer A, 50% to offer B. Track conversions automatically and find the winner without touching code.', stat: 'Unlimited variants', color: 'yellow' },
  { icon: Lock, title: 'Link Cloaking & Protection', description: 'Turn ugly affiliate URLs into clean, branded links. Protect your commission source and increase CTR by up to 35%.', stat: 'Up to 35% higher CTR', color: 'purple' },
  { icon: Target, title: 'Retargeting Pixels', description: 'Fire Facebook, Google, and TikTok pixels directly from your short links. Build warm audiences without touching your LP.', stat: 'FB, Google, TikTok, Bing', color: 'orange' },
];

const comparison = [
  { feature: 'Monthly Price', smartlink: '$9/mo', voluum: '$89/mo', redtrack: '$49/mo' },
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

const testimonials = [
  { name: 'Marcus T.', role: 'Media Buyer — ClickBank', initials: 'MT', text: 'Switched from Voluum 3 months ago. Same features, $80/mo savings. The bot shield alone saved my conversion data from being completely trashed.', stars: 5 },
  { name: 'Sara K.', role: 'Affiliate @ MaxBounty', initials: 'SK', text: 'The geo-targeting is insane. I set it up in 5 minutes to route by country and my EPC jumped 40% overnight.', stars: 5 },
  { name: 'James R.', role: 'Solo Affiliate Marketer', initials: 'JR', text: 'Real-time click data is a game changer. I killed a bad traffic source in 20 minutes instead of waiting days for the network report.', stars: 5 },
];

const faqs = [
  { q: 'How is Smart Link different from Voluum?', a: "Same core features (geo-targeting, A/B testing, bot protection, custom domains) at 90% of the cost. We also include link cloaking and retargeting pixels which Voluum doesn't offer at any price tier." },
  { q: 'Does it work with ClickBank, MaxBounty, CJ, and other networks?', a: 'Yes. Smart Link works with any affiliate network. Just create a smart link to your affiliate URL and start tracking. Sub-ID and postback tracking available on Agency Elite plan.' },
  { q: 'How does the bot protection work?', a: 'Our Auto-Shield detects and blocks clicks from VPNs, datacenters (AWS, DigitalOcean), and known botnets in real-time. Your analytics will only show real human engagement.' },
  { q: 'Can I use my own branded domain?', a: 'Yes! Connect your own domain (e.g., go.yourbrand.com) on Pro and Agency Elite plans to maintain full brand consistency and increase trust.' },
  { q: 'Is there a free plan?', a: "Yes. Our Starter plan is free forever with 5 smart links/month. No credit card required. Upgrade when you're ready to scale." },
];

const colorMap = {
  red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', icon: 'text-red-400' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: 'text-blue-400' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', icon: 'text-green-400' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', icon: 'text-yellow-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', icon: 'text-purple-400' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', icon: 'text-orange-400' },
};

export default function AffiliatesLanding() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { y: 24, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

  return (
    <div className="min-h-screen bg-[#080810] text-white font-sans overflow-x-hidden">
      <SEO
        title="Smart Link for Affiliate Marketers — $9/mo vs Voluum $89/mo"
        description="Geo-targeting, A/B testing, bot protection, and link cloaking at 90% less than Voluum. Built for affiliate marketers who want more for less."
      />

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#080810]/90 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-white text-lg tracking-tight">Smart Link</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#compare" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">vs Voluum</a>
            <a href="#testimonials" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">Reviews</a>
            <Link to="/pricing" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode} className="p-2 rounded-xl text-gray-400 hover:text-white transition-colors">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to={user ? '/dashboard' : '/register'}>
              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-black hover:opacity-90 transition-all shadow-lg shadow-blue-600/30">
                {user ? 'Dashboard' : 'Start Free ?'}
              </button>
            </Link>
            <button className="md:hidden p-2 text-gray-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#080810] border-t border-white/10 px-4 py-4 flex flex-col gap-4">
            <a href="#features" className="text-sm font-semibold text-gray-300" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#compare" className="text-sm font-semibold text-gray-300" onClick={() => setMobileMenuOpen(false)}>vs Voluum</a>
            <a href="#testimonials" className="text-sm font-semibold text-gray-300" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
            <Link to="/pricing" className="text-sm font-semibold text-gray-300" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 sm:px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
        <motion.div variants={container} initial="hidden" animate="visible" className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div variants={item} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <MousePointerClick className="w-3.5 h-3.5" />
              For Affiliate Marketers
            </span>
          </motion.div>
          <motion.h1 variants={item} className="text-5xl sm:text-7xl font-black leading-tight tracking-tight mb-6">
            <span className="text-white">The Tracker That</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Doesn't Rob You</span>
          </motion.h1>
          <motion.p variants={item} className="text-xl sm:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-4">
            Geo-targeting, A/B testing, bot protection, link cloaking, retargeting pixels.
          </motion.p>
          <motion.p variants={item} className="text-lg text-gray-500 mb-10">
            <span className="text-red-400 font-bold line-through">Voluum: $89/mo</span>
            {' '}&nbsp;?&nbsp;{' '}
            <span className="text-green-400 font-black text-xl">Smart Link: $9/mo</span>
          </motion.p>
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2">
                Start Tracking Free <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/pricing">
              <button className="px-8 py-4 bg-white/5 border border-white/15 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">See Pricing ?</button>
            </Link>
          </motion.div>
          <motion.p variants={item} className="mt-4 text-xs text-gray-600">No credit card required • Free forever plan • Setup in 60 seconds</motion.p>
          <motion.div variants={item} className="mt-16 flex flex-wrap justify-center gap-6">
            {[{ label: 'Affiliates Tracking', value: '2,400+' }, { label: 'Clicks Analyzed', value: '180M+' }, { label: 'Bots Blocked', value: '34%' }, { label: 'Saved vs Voluum', value: '$80/mo' }].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* PAIN POINTS */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-white mb-2">Sound Familiar?</h2>
            <p className="text-gray-500">These are the real problems affiliates face every day.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {painPoints.map((pain, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4 p-5 rounded-2xl border border-red-500/10 bg-red-500/5">
                <span className="text-2xl flex-shrink-0">{pain.emoji}</span>
                <p className="text-gray-300 font-semibold text-sm leading-relaxed">{pain.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-green-400 font-black text-lg">Smart Link fixes all of this. For $9/mo. ?</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-4 sm:px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">Everything You Need</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Built for Affiliates.<br />Not Enterprises.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Every feature is designed around how affiliate marketers actually work — not how Fortune 500 companies do.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const c = colorMap[feat.color];
              const Icon = feat.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-6 rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all group">
                  <div className={`w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${c.icon}`} />
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{feat.description}</p>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${c.bg} ${c.text} border ${c.border}`}>
                    <CheckCircle className="w-3 h-3" />
                    {feat.stat}
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
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20 mb-4">Side-by-Side</span>
            <h2 className="text-4xl font-black text-white mb-3">Smart Link vs Voluum vs RedTrack</h2>
            <p className="text-gray-400 text-lg">Same power. 90% less cost. Plus features they don't even offer.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-5 text-left text-sm font-bold text-gray-400 bg-white/5 min-w-[160px]">Feature</th>
                  <th className="p-5 text-center bg-blue-600/20 border-x border-blue-500/30 min-w-[140px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-blue-400 font-black">Smart Link</span>
                      <span className="text-white font-black text-xl">$9<span className="text-xs font-normal text-gray-400">/mo</span></span>
                      <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">BEST VALUE</span>
                    </div>
                  </th>
                  <th className="p-5 text-center bg-white/5 min-w-[130px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-gray-400 font-bold">Voluum</span>
                      <span className="text-gray-300 font-black text-xl">$89<span className="text-xs font-normal text-gray-500">/mo</span></span>
                    </div>
                  </th>
                  <th className="p-5 text-center bg-white/5 min-w-[130px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-gray-400 font-bold">RedTrack</span>
                      <span className="text-gray-300 font-black text-xl">$49<span className="text-xs font-normal text-gray-500">/mo</span></span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="p-4 text-sm font-semibold text-gray-300">{row.feature}</td>
                    <td className="p-4 text-center bg-blue-600/[0.07] border-x border-blue-500/10">
                      {typeof row.smartlink === 'boolean' ? (row.smartlink ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />) : <span className="font-black text-blue-400">{row.smartlink}</span>}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.voluum === 'boolean' ? (row.voluum ? <Check className="w-5 h-5 text-gray-500 mx-auto" /> : <X className="w-5 h-5 text-red-400/40 mx-auto" />) : <span className="font-bold text-gray-400">{row.voluum}</span>}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.redtrack === 'boolean' ? (row.redtrack ? <Check className="w-5 h-5 text-gray-500 mx-auto" /> : <X className="w-5 h-5 text-red-400/40 mx-auto" />) : <span className="font-bold text-gray-400">{row.redtrack}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 text-center">
            <Link to="/register">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-blue-600/30">
                Switch to Smart Link — Save $80/mo ?
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-3">Affiliates Are Switching</h2>
            <p className="text-gray-400">Real results from real affiliate marketers.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-3xl border border-white/10 bg-white/[0.03] flex flex-col gap-4">
                <div className="flex gap-1">
                  {[...Array(t.stars)].map((_, s) => (<Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-black text-white">{t.initials}</div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-3">Affiliate Questions, Answered</h2>
            <p className="text-gray-400">Everything you need to know before switching.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left gap-4">
                  <span className="font-bold text-white text-base">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <p className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/10 pt-4">{faq.a}</p>
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
          <h2 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Stop Overpaying.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Start Winning.</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10">Join 2,400+ affiliates who ditched overpriced trackers and kept the $80/mo for ad spend.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-xl hover:opacity-90 transition-all shadow-2xl shadow-blue-600/40 flex items-center gap-3">
                Start Free — No Credit Card <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
            <Link to="/pricing">
              <button className="px-10 py-5 bg-white/5 border border-white/15 text-white rounded-2xl font-bold text-xl hover:bg-white/10 transition-all">View Pricing</button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-600">Pro Affiliate plan from $9/mo • Agency Elite from $19/mo</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Link2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white">Smart Link</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
          <p className="text-xs text-gray-600">© 2025 Smart Link. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
