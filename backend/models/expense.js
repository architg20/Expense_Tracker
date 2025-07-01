const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Expense = sequelize.define('Expense', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});


User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

module.exports = Expense;
