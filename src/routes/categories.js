const express = require('express');
const router = express.Router();
const { listCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', listCategories);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
