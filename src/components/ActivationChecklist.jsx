import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Rocket, Link2, BarChart3, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../services/api';

const ActivationChecklist = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [checklist, setChecklist] = useState({
        createFirstLink: false,
        viewAnalytics: false,
        createCustomDomain: false
    });
    const [statsLoaded, setStatsLoaded] = useState(false);

    useEffect(() => {
        loadChecklistState();
    }, [user]);

    const loadChecklistState = async () => {
        try {
            // ✅ Check real data from API
            const data = await getDashboardStats();
            const apiChecklist = data.activationChecklist || {};

            setChecklist({
                createFirstLink: apiChecklist.createFirstLink?.completed || false,
                viewAnalytics: apiChecklist.viewAnalytics?.completed || false,
                createCustomDomain: apiChecklist.createCustomDomain?.completed || false
            });
            setStatsLoaded(true);
        } catch (err) {
            console.error('Checklist load error:', err);
            setStatsLoaded(true);
        }
    };

    const completedCount = Object.values(checklist).filter(Boolean).length;
    const totalTasks = 3;
    const completionPercentage = (completedCount / totalTasks) * 100;

    const tasks = [
        {
            id: 'createFirstLink',
            title: 'Create Your First Link',
            description: 'Start by creating your first smart link',
            icon: Link2,
            action: () => {
                // ✅ Navigate to /links and trigger create modal
                navigate('/links', { state: { openCreateModal: true } });
            }
        },
        {
            id: 'viewAnalytics',
            title: 'View Analytics',
            description: 'Check your link performance and insights',
            icon: BarChart3,
            action: () => {
                // ✅ Go to analytics
                navigate('/analytics');
            }
        },
        {
            id: 'createCustomDomain',
            title: 'Add Custom Domain',
            description: 'Connect your own domain for branded links',
            icon: Globe,
            action: () => {
                // ✅ Navigate to /links and open domain tab in the create modal
                navigate('/links', { state: { openDomainModal: true } });
            }
        }
    ];

    if (!statsLoaded) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-2xl">
                        <Rocket className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            Complete Your Setup
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Unlock the full power of Business Elite
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                        {Math.round(completionPercentage)}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {completedCount}/{totalTasks} tasks
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    />
                </div>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
                {tasks.map((task, index) => {
                    const Icon = task.icon;
                    const isCompleted = checklist[task.id];

                    return (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => !isCompleted && task.action()}
                            className={`
                                flex items-center gap-4 p-4 rounded-xl border transition-all
                                ${isCompleted
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 cursor-default'
                                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md cursor-pointer'
                                }
                            `}
                        >
                            {/* Check Icon */}
                            <div className={`
                                flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                                ${isCompleted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'}
                            `}>
                                {isCompleted
                                    ? <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    : <Circle className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                                }
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <Icon className={`w-4 h-4 ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
                                    <h4 className={`font-semibold text-sm ${isCompleted
                                            ? 'text-green-800 dark:text-green-200 line-through'
                                            : 'text-gray-900 dark:text-white'
                                        }`}>
                                        {task.title}
                                    </h4>
                                </div>
                                <p className={`text-xs ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {task.description}
                                </p>
                            </div>

                            {!isCompleted && (
                                <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* All Done Message */}
            <AnimatePresence>
                {completionPercentage === 100 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl flex items-center gap-3"
                    >
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-green-900 dark:text-green-100 text-sm">Setup Complete!</p>
                            <p className="text-xs text-green-700 dark:text-green-300">You're getting the most out of Business Elite</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ActivationChecklist;
