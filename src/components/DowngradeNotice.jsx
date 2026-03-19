import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DowngradeNotice() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = React.useState(true);

    // Only show if plan is free and they had a trial (trialExpiredAt exists)
    // Or if they are on 'free' and trialEndsAt is in the past
    const trialExpired = user?.plan === 'free' && (user?.trialExpiredAt || (user?.subscription?.trialEndsAt && new Date(user.subscription.trialEndsAt) < new Date()));

    if (!trialExpired || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white relative overflow-hidden"
            >
                <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-sm sm:text-base">Your Business trial has ended</p>
                            <p className="text-xs sm:text-sm text-amber-50 opacity-90">
                                Premium features like Custom Domains and Targeting are now paused.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/pricing')}
                            className="px-4 py-2 bg-white text-orange-600 rounded-lg font-bold text-sm hover:bg-orange-50 transition-colors flex items-center gap-2"
                        >
                            Resume Experience
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Decorative background element */}
                <Sparkles className="absolute -bottom-2 -right-2 w-16 h-16 text-white/10 rotate-12" />
            </motion.div>
        </AnimatePresence>
    );
}
