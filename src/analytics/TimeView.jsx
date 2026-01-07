import HourlyChart from '../components/analytics/HourlyChart';
import DayOfWeekChart from '../components/analytics/DayOfWeekChart';
import TimeSeries from '../components/analytics/TimeSeries';

export default function TimeView({ data }) {
  return (
    <div className="space-y-6">
      
      {/* Hourly and Day Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HourlyChart data={data.clicksByHour} />
        <DayOfWeekChart data={data.clicksByDay} />
      </div>

      {/* Time Series */}
      <TimeSeries data={data.timeSeries} />
      
    </div>
  );
}