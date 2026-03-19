import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    // Support both signatures:
    //   addToast('message', 'type')      ← legacy string form
    //   addToast({ message, type, ... }) ← object form
    const addToast = useCallback((toastOrMessage, type) => {
        const toast = typeof toastOrMessage === 'string'
            ? { message: toastOrMessage, type: type || 'info' }
            : toastOrMessage;

        const id = Date.now() + Math.random();
        const newToast = { ...toast, id };

        setToasts(prev => [...prev, newToast]);

        if (toast.duration !== 0) {
            setTimeout(() => {
                removeToast(id);
            }, toast.duration || 5000);
        }

        return id;
    }, [removeToast]);

    const success = useCallback((message, options = {}) => {
        return addToast({ type: 'success', message, ...options });
    }, [addToast]);

    const error = useCallback((message, options = {}) => {
        return addToast({ type: 'error', message, ...options });
    }, [addToast]);

    const warning = useCallback((message, options = {}) => {
        return addToast({ type: 'warning', message, ...options });
    }, [addToast]);

    const info = useCallback((message, options = {}) => {
        return addToast({ type: 'info', message, ...options });
    }, [addToast]);

    const value = {
        toasts,
        addToast,
        removeToast,
        clearAllToasts,
        success,
        error,
        warning,
        info
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            {/* ✅ top-28 = أسفل الـ Navbar (الذي يأخذ ~110px) */}
            {/* z-[99999] = فوق كل شيء حتى الـ modals */}
            <div className="fixed top-32 sm:top-24 inset-x-4 sm:inset-x-auto sm:right-4 z-[2147483647] flex flex-col items-center sm:items-end gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto w-full max-w-sm">
                        <Toast
                            {...toast}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;