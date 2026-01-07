import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

export default function TimeSeries({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Clicks Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: '#6b7280' }} 
            stroke="#9ca3af"
            tickMargin={8}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#6b7280' }} 
            stroke="#9ca3af"
            tickMargin={8}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="clicks" 
            stroke="#2563eb" 
            strokeWidth={2} 
            fill="url(#blueGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}