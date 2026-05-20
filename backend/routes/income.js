const express = require('express');
const router = express.Router();
const { getIncomes, addIncome, updateIncome, deleteIncome, getIncomeAnalytics } = require('../controllers/incomeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getIncomes).post(addIncome);
router.route('/analytics').get(getIncomeAnalytics);
router.route('/:id').put(updateIncome).delete(deleteIncome);

module.exports = router;
