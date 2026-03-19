import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Zap, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Star,
  TrendingUp,
  Globe,
  BarChart3,
  Users
} from 'lucide-react';
import { PLANS } from '../utils/plans';

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

  const getPlanIcon = () => {
    switch (plan.id) {
      case 'pro':
        return <Crown className="w-6 h-6" />;
      case 'business':
        return <Shield className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getPlanColor = () => {
    switch (plan.id) {
      case 'pro':
        return 'from-blue-500 to-indigo-600';
      case 'business':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getPlanBgColor = () => {
    switch (plan.id) {
      case 'pro':
        return 'bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-blue-200 dark:border-blue-700';
      case 'business':
        return 'bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-200 dark:border-purple-700';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`
        relative rounded-2xl p-6 transition-all duration-300
        ${compact ? 'max-w-sm' : 'w-full'}
        ${isCurrentPlan ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-md hover:shadow-xl'}
        ${getPlanBgColor()}
      `}
    >
      {/* Popular Badge */}
      {plan.popular && !compact && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
            Most Popular
          </div>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute top-4 right-4">
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Current
          </div>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-6">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${getPlanColor()} flex items-center justify-center text-white shadow-lg`}>
          {getPlanIcon()}
        </div>
        
        <h3 className={`text-xl font-bold mb-2 ${
          plan.id === 'pro' ? 'text-blue-600 dark:text-blue-400' :
          plan.id === 'business' ? 'text-purple-600 dark:text-purple-400' :
          'text-gray-600 dark:text-gray-400'
        }`}>
          {plan.name}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {plan.description}
        </p>

        {/* Trial Option for Free Plan */}
        {plan.hasTrial && !compact && (
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-4">
            <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
              🎯 Business Elite Trial
            </p>
            <p className="text-xs text-indigo-700 dark:text-indigo-300">
              {plan.trialText}
            </p>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {plan.price.monthly}
          </span>
          {plan.id !== 'free' && (
            <span className="text-sm text-gray-500 dark:text-gray-400">/mo</span>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6">
        {plan.features.slice(0, compact ? 3 : undefined).map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
          plan.id === 'pro' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
          plan.id === 'business' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
          'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}>
              <CheckCircle className="w-3 h-3" />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={handleUpgrade}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        className={`
          w-full py-3 rounded-xl font-bold transition-all shadow-lg
          flex items-center justify-center gap-2
          ${isCurrentPlan 
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed' 
            : plan.id === 'free' && plan.hasTrial
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/40'
            : plan.id === 'pro'
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:shadow-blue-500/40'
            : plan.id === 'business'
            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 hover:shadow-purple-500/40'
            : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
          }
        `}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? (
          'Current Plan'
        ) : plan.id === 'free' && plan.hasTrial ? (
          <>
            {plan.trialCta}
            <ArrowRight className="w-4 h-4" />
          </>
        ) : plan.id === 'free' ? (
          <>
            Continue to Dashboard
            <ArrowRight className="w-4 h-4" />
          </>
        ) : (
          <>
            {plan.cta}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>

      {/* Trial Notice */}
      {plan.hasTrial && (
        <p className="text-center mt-3 text-xs text-gray-500 dark:text-gray-400">
          🎁 No credit card required • 7 days full access
        </p>
      )}

      {/* Cancel Notice */}
      {plan.id !== 'free' && (
        <p className="text-center mt-3 text-xs text-gray-500 dark:text-gray-400">
          ✨ Cancel anytime, no questions asked
        </p>
      )}
    </motion.div>
  );
};

export default UpgradePlanCard;
