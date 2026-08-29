import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

const tools = [
  {
    id: 'qr-code-generator',
    title: 'QR Code Generator',
    description: 'Create custom QR codes instantly. Choose colors, sizes, and download as PNG for free.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75H16.5v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75H16.5v-.75z" />
      </svg>
    ),
    color: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
    bgDark: 'dark:bg-violet-900/20',
    path: '/tools/qr-code-generator',
  },
  {
    id: 'utm-builder',
    title: 'UTM Link Builder',
    description: 'Build campaign tracking URLs with UTM parameters. Perfect for Google Analytics and marketing.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    color: 'from-blue-500 to-cyan-500',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-900/20',
    path: '/tools/utm-builder',
  },
  {
    id: 'meta-tag-generator',
    title: 'Meta Tag Generator',
    description: 'Generate perfect SEO meta tags for your website. Preview how your page looks on Google search results.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    color: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-900/20',
    path: '/tools/meta-tag-generator',
  },
];

export default function FreeTools() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <SEO
        title="Free Marketing Tools | QR Code Generator, UTM Builder & More"
        description="Free online tools for marketers and developers. Generate QR codes, build UTM campaign links, create SEO meta tags — all free, no signup required."
      />

      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/logo-v1.svg" alt="Smart Link Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">Smart Link</span>
        </Link>
        <Link to="/register" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm">
          Start for Free
        </Link>
      </nav>

      {/* Hero */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight"
        >
          Free Marketing{' '}
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Tools
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Powerful tools for marketers and developers. No signup required. 100% free, forever.
        </motion.p>
      </header>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              <Link
                to={tool.path}
                className="block h-full p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl ${tool.bgLight} ${tool.bgDark} flex items-center justify-center mb-6 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform`}>
                  {tool.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  {tool.description}
                </p>
                <span className={`inline-flex items-center gap-1 text-sm font-semibold bg-gradient-to-r ${tool.color} bg-clip-text text-transparent`}>
                  Use Tool Free
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Need More Power?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Smart Link gives you enterprise-grade link tracking, AI bot protection, geo-targeting, and deep analytics — all in one platform.
          </p>
          <Link to="/register" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25">
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}
