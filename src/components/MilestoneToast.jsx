// frontend/src/components/MilestoneToast.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Trophy, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  CHANNELS,
  getChannelForLink,
  MILESTONE_THRESHOLDS,
  wasMilestoneNotified,
  saveMilestoneNotified,
} from '../utils/playbookData';

// Confetti particles
function ConfettiParticle({ delay, x, color }) {
  return (
    <motion.div
      initial={{ y: 0, x, opacity: 1, rotate: 0, scale: 1 }}
      animate={{ y: 60, opacity: 0, rotate: 360 * (Math.random() > 0.5 ? 1 : -1), scale: 0 }}
      transition={{ duration: 1.2, delay, ease: 'easeOut' }}
      className={`absolute top-0 w-2 h-2 rounded-sm ${color}`}
      style={{ left: `${x}%` }}
    />
  );
}

const CONFETTI_COLORS = [
  'bg-blue-400', 'bg-purple-400', 'bg-pink-400',
  'bg-yellow-400', 'bg-green-400', 'bg-indigo-400', 'bg-orange-400',
];

function Confetti() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.3,
    x: Math.random() * 90,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
      {particles.map((p) => (
        <ConfettiParticle key={p.id} delay={p.delay} x={p.x} color={p.color} />
      ))}
    </div>
  );
}

// Milestone data
const MILESTONE_CONFIG = {
  1:    { label: 'First click!',       emoji: '🎯', gradient: 'from-blue-500 to-indigo-600',    size: 'sm' },
  10:   { label: '10 clicks!',         emoji: '🔥', gradient: 'from-orange-500 to-pink-600',   size: 'md' },
  50:   { label: '50 clicks!',         emoji: '⚡', gradient: 'from-yellow-500 to-orange-600', size: 'md' },
  100:  { label: '100 clicks!',        emoji: '💯', gradient: 'from-purple-500 to-indigo-600', size: 'lg' },
  500:  { label: '500 clicks!',        emoji: '🚀', gradient: 'from-pink-500 to-purple-600',   size: 'lg' },
  1000: { label: '1,000 clicks!',      emoji: '🏆', gradient: 'from-amber-500 to-yellow-500',  size: 'xl' },
};

export default function MilestoneToast({ milestones, onDismiss }) {
  // milestones = array of { shortCode, linkTitle, milestone }
  const [visible, setVisible] = useState(true);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const activeMilestones = milestones?.filter(Boolean) || [];

  useEffect(() => {
    if (!activeMilestones.length) return;
    // Auto-dismiss after 8s
    const timer = setTimeout(() => handleDismiss(), 8000);
    return () => clearTimeout(timer);
  }, [current, activeMilestones.length]);

  if (!activeMilestones.length || !visible) return null;

  const item = activeMilestones[current];
  const config = MILESTONE_CONFIG[item.milestone] || MILESTONE_CONFIG[10];
  const channel = getChannelForLink(item.shortCode);
  const channelData = channel ? CHANNELS[channel] : null;

  const handleDismiss = () => {
    if (current < activeMilestones.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setVisible(false);
      onDismiss?.();
    }
  };

  const handleViewAnalytics = () => {
    handleDismiss();
    navigate(`/analytics?link=${item.shortCode}`);
  };

  const isLarge = config.size === 'lg' || config.size === 'xl';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`${item.shortCode}-${item.milestone}`}
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="fixed bottom-6 right-6 z-[99999] w-full max-w-sm"
        >
          <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br ${config.gradient} text-white`}>
            {/* Confetti */}
            {isLarge && <Confetti />}

            {/* Subtle glass overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

            {/* Content */}
            <div className="relative p-5">
              {/* Header row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {/* Milestone badge */}
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                    {config.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Trophy className="w-3.5 h-3.5 text-yellow-200" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                        Milestone Reached
                      </span>
                    </div>
                    <p className="text-xl font-black leading-tight">
                      {config.label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Link info */}
              <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-white/10 rounded-xl">
                {channelData && (
                  <span className="text-base">{channelData.emoji}</span>
                )}
                <p className="text-sm font-bold truncate flex-1 text-white/90">
                  "{item.linkTitle || item.shortCode}"
                </p>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                  <span className="text-xs font-black text-yellow-200">{item.milestone}</span>
                </div>
              </div>

              {/* Context message */}
              <p className="text-sm text-white/80 font-medium mb-4 leading-relaxed">
                {item.milestone === 1
                  ? "Your first click just landed. The journey begins. 🚀"
                  : item.milestone >= 100
                  ? "This is serious momentum. Check your analytics for deep insights."
                  : "Great progress! See where your audience is coming from."}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleViewAnalytics}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-gray-900 rounded-xl font-black text-sm shadow-lg hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <TrendingUp className="w-4 h-4" />
                  View Analytics
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl font-bold text-sm transition-all"
                >
                  Later
                </button>
              </div>

              {/* Multiple milestones indicator */}
              {activeMilestones.length > 1 && (
                <div className="flex justify-center gap-1 mt-3">
                  {activeMilestones.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/30'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── useMilestoneDetection hook ───────────────────────────────────
// Usage in Dashboard: detects if any link hit a new milestone

export function useMilestoneDetection(topLinks) {
  const [pendingMilestones, setPendingMilestones] = useState([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!topLinks?.length) return;

    const found = [];

    topLinks.forEach((link) => {
      const clicks = link.totalClicks || 0;
      MILESTONE_THRESHOLDS.forEach((threshold) => {
        if (clicks >= threshold && !wasMilestoneNotified(link.shortCode, threshold)) {
          found.push({
            shortCode: link.shortCode,
            linkTitle: link.title,
            milestone: threshold,
          });
          saveMilestoneNotified(link.shortCode, threshold);
        }
      });
    });

    if (found.length) {
      setPendingMilestones(found);
      setDismissed(false);
    }
  }, [topLinks]);

  const handleDismiss = () => setDismissed(true);

  return {
    milestones: dismissed ? [] : pendingMilestones,
    handleDismiss,
  };
}
