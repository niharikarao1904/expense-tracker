import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getMonthName, categoryColors } from '../utils/helpers';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import { BarChart3, TrendingUp, TrendingDown, Target, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#f97316', '#3b82f6', '#ec4899', '#a855f7', '#eab308', '#22c55e', '#6366f1', '#6b7280'];

const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [incomeAnalytics, setIncomeAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, incRes] = await Promise.all([
          api.get('/expenses/analytics'),
          api.get('/income/analytics')
        ]);
        if (expRes.data.success) setAnalytics(expRes.data.data);
        if (incRes.data.success) setIncomeAnalytics(incRes.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalExpenses = analytics?.categoryBreakdown?.reduce((sum, c) => sum + c.total, 0) || 0;
  const totalIncome = incomeAnalytics?.sourceBreakdown?.reduce((sum, s) => sum + s.total, 0) || 0;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
  const avgDaily = totalExpenses / 30;

  const pieData = analytics?.categoryBreakdown?.map(c => ({ name: c._id, value: Math.round(c.total * 100) / 100 })) || [];
  const barData = analytics?.monthlySpending?.map(m => ({ name: getMonthName(m._id.month), amount: Math.round(m.total * 100) / 100 })) || [];
  const dailyData = analytics?.dailyTrend?.map(d => ({ date: d._id.split('-')[2], amount: Math.round(d.total * 100) / 100 })) || [];
  const incomeBarData = incomeAnalytics?.monthlyIncome?.map(m => ({ name: getMonthName(m._id.month), amount: Math.round(m.total * 100) / 100 })) || [];

  const combinedData = barData.map((exp, i) => ({
    name: exp.name,
    expenses: exp.amount,
    income: incomeBarData[i]?.amount || 0
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="glass-card px-4 py-3 shadow-xl">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{label || payload[0]?.name}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-sm" style={{ color: p.color }}>
              {p.name}: {formatCurrency(p.value, user?.currency)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Deep insights into your financial patterns</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Spent" value={formatCurrency(totalExpenses, user?.currency)} icon={TrendingDown} color="red" delay={0} />
        <StatCard title="Total Earned" value={formatCurrency(totalIncome, user?.currency)} icon={TrendingUp} color="green" delay={1} />
        <StatCard title="Savings Rate" value={`${savingsRate}%`} icon={Target} color={savingsRate >= 20 ? 'green' : 'yellow'} delay={2} />
        <StatCard title="Daily Avg Spend" value={formatCurrency(avgDaily, user?.currency)} icon={BarChart3} color="blue" delay={3} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Category Breakdown</h3>
          </div>
          {pieData.length > 0 ? (
            <div className="flex flex-col items-center">
              <div className="w-56 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 w-full">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-600 dark:text-gray-400 truncate">{item.name}</span>
                    <span className="font-medium text-gray-900 dark:text-white ml-auto">{formatCurrency(item.value, user?.currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">No data available</div>
          )}
        </motion.div>

        {/* Monthly Spending Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Spending</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4c6ef5" />
                    <stop offset="100%" stopColor="#748ffc" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">No data available</div>
          )}
        </motion.div>

        {/* Daily Trend Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Spending Trend</h3>
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="#4c6ef5" fill="url(#areaGrad)" strokeWidth={2} />
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4c6ef5" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#4c6ef5" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">No data available</div>
          )}
        </motion.div>

        {/* Income vs Expenses */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Income vs Expenses</h3>
          {combinedData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">No data available</div>
          )}
        </motion.div>
      </div>

      {/* Top Expenses */}
      {analytics?.topExpenses?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Expenses This Month</h3>
          <div className="space-y-3">
            {analytics.topExpenses.map((exp, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-500">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{exp.title}</p>
                  <p className="text-xs text-gray-500">{exp.category}</p>
                </div>
                <span className="text-sm font-semibold text-red-500">{formatCurrency(exp.amount, user?.currency)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;
