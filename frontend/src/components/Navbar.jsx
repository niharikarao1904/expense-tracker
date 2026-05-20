import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, Sun, Moon, Bell } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="sticky top-0 z-30 glass border-b border-gray-200/30 dark:border-gray-700/30">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="hidden lg:block">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>

          <button className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>

          <div className="ml-2 w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
