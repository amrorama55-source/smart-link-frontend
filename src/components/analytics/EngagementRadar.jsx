import {
  ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip
} from 'recharts';

export default function EngagementRadar({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
        Engagement Metrics
      </h3>
      
      {data && data.length > 0 ? (
        <>
          {/* Mobile View - Smaller Radar */}
          <ResponsiveContainer width="100%" height={250} className="sm:hidden">
            <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fontSize: 10, fill: '#6b7280' }}
                stroke="#9ca3af"
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 9, fill: '#6b7280' }}
                stroke="#9ca3af"
              />
              <Radar 
                dataKey="value" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.6} 
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '12px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>

          {/* Desktop View - Larger Radar */}
          <ResponsiveContainer width="100%" height={320} className="hidden sm:block">
            <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#9ca3af"
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 10, fill: '#6b7280' }}
                stroke="#9ca3af"
              />
              <Radar 
                dataKey="value" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.6} 
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400 text-sm">
          No engagement data available
        </div>
      )}
    </div>
  );
}