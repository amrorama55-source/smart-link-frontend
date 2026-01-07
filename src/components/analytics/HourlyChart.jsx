import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

export default function HourlyChart({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Clicks by Hour</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 10, fill: '#6b7280' }} 
            stroke="#9ca3af"
            tickMargin={8}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#6b7280' }} 
            stroke="#9ca3af"
            tickMargin={8}
          />
          <Tooltip />
          <Bar dataKey="clicks" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}