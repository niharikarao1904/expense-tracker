const Income = require('../models/Income');

// @desc    Get all income
// @route   GET /api/income
exports.getIncomes = async (req, res) => {
  try {
    const { source, startDate, endDate, page = 1, limit = 10, sort = '-date' } = req.query;
    const query = { user: req.user.id };

    if (source && source !== 'All') query.source = source;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const total = await Income.countDocuments(query);
    const incomes = await Income.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({
      success: true,
      data: incomes,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add income
// @route   POST /api/income
exports.addIncome = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const income = await Income.create(req.body);
    res.status(201).json({ success: true, data: income });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update income
// @route   PUT /api/income/:id
exports.updateIncome = async (req, res) => {
  try {
    let income = await Income.findOne({ _id: req.params.id, user: req.user.id });
    if (!income) return res.status(404).json({ success: false, message: 'Income not found' });
    income = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: income });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete income
// @route   DELETE /api/income/:id
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({ _id: req.params.id, user: req.user.id });
    if (!income) return res.status(404).json({ success: false, message: 'Income not found' });
    await income.deleteOne();
    res.json({ success: true, message: 'Income removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get income analytics
// @route   GET /api/income/analytics
exports.getIncomeAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const sourceBreakdown = await Income.aggregate([
      { $match: { user: userId, date: { $gte: startOfYear } } },
      { $group: { _id: '$source', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    const monthlyIncome = await Income.aggregate([
      { $match: { user: userId, date: { $gte: startOfYear } } },
      { $group: { _id: { month: { $month: '$date' } }, total: { $sum: '$amount' } } },
      { $sort: { '_id.month': 1 } }
    ]);

    res.json({ success: true, data: { sourceBreakdown, monthlyIncome } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
