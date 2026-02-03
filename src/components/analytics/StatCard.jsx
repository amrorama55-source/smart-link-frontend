export default function StatCard({ icon: Icon, title, value, subtitle, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-2 sm:mb-3`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1 truncate">{title}</p>
      <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">{subtitle}</p>}
    </div>
  );
}