import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PLANS } from '../utils/plans';
import Navbar from '../components/Navbar';
import { 
  CheckCircle, ArrowRight, Zap, Sparkles, Rocket, ShieldCheck, 
  Crown, Globe, X, Check, Calculator, TrendingDown, Star,
  Lock, RefreshCw, Headphones, ChevronDown
} from 'lucide-react';
import { useToast } from '../context/ToastProvider';
import { useAuth } from '../context/AuthContext';

const SUCCESS_URL = 'https://www.by-smartlink.com/success';

function buildCheckoutUrl(baseUrl, userId) {
    if (!baseUrl) return null;
    const url = new URL(baseUrl);
    if (userId) url.searchParams.set('checkout[custom][user_id]', userId);
    url.searchParams.set('checkout[success_url]', SUCCESS_URL);
    return url.toString();
}

// ============================================================
// Competitor Comparison Table
// ============================================================
const comparisonFeatures = [
  { feature: 'Monthly Price', smartlink: '$79', voluum: '$89', redtrack: '$149' },
  { feature: 'Unlimited Links', smartlink: true, voluum: true, redtrack: true },
  { feature: 'Geo Targeting', smartlink: true, voluum: true, redtrack: true },
  { feature: 'A/B Testing', smartlink: true, voluum: true, redtrack: true },
  { feature: 'Bot Protection', smartlink: true, voluum: true, redtrack: false },
  { feature: 'Custom Domains', smartlink: true, voluum: true, redtrack: true },
  { feature: 'Retargeting Pixels', smartlink: true, voluum: false, redtrack: false },
  { feature: 'Link Cloaking', smartlink: true, voluum: false, redtrack: true },
  { feature: 'Bio Page Builder', smartlink: true, voluum: false, redtrack: false },
  { feature: 'Sub-ID Tracking', smartlink: true, voluum: true, redtrack: true },
  { feature: 'Language Routing', smartlink: true, voluum: false, redtrack: false },
  { feature: 'City-Level Targeting', smartlink: true, voluum: true, redtrack: false },
];

