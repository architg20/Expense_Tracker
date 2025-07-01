const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../config/database');

exports.showLeaderboard = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const leaderboardData = await Expense.findAll({
      attributes: [
        'userId',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalExpense']
      ],
      include: [{
        model: User,
        attributes: ['username']
      }],
      group: ['userId', 'User.id'], // ✅ Include User.id in GROUP BY
      order: [[sequelize.literal('totalExpense'), 'DESC']],
      transaction: t
    });

    const formatted = leaderboardData.map(entry => ({
      username: entry.User?.username || 'NA',
      totalExpense: entry.dataValues.totalExpense
    }));

    await t.commit();
    res.status(200).json({ leaderboard: formatted });

  } catch (error) {
    await t.rollback();
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};
