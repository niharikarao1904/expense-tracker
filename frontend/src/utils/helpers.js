export const formatCurrency = (amount, currency = 'USD') => {
  const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', CAD: 'C$', AUD: 'A$', CNY: '¥' };
  return `${symbols[currency] || '$'}${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getMonthName = (monthNum) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthNum - 1] || '';
};

export const categoryColors = {
  Food: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', fill: '#f97316' },
  Travel: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', fill: '#3b82f6' },
  Shopping: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400', fill: '#ec4899' },
  Entertainment: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', fill: '#a855f7' },
  Bills: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', fill: '#eab308' },
  Health: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', fill: '#22c55e' },
  Education: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400', fill: '#6366f1' },
  Other: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300', fill: '#6b7280' }
};

export const categoryIcons = {
  Food: 'UtensilsCrossed', Travel: 'Plane', Shopping: 'ShoppingBag', Entertainment: 'Film',
  Bills: 'Receipt', Health: 'Heart', Education: 'GraduationCap', Other: 'MoreHorizontal'
};

export const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
export const getCurrentMonth = () => new Date().getMonth() + 1;
export const getCurrentYear = () => new Date().getFullYear();
