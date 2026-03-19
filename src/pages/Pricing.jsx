import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PLANS } from '../utils/plans';
import Navbar from '../components/Navbar';
import { CheckCircle, ArrowRight, Zap, Sparkles, Rocket, ShieldCheck, Crown, Globe } from 'lucide-react';
import { useToast } from '../context/ToastProvider';
import { useAuth } from '../context/AuthContext';

const SUCCESS_URL = 'https://www.smart-link.website/success';

function buildCheckoutUrl(baseUrl, userId) {
    if (!baseUrl) return null;
    const url = new URL(baseUrl);
    if (userId) url.searchParams.set('checkout[custom][user_id]', userId);
    url.searchParams.set('checkout[success_url]', SUCCESS_URL);
    return url.toString();
}

const PricingCard = ({ plan, isYearly, handleCheckout, handleStartTrial }) => {
    const isPro = plan.id === 'pro';

    return (
        <div className={`relative p-8 rounded-3xl bg-white dark:bg-gray-900 border transition-all duration-300 flex flex-col h-full ${isPro
            ? 'border-blue-600 ring-1 ring-blue-600 shadow-xl shadow-blue-500/10'
            : 'border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md'
            }`}>
            {isPro && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    Most Popular
                </div>
            )}

            <div className="mb-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isPro ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}>
                    {plan.id === 'free' ? <Rocket className="w-6 h-6" /> :
                        isPro ? <Zap className="w-6 h-6" /> :
                            <Crown className="w-6 h-6" />}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed min-h-[40px]">
                    {plan.description}
                </p>
            </div>

            <div className="mb-8">
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">/ month</span>
                </div>
                {isYearly && plan.price.monthly !== '$0' && (
                    <p className="text-xs font-bold text-green-600 dark:text-green-500 mt-2">Billed annually (Save 15%)</p>
                )}
            </div>

            <button
                onClick={() => handleCheckout(plan, isYearly)}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mb-4 ${isPro
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
            >
                {plan.id === 'free' ? 'Get Started' : plan.cta}
                <ArrowRight className="w-4 h-4" />
            </button>

            {plan.trialAvailable && (
                <button
                    onClick={handleStartTrial}
                    className="w-full text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mb-8"
                >
                    Start {plan.trialDays}-day free trial
                </button>
            )}

            <div className="h-px bg-gray-100 dark:bg-gray-800 w-full mb-8" />

            <ul className="space-y-4 mb-4">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false);
    const navigate = useNavigate();
    const { success, error } = useToast();
    const { user } = useAuth();

    const handleCheckout = (plan, yearly) => {
        if (plan.id === 'free') {
            navigate(user ? '/dashboard' : '/register');
            return;
        }

        // ✅ MUST BE LOGGED IN TO BUY A PAID PLAN
        if (!user) {
            navigate('/register?redirect=pricing');
            return;
        }
        const rawUrl = yearly ? plan.checkoutUrl.yearly : plan.checkoutUrl.monthly;
        const checkoutUrl = buildCheckoutUrl(rawUrl, user?._id || user?.id);
        if (!checkoutUrl) {
            error('Checkout link not available');
            return;
        }
        success('Redirecting to checkout...', { duration: 1500 });
        setTimeout(() => { window.location.href = checkoutUrl; }, 800);
    };

    const handleStartTrial = () => {
        if (user) {
            success('Your 7-day Business Elite trial is active!');
            navigate('/dashboard');
        } else {
            navigate('/register?trial=true');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12 sm:py-24">
                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-24">
                    <span className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-4 block">Pricing Plans</span>
                    <h1 className="text-3xl sm:text-5xl font-bold bg-gray-900 dark:bg-white bg-clip-text text-transparent mb-6 tracking-tight">
                        Simple, transparent pricing for everyone
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 font-medium text-pretty leading-relaxed">
                        Scale your social reach with powerful features. No hidden fees. Choose the plan that fits your growth.
                    </p>

                    <div className="mt-12 flex justify-center">
                        <div className="bg-white dark:bg-gray-900 p-1 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center">
                            <button
                                onClick={() => setIsYearly(false)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${!isYearly ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'text-gray-500'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setIsYearly(true)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isYearly ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'text-gray-500'}`}
                            >
                                Yearly
                                <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">-15%</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {PLANS.map((plan) => (
                        <PricingCard
                            key={plan.id}
                            plan={plan}
                            isYearly={isYearly}
                            handleCheckout={handleCheckout}
                            handleStartTrial={handleStartTrial}
                        />
                    ))}
                </div>

                {/* Social Proof / Security */}
                <div className="mt-24 pt-16 border-t border-gray-200 dark:border-gray-800 flex flex-wrap justify-center gap-12 grayscale opacity-40">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                        <ShieldCheck className="w-5 h-5 text-gray-400" /> Secure Payments
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                        <Zap className="w-5 h-5 text-gray-400" /> Instant Setup
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                        <Globe className="w-5 h-5 text-gray-400" /> Global Scale
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Link to="/dashboard" className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                        Back to dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    );
}