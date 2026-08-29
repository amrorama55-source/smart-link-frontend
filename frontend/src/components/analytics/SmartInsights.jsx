import { useState } from 'react';
import { Sparkles, X, ChevronRight } from 'lucide-react';

export default function SmartInsights({ insights }) {
  const [dismissed, setDismissed] = useState([]);

  if (!insights || insights.length === 0) return null;

  const visibleInsights = insights.filter((_, i) => !dismissed.includes(i));
  
  if (visibleInsights.length === 0) return null;

  const handleDismiss = (index) => {
    setDismissed([...dismissed, index]);
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'danger':
        return 'from-red-500/10 to-rose-500/5 border-red-500/20 text-red-700 dark:text-red-400 dark:from-red-900/20 dark:to-rose-900/10 dark:border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]';
      case 'warning':
        return 'from-amber-500/10 to-orange-500/5 border-amber-500/20 text-amber-700 dark:text-amber-400 dark:from-amber-900/20 dark:to-orange-900/10 dark:border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
      case 'success':
        return 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 dark:from-emerald-900/20 dark:to-teal-900/10 dark:border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
      case 'info':
      default:
        return 'from-blue-500/10 to-indigo-500/5 border-blue-500/20 text-blue-700 dark:text-blue-400 dark:from-blue-900/20 dark:to-indigo-900/10 dark:border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]';
    }
  };

  const getButtonStyles = (type) => {
    switch (type) {
      case 'danger': return 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:text-red-300';
      case 'warning': return 'bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 dark:text-amber-300';
      case 'success': return 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300';
      case 'info':
      default: return 'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 dark:text-blue-300';
    }
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center gap-2 mb-2 px-1">
        <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
        </div>
        <h2 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight">
          Smart AI Insights
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((insight, index) => {
          if (dismissed.includes(index)) return null;
          
          return (
            <div 
              key={index}
              className={`relative group overflow-hidden rounded-2xl border backdrop-blur-xl bg-gradient-to-br p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${getTypeStyles(insight.type)}`}
            >
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-white/40 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              <button 
                onClick={() => handleDismiss(index)}
                className="absolute top-3 right-3 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-4">
                <div className="text-3xl filter drop-shadow-md transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  {insight.icon}
                </div>
                <div className="flex-1 pr-6">
                  <h3 className="font-bold text-base mb-1 tracking-tight flex items-center gap-2">
                    {insight.title}
                    {insight.type === 'danger' && <span className="flex w-2 h-2 rounded-full bg-red-500 animate-ping"></span>}
                  </h3>
                  <p className="text-sm opacity-90 leading-relaxed font-medium">
                    {insight.text}
                  </p>
                  
                  {insight.action && (
                    <button className={`mt-3 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${getButtonStyles(insight.type)}`}>
                      {insight.action}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
