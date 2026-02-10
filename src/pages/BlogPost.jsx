import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import { BLOG_POSTS } from '../utils/blogData';

export default function BlogPost() {
    const { id } = useParams();
    const post = BLOG_POSTS.find(p => p.id === id);

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center italic font-black text-4xl uppercase tracking-tighter">
                Post Not Found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 p-4 sm:p-6 lg:p-8 font-sans transition-colors">
            <div className="max-w-4xl mx-auto">
                {/* Navigation */}
                <nav className="flex items-center justify-between mb-12 sm:mb-20">
                    <Link to="/blog" className="flex items-center gap-2 group text-blue-600 dark:text-blue-400 font-black italic uppercase tracking-tight text-sm">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Blog
                    </Link>
                    <div className="flex items-center gap-4">
                        <button className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                            <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </nav>

                {/* Post Header */}
                <header className="mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-6 italic"
                    >
                        {post.category}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-[1.1] tracking-tighter italic"
                    >
                        {post.title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-6 text-sm text-gray-500 font-bold italic"
                    >
                        <div className="flex items-center gap-2">
                            <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full outline outline-4 outline-blue-500/10" />
                            <span className="text-gray-900 dark:text-white uppercase">{post.author.name}</span>
                        </div>
                        <span className="flex items-center gap-1.5 border-l border-gray-200 dark:border-gray-800 pl-6">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5 border-l border-gray-200 dark:border-gray-800 pl-6">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                        </span>
                    </motion.div>
                </header>

                {/* Featured Image */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative h-[300px] sm:h-[500px] rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl border-4 border-white dark:border-gray-900"
                >
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </motion.div>

                {/* Content */}
                <motion.article
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="prose prose-lg prose-blue dark:prose-invert max-w-none 
            prose-h2:text-3xl prose-h2:font-black prose-h2:tracking-tighter prose-h2:italic prose-h2:mt-12
            prose-h3:text-2xl prose-h3:font-bold prose-h3:italic
            prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-black prose-a:no-underline hover:prose-a:underline
            prose-table:border prose-table:rounded-2xl prose-table:overflow-hidden
            prose-th:bg-gray-50 dark:prose-th:bg-gray-900 prose-th:p-4
            prose-td:p-4 prose-td:border-t
          "
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Sharing & Meta */}
                <div className="mt-20 pt-12 border-t-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-black uppercase italic text-gray-400">Share Article</span>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                <Twitter className="w-4 h-4" />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                <Facebook className="w-4 h-4" />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                <LinkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <Link to="/register" className="flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black italic uppercase tracking-tighter hover:scale-105 transition-all shadow-xl">
                        Join the movement
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                {/* More Articles Placeholder */}
                <section className="mt-32 pb-20">
                    <h2 className="text-4xl font-black italic tracking-tighter mb-12 dark:text-white">Keep Reading</h2>
                    <div className="grid sm:grid-cols-2 gap-8 italic">
                        <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center">
                            <p className="text-gray-400 font-bold">More guides coming soon...</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
