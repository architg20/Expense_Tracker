const { Expense } = require('../models');  // Ensure you are importing Expense model correctly

exports.addExpense = async (req, res) => {
  const { amount, description, category } = req.body;

  if (!amount || !description || !category) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const expense = await Expense.create({
      amount,
      description,
      category,
      userId: req.user.id  // Associate expense with the logged-in user
    });

    res.status(201).json({ success: true, expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    
    const expenses = await Expense.findAll({ where: { userId: req.user.id } }); // Get all expenses for the logged-in user
    if (expenses.length === 0) {
      return res.status(404).json({ success: true, message: 'No expenses found', expenses: [] });
    }
    res.json({ success: true, expenses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.deleteExpense = async (req, res) => {
  const expenseId = req.params.id;

  try {
    const expense = await Expense.findOne({ where: { id: expenseId, userId: req.user.id } });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    await expense.destroy();  // Delete the expense from the database

    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
