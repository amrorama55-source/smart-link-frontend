import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function DevicePie({ devices }) {
  // Custom label renderer for desktop - shows percentage outside chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    // Only show label if percentage is significant (> 5%)
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#6b7280" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs sm:text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom legend with better layout
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: entry.color }}
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
                {entry.value}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                ({entry.payload.count})
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
        Device Breakdown
      </h3>
      
      {devices && devices.length > 0 ? (
        <>
          {/* Mobile View - Smaller Pie Chart */}
          <ResponsiveContainer width="100%" height={220} className="sm:hidden">
            <PieChart>
              <Pie 
                data={devices} 
                dataKey="count" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={75}
              >
                {devices.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Desktop View - Larger Pie with External Labels */}
          <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
            <PieChart>
              <Pie 
                data={devices} 
                dataKey="count" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={95} 
                label={renderCustomLabel}
                labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
              >
                {devices.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend Below Chart */}
          <Legend content={renderLegend} />
        </>
      ) : (
        <div className="flex items-center justify-center h-60 text-gray-500 dark:text-gray-400">
          No device data available
        </div>
      )}
    </div>
  );
}