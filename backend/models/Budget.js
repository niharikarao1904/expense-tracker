const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Other']
  },
  limit: {
    type: Number,
    required: [true, 'Please set a budget limit'],
    min: [0, 'Limit must be positive']
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

budgetSchema.index({ user: 1, month: 1, year: 1 });

module.exports = mongoose.model('Budget', budgetSchema);
