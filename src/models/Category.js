const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'categories',
    timestamps: false
  });

  return Category;
};
