import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, categoryColors } from '../utils/helpers';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { PiggyBank, Plus, AlertTriangle, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const categories = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Other'];

const Budget = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ category: 'Food', limit: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchBudgets = async () => {
    try {
      const { data } = await api.get('/budgets');
      if (data.success) setBudgets(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBudgets(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/budgets', { category: form.category, limit: parseFloat(form.limit) });
      if (data.success) {
        toast.success('Budget set');
        setShowModal(false);
        setForm({ category: 'Food', limit: '' });
        fetchBudgets();
      }
    } catch (error) {
      toast.error('Failed to set budget');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this budget?')) {
      try {
        await api.delete(`/budgets/${id}`);
        toast.success('Budget deleted');
        fetchBudgets();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Set spending limits for each category</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Set Budget
        </button>
      </div>

      {/* Summary */}
      <div className="glass-card p-6 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-purple-500/10">
            <PiggyBank className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalBudget, user?.currency)}</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${totalSpent > totalBudget ? 'bg-red-500' : totalSpent > totalBudget * 0.8 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(100, (totalSpent / totalBudget) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-gray-500">Spent: {formatCurrency(totalSpent, user?.currency)}</span>
          <span className="text-gray-500">Remaining: {formatCurrency(Math.max(0, totalBudget - totalSpent), user?.currency)}</span>
        </div>
      </div>

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <div className="text-center py-16">
          <PiggyBank className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No budgets set yet</p>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm mt-4">Set Your First Budget</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget, i) => {
            const isOver = budget.percentage >= 100;
            const isWarning = budget.percentage >= 80 && budget.percentage < 100;
            return (
              <motion.div
                key={budget._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card p-5 ${isOver ? 'ring-2 ring-red-500/50' : isWarning ? 'ring-2 ring-yellow-500/50' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`badge ${categoryColors[budget.category]?.bg} ${categoryColors[budget.category]?.text}`}>
                    {budget.category}
                  </span>
                  {isOver ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : isWarning ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Spent</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(budget.spent || 0, user?.currency)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(100, budget.percentage)}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Limit: {formatCurrency(budget.limit, user?.currency)}</p>
                    <p className="text-xs text-gray-500">Remaining: {formatCurrency(budget.remaining || 0, user?.currency)}</p>
                  </div>
                  <button onClick={() => handleDelete(budget._id)} className="text-xs text-red-500 hover:text-red-600">Delete</button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Budget Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Set Budget">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Monthly Limit</label>
            <input type="number" step="0.01" min="0" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} className="input-field" placeholder="500.00" required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-60">
              {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Set Budget'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Budget;
