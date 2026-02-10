// src/context/ToastContext.jsx
import { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  };

  const colors = {
    success: 'from-emerald-500 to-teal-600 shadow-emerald-500/20',
    error: 'from-rose-500 to-red-600 shadow-red-500/20',
    warning: 'from-amber-400 to-orange-500 shadow-orange-500/20',
    info: 'from-blue-500 to-indigo-600 shadow-blue-500/20'
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => {
            const Icon = icons[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                layout
                className={`pointer-events-auto flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br ${colors[toast.type]} text-white shadow-2xl min-w-[320px] max-w-md border border-white/20 backdrop-blur-xl relative overflow-hidden group`}
              >
                {/* Shine effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine transition-all duration-1000"></div>

                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex-shrink-0">
                  <Icon className="w-6 h-6 text-white drop-shadow-md" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold tracking-wide drop-shadow-sm">{toast.message}</p>
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 1.5s ease;
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};