import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary', delay = 0 }) => {
  const colors = {
    primary: { bg: 'from-primary-500/10 to-primary-600/10', icon: 'text-primary-500', shadow: 'shadow-primary-500/10' },
    green: { bg: 'from-green-500/10 to-emerald-500/10', icon: 'text-green-500', shadow: 'shadow-green-500/10' },
    red: { bg: 'from-red-500/10 to-rose-500/10', icon: 'text-red-500', shadow: 'shadow-red-500/10' },
    purple: { bg: 'from-purple-500/10 to-violet-500/10', icon: 'text-purple-500', shadow: 'shadow-purple-500/10' },
    blue: { bg: 'from-blue-500/10 to-cyan-500/10', icon: 'text-blue-500', shadow: 'shadow-blue-500/10' },
    yellow: { bg: 'from-yellow-500/10 to-amber-500/10', icon: 'text-yellow-500', shadow: 'shadow-yellow-500/10' },
  };

  const c = colors[color] || colors.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className={`stat-card bg-gradient-to-br ${c.bg}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trendValue !== undefined && (
            <p className={`text-xs mt-2 ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg ${c.shadow}`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
