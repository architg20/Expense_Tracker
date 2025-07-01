const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Assuming you have this file for DB connection
const User = require('../models/user')
// const Order = sequelize.define('order', {
//   orderId: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   status: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     defaultValue: 'PENDING',  // Initial status when order is created
//   },
//   paymentId: {
//     type: Sequelize.STRING,
//     allowNull: true,  // This will store the payment ID once the payment is successful
//   },
//   userId: {
//     type: Sequelize.INTEGER,
//     allowNull: false,  // Relates to the user who made the order
//     references: {
//       model: 'users',  // Assuming the Users table exists in your database
//       key: 'id',
//     },
//   },
// });


// Define Payment model
const Payment = sequelize.define('Payment', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  paymentSessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  orderAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  orderCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending',
  },
    userId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'id'
    }
  }
});

Payment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Payment, { foreignKey: 'userId' });


module.exports = Payment;