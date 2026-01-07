// src/context/ToastContext.jsx
import { createContext, useContext, useState } from 'react';
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
    success: 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-900 dark:text-green-100',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-100',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-900 dark:text-yellow-100',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-900 dark:text-blue-100'
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => {
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 p-4 rounded-lg border-l-4 shadow-lg ${colors[toast.type]} animate-slide-in min-w-[300px] max-w-md`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
              <button 
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
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