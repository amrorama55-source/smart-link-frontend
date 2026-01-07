import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function DeviceDonut({ devices }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Devices</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie 
            data={devices} 
            dataKey="count" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            innerRadius={60} 
            outerRadius={90} 
            paddingAngle={5}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {devices.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}