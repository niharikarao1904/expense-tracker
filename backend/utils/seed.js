const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Budget = require('../models/Budget');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Expense.deleteMany({});
    await Income.deleteMany({});
    await Budget.deleteMany({});

    const user = await User.create({
      name: 'Niharika Rao',
      email: 'demo@expense.com',
      password: 'demo123',
      currency: 'USD',
      monthlyBudget: 3000
    });

    const categories = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Other'];
    const sources = ['Salary', 'Freelance', 'Business', 'Investment'];

    const expenses = [];
    const now = new Date();

    for (let i = 0; i < 90; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const numExpenses = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numExpenses; j++) {
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const amounts = { Food: [8, 45], Travel: [20, 150], Shopping: [15, 200], Entertainment: [10, 80], Bills: [50, 300], Health: [20, 150], Education: [10, 100], Other: [5, 50] };
        const [min, max] = amounts[cat];
        expenses.push({
          user: user._id,
          title: `${cat} expense ${i}-${j}`,
          amount: Math.round((Math.random() * (max - min) + min) * 100) / 100,
          category: cat,
          date,
          notes: `Sample ${cat.toLowerCase()} expense`
        });
      }
    }
    await Expense.insertMany(expenses);

    const incomes = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      incomes.push({ user: user._id, title: 'Monthly Salary', amount: 5000, source: 'Salary', date });
      if (i % 2 === 0) {
        incomes.push({ user: user._id, title: 'Freelance Project', amount: Math.round(Math.random() * 2000 + 500), source: 'Freelance', date: new Date(date.getTime() + 10 * 24 * 60 * 60 * 1000) });
      }
    }
    await Income.insertMany(incomes);

    for (const cat of categories) {
      await Budget.create({
        user: user._id,
        category: cat,
        limit: cat === 'Food' ? 500 : cat === 'Travel' ? 300 : cat === 'Shopping' ? 400 : cat === 'Bills' ? 600 : 200,
        month: now.getMonth() + 1,
        year: now.getFullYear()
      });
    }

    console.log('Seed data created successfully');
    console.log('Login: demo@expense.com / demo123');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
