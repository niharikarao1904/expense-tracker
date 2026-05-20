import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { Settings as SettingsIcon, Moon, Sun, Globe, DollarSign, Bell, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' }
];

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [language, setLanguage] = useState(user?.language || 'en');
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', { language, currency });
      if (data.success) {
        updateUser(data.data);
        toast.success('Settings saved');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Customize your experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary-500/10">
              <SettingsIcon className="w-5 h-5 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-xs text-gray-500">Toggle dark/light theme</p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${darkMode ? 'bg-primary-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Language */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-blue-500/10">
              <Globe className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Language & Region</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-field">
                {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input-field">
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="JPY">JPY (¥) - Japanese Yen</option>
                <option value="CAD">CAD (C$) - Canadian Dollar</option>
                <option value="AUD">AUD (A$) - Australian Dollar</option>
                <option value="CNY">CNY (¥) - Chinese Yuan</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-yellow-500/10">
              <Bell className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</p>
                <p className="text-xs text-gray-500">Get notified about transactions</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${notifications ? 'bg-primary-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Budget Alerts</p>
                <p className="text-xs text-gray-500">Warn when approaching budget limit</p>
              </div>
              <button
                onClick={() => setBudgetAlerts(!budgetAlerts)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${budgetAlerts ? 'bg-primary-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${budgetAlerts ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-green-500/10">
              <Shield className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Password</p>
              <p className="text-xs text-gray-500 mb-3">Last changed: Never</p>
              <button className="btn-secondary text-sm">Change Password</button>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500 mb-3">Add an extra layer of security</p>
              <button className="btn-secondary text-sm">Enable 2FA</button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