function ComparisonTable() {
  return (
    <section className="mt-24 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 mb-4">
          Side-by-Side Comparison
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
          Why Affiliates Are Switching to Smart Link
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Same power. Fraction of the cost.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 shadow-lg dark:shadow-none">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="p-5 text-left text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 min-w-[180px]">Feature</th>
              <th className="p-5 text-center bg-blue-600/10 dark:bg-blue-600/20 border-x border-blue-500/30 min-w-[140px]">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-blue-600 dark:text-blue-400 font-black text-lg">Smart Link</span>
                  <span className="text-gray-900 dark:text-white font-black text-2xl">$29<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/mo</span></span>
                  <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">BEST VALUE</span>
                </div>
              </th>
              <th className="p-5 text-center bg-gray-50 dark:bg-gray-800/60 min-w-[140px]">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-400 font-bold text-lg">Voluum</span>
                  <span className="text-gray-700 dark:text-gray-300 font-black text-2xl">$89<span className="text-sm font-normal text-gray-500">/mo</span></span>
                </div>
              </th>
              <th className="p-5 text-center bg-gray-50 dark:bg-gray-800/60 min-w-[140px]">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-400 font-bold text-lg">RedTrack</span>
                  <span className="text-gray-700 dark:text-gray-300 font-black text-2xl">$149<span className="text-sm font-normal text-gray-500">/mo</span></span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonFeatures.map((row, i) => (
              <tr key={i} className={`border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40 ${i % 2 === 0 ? 'bg-transparent' : 'bg-gray-50/50 dark:bg-gray-800/20'}`}>
                <td className="p-4 text-sm font-semibold text-gray-800 dark:text-gray-300">{row.feature}</td>
                <td className="p-4 text-center bg-blue-600/[0.04] dark:bg-blue-600/10 border-x border-blue-500/20">
                  {typeof row.smartlink === 'boolean' ? (
                    row.smartlink 
                      ? <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                      : <X className="w-5 h-5 text-red-500 dark:text-red-400 mx-auto" />
                  ) : <span className="font-black text-blue-600 dark:text-blue-400 text-lg">{row.smartlink}</span>}
                </td>
                <td className="p-4 text-center">
                  {typeof row.voluum === 'boolean' ? (
                    row.voluum 
                      ? <Check className="w-5 h-5 text-gray-400 mx-auto" />
                      : <X className="w-5 h-5 text-red-400/50 mx-auto" />
                  ) : <span className="font-black text-gray-700 dark:text-gray-300 text-lg">{row.voluum}</span>}
                </td>
                <td className="p-4 text-center">
                  {typeof row.redtrack === 'boolean' ? (
                    row.redtrack 
                      ? <Check className="w-5 h-5 text-gray-400 mx-auto" />
                      : <X className="w-5 h-5 text-red-400/50 mx-auto" />
                  ) : <span className="font-black text-gray-700 dark:text-gray-300 text-lg">{row.redtrack}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ============================================================
// ROI Calculator
// ============================================================
function SwitchROICalculator() {
  const [currentSpend, setCurrentSpend] = useState(149);
  const smartlinkCost = 29;
  const monthlySaving = currentSpend - smartlinkCost;
  const yearlySaving = monthlySaving * 12;

  return (
    <section className="mt-24 max-w-3xl mx-auto">
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-8 sm:p-10 shadow-xl dark:shadow-none backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Switch & Save Calculator</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-8 ml-[52px]">See how much you'll save by ditching your current tracker.</p>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-3">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">What you currently pay / month</label>
              <span className="text-xl font-black text-gray-900 dark:text-white">${currentSpend}/mo</span>
            </div>
            <input 
              type="range" 
              min="29" max="500" step="1" 
              value={currentSpend} 
              onChange={(e) => setCurrentSpend(Number(e.target.value))} 
              className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full appearance-none cursor-pointer accent-blue-500" 
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$29</span><span>$500+</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wider mb-1">You pay now</p>
              <p className="text-2xl font-black text-red-500 dark:text-red-400">${currentSpend}</p>
              <p className="text-xs text-gray-500">per month</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Smart Link</p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">$29</p>
              <p className="text-xs text-gray-500">per month</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">You save</p>
              <p className="text-2xl font-black text-green-600 dark:text-green-400">${yearlySaving}</p>
              <p className="text-xs text-gray-500">per year</p>
            </div>
          </div>

          {monthlySaving > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5 text-center"
            >
              <p className="text-green-700 dark:text-green-300 font-bold text-lg">
                By switching to Smart Link, you'll save <span className="text-gray-900 dark:text-white font-black">${yearlySaving.toLocaleString()}</span> this year
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">That's money you can put back into ad spend to scale your campaigns 🚀</p>
            </motion.div>
          )}

          <Link to="/register">
            <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-black text-lg transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
              Start Saving ${yearlySaving.toLocaleString()}/year — Join Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Pricing Card
// ============================================================
const PricingCard = ({ plan, isYearly, handleCheckout, index }) => {
    const isPro = plan.id === 'pro';
    const savings = plan.id === 'pro' ? 80 : plan.id === 'business' ? 70 : null;

    return (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative flex flex-col rounded-3xl border transition-all duration-300 ${
            isPro 
              ? 'bg-blue-600/5 dark:bg-blue-600/10 border-blue-500/40 shadow-2xl shadow-blue-500/20 scale-105' 
              : 'bg-white dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-none hover:border-gray-300 dark:hover:border-gray-700'
          }`}
        >
          {isPro && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg whitespace-nowrap">
                ⭐ Most Popular
              </span>
            </div>
          )}

          <div className="p-8 flex flex-col h-full">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{plan.description}</p>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-gray-900 dark:text-white">
                  {isYearly ? plan.price.yearly : plan.price.monthly}
                </span>
                {plan.price.monthly !== '$0' && (
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">/ month</span>
                )}
              </div>
              {isYearly && plan.price.monthly !== '$0' && (
                <p className="text-xs font-bold text-green-600 dark:text-green-400 mt-1">Billed annually — Save 15%</p>
              )}
              {savings && (
                <div className="mt-3 inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                  <TrendingDown className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">${savings}/mo cheaper than Voluum</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={() => handleCheckout(plan, isYearly)}
              className={`w-full py-4 rounded-xl font-black text-base transition-all flex items-center justify-center gap-2 mb-6 ${
                isPro
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30'
                  : 'bg-gray-900 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700 border border-gray-800 dark:border-gray-700'
              }`}
            >
              {plan.id === 'free' ? 'Get Started Free' : plan.cta}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="h-px bg-gray-200 dark:bg-gray-800 w-full mb-6" />

            {/* Features */}
            <ul className="space-y-3 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isPro ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
    );
};

// ============================================================
// FAQ
// ============================================================
const affiliateFAQs = [
  {
    q: 'How is Smart Link different from Voluum or RedTrack?',
    a: "Smart Link offers core tracking features (geo-targeting, A/B testing, bot protection, custom domains) at a fraction of the cost. Starting at $29/mo vs $89/mo for Voluum, you get identical power without the enterprise price tag. We also include link cloaking and a bio page builder — features Voluum doesn't offer."
  },
  {
    q: 'Does it work with affiliate networks like ClickBank, MaxBounty, CJ?',
    a: 'Yes. You can use Smart Link with any affiliate network. Simply create a smart link pointing to your affiliate offer, set up your targeting rules, and start tracking. Sub-ID and postback tracking are supported on the Agency Elite plan.'
  },
  {
    q: 'How does the bot protection work?',
    a: 'Our Auto-Shield automatically detects and blocks clicks from VPNs, datacenters (AWS, DigitalOcean, etc.), and known botnets. This keeps your conversion data clean and prevents you from paying for fake traffic.'
  },
  {
    q: 'Can I cloak my affiliate links?',
    a: 'Yes. Link cloaking is available on all plans. Your links will look like yourname.com/offer instead of ugly affiliate URLs with tracking parameters, which significantly increases click-through rates.'
  },
  {
    q: 'Is there a free trial?',
    a: "Yes! The Starter plan comes with a 14-day free trial — no credit card required. You get full access to all Starter features. Upgrade to Pro Affiliate or Agency Elite anytime when you're ready to scale."
  },
];

function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <section className="mt-24 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Affiliate Questions, Answered</h2>
        <p className="text-gray-600 dark:text-gray-400">Everything you need to know before switching.</p>
      </div>
      <div className="space-y-3">
        {affiliateFAQs.map((faq, i) => (
          <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900/60 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors shadow-sm dark:shadow-none">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left gap-4"
            >
              <span className="font-bold text-gray-900 dark:text-white text-base">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// MAIN PRICING PAGE
// ============================================================
export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { success, error } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        if (window.createLemonSqueezy) {
            window.createLemonSqueezy();
        }
    }, []);

    const handleCheckout = (plan, yearly) => {
        if (plan.id === 'free') {
            navigate(user ? '/dashboard' : '/register');
            return;
        }
        if (!user) {
            navigate('/register?redirect=pricing');
            return;
        }
        setSelectedPlan({ ...plan, yearly });
        setIsModalOpen(true);
    };

    const confirmPayment = () => {
        if (!selectedPlan) return;
        const rawUrl = selectedPlan.yearly ? selectedPlan.checkoutUrl.yearly : selectedPlan.checkoutUrl.monthly;
        const checkoutUrl = buildCheckoutUrl(rawUrl, user?._id || user?.id);
        if (!checkoutUrl) {
            error('Checkout link not available');
            return;
        }
        
        if (window.LemonSqueezy) {
            window.LemonSqueezy.Url.Open(checkoutUrl);
        } else {
            success('Redirecting to secure payment...', { duration: 1500 });
            setTimeout(() => { window.location.href = checkoutUrl; }, 800);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-28">

                {/* ---- Hero Header ---- */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-3xl mx-auto text-center mb-16"
                >
                  <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-6">
                    Built for Affiliate Marketers
                  </span>
                  <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                    Stop Paying <span className="text-red-500 dark:text-red-400 line-through">$89</span> for Voluum.
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Get More for $29.</span>
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                    Geo-targeting, A/B testing, bot protection, link cloaking, retargeting pixels — everything you need to run profitable campaigns, at a fraction of the cost.
                  </p>

                  {/* Toggle */}
                  <div className="mt-10 flex justify-center">
                    <div className="bg-gray-200/60 dark:bg-gray-800 p-1 rounded-2xl border border-gray-300 dark:border-gray-700 flex items-center">
                      <button
                        onClick={() => setIsYearly(false)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          !isYearly ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >Monthly</button>
                      <button
                        onClick={() => setIsYearly(true)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                          isYearly ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        Yearly
                        <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full">-15%</span>
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* ---- Pricing Cards ---- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
                    {PLANS.map((plan, index) => (
                        <PricingCard
                            key={plan.id}
                            plan={plan}
                            isYearly={isYearly}
                            handleCheckout={handleCheckout}
                            index={index}
                        />
                    ))}
                </div>

                {/* ---- Trust Badges ---- */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-10 flex flex-wrap justify-center gap-8"
                >
                  {[
                    { icon: Lock, label: 'Secure Payments' },
                    { icon: RefreshCw, label: '30-Day Money Back' },
                    { icon: Zap, label: 'Instant Setup' },
                    { icon: Headphones, label: '24/7 Support' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                      <Icon className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                      {label}
                    </div>
                  ))}
                </motion.div>

                {/* ---- Competitor Comparison ---- */}
                <ComparisonTable />

                {/* ---- ROI Calculator ---- */}
                <SwitchROICalculator />

                {/* ---- FAQ ---- */}
                <FAQSection />

                {/* ---- Final CTA ---- */}
                <div className="mt-24 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Already have an account?</p>
                  <Link to="/dashboard" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-2">
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* ---- Payment Modal ---- */}
                <AnimatePresence>
                    {isModalOpen && selectedPlan && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }} 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                                className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl shadow-blue-500/20 rounded-3xl p-8 max-w-lg w-full overflow-hidden text-gray-900 dark:text-white"
                            >
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
                                        <Lock className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Secure Checkout</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Your leads, links, and campaigns are ready. Unlock full access to <strong className="text-blue-600 dark:text-blue-400">{selectedPlan.name}</strong>.
                                    </p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-800 dark:text-gray-300 font-bold">{selectedPlan.name} Plan</span>
                                        <span className="text-xl font-black text-gray-900 dark:text-white">
                                            {selectedPlan.yearly ? selectedPlan.price.yearly : selectedPlan.price.monthly}
                                            <span className="text-sm font-normal text-gray-500">/mo</span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Billed {selectedPlan.yearly ? 'Annually' : 'Monthly'}</span>
                                        {selectedPlan.yearly && <span className="text-green-600 dark:text-green-400 font-bold">15% Discount Applied</span>}
                                    </div>
                                </div>

                                <div className="text-center space-y-4">
                                    <button 
                                        onClick={confirmPayment}
                                        className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        Proceed to Payment
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                    
                                    <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                                        <strong className="text-gray-700 dark:text-gray-300">Free for 14 days</strong>, we only charge if you keep going. Cancel anytime before then and pay nothing.
                                    </p>

                                    <div className="flex items-center justify-center gap-2 pt-2">
                                        <Lock className="w-3 h-3 text-gray-400" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secured By Stripe</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}