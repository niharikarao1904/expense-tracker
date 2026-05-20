import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Receipt, Wallet, BarChart3, PiggyBank, User, Settings, LogOut, X, Sparkles } from 'lucide-react';

const navItems = [
  { path: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/app/expenses', icon: Receipt, label: 'Expenses' },
  { path: '/app/income', icon: Wallet, label: 'Income' },
  { path: '/app/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/app/budget', icon: PiggyBank, label: 'Budget' },
  { path: '/app/profile', icon: User, label: 'Profile' },
  { path: '/app/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 glass-sidebar flex flex-col transform transition-transform duration-300 lg:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">FinTrack</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Expense Tracker</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/10 to-accent-500/10 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-primary-500' : ''}`} />
                  <span>{label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
