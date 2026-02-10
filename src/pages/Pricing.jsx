import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PLANS } from '../utils/plans';
import Navbar from '../components/Navbar';
import { CheckCircle, ArrowRight, Zap, Sparkles } from 'lucide-react';

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = (plan, isYearly) => {
        // If free plan, navigate to dashboard
        if (plan.id === 'free') {
            navigate('/dashboard');
            return;
        }

        // Get Checkout URL according to subscription type (monthly or yearly)
        const checkoutUrl = isYearly
            ? plan.checkoutUrl.yearly
            : plan.checkoutUrl.monthly;

        if (!checkoutUrl) {
            alert('Checkout link not available');
            return;
        }

        // Open Checkout URL
        window.location.href = checkoutUrl;
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                <div className="text-center mb-16 sm:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-bold mb-6"
                    >
                        <Zap className="w-4 h-4" />
                        <span>Scale Your Success</span>
                    </motion.div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Choose the Perfect <span className="text-blue-600">Plan</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                        Professional tools to help you grow your audience and optimize your links.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className={`text-sm font-bold ${!isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative w-14 h-8 bg-gray-200 dark:bg-gray-800 rounded-full p-1 transition-colors hover:bg-gray-300 dark:hover:bg-gray-700 active:scale-95"
                        >
                            <motion.div
                                animate={{ x: isYearly ? 24 : 0 }}
                                className="w-6 h-6 bg-blue-600 rounded-full shadow-md"
                            />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Yearly</span>
                            <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ring-1 ring-green-600/20">
                                Save 25%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {PLANS.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className={`relative p-8 sm:p-10 rounded-[2.5rem] flex flex-col transition-all duration-300 ${plan.popular
                                ? 'bg-gray-900 dark:bg-gray-800 text-white shadow-[0_30px_60px_-15px_rgba(37,99,235,0.3)] scale-100 lg:scale-105 z-10 border-4 border-blue-500'
                                : 'bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white shadow-xl border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest shadow-xl ring-4 ring-white dark:ring-gray-900">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={`text-2xl font-black mb-2 uppercase tracking-tight ${plan.popular ? 'text-blue-400' : 'text-blue-600'}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm font-medium ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mb-10 flex items-baseline gap-1">
                                <span className="text-5xl sm:text-6xl font-black tracking-tighter">
                                    {isYearly ? plan.price.yearly : plan.price.monthly}
                                </span>
                                <span className={`text-lg font-bold ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>/mo</span>
                            </div>

                            <div className={`h-px w-full mb-10 ${plan.popular ? 'bg-gray-700' : 'bg-gray-100 dark:bg-gray-700'}`}></div>

                            <ul className="space-y-5 mb-12 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.popular ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <span className={`text-sm sm:text-base font-semibold leading-snug ${plan.popular ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleCheckout(plan, isYearly)}
                                whileTap={{ scale: 0.95 }}
                                className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-2 ${plan.popular
                                    ? 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-500/40'
                                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90'
                                    }`}
                            >
                                <span>{plan.id === 'free' ? 'Continue to Dashboard' : plan.cta}</span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>

                            {plan.id !== 'free' && (
                                <p className={`text-center mt-4 text-[10px] font-bold uppercase tracking-widest ${plan.popular ? 'text-gray-500' : 'text-gray-400'}`}>
                                    ✨ Cancel anytime, no questions asked
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link to="/dashboard" className="text-gray-500 hover:text-blue-600 font-bold transition-colors">
                        Maybe later, take me to my Dashboard
                    </Link>
                </div>
            </main>
        </div>
    );
}
