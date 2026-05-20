import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIncome } from '../hooks/useExpenses';
import { formatCurrency, formatDate } from '../utils/helpers';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Plus, Search, Edit2, Trash2, Wallet, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const sources = ['Salary', 'Freelance', 'Business', 'Investment', 'Rental', 'Gift', 'Other'];
const sourceColors = {
  Salary: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Freelance: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Business: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Investment: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Rental: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Gift: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
};

const Income = () => {
  const { user } = useAuth();
  const { incomes, pagination, loading, filters, setFilters, addIncome, updateIncome, deleteIncome } = useIncome();
  const [showModal, setShowModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [form, setForm] = useState({ title: '', amount: '', source: 'Salary', date: new Date().toISOString().split('T')[0], notes: '', isRecurring: false });
  const [submitting, setSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const resetForm = () => {
    setForm({ title: '', amount: '', source: 'Salary', date: new Date().toISOString().split('T')[0], notes: '', isRecurring: false });
    setEditingIncome(null);
  };

  const openEdit = (income) => {
    setEditingIncome(income);
    setForm({
      title: income.title,
      amount: income.amount.toString(),
      source: income.source,
      date: new Date(income.date).toISOString().split('T')[0],
      notes: income.notes || '',
      isRecurring: income.isRecurring || false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (editingIncome) {
        await updateIncome(editingIncome._id, payload);
        toast.success('Income updated');
      } else {
        await addIncome(payload);
        toast.success('Income added');
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this income?')) {
      try {
        await deleteIncome(id);
        toast.success('Income deleted');
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Income</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track all your income sources</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Income
        </button>
      </div>

      {/* Summary Card */}
      <div className="glass-card p-6 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-500/10">
            <Wallet className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalIncome, user?.currency)}</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search income..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="input-field pl-11"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <select value={filters.source || ''} onChange={(e) => setFilters({ ...filters, source: e.target.value, page: 1 })} className="input-field">
                  <option value="">All Sources</option>
                  {sources.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="date" value={filters.startDate || ''} onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })} className="input-field" />
                <button onClick={() => setFilters({})} className="btn-secondary text-sm flex items-center justify-center gap-2">
                  <X className="w-4 h-4" /> Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Income List */}
      {loading ? (
        <LoadingSpinner />
      ) : incomes.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No income recorded"
          description="Start tracking your income by adding your first entry."
          action={
            <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Income
            </button>
          }
        />
      ) : (
        <>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Income</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {incomes.map((income, i) => (
                    <motion.tr key={income._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{income.title}</p>
                          {income.notes && <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">{income.notes}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${sourceColors[income.source] || 'bg-gray-100 text-gray-600'}`}>{income.source}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(income.date)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-green-500">+{formatCurrency(income.amount, user?.currency)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(income)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Edit2 className="w-4 h-4 text-gray-500" />
                          </button>
                          <button onClick={() => handleDelete(income._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={pagination.page} pages={pagination.pages} onPageChange={(p) => setFilters({ ...filters, page: p })} />
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingIncome ? 'Edit Income' : 'Add Income'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Monthly salary" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Amount</label>
              <input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input-field" placeholder="0.00" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Source</label>
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="input-field">
                {sources.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes (optional)</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field resize-none" rows={3} placeholder="Add any notes..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editingIncome ? 'Update' : 'Add Income'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Income;
