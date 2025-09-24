const sequelize = require('../config/database');
const UserModel = require('./User');
const CategoryModel = require('./Category');
const ExpenseModel = require('./Expense');

const User = UserModel(sequelize);
const Category = CategoryModel(sequelize);
const Expense = ExpenseModel(sequelize);

// Associations
User.hasMany(Category, { foreignKey: 'userId', as: 'categories', onDelete: 'CASCADE' });
Category.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Expense, { foreignKey: 'userId', as: 'expenses', onDelete: 'CASCADE' });
Expense.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Category.hasMany(Expense, { foreignKey: 'categoryId', as: 'expenses' });
Expense.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = {
  sequelize,
  User,
  Category,
  Expense
};
