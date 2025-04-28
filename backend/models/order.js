const Sequelize = require('sequelize');
const sequelize = require('../config/database');  // Assuming you have this file for DB connection

const Order = sequelize.define('order', {
  orderId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'PENDING',  // Initial status when order is created
  },
  paymentId: {
    type: Sequelize.STRING,
    allowNull: true,  // This will store the payment ID once the payment is successful
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,  // Relates to the user who made the order
    references: {
      model: 'users',  // Assuming the Users table exists in your database
      key: 'id',
    },
  },
});

module.exports = Order;
