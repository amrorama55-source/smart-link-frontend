// frontend/src/components/ChannelPickerModal.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { CHANNELS, saveChannelForLink } from '../utils/playbookData';

const channelOrder = ['instagram', 'telegram', 'facebook', 'whatsapp', 'email', 'other'];

const CHANNEL_ACCENT = {
  instagram: { color: '#E1306C', bg: 'rgba(225,48,108,0.12)', border: 'rgba(225,48,108,0.35)' },
  telegram:  { color: '#2AABEE', bg: 'rgba(42,171,238,0.12)', border: 'rgba(42,171,238,0.35)' },
  facebook:  { color: '#1877F2', bg: 'rgba(24,119,242,0.12)', border: 'rgba(24,119,242,0.35)' },
  whatsapp:  { color: '#25D366', bg: 'rgba(37,211,102,0.12)', border: 'rgba(37,211,102,0.35)' },
  email:     { color: '#FF6B35', bg: 'rgba(255,107,53,0.12)', border: 'rgba(255,107,53,0.35)' },
  other:     { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.35)' },
};

const GOAL_LABELS = {
  instagram: '10 clicks',
  telegram: '20 clicks',
  facebook: '50 clicks',
  whatsapp: '15 clicks',
  email: '30 clicks',
  other: '10 clicks',
};

export default function ChannelPickerModal({ show, onClose, onSelectChannel, link }) {
  const [selected, setSelected] = useState(null);

  if (!show || !link) return null;

  const handleSelect = (channelId) => {
    // Toggle — clicking same one deselects (back)
    setSelected((prev) => (prev === channelId ? null : channelId));
  };

  const handleConfirm = () => {
    if (!selected) return;
    saveChannelForLink(link.shortCode, selected);
    onSelectChannel(selected);
    setSelected(null);
  };

  const handleSkip = () => {
    setSelected(null);
    onClose();
  };

  const accent = selected ? CHANNEL_ACCENT[selected] : null;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={handleSkip}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="relative w-full max-w-[420px] z-10"
          >
            <div className="bg-[#111318] border border-white/10 rounded-[1.75rem] shadow-[0_24px_64px_rgba(0,0,0,0.7)] overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <div>
                  <h2 className="text-base font-black text-white leading-tight">
                    Link Created! 🎉
                  </h2>
                  <p className="text-xs text-white/40 mt-0.5">Where will you share it?</p>
                </div>
                <button
                  onClick={handleSkip}
                  className="p-2 rounded-xl text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Link pill */}
              <div className="mx-5 mb-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/8">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="text-white/50 text-xs font-mono truncate">
                  {link.shortUrl || link.shortCode}
                </span>
              </div>

              {/* Label */}
              <p className="px-5 text-[10px] font-black uppercase tracking-[0.18em] text-white/25 mb-2.5">
                Choose your channel
              </p>

              {/* Channel Grid — compact 2-col */}
              <div className="px-5 pb-4 grid grid-cols-2 gap-2">
                {channelOrder.map((channelId, idx) => {
                  const ch = CHANNELS[channelId];
                  const a = CHANNEL_ACCENT[channelId];
                  const isSelected = selected === channelId;

                  return (
                    <motion.button
                      key={channelId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.045 }}
                      onClick={() => handleSelect(channelId)}
                      className="relative text-left rounded-xl border transition-all duration-200 px-3.5 py-3 group"
                      style={{
                        background: isSelected ? a.bg : 'rgba(255,255,255,0.04)',
                        borderColor: isSelected ? a.border : 'rgba(255,255,255,0.07)',
                        boxShadow: isSelected ? `0 0 18px ${a.bg}` : 'none',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        {/* Name */}
                        <span
                          className="text-sm font-bold leading-none transition-colors"
                          style={{ color: isSelected ? a.color : 'rgba(255,255,255,0.75)' }}
                        >
                          {ch.name}
                        </span>

                        {/* Selected indicator dot or goal pill */}
                        <div
                          className="px-1.5 py-0.5 rounded-full text-[9px] font-black transition-all"
                          style={{
                            background: isSelected ? a.border : 'rgba(255,255,255,0.06)',
                            color: isSelected ? a.color : 'rgba(255,255,255,0.3)',
                          }}
                        >
                          {GOAL_LABELS[channelId]}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-white/30 leading-tight truncate">
                        {ch.description}
                      </p>

                      {/* Active left bar */}
                      {isSelected && (
                        <motion.div
                          layoutId="active-bar"
                          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                          style={{ background: a.color }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-5 pb-5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-white/20" />
                  <span className="text-[10px] text-white/25">
                    We'll build a custom playbook
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <AnimatePresence mode="wait">
                    {selected ? (
                      <motion.div
                        key="actions"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        className="flex items-center gap-2"
                      >
                        {/* Back / deselect */}
                        <button
                          onClick={() => setSelected(null)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all font-medium"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Back
                        </button>

                        {/* Confirm */}
                        <button
                          onClick={handleConfirm}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-black text-xs text-white transition-all hover:opacity-90 active:scale-95 shadow-lg"
                          style={{
                            background: accent?.color,
                            boxShadow: `0 4px 16px ${accent?.bg}`,
                          }}
                        >
                          Get Playbook
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="skip"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleSkip}
                        className="text-xs text-white/25 hover:text-white/50 font-medium transition-colors underline underline-offset-2"
                      >
                        Skip for now
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
