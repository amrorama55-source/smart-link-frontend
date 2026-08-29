import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Crown, Zap, ShieldCheck, Sparkles, Star, ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpgradeModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const daysSinceExpired = user?.trialExpiredAt ?
        Math.floor((new Date() - new Date(user.trialExpiredAt)) / (1000 * 60 * 60 * 24)) : 0;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gray-900/40 dark:bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                >
                    {/* Header Detail */}
                    <div className="h-2 bg-blue-600 w-full" />

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8 sm:p-12 text-center">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <Crown className="w-8 h-8 text-blue-600" />
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                            Upgrade to Business Elite
                        </h2>

                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 leading-relaxed">
                            Your trial has ended. Upgrade now to keep accessing your advanced analytics and unlimited smart links.
                        </p>

                        <div className="space-y-3 mb-10 text-left">
                            {[
                                "Unlimited Dynamic Smart Links",
                                "Deep Real-time Analytics Engine",
                                "Verified Custom Domain Integration",
                                "Strategic A/B Testing Suite",
                                "White-label Link Experience",
                                "Priority Elite Support"
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 py-1">
                                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {daysSinceExpired > 0 && (
                            <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold border border-red-100 dark:border-red-900/20">
                                <Clock className="w-4 h-4" />
                                Trial expired {daysSinceExpired} days ago
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => navigate('/pricing')}
                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                View Pricing Plans
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={onClose}
                                className="w-full text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white py-2 font-bold text-sm transition-all"
                            >
                                Continue with limited free plan
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UpgradeModal;
