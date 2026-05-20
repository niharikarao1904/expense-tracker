const Expense = require('../models/Expense');

// @desc    Get all expenses
// @route   GET /api/expenses
exports.getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, search, page = 1, limit = 10, sort = '-date' } = req.query;
    const query = { user: req.user.id };

    if (category && category !== 'All') query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Expense.countDocuments(query);
    const expenses = await Expense.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({
      success: true,
      data: expenses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add expense
// @route   POST /api/expenses
exports.addExpense = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    await expense.deleteOne();
    res.json({ success: true, message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get expense analytics
// @route   GET /api/expenses/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Category breakdown for current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const categoryBreakdown = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Monthly spending for current year
    const monthlySpending = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfYear }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);

    // Top expenses this month
    const topExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    })
      .sort({ amount: -1 })
      .limit(5);

    // Daily spending trend (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dailyTrend = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: { categoryBreakdown, monthlySpending, topExpenses, dailyTrend }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
