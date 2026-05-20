import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Mail, Calendar, DollarSign, Camera, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', currency: 'USD', monthlyBudget: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ totalExpenses: 0, totalIncome: 0, transactionCount: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/auth/me');
        if (data.success) {
          setForm({
            name: data.data.name,
            currency: data.data.currency || 'USD',
            monthlyBudget: data.data.monthlyBudget?.toString() || ''
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', {
        name: form.name,
        currency: form.currency,
        monthlyBudget: parseFloat(form.monthlyBudget) || 0
      });
      if (data.success) {
        updateUser(data.data);
        toast.success('Profile updated');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-500/25">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-shadow">
              <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Edit Profile</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={user?.email} className="input-field pl-11 bg-gray-100 dark:bg-gray-700/50" disabled />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Currency</label>
                <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="input-field">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="CNY">CNY (¥)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Monthly Budget</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.monthlyBudget}
                    onChange={(e) => setForm({ ...form, monthlyBudget: e.target.value })}
                    className="input-field pl-11"
                    placeholder="3000.00"
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
