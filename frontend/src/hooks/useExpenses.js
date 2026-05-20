import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const useExpenses = (initialFilters = {}) => {
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      const { data } = await api.get('/expenses', { params });
      if (data.success) {
        setExpenses(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const addExpense = async (expense) => {
    const { data } = await api.post('/expenses', expense);
    if (data.success) {
      fetchExpenses();
      return data.data;
    }
  };

  const updateExpense = async (id, updates) => {
    const { data } = await api.put(`/expenses/${id}`, updates);
    if (data.success) {
      fetchExpenses();
      return data.data;
    }
  };

  const deleteExpense = async (id) => {
    const { data } = await api.delete(`/expenses/${id}`);
    if (data.success) fetchExpenses();
  };

  return { expenses, pagination, loading, filters, setFilters, fetchExpenses, addExpense, updateExpense, deleteExpense };
};

export const useIncome = (initialFilters = {}) => {
  const [incomes, setIncomes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);

  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      const { data } = await api.get('/income', { params });
      if (data.success) {
        setIncomes(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching incomes:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchIncomes(); }, [fetchIncomes]);

  const addIncome = async (income) => {
    const { data } = await api.post('/income', income);
    if (data.success) {
      fetchIncomes();
      return data.data;
    }
  };

  const updateIncome = async (id, updates) => {
    const { data } = await api.put(`/income/${id}`, updates);
    if (data.success) {
      fetchIncomes();
      return data.data;
    }
  };

  const deleteIncome = async (id) => {
    const { data } = await api.delete(`/income/${id}`);
    if (data.success) fetchIncomes();
  };

  return { incomes, pagination, loading, filters, setFilters, fetchIncomes, addIncome, updateIncome, deleteIncome };
};
