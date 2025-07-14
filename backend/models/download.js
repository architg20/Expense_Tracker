const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Download = sequelize.define('Download', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Download;
