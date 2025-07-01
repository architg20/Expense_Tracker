const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ForgotPasswordRequest = require('./ForgotPasswordRequest');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  premium: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

module.exports = User;
