// frontend/src/components/PlaybookDrawer.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Circle, ExternalLink, TrendingUp, Trophy, ChevronDown, ChevronUp, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  CHANNELS,
  PLAYBOOKS,
  getPlaybookProgress,
  savePlaybookProgress,
} from '../utils/playbookData';
import { SHORT_URL_BASE } from '../config';

export default function PlaybookDrawer({ show, onClose, channelId, link }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  const channel = CHANNELS[channelId];
  const playbook = PLAYBOOKS[channelId];

  useEffect(() => {
    if (show && link?.shortCode) {
      setProgress(getPlaybookProgress(link.shortCode));
      setCollapsed(false);
    }
  }, [show, link?.shortCode]);

  if (!show || !channel || !playbook || !link) return null;

  const steps = playbook.steps;
  const completedCount = steps.filter((s) => progress[s.id]).length;
  const totalSteps = steps.length;
  const pct = Math.round((completedCount / totalSteps) * 100);
  const allDone = completedCount === totalSteps;

  const handleToggleStep = (stepId) => {
    const next = !progress[stepId];
    setProgress((prev) => ({ ...prev, [stepId]: next }));
    savePlaybookProgress(link.shortCode, stepId, next);
  };

  const shortUrl = `${SHORT_URL_BASE}/${link.shortCode}`;

  const handleViewAnalytics = () => {
    onClose();
    navigate(`/analytics?link=${link.shortCode}`);
  };

  // ─── Mobile bottom sheet / Desktop right drawer ───
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
            onClick={onClose}
          />

          {/* Drawer — bottom on mobile, right on desktop */}
          <motion.div
            initial={{ y: '100%', x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: '100%', x: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden"
          >
            <MobileSheet
              channel={channel}
              playbook={playbook}
              steps={steps}
              progress={progress}
              completedCount={completedCount}
              totalSteps={totalSteps}
              pct={pct}
              allDone={allDone}
              shortUrl={shortUrl}
              link={link}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              onToggleStep={handleToggleStep}
              onViewAnalytics={handleViewAnalytics}
              onClose={onClose}
            />
          </motion.div>

          {/* Desktop Right Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[380px] z-[9999] hidden md:block"
          >
            <DesktopDrawer
              channel={channel}
              playbook={playbook}
              steps={steps}
              progress={progress}
              completedCount={completedCount}
              totalSteps={totalSteps}
              pct={pct}
              allDone={allDone}
              shortUrl={shortUrl}
              link={link}
              onToggleStep={handleToggleStep}
              onViewAnalytics={handleViewAnalytics}
              onClose={onClose}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Shared inner content ─────────────────────────────────────────

function PlaybookContent({ channel, playbook, steps, progress, completedCount, totalSteps, pct, allDone, shortUrl, link, onToggleStep, onViewAnalytics }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Progress
          </span>
          <span className={`text-xs font-black ${allDone ? 'text-emerald-600 dark:text-emerald-400' : channel.text}`}>
            {completedCount}/{totalSteps} steps
          </span>
        </div>
        <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${channel.color}`}
          />
        </div>
      </div>

      {/* All done celebration */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 rounded-2xl"
          >
            <Trophy className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-black text-emerald-800 dark:text-emerald-200">
                Playbook complete! 🏆
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                Now wait for your first {channel.milestone} clicks to flow in.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steps */}
      <div className="space-y-2.5">
        {steps.map((step, idx) => {
          const done = !!progress[step.id];
          return (
            <motion.button
              key={step.id}
              onClick={() => onToggleStep(step.id)}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={`
                w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 group
                ${done
                  ? 'bg-emerald-50 dark:bg-emerald-900/15 border-emerald-200 dark:border-emerald-700/40'
                  : `${channel.bgLight} ${channel.border} hover:shadow-md`
                }
              `}
            >
              {/* Step check circle */}
              <div className="flex-shrink-0 mt-0.5">
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 ${channel.border} flex items-center justify-center`}>
                    <span className="text-[9px] font-black text-gray-400">{idx + 1}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{step.emoji}</span>
                  <p className={`text-sm font-bold leading-tight ${done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                    {step.title}
                  </p>
                </div>
                {!done && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                    {step.detail}
                  </p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Milestone goal */}
      <div className={`flex items-center gap-3 p-4 rounded-2xl ${channel.bgLight} border ${channel.border}`}>
        <Target className={`w-5 h-5 ${channel.text} flex-shrink-0`} />
        <div className="flex-1">
          <p className={`text-xs font-black uppercase tracking-wider ${channel.text}`}>
            Your Goal
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mt-0.5">
            Get <strong>{channel.milestone} clicks</strong> on this link, then come back for insights
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onViewAnalytics}
        className={`
          w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm
          bg-gradient-to-r ${channel.color} text-white shadow-lg transition-all hover:opacity-90 hover:scale-[1.01] active:scale-95
        `}
      >
        <TrendingUp className="w-4 h-4" />
        View Analytics
        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
      </button>
    </div>
  );
}

// ─── Mobile Sheet ─────────────────────────────────────────────────

function MobileSheet({ channel, playbook, steps, progress, completedCount, totalSteps, pct, allDone, shortUrl, link, collapsed, setCollapsed, onToggleStep, onViewAnalytics, onClose }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-t-[2rem] shadow-2xl max-h-[90vh] flex flex-col border-t border-gray-100 dark:border-gray-800">
      {/* Handle + Header */}
      <div className="px-6 pt-4 pb-3 flex-shrink-0">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${channel.color} flex items-center justify-center text-lg shadow-md`}>
              {channel.emoji}
            </div>
            <div>
              <p className="font-black text-gray-900 dark:text-white text-base leading-tight">
                {playbook.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{playbook.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-y-auto overscroll-contain px-6 pb-8"
          >
            <PlaybookContent
              channel={channel}
              playbook={playbook}
              steps={steps}
              progress={progress}
              completedCount={completedCount}
              totalSteps={totalSteps}
              pct={pct}
              allDone={allDone}
              shortUrl={shortUrl}
              link={link}
              onToggleStep={onToggleStep}
              onViewAnalytics={onViewAnalytics}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Desktop Drawer ───────────────────────────────────────────────

function DesktopDrawer({ channel, playbook, steps, progress, completedCount, totalSteps, pct, allDone, shortUrl, link, onToggleStep, onViewAnalytics, onClose }) {
  return (
    <div className="h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col border-l border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${channel.color} flex items-center justify-center text-xl shadow-lg`}>
            {channel.emoji}
          </div>
          <div>
            <p className="font-black text-gray-900 dark:text-white leading-tight">
              {playbook.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{playbook.subtitle}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <PlaybookContent
          channel={channel}
          playbook={playbook}
          steps={steps}
          progress={progress}
          completedCount={completedCount}
          totalSteps={totalSteps}
          pct={pct}
          allDone={allDone}
          shortUrl={shortUrl}
          link={link}
          onToggleStep={onToggleStep}
          onViewAnalytics={onViewAnalytics}
        />
      </div>

      {/* Footer branding */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
        <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 font-medium">
          SmartLink — Analytics → Insight → Action → Outcome
        </p>
      </div>
    </div>
  );
}
