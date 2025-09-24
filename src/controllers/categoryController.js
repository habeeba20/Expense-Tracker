const asyncHandler = require('express-async-handler');
const { Category } = require('../models');

const listCategories = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const categories = await Category.findAll({ where: { userId }, order: [['name', 'ASC']] });
  res.json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name } = req.body || {};
  if (!name || !name.trim()) return res.status(400).json({ message: 'name required' });

  const cat = await Category.create({ name: name.trim(), userId });
  res.status(201).json(cat);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const cat = await Category.findOne({ where: { id, userId } });
  if (!cat) return res.status(404).json({ message: 'category not found' });

  await cat.destroy();
  res.json({ message: 'category deleted' });
});

module.exports = { listCategories, createCategory, deleteCategory };
