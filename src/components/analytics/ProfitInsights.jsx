import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, Zap, DollarSign, Info, ArrowUpRight } from 'lucide-react';

const ProfitInsights = ({ data }) => {
  if (!data) return null;

  const { 
    savedBudget, 
    efficiencyScore, 
    potentialLift, 
    botClicks,
    insightMessage 
  } = data;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xl shadow-blue-500/5">
      <div className="flex flex-col lg:flex-row">
        {/* Left: Main Insight Hero */}
        <div className="flex-1 p-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-48 h-48 rotate-12 -mr-12 -mt-12" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3 fill-current" />
                AI Analysis Active
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-4 leading-tight">Profit Intelligence</h2>
            <p className="text-blue-100 text-lg font-medium leading-relaxed mb-8 max-w-lg">
              {insightMessage}
            </p>

            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-blue-200 text-xs font-bold uppercase mb-1">Human Clicks</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">Verified</span>
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div className="w-px h-10 bg-white/20 hidden sm:block" />
              <div>
                <p className="text-blue-200 text-xs font-bold uppercase mb-1">Bot Protection</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">Active</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Key Metrics Grid */}
        <div className="lg:w-1/3 p-8 bg-gray-50/50 dark:bg-gray-800/30 grid grid-cols-1 gap-6 border-l border-gray-100 dark:border-gray-800">
          <div className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Money Saved</span>
              <ShieldCheck className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">${savedBudget}</span>
              <span className="text-xs text-green-600 font-bold">AD FRAUD STOPPED</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{botClicks} malicious bots blocked</p>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          <div className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Efficiency Score</span>
              <Zap className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{efficiencyScore}%</span>
              <span className="text-xs text-blue-600 font-bold">REAL TRAFFIC</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">High-quality audience confirmed</p>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          <div className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Revenue Lift</span>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">+{potentialLift}%</span>
              <span className="text-xs text-purple-600 font-bold">ROI INCREASE</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Via AI Auto-Optimization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitInsights;
