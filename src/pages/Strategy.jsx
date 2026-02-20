import { Link } from 'react-router-dom';
import { Target, Users, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

const pillars = [
  {
    icon: Target,
    title: 'Acquisition',
    description: 'Grow high-intent traffic using smart links, campaigns, and partner channels.',
    bullets: ['SEO + blog distribution', 'UTM-ready campaign links', 'Cross-platform link consistency']
  },
  {
    icon: Users,
    title: 'Activation',
    description: 'Turn first-time visitors into engaged users with focused landing and bio flows.',
    bullets: ['Fast-loading mobile-first pages', 'Clear conversion CTAs', 'A/B experiments on messaging']
  },
  {
    icon: BarChart3,
    title: 'Optimization',
    description: 'Use analytics to continuously improve click-through and conversion performance.',
    bullets: ['Device/location performance tracking', 'Top referrer analysis', 'Weekly strategy review loop']
  }
];

export default function Strategy() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30 px-4 py-1 text-sm font-semibold text-blue-700 dark:text-blue-300 mb-4">
            Product Strategy
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Smart Link Growth Strategy
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A practical framework to attract users, activate them quickly, and optimize conversion performance.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-3 mb-12">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <pillar.icon className="w-7 h-7 text-blue-600 dark:text-blue-400 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{pillar.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{pillar.description}</p>
              <ul className="space-y-2">
                {pillar.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Execution cadence</h2>
          <p className="text-blue-100 mb-6">
            Plan monthly campaigns, review analytics weekly, and ship at least one conversion improvement every sprint.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 font-semibold px-5 py-2.5 hover:bg-blue-50 transition-colors">
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-2.5 font-semibold hover:bg-white/10 transition-colors">
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
