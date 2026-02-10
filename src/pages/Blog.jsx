import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '../utils/blogData';

export default function Blog() {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 p-4 sm:p-6 lg:p-8 font-sans transition-colors">
            <div className="max-w-7xl mx-auto">
                {/* Navigation */}
                <nav className="flex items-center justify-between mb-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white group-hover:shadow-lg transition-all">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold dark:text-white">Smart Link Blog</span>
                    </Link>
                    <Link to="/register" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md">
                        Start for Free
                    </Link>
                </nav>

                {/* Hero */}
                <header className="mb-16 text-center lg:text-left">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight"
                    >
                        Insights for the <br />
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Modern Creator</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl"
                    >
                        Learn how to grow your audience, optimize your links, and master digital marketing with our latest guides and updates.
                    </motion.p>
                </header>

                {/* Featured Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {BLOG_POSTS.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="group relative bg-gray-50 dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col h-full hover:shadow-2xl transition-all duration-500"
                        >
                            <Link to={`/blog/${post.id}`} className="block relative h-64 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-4 py-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-blue-600">
                                        {post.category}
                                    </span>
                                </div>
                            </Link>

                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                    <span className="flex items-center gap-1.5 font-medium italic">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className="flex items-center gap-1.5 font-medium italic">
                                        <Clock className="w-3.5 h-3.5" />
                                        {post.readTime}
                                    </span>
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                                </h2>

                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 line-clamp-3 leading-relaxed">
                                    {post.description}
                                </p>

                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full" />
                                        <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-tighter italic">
                                            {post.author.name}
                                        </span>
                                    </div>
                                    <Link
                                        to={`/blog/${post.id}`}
                                        className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 shadow-sm transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:translate-x-1"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Newsletter / CTA */}
                <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-8 lg:p-16 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl lg:text-5xl font-black mb-6 italic">Stay Ahead of the Curve</h2>
                        <p className="text-blue-100 mb-10 text-lg">Join 5,000+ creators getting our weekly deep-dive into audience growth and link optimization.</p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white transition-all shadow-inner backdrop-blur-sm"
                            />
                            <button className="px-8 py-4 bg-white text-blue-700 font-black rounded-2xl hover:scale-105 transition-all shadow-lg uppercase tracking-tight italic">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-100 dark:border-gray-900 mt-20 italic">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">© 2026 Smart Link. All rights reserved.</p>
                    <div className="flex gap-8 text-sm font-bold text-gray-900 dark:text-white">
                        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        <Link to="/faq" className="hover:text-blue-600 transition-colors">FAQ</Link>
                        <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
                    </div>
                </footer>
            </div>
        </div>
    );
}
