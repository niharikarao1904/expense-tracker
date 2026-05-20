const express = require('express');
const router = express.Router();
const { getExpenses, getExpense, addExpense, updateExpense, deleteExpense, getAnalytics } = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getExpenses).post(addExpense);
router.route('/analytics').get(getAnalytics);
router.route('/:id').get(getExpense).put(updateExpense).delete(deleteExpense);

module.exports = router;
