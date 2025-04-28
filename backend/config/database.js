const { Sequelize } = require('sequelize');

// Database configuration (adjust to your DB credentials)
const sequelize = new Sequelize('expense_tracker', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
