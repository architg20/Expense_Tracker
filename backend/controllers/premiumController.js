const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../config/database');
const AWS = require('aws-sdk');
const Download = require('../models/download');

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
exports.downloadExpenses = async (req, res) => {
  try {
    // if (!req.user.isPremiumUser) {
    //   return res.status(401).json({ message: 'Unauthorized' });
    // }

    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    const csv = convertToCSV(expenses); // Your CSV logic

    const fileName = `Expenses_${req.user.id}_${new Date().toISOString()}.csv`;

    const s3 = new AWS.S3({
      accessKeyId: process.env.IAM_KEY,
      secretAccessKey: process.env.IAM_SECRET
    });

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: csv
    };

    s3.upload(params, async (err, data) => {
      if (err) return res.status(500).json({ error: err });

      // Optional: Save history
      await Download.create({
        userId: req.user.id,
        fileUrl: data.Location
      });

      return res.status(200).json({ fileURL: data.Location });
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Download failed' });
  }
};

function convertToCSV(expenses) {
  let csv = 'Date,Description,Category,Amount\n';
  expenses.forEach(e => {
    const date = new Date(e.createdAt).toLocaleDateString();
    csv += `${date},${e.description},${e.category},${e.amount}\n`;
  });
  return csv;
}
