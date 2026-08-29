import DeviceDonut from '../components/analytics/DeviceDonut';
import BrowserBars from '../components/analytics/BrowserBars';
import OSBars from '../components/analytics/OSBars';
import ReferrersChart from '../components/analytics/ReferrersChart';

export default function DeviceView({ data }) {
  return (
    <div className="space-y-6">
      
      {/* Devices, Browsers, OS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DeviceDonut devices={data.devices} />
        <BrowserBars browsers={data.browsers} />
        <OSBars os={data.os} />
      </div>

      {/* Referrers */}
      <ReferrersChart referrers={data.referrers} />
      
    </div>
  );
}