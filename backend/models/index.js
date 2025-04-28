const User = require('./user');  // No need for destructuring, since it's a default export
const Expense = require('./expense');  // No need for destructuring

// Define associations
// User.hasMany(Expense, { foreignKey: 'userId' });
// Expense.belongsTo(User, { foreignKey: 'userId' });

// Export models
module.exports = { User, Expense };
