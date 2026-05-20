const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc    Get budgets for month
// @route   GET /api/budgets
exports.getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const m = parseInt(month) || new Date().getMonth() + 1;
    const y = parseInt(year) || new Date().getFullYear();

    const budgets = await Budget.find({ user: req.user.id, month: m, year: y });

    // Get actual spending per category
    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0);

    const spending = await Expense.aggregate([
      {
        $match: {
          user: req.user.id,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' }
        }
      }
    ]);

    const spendingMap = {};
    spending.forEach(s => { spendingMap[s._id] = s.spent; });

    const result = budgets.map(b => ({
      ...b.toObject(),
      spent: spendingMap[b.category] || 0,
      remaining: b.limit - (spendingMap[b.category] || 0),
      percentage: Math.min(100, Math.round(((spendingMap[b.category] || 0) / b.limit) * 100))
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set budget
// @route   POST /api/budgets
exports.setBudget = async (req, res) => {
  try {
    const { category, limit, month, year } = req.body;
    const m = month || new Date().getMonth() + 1;
    const y = year || new Date().getFullYear();

    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id, category, month: m, year: y },
      { limit, month: m, year: y, user: req.user.id },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });
    res.json({ success: true, message: 'Budget removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
