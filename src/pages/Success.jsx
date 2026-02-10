import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function Success() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-gray-100 dark:border-gray-800"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </motion.div>

                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                    Payment Successful!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                    Thank you for your subscription. Your account has been upgraded and you now have access to all premium features.
                </p>

                <div className="space-y-4">
                    <Link to="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Go to Dashboard
                        </motion.button>
                    </Link>

                    <Link to="/" className="block text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-semibold transition-colors">
                        Return to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
