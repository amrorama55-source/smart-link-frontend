import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, LayoutDashboard, Crown, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getSubscription } from '../services/api';

const PLAN_META = {
    pro: {
        label: 'PRO',
        icon: <Crown className="w-6 h-6 text-indigo-400" />,
        color: 'from-indigo-500 to-blue-600',
        features: ['Custom Domains', 'A/B Testing', 'Smart Targeting', 'Advanced Analytics', 'Dynamic QR Codes'],
    },
    business: {
        label: 'BUSINESS',
        icon: <Shield className="w-6 h-6 text-purple-400" />,
        color: 'from-purple-500 to-pink-600',
        features: ['Bulk Link Import', 'API Access', 'Team Collaboration', 'White-label Support', 'Premium Integration'],
    },
};

export default function Success() {
    const { refreshUser } = useAuth();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Refresh user context so plan updates immediately in the UI
        const init = async () => {
            try {
                if (refreshUser) await refreshUser();
                const data = await getSubscription();
                setSubscription(data);
            } catch (e) {
                console.error('Could not load subscription:', e);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const plan = subscription?.plan;
    const meta = PLAN_META[plan] || PLAN_META.pro;

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg w-full bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-800"
            >
                {/* Top gradient bar */}
                <div className={`h-2 w-full bg-gradient-to-r ${meta.color}`} />

                <div className="p-8 sm:p-12 text-center">
                    {/* Success icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                        className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-900/30 text-green-400 rounded-full text-sm font-bold mb-4">
                            <Sparkles className="w-4 h-4" />
                            Payment Successful
                        </div>

                        <h1 className="text-3xl font-extrabold text-white mb-2">
                            Welcome to {meta.label}!
                        </h1>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Your account has been upgraded. You now have access to all {meta.label} features.
                        </p>
                    </motion.div>

                    {/* Plan features */}
                    {!loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gray-800/60 rounded-2xl p-5 mb-8 text-left"
                        >
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                                Your {meta.label} Features
                            </p>
                            <ul className="space-y-2">
                                {meta.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {/* Billing period */}
                    {subscription?.subscription?.currentPeriodEnd && (
                        <p className="text-xs text-gray-500 mb-6">
                            Next billing date:{' '}
                            <span className="text-gray-300 font-semibold">
                                {new Date(subscription.subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </span>
                        </p>
                    )}

                    {/* CTA */}
                    <div className="space-y-3">
                        <Link to="/dashboard">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-4 bg-gradient-to-r ${meta.color} text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all`}
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                Go to Dashboard
                            </motion.button>
                        </Link>

                        <Link
                            to="/settings"
                            className="block text-gray-500 hover:text-gray-300 text-sm font-semibold transition-colors"
                        >
                            Manage Subscription →
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
