import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, BarChart3, Globe, Shield, ArrowRight, Activity, Smartphone, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InteractiveDemo() {
  const [url, setUrl] = useState('');
  const [step, setStep] = useState('idle'); // idle, analyzing, ready
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (!url) return;
    
    setStep('analyzing');
    setProgress(0);
    
    // Simulate analyzing process
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setStep('ready');
          return 100;
        }
        return p + Math.floor(Math.random() * 20) + 10;
      });
    }, 300);
  };

  const handleRegister = () => {
    navigate('/register?trial=true');
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative z-10 mt-12 mb-20">
      {/* Input Section */}
      <motion.div 
        layout
        className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 sm:p-4 rounded-3xl shadow-2xl mb-8"
      >
        <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 flex items-center">
            <Link2 className="absolute left-6 text-gray-400 w-6 h-6" />
            <input 
              type="url" 
              required
              placeholder="Paste your long affiliate link here..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-lg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={step !== 'idle'}
            />
          </div>
          <button 
            type="submit" 
            disabled={step !== 'idle'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl px-8 py-5 transition-all shadow-lg shadow-blue-600/30 whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 'idle' ? (
              <>Shorten & Track <ArrowRight className="w-5 h-5" /></>
            ) : step === 'analyzing' ? (
              'Analyzing...'
            ) : (
              'Link Ready!'
            )}
          </button>
        </form>

        {/* Loading Bar */}
        <AnimatePresence>
          {step === 'analyzing' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-2 pt-4"
            >
              <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                <span>Analyzing URL Structure...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results / Mock Dashboard Section */}
      <AnimatePresence>
        {step === 'ready' && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative"
          >
            {/* Overlay to drive registration */}
            <div className="absolute inset-0 z-20 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center p-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1 }}
                className="bg-gray-800 border border-gray-700 p-8 rounded-3xl shadow-2xl max-w-md text-center"
              >
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Your Link is Live!</h3>
                <p className="text-gray-400 mb-6">
                  We've successfully generated your short link and the tracking engine is armed. 
                  Create a free account to copy your link and view real-time data.
                </p>
                <button 
                  onClick={handleRegister}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-4 transition-all shadow-lg shadow-blue-600/30"
                >
                  Start 14-Day Free Trial
                </button>
                <p className="text-xs text-gray-500 mt-4">No credit card required to start.</p>
              </motion.div>
            </div>

            {/* Background Mock Data (Visible behind the blur) */}
            <div className="p-6 sm:p-8 opacity-50 select-none">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-6 mb-6">
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-1">Your Short Link</p>
                  <p className="text-xl font-mono text-blue-400 font-bold">by-smartlink.com/x72pQ</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-gray-800 rounded-xl px-4 py-2 border border-gray-700">
                    <p className="text-xs text-gray-500 font-bold uppercase">Total Clicks</p>
                    <p className="text-xl font-black text-white">1,248</p>
                  </div>
                  <div className="bg-red-500/10 rounded-xl px-4 py-2 border border-red-500/20">
                    <p className="text-xs text-red-500/70 font-bold uppercase">Bots Blocked</p>
                    <p className="text-xl font-black text-red-400">342</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 p-5 rounded-2xl border border-gray-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    <h4 className="font-bold text-gray-300">Top Geographies</h4>
                  </div>
                  <div className="space-y-3">
                    {['United States', 'United Kingdom', 'Canada'].map((country, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>{country}</span>
                          <span>{80 - i*20}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-700 rounded-full">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${80 - i*20}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800/50 p-5 rounded-2xl border border-gray-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    <h4 className="font-bold text-gray-300">Devices</h4>
                  </div>
                  <div className="space-y-3">
                    {['Mobile (iOS)', 'Mobile (Android)', 'Desktop'].map((device, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>{device}</span>
                          <span>{65 - i*15}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-700 rounded-full">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${65 - i*15}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800/50 p-5 rounded-2xl border border-gray-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-red-400" />
                    <h4 className="font-bold text-gray-300">Threat Shield</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span>Data Center IPs Blocked</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <span>VPNs Detected</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Traffic Cleaned</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
