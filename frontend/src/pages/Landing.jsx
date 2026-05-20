import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, Sparkles, Shield, BarChart3, Wallet, PieChart, TrendingUp, Moon, Sun, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Wallet, title: 'Track Expenses', desc: 'Easily log and categorize every transaction' },
  { icon: PieChart, title: 'Visual Analytics', desc: 'Beautiful charts to understand your spending' },
  { icon: Shield, title: 'Secure & Private', desc: 'JWT authentication keeps your data safe' },
  { icon: TrendingUp, title: 'Budget Goals', desc: 'Set limits and track your financial goals' },
  { icon: BarChart3, title: 'Monthly Reports', desc: 'Detailed insights into your financial health' },
  { icon: Sparkles, title: 'AI Insights', desc: 'Smart recommendations to save more money' },
];

const Landing = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">FinTrack</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleDarkMode} className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
          <Link to="/login" className="btn-secondary text-sm">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Smart Financial Management
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            Take Control of Your
            <br />
            <span className="gradient-text">Financial Future</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Track expenses, set budgets, and gain powerful insights into your spending habits. Your journey to financial freedom starts here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2">
              Start Tracking Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
              View Demo Account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to <span className="gradient-text">Manage Money</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              Powerful features designed to give you complete visibility and control over your finances.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 card-hover group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-6 md:px-12 py-16">
        <div className="max-w-4xl mx-auto glass-card p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[{ num: '10K+', label: 'Active Users' }, { num: '$2M+', label: 'Tracked' }, { num: '99.9%', label: 'Uptime' }, { num: '4.9★', label: 'Rating' }].map((s, i) => (
              <div key={i}>
                <div className="text-2xl md:text-3xl font-bold gradient-text">{s.num}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-12 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Start Your <span className="gradient-text">Financial Journey</span>?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
          Join thousands of users who are already managing their finances smarter.
        </p>
        <Link to="/register" className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2">
          Create Free Account <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200/50 dark:border-gray-700/50 py-8 px-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Developed by <span className="font-semibold gradient-text">Niharika Rao</span>
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          &copy; {new Date().getFullYear()} FinTrack. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
