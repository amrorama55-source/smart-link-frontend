import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle, Info, CheckCircle } from 'lucide-react';

const Toast = ({ 
    type = 'info', 
    message, 
    duration = 5000, 
    onClose,
    action,
    showProgress = false 
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (showProgress && duration > 0) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + (100 / (duration / 100));
                });
            }, 100);

            return () => clearInterval(interval);
        }
    }, [showProgress, duration]);

    useEffect(() => {
        if (!showProgress) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose?.(), 300);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'info':
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-900 dark:text-green-100';
            case 'error':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-900 dark:text-red-100';
            case 'warning':
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100';
            case 'info':
            default:
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100';
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="w-full max-w-sm"
            >
                <div className={`
                    relative rounded-lg border shadow-lg backdrop-blur-sm p-4
                    ${getStyles()}
                `}>
                    {/* Progress bar */}
                    {showProgress && (
                        <div className="absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                className={`h-full transition-all duration-100 ${
                                    type === 'success' ? 'bg-green-500' :
                                    type === 'error' ? 'bg-red-500' :
                                    type === 'warning' ? 'bg-yellow-500' :
                                    'bg-blue-500'
                                }`}
                            />
                        </div>
                    )}

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                            {getIcon()}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-snug">
                                {message}
                            </p>
                            
                            {action && (
                                <button
                                    onClick={action.onClick}
                                    className="mt-2 text-sm font-bold underline hover:no-underline transition-all"
                                >
                                    {action.label}
                                </button>
                            )}
                        </div>
                        
                        <button
                            onClick={() => {
                                setIsVisible(false);
                                setTimeout(() => onClose?.(), 300);
                            }}
                            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="w-4 h-4 opacity-60 hover:opacity-100" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Toast;
