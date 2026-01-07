import {
  ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip
} from 'recharts';

export default function EngagementRadar({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Engagement Metrics</h3>
      <ResponsiveContainer width="100%" height={300}>
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
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}