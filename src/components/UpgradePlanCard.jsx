import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, TrendingDown } from 'lucide-react';

const UpgradePlanCard = ({ plan, isCurrentPlan, onUpgrade, compact = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleUpgrade = () => {
    if (plan.id === 'free') {
      navigate('/dashboard');
      return;
    }
    
    if (onUpgrade) {
      onUpgrade(plan);
    } else {
      navigate('/pricing');
    }
  };

  const isPro = plan.id === 'pro';
  const savings = plan.id === 'pro' ? 80 : plan.id === 'business' ? 70 : null;

  // Adapt the landing page styling (which is strictly dark) to also look great in light mode
  // But maintain the exact same premium feel.
  const getContainerClasses = () => {
    if (isPro) {
      return 'bg-gradient-to-b from-blue-600/10 to-blue-600/5 dark:from-blue-600/20 dark:to-blue-600/5 border-blue-500/40 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/20 scale-100 sm:scale-105 z-10';
    }
    return 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/[0.07] shadow-sm';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex flex-col rounded-3xl border transition-all duration-300 ${getContainerClasses()} ${compact ? 'max-w-sm mx-auto' : 'w-full'}`}
    >
      {/* Popular Badge */}
      {isPro && !compact && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg whitespace-nowrap">
            ⭐ Most Popular
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-green-200 dark:border-green-500/30">
            <CheckCircle className="w-3.5 h-3.5" />
            Current Plan
          </div>
        </div>
      )}

      <div className="p-8 flex flex-col h-full relative">
        {/* Header */}
        <div className="mb-6">
          <h3 className={`text-xl font-black mb-2 ${isPro ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
            {plan.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-gray-900 dark:text-white">
              {plan.price.monthly}
            </span>
            {plan.price.monthly !== '$0' && (
              <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">/ month</span>
            )}
          </div>
          
          {/* Trial Notice inside price area for Starter */}
          {plan.isTrial && !compact && (
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-2">
              🎁 14-Day Free Trial — No credit card required
            </p>
          )}

          {/* Competitor Savings */}
          {savings && !compact && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-full px-3 py-1">
              <TrendingDown className="w-3.5 h-3.5 text-green-700 dark:text-green-400" />
              <span className="text-xs font-bold text-green-700 dark:text-green-400">${savings}/mo cheaper than Voluum</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleUpgrade}
          disabled={isCurrentPlan}
          className={`w-full py-4 rounded-xl font-black text-base transition-all flex items-center justify-center gap-2 mb-6 ${
            isCurrentPlan
              ? 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-white/10'
              : isPro
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30'
              : 'bg-gray-900 dark:bg-white/10 text-white hover:bg-gray-800 dark:hover:bg-white/15 border border-transparent dark:border-white/20 shadow-md'
          }`}
        >
          {isCurrentPlan ? (
            'Active Plan'
          ) : plan.isTrial ? (
            'Start 14-Day Free Trial'
          ) : plan.id === 'free' ? (
            'Get Started Free'
          ) : (
            plan.cta || 'Upgrade Now'
          )}
          {!isCurrentPlan && <ArrowRight className="w-4 h-4" />}
        </button>

        <div className="h-px bg-gray-200 dark:bg-white/10 w-full mb-6" />

        {/* Features */}
        <ul className="space-y-3 flex-1">
          {plan.features.slice(0, compact ? 4 : undefined).map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isPro ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-tight">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* Cancel Notice */}
        {!plan.isTrial && plan.id !== 'free' && !compact && (
          <p className="text-center mt-6 text-xs text-gray-500 dark:text-gray-400 font-medium">
            ✨ Cancel anytime, no questions asked
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default UpgradePlanCard;
