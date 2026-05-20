import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, categoryColors, getMonthName } from '../utils/helpers';
import { useExpenses, useIncome } from '../hooks/useExpenses';
import api from '../utils/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight, Wallet, Receipt, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { expenses, loading: expLoading } = useExpenses({ limit: 5 });
  const { incomes, loading: incLoading } = useIncome({ limit: 5 });
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

  if (loading || expLoading) return <LoadingSpinner />;

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savings = balance > 0 ? balance : 0;

  const pieData = analytics?.categoryBreakdown?.map(c => ({ name: c._id, value: Math.round(c.total * 100) / 100 })) || [];
  const barData = analytics?.monthlySpending?.map(m => ({ name: getMonthName(m._id.month), amount: Math.round(m.total * 100) / 100 })) || [];
  const lineData = analytics?.dailyTrend?.map(d => ({ date: d._id.split('-')[2], savings: Math.round(d.total * 100) / 100 })) || [];

  const COLORS = ['#f97316', '#3b82f6', '#ec4899', '#a855f7', '#eab308', '#22c55e', '#6366f1', '#6b7280'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.[0]) {
      return (
        <div className="glass-card px-3 py-2 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{payload[0].name || payload[0].payload?.name}</p>
          <p className="text-sm text-primary-500">{formatCurrency(payload[0].value, user?.currency)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your financial overview at a glance</p>
        </div>
        <Link to="/app/expenses" className="btn-primary text-sm flex items-center gap-2">
          <Receipt className="w-4 h-4" /> Add Expense
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Balance" value={formatCurrency(balance, user?.currency)} icon={DollarSign} color={balance >= 0 ? 'green' : 'red'} trend={balance >= 0 ? 'up' : 'down'} trendValue={`${formatCurrency(Math.abs(balance), user?.currency)}`} delay={0} />
        <StatCard title="Total Income" value={formatCurrency(totalIncome, user?.currency)} icon={TrendingUp} color="blue" delay={1} />
        <StatCard title="Total Expenses" value={formatCurrency(totalExpenses, user?.currency)} icon={TrendingDown} color="red" delay={2} />
        <StatCard title="Savings" value={formatCurrency(savings, user?.currency)} icon={PiggyBank} color="purple" delay={3} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Expense Categories</h3>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-4">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {pieData.slice(0, 6).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-600 dark:text-gray-400 flex-1">{item.name}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.value, user?.currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">No expense data yet</div>
          )}
        </motion.div>

        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Spending</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4c6ef5" />
                    <stop offset="100%" stopColor="#748ffc" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">No spending data yet</div>
          )}
        </motion.div>
      </div>

      {/* Line Chart + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending Trend (30 Days)</h3>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="savings" stroke="#4c6ef5" strokeWidth={2.5} dot={false} activeDot={{ r: 6, fill: '#4c6ef5' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">No trend data yet</div>
          )}
        </motion.div>

        {/* Recent Transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent</h3>
            <Link to="/app/expenses" className="text-sm text-primary-500 hover:text-primary-600">View All</Link>
          </div>
          <div className="space-y-3">
            {expenses.slice(0, 5).map((exp, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${categoryColors[exp.category]?.bg || 'bg-gray-100'} ${categoryColors[exp.category]?.text || 'text-gray-600'}`}>
                  {exp.category.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{exp.title}</p>
                  <p className="text-xs text-gray-500">{formatDate(exp.date)}</p>
                </div>
                <span className="text-sm font-semibold text-red-500">-{formatCurrency(exp.amount, user?.currency)}</span>
              </div>
            ))}
            {expenses.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No transactions yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6 bg-gradient-to-r from-primary-500/5 to-accent-500/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary-500/10">
            <Sparkles className="w-5 h-5 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Spending Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics?.categoryBreakdown?.[0] && (
            <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Top Spending Category</p>
              <p className="font-semibold text-gray-900 dark:text-white">{analytics.categoryBreakdown[0]._id}</p>
              <p className="text-xs text-gray-500 mt-1">{formatCurrency(analytics.categoryBreakdown[0].total, user?.currency)} this month</p>
            </div>
          )}
          <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Daily Average</p>
            <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(totalExpenses / 30, user?.currency)}</p>
            <p className="text-xs text-gray-500 mt-1">Based on last 30 days</p>
          </div>
          <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Budget Status</p>
            <p className="font-semibold text-gray-900 dark:text-white">{user?.monthlyBudget ? `${Math.round((totalExpenses / user.monthlyBudget) * 100)}%` : 'Not set'}</p>
            <p className="text-xs text-gray-500 mt-1">Of monthly budget used</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
