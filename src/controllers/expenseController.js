const asyncHandler = require('express-async-handler');
const { Expense, Category } = require('../models');
const { Op } = require('sequelize');

const listExpenses = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { from, to, categoryId, limit = 100, offset = 0 } = req.query;

  const where = { userId };
  if (categoryId) where.categoryId = categoryId;
  if (from || to) {
    where.date = {};
    if (from) where.date[Op.gte] = from;
    if (to) where.date[Op.lte] = to;
  }

  const expenses = await Expense.findAll({
    where,
    include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    order: [['date', 'DESC']],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10)
  });
  res.json(expenses);
});

const createExpense = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { amount, description, categoryId, date } = req.body || {};

  if (amount == null || isNaN(Number(amount))) return res.status(400).json({ message: 'amount is required and must be numeric' });

  // optional: verify category belongs to user
  if (categoryId) {
    const cat = await Category.findOne({ where: { id: categoryId, userId } });
    if (!cat) return res.status(400).json({ message: 'invalid category' });
  }

  const expense = await Expense.create({
    amount,
    description: description || null,
    categoryId: categoryId || null,
    userId,
    date: date || new Date()
  });

  res.status(201).json(expense);
});

const updateExpense = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { amount, description, categoryId, date } = req.body || {};

  const expense = await Expense.findOne({ where: { id, userId } });
  if (!expense) return res.status(404).json({ message: 'expense not found' });

  if (categoryId) {
    const cat = await Category.findOne({ where: { id: categoryId, userId } });
    if (!cat) return res.status(400).json({ message: 'invalid category' });
  }

  if (amount != null) expense.amount = amount;
  if (description !== undefined) expense.description = description;
  expense.categoryId = categoryId ?? expense.categoryId;
  if (date) expense.date = date;

  await expense.save();
  res.json(expense);
});

const deleteExpense = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const exp = await Expense.findOne({ where: { id, userId } });
  if (!exp) return res.status(404).json({ message: 'expense not found' });

  await exp.destroy();
  res.json({ message: 'expense deleted' });
});

const generateMonthlyReport = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: 'Month and year are required' });
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const expenses = await Expense.findAll({
    where: {
      userId,
      date: {
        [Op.gte]: startDate,
        [Op.lte]: endDate
      }
    },
    include: [{ model: Category, as: 'category', attributes: ['name'] }]
  });

  if (expenses.length === 0) {
    return res.json({ message: 'No expenses found for this month.' });
  }

  const report = expenses.reduce((acc, expense) => {
    const categoryName = expense.category ? expense.category.name : 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += parseFloat(expense.amount);
    return acc;
  }, {});

  const total = Object.values(report).reduce((sum, value) => sum + value, 0);

  res.json({ report, total });
});

module.exports = { listExpenses, createExpense, updateExpense, deleteExpense, generateMonthlyReport };
