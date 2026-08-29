import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastProvider';

const TRIAL_DAYS = 7;

const TrialBanner = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { success, info } = useToast();

    if (!user || user.plan !== 'trial' || !user.trialEndsAt) return null;

    const trialEndsAt = new Date(user.trialEndsAt);
    const trialStartedAt = user.trialStartedAt
        ? new Date(user.trialStartedAt)
        : new Date(trialEndsAt - TRIAL_DAYS * 86400000);
    const now = new Date();

    const totalMs = trialEndsAt - trialStartedAt;
    const elapsedMs = now - trialStartedAt;
    const progressPct = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));

    const diffMs = trialEndsAt - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs < 0) return null;

    const isLastDay = diffMs <= (1000 * 60 * 60 * 24);
    const isCritical = diffMs <= (1000 * 60 * 60 * 3); // 3 hours

    const urgencyColor = isCritical
        ? 'from-red-600 to-rose-700'
        : isLastDay
            ? 'from-amber-600 to-orange-700'
            : 'from-blue-600 to-indigo-700';

    const progressBarColor = isCritical
        ? 'bg-red-300'
        : isLastDay
            ? 'bg-yellow-300'
            : 'bg-white/60';

    const handleUpgrade = () => {
        success('🚀 Ready to upgrade? Keep all your Business Elite features!', {
            duration: 3000,
            action: { label: 'View Plans', onClick: () => navigate('/pricing') }
        });
        navigate('/pricing');
    };

    const handleShowFeatures = () => {
        info('🎯 You have: Unlimited links, Advanced analytics, Custom domains, A/B Testing, Priority support', {
            duration: 5000
        });
    };

    return (
        <div className={`bg-gradient-to-r ${urgencyColor} text-white px-4 py-3 shadow-lg`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="bg-white/20 p-2 rounded-lg hidden sm:block flex-shrink-0">
                        <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm md:text-base leading-tight">
                            {isCritical
                                ? `⚠️ Trial ending in ${diffHours}h ${diffMinutes}m!`
                                : isLastDay
                                    ? `🕒 Only ${diffHours} hours left of Business Elite!`
                                    : `🚀 ${diffDays + 1} days left of Business Elite access`}
                        </h3>
                        <p className="text-white/80 text-xs mt-0.5">
                            Day {Math.min(TRIAL_DAYS, Math.ceil(elapsedMs / 86400000))} of {TRIAL_DAYS} — upgrade now to keep all features
                        </p>
                        <div className="mt-1.5 w-full max-w-xs bg-white/20 rounded-full h-1.5">
                            <div
                                className={`${progressBarColor} h-1.5 rounded-full transition-all duration-500`}
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={handleShowFeatures}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-xs font-bold transition-all items-center gap-2 hidden sm:flex"
                    >
                        <TrendingUp className="w-3 h-3" />
                        View Features
                    </button>
                    <button
                        onClick={handleUpgrade}
                        className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-2 rounded-full text-sm font-black transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
                    >
                        Upgrade Now
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrialBanner;
