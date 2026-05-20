import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency, formatDate, categoryColors } from '../utils/helpers';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import api from '../utils/api';
import { Plus, Search, Filter, Edit2, Trash2, Receipt, Download, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Other'];

const Expenses = () => {
  const { user } = useAuth();
  const { expenses, pagination, loading, filters, setFilters, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form, setForm] = useState({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], notes: '', isRecurring: false });
  const [submitting, setSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const resetForm = () => {
    setForm({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], notes: '', isRecurring: false });
    setEditingExpense(null);
  };

  const openEdit = (expense) => {
    setEditingExpense(expense);
    setForm({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: new Date(expense.date).toISOString().split('T')[0],
      notes: expense.notes || '',
      isRecurring: expense.isRecurring || false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (editingExpense) {
        await updateExpense(editingExpense._id, payload);
        toast.success('Expense updated');
      } else {
        await addExpense(payload);
        toast.success('Expense added');
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
    if (window.confirm('Delete this expense?')) {
      try {
        await deleteExpense(id);
        toast.success('Expense deleted');
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await api.get(`/export/${format}`, { responseType: format === 'csv' ? 'blob' : 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `expenses.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track all your expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleExport('csv')} className="btn-secondary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={() => handleExport('pdf')} className="btn-secondary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> PDF
          </button>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
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
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <select
                  value={filters.category || ''}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
                  className="input-field"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
                  className="input-field"
                  placeholder="End Date"
                />
                <button onClick={clearFilters} className="btn-secondary text-sm flex items-center justify-center gap-2">
                  <X className="w-4 h-4" /> Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expenses List */}
      {loading ? (
        <LoadingSpinner />
      ) : expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses yet"
          description="Start tracking your expenses by adding your first transaction."
          action={
            <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Expense
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
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expense</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {expenses.map((expense, i) => (
                    <motion.tr
                      key={expense._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.title}</p>
                          {expense.notes && <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">{expense.notes}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${categoryColors[expense.category]?.bg || 'bg-gray-100'} ${categoryColors[expense.category]?.text || 'text-gray-600'}`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(expense.date)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-red-500">-{formatCurrency(expense.amount, user?.currency)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(expense)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Edit2 className="w-4 h-4 text-gray-500" />
                          </button>
                          <button onClick={() => handleDelete(expense._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingExpense ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Grocery shopping" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Amount</label>
              <input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input-field" placeholder="0.00" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
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
          <div className="flex items-center gap-2">
            <input type="checkbox" id="recurring" checked={form.isRecurring} onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <label htmlFor="recurring" className="text-sm text-gray-700 dark:text-gray-300">Recurring expense</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editingExpense ? 'Update' : 'Add Expense'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
