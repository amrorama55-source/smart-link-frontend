import StatCard from '../components/analytics/StatCard';
import TimeSeries from '../components/analytics/TimeSeries';
import EngagementRadar from '../components/analytics/EngagementRadar';
import TopCountries from '../components/analytics/TopCountries';
import DevicePie from '../components/analytics/DevicePie';
import ABTestingSection from '../components/analytics/ABTestingSection';
import { MousePointerClick, Users, Globe, Smartphone } from 'lucide-react';

export default function OverviewView({ data, analytics }) {
  return (
    <div className="space-y-6">

      {/* Stats Cards - 2 cols on mobile so key metrics visible without scroll */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          icon={MousePointerClick}
          title="Total Clicks"
          value={data.stats.totalClicks.toLocaleString()}
          color="blue"
        />
        <StatCard
          icon={Users}
          title="Unique Visitors"
          value={data.stats.uniqueVisitors.toLocaleString()}
          subtitle={`${data.stats.returningVisitors} returning`}
          color="green"
        />
        <StatCard
          icon={Globe}
          title="Countries"
          value={data.stats.countries}
          subtitle="Global reach"
          color="purple"
        />
        <StatCard
          icon={Smartphone}
          title="Mobile Traffic"
          value={`${data.stats.mobilePercentage}%`}
          color="orange"
        />
      </div>

      {/* A/B Testing Section */}
      {analytics?.abTest?.enabled && (
        <ABTestingSection abTest={analytics.abTest} />
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeSeries data={data.timeSeries} />
        <EngagementRadar data={data.engagement} />
      </div>

      {/* Data Quality & Funnel Highlights (Enterprise Feature) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
            🛡️
          </span>
          Enterprise Data Quality
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Human Traffic</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {(analytics.botPercentage ? (100 - analytics.botPercentage).toFixed(1) : 100)}%
              </span>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium mb-1 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">Verified</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Filter out scrapers & bots</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Blocked Bots</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.botClicks || 0}</span>
              <span className="text-sm text-gray-500 mb-1">requests</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Prevented from skewing data</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 flex flex-col justify-center items-center text-center">
            <div className="text-indigo-600 dark:text-indigo-400 font-bold mb-1 flex items-center gap-1">
              <Users className="w-4 h-4" /> Funnel Health
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {analytics.uniqueVisitors} Unique → {analytics.totalClicks} Clicks
            </p>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${Math.min(100, (analytics.uniqueVisitors / Math.max(1, analytics.totalClicks)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCountries countries={data.countries} />
        <DevicePie devices={data.devices} />
      </div>

    </div>
  );
}