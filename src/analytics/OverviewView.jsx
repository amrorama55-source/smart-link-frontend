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
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCountries countries={data.countries} />
        <DevicePie devices={data.devices} />
      </div>
      
    </div>
  );
}